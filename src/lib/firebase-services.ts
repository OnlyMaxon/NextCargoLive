import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
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
  setDoc
} from 'firebase/firestore'
import { auth, db } from './firebase'
import { User, Order, SupportMessage, Notification } from './types'

export const authService = {
  async register(email: string, password: string, userData: Omit<User, 'id'>) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const userId = userCredential.user.uid
    
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      createdAt: Timestamp.now()
    })
    
    return userId
  },

  async login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  },

  async logout() {
    await signOut(auth)
  },

  async getUserData(userId: string): Promise<User | null> {
    const userDoc = await getDocs(query(collection(db, 'users'), where('__name__', '==', userId)))
    if (userDoc.empty) return null
    
    const data = userDoc.docs[0].data()
    return {
      id: userDoc.docs[0].id,
      firstName: data.firstName,
      lastName: data.lastName,
      finCode: data.finCode,
      password: '',
      isAdmin: data.isAdmin || false
    }
  },

  async getUserByFinCode(finCode: string): Promise<User | null> {
    const usersQuery = query(collection(db, 'users'), where('finCode', '==', finCode.toUpperCase()))
    const usersSnapshot = await getDocs(usersQuery)
    
    if (usersSnapshot.empty) return null
    
    const data = usersSnapshot.docs[0].data()
    return {
      id: usersSnapshot.docs[0].id,
      firstName: data.firstName,
      lastName: data.lastName,
      finCode: data.finCode,
      password: '',
      isAdmin: data.isAdmin || false
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
      createdAt: Timestamp.now()
    })
    return docRef.id
  },

  async updateOrder(orderId: string, updates: Partial<Order>) {
    await updateDoc(doc(db, 'orders', orderId), {
      ...updates,
      updatedAt: Timestamp.now()
    })
  },

  async deleteOrder(orderId: string) {
    await deleteDoc(doc(db, 'orders', orderId))
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    const ordersQuery = query(
      collection(db, 'orders'), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    const ordersSnapshot = await getDocs(ordersQuery)
    
    return ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order))
  },

  async getAllOrders(): Promise<Order[]> {
    const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
    const ordersSnapshot = await getDocs(ordersQuery)
    
    return ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order))
  }
}

export const supportService = {
  async sendMessage(message: Omit<SupportMessage, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'support_messages'), {
      ...message,
      timestamp: Timestamp.now()
    })
    return docRef.id
  },

  async getUserMessages(userId: string): Promise<SupportMessage[]> {
    const messagesQuery = query(
      collection(db, 'support_messages'),
      where('userId', '==', userId),
      orderBy('timestamp', 'asc')
    )
    const messagesSnapshot = await getDocs(messagesQuery)
    
    return messagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as SupportMessage))
  },

  async getAllMessages(): Promise<SupportMessage[]> {
    const messagesQuery = query(
      collection(db, 'support_messages'),
      orderBy('timestamp', 'desc')
    )
    const messagesSnapshot = await getDocs(messagesQuery)
    
    return messagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as SupportMessage))
  }
}

export const notificationsService = {
  async createNotification(notification: Omit<Notification, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'notifications'), {
      ...notification,
      timestamp: Timestamp.now()
    })
    return docRef.id
  },

  async getUserNotifications(userId: string): Promise<Notification[]> {
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    )
    const notificationsSnapshot = await getDocs(notificationsQuery)
    
    return notificationsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Notification))
  },

  async markAsRead(notificationId: string) {
    await updateDoc(doc(db, 'notifications', notificationId), {
      read: true
    })
  }
}

export const usersService = {
  async getAllUsers(): Promise<User[]> {
    const usersSnapshot = await getDocs(collection(db, 'users'))
    
    return usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      password: ''
    } as User))
  },

  async searchUsers(searchTerm: string): Promise<User[]> {
    const usersSnapshot = await getDocs(collection(db, 'users'))
    
    const allUsers = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      password: ''
    } as User))

    const term = searchTerm.toLowerCase()
    return allUsers.filter(user => 
      user.firstName.toLowerCase().includes(term) ||
      user.lastName.toLowerCase().includes(term) ||
      user.finCode.toLowerCase().includes(term)
    )
  }
}
