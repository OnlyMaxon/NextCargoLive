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
  setDoc,
  getDoc
} from 'firebase/firestore'
import { auth, db } from './firebase'
import { User, Order, SupportMessage, Notification } from './types'

const convertTimestamp = (timestamp: any): number => {
  if (timestamp?.toMillis) {
    return timestamp.toMillis()
  }
  if (typeof timestamp === 'number') {
    return timestamp
  }
  return Date.now()
}

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
    try {
      const userDocRef = doc(db, 'users', userId)
      const userDoc = await getDoc(userDocRef)
      
      if (!userDoc.exists()) return null
      
      const data = userDoc.data()
      return {
        id: userDoc.id,
        firstName: data.firstName,
        lastName: data.lastName,
        finCode: data.finCode,
        password: '',
        isAdmin: data.isAdmin || false
      }
    } catch (error) {
      console.error('Error getting user data:', error)
      return null
    }
  },

  async getUserByFinCode(finCode: string): Promise<User | null> {
    try {
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
    } catch (error) {
      console.error('Error getting user by FIN:', error)
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
    await updateDoc(doc(db, 'orders', orderId), {
      ...updates,
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
      
      return ordersSnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
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
        } as Order
      })
    } catch (error) {
      console.error('Error getting user orders:', error)
      return []
    }
  },

  async getAllOrders(): Promise<Order[]> {
    try {
      const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
      const ordersSnapshot = await getDocs(ordersQuery)
      
      return ordersSnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
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
        } as Order
      })
    } catch (error) {
      console.error('Error getting all orders:', error)
      return []
    }
  }
}

export const supportService = {
  async sendMessage(message: Omit<SupportMessage, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'support_messages'), {
      ...message,
      timestamp: message.timestamp || Date.now()
    })
    return docRef.id
  },

  async getUserMessages(userId: string): Promise<SupportMessage[]> {
    try {
      const messagesQuery = query(
        collection(db, 'support_messages'),
        where('userId', '==', userId),
        orderBy('timestamp', 'asc')
      )
      const messagesSnapshot = await getDocs(messagesQuery)
      
      return messagesSnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          userId: data.userId,
          userName: data.userName,
          message: data.message,
          timestamp: convertTimestamp(data.timestamp),
          isAdmin: data.isAdmin,
          conversationId: data.conversationId
        } as SupportMessage
      })
    } catch (error) {
      console.error('Error getting user messages:', error)
      return []
    }
  },

  async getAllMessages(): Promise<SupportMessage[]> {
    try {
      const messagesQuery = query(
        collection(db, 'support_messages'),
        orderBy('timestamp', 'desc')
      )
      const messagesSnapshot = await getDocs(messagesQuery)
      
      return messagesSnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          userId: data.userId,
          userName: data.userName,
          message: data.message,
          timestamp: convertTimestamp(data.timestamp),
          isAdmin: data.isAdmin,
          conversationId: data.conversationId
        } as SupportMessage
      })
    } catch (error) {
      console.error('Error getting all messages:', error)
      return []
    }
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
      
      return notificationsSnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          userId: data.userId,
          message: data.message,
          timestamp: convertTimestamp(data.timestamp),
          read: data.read,
          orderId: data.orderId
        } as Notification
      })
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
      
      return usersSnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          firstName: data.firstName,
          lastName: data.lastName,
          finCode: data.finCode,
          password: '',
          isAdmin: data.isAdmin || false
        } as User
      })
    } catch (error) {
      console.error('Error getting all users:', error)
      return []
    }
  },

  async searchUsers(searchTerm: string): Promise<User[]> {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'))
      
      const allUsers = usersSnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          firstName: data.firstName,
          lastName: data.lastName,
          finCode: data.finCode,
          password: '',
          isAdmin: data.isAdmin || false
        } as User
      })

      const term = searchTerm.toLowerCase()
      return allUsers.filter(user => 
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.finCode.toLowerCase().includes(term)
      )
    } catch (error) {
      console.error('Error searching users:', error)
      return []
    }
  }
}
