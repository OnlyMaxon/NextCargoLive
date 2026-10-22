import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  deleteUser,
  User as FirebaseUser
} from 'firebase/auth'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  setDoc,
  getDoc,
  onSnapshot,
  Unsubscribe,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore'
import { auth, db } from './firebase'
import { User, Order, Notification } from './types'

/** Бросается, когда FIN-код уже занят другим аккаунтом. */
export const FIN_CODE_TAKEN = 'app/fin-code-taken'

/**
 * Приводит значение из Firestore к миллисекундам.
 *
 * Раньше при отсутствующем значении возвращался Date.now(), из-за чего заказ
 * без createdAt тихо становился «сегодняшним» и уезжал в начало сортировки.
 * Теперь такой случай виден: 0 означает «даты нет», UI рисует прочерк.
 */
const convertTimestamp = (value: unknown): number => {
  if (value instanceof Timestamp) return value.toMillis()
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Date.parse(value)
    if (!Number.isNaN(parsed)) return parsed
  }
  if (value != null) {
    console.warn('Unrecognised timestamp value from Firestore:', value)
  }
  return 0
}

const toUser = (snapshot: QueryDocumentSnapshot<DocumentData> | { id: string; data: () => DocumentData }): User => {
  const data = snapshot.data()
  return {
    id: snapshot.id,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email || '',
    finCode: data.finCode,
    isAdmin: data.isAdmin || false,
    documentSerial: data.documentSerial || '',
    birthDate: data.birthDate || ''
  }
}

const toOrder = (snapshot: QueryDocumentSnapshot<DocumentData>): Order => {
  const data = snapshot.data()
  return {
    id: snapshot.id,
    userId: data.userId,
    trackingNumber: data.trackingNumber,
    description: data.description,
    status: data.status,
    createdAt: convertTimestamp(data.createdAt),
    updatedAt: convertTimestamp(data.updatedAt),
    origin: data.origin,
    destination: data.destination,
    weight: data.weight,
    trackingHistory: data.trackingHistory || []
  }
}

const toNotification = (snapshot: QueryDocumentSnapshot<DocumentData>): Notification => {
  const data = snapshot.data()
  return {
    id: snapshot.id,
    userId: data.userId,
    message: data.message,
    timestamp: convertTimestamp(data.timestamp),
    read: data.read ?? false,
    orderId: data.orderId
  }
}

export const authService = {
  /**
   * Регистрация. FIN-код занимается через отдельный документ fin_index/{FIN}:
   * правило `create` в Firestore срабатывает только когда документа ещё нет,
   * поэтому занятый код отклоняется атомарно.
   *
   * Проверить занятость заранее нельзя — до createUserWithEmailAndPassword
   * запрос неаутентифицирован, и правила его отклонят. Именно поэтому прежняя
   * предварительная проверка всегда «разрешала» любой дубликат.
   */
  async register(email: string, password: string, userData: Omit<User, 'id'>) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const firebaseUser = userCredential.user
    const userId = firebaseUser.uid
    const finRef = doc(db, 'fin_index', userData.finCode)

    try {
      await setDoc(finRef, { userId })
    } catch {
      // FIN занят. Удаляем только что созданный аккаунт, иначе у человека
      // останется auth-пользователь без профиля: войти он не сможет, а email
      // окажется навсегда занятым.
      await deleteUser(firebaseUser).catch(() => undefined)
      const error = new Error('FIN code already registered') as Error & { code: string }
      error.code = FIN_CODE_TAKEN
      throw error
    }

    try {
      await setDoc(doc(db, 'users', userId), {
        ...userData,
        createdAt: Timestamp.now()
      })
    } catch (error) {
      // Профиль не создался — освобождаем FIN и аккаунт, чтобы регистрацию
      // можно было повторить.
      await deleteDoc(finRef).catch(() => undefined)
      await deleteUser(firebaseUser).catch(() => undefined)
      throw error
    }

    return userId
  },

  async login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  },

  async resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email)
  },

  async logout() {
    await signOut(auth)
  },

  async getUserData(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId))
      if (!userDoc.exists()) return null
      return toUser(userDoc)
    } catch (error) {
      console.error('Error getting user data:', error)
      return null
    }
  },

  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser
  }
}

export const ordersService = {
  async createOrder(order: Omit<Order, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...order,
      createdAt: order.createdAt || Date.now(),
      updatedAt: order.updatedAt || Date.now()
    })
    return docRef.id
  },

  async updateOrder(orderId: string, updates: Partial<Order>) {
    // id — это идентификатор документа, в полях ему делать нечего.
    const { id: _id, ...fields } = updates
    await updateDoc(doc(db, 'orders', orderId), {
      ...fields,
      updatedAt: Date.now()
    })
  },

  async deleteOrder(orderId: string) {
    await deleteDoc(doc(db, 'orders', orderId))
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const ordersQuery = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      const ordersSnapshot = await getDocs(ordersQuery)
      return ordersSnapshot.docs.map(toOrder)
    } catch (error) {
      console.error('Error getting user orders:', error)
      return []
    }
  },

  /**
   * Живая подписка на все заказы (админка). Без неё панель показывала срез на
   * момент входа: новые заказы и регистрации появлялись только после перезагрузки.
   */
  subscribeToAllOrders(
    callback: (orders: Order[]) => void,
    onError: (error: Error) => void
  ): Unsubscribe {
    const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
    return onSnapshot(
      ordersQuery,
      (snapshot) => callback(snapshot.docs.map(toOrder)),
      (error) => {
        console.error('Error subscribing to orders:', error)
        onError(error)
      }
    )
  }
}

export const notificationsService = {
  async createNotification(notification: Omit<Notification, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'notifications'), {
      ...notification,
      timestamp: notification.timestamp || Date.now()
    })
    return docRef.id
  },

  async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      const notificationsQuery = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      )
      const notificationsSnapshot = await getDocs(notificationsQuery)
      return notificationsSnapshot.docs.map(toNotification)
    } catch (error) {
      console.error('Error getting user notifications:', error)
      return []
    }
  },

  async markAsRead(notificationId: string) {
    await updateDoc(doc(db, 'notifications', notificationId), {
      read: true
    })
  }
}

export const usersService = {
  async getAllUsers(): Promise<User[]> {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'))
      return usersSnapshot.docs.map(toUser)
    } catch (error) {
      console.error('Error getting all users:', error)
      return []
    }
  },

  subscribeToAllUsers(
    callback: (users: User[]) => void,
    onError: (error: Error) => void
  ): Unsubscribe {
    return onSnapshot(
      collection(db, 'users'),
      (snapshot) => callback(snapshot.docs.map(toUser)),
      (error) => {
        console.error('Error subscribing to users:', error)
        onError(error)
      }
    )
  },

  async updateUser(userId: string, data: Partial<User>): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), data)
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }
}
