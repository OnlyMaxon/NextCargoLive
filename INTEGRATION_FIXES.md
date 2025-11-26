# Firebase Integration Fixes

This document provides the exact code changes needed to properly integrate Firebase into NextCargo.

---

## Fix #1: Update firebase-services.ts for Timestamp Handling

### Problem
Firestore returns `Timestamp` objects, but our types expect `number`.

### Solution
Add converter functions to firebase-services.ts:

```typescript
// Add to src/lib/firebase-services.ts at the top

import { Timestamp } from 'firebase/firestore'

// Helper to convert Firestore Timestamp to number
const timestampToNumber = (timestamp: any): number => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toMillis()
  }
  if (typeof timestamp === 'number') {
    return timestamp
  }
  return Date.now()
}

// Update getUserOrders to convert timestamps
async getUserOrders(userId: string): Promise<Order[]> {
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
      ...data,
      createdAt: timestampToNumber(data.createdAt),
      updatedAt: timestampToNumber(data.updatedAt),
      trackingHistory: data.trackingHistory?.map((event: any) => ({
        ...event,
        timestamp: timestampToNumber(event.timestamp)
      })) || []
    } as Order
  })
}

// Apply same pattern to getAllOrders, getUserMessages, getAllMessages, getUserNotifications
```

---

## Fix #2: Add Real-Time Listeners

### Problem
Current services only fetch data once. No real-time updates.

### Solution
Add listener services to firebase-services.ts:

```typescript
// Add to firebase-services.ts

import { onSnapshot, Query } from 'firebase/firestore'

export const realtimeService = {
  // Listen to user's orders
  subscribeToUserOrders(userId: string, callback: (orders: Order[]) => void): () => void {
    const ordersQuery = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )

    return onSnapshot(ordersQuery, (snapshot) => {
      const orders = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          createdAt: timestampToNumber(data.createdAt),
          updatedAt: timestampToNumber(data.updatedAt),
          trackingHistory: data.trackingHistory?.map((event: any) => ({
            ...event,
            timestamp: timestampToNumber(event.timestamp)
          })) || []
        } as Order
      })
      callback(orders)
    })
  },

  // Listen to all orders (admin)
  subscribeToAllOrders(callback: (orders: Order[]) => void): () => void {
    const ordersQuery = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    )

    return onSnapshot(ordersQuery, (snapshot) => {
      const orders = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          createdAt: timestampToNumber(data.createdAt),
          updatedAt: timestampToNumber(data.updatedAt),
          trackingHistory: data.trackingHistory?.map((event: any) => ({
            ...event,
            timestamp: timestampToNumber(event.timestamp)
          })) || []
        } as Order
      })
      callback(orders)
    })
  },

  // Listen to support messages
  subscribeToUserMessages(userId: string, callback: (messages: SupportMessage[]) => void): () => void {
    const messagesQuery = query(
      collection(db, 'support_messages'),
      where('userId', '==', userId),
      orderBy('timestamp', 'asc')
    )

    return onSnapshot(messagesQuery, (snapshot) => {
      const messages = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          timestamp: timestampToNumber(data.timestamp)
        } as SupportMessage
      })
      callback(messages)
    })
  },

  // Listen to all messages (admin)
  subscribeToAllMessages(callback: (messages: SupportMessage[]) => void): () => void {
    const messagesQuery = query(
      collection(db, 'support_messages'),
      orderBy('timestamp', 'desc')
    )

    return onSnapshot(messagesQuery, (snapshot) => {
      const messages = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          timestamp: timestampToNumber(data.timestamp)
        } as SupportMessage
      })
      callback(messages)
    })
  },

  // Listen to user notifications
  subscribeToUserNotifications(userId: string, callback: (notifications: Notification[]) => void): () => void {
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    )

    return onSnapshot(notificationsQuery, (snapshot) => {
      const notifications = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          timestamp: timestampToNumber(data.timestamp)
        } as Notification
      })
      callback(notifications)
    })
  }
}
```

---

## Fix #3: Update App.tsx to Use Firebase

### Problem
App.tsx uses useKV instead of Firebase.

### Solution
Complete rewrite of App.tsx data layer:

```typescript
import { useState, useEffect } from 'react'
import { User, Order, SupportMessage, Notification } from '@/lib/types'
import { Auth } from '@/components/Auth'
import { AdminPanel } from '@/components/AdminPanel'
import { OrderList } from '@/components/OrderList'
import { Support } from '@/components/Support'
import { Profile } from '@/components/Profile'
import { Marketplaces } from '@/components/Marketplaces'
import { Toaster } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import { Package, ChatCircle, User as UserIcon, AppWindow } from '@phosphor-icons/react'
import { authService, realtimeService, usersService } from '@/lib/firebase-services'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { toast } from 'sonner'

type Tab = 'orders' | 'support' | 'profile' | 'apps'
type ViewMode = 'user' | 'admin'

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('user')
  const [activeTab, setActiveTab] = useState<Tab>('orders')
  const [loading, setLoading] = useState(true)
  
  // Firebase real-time data
  const [orders, setOrders] = useState<Order[]>([])
  const [messages, setMessages] = useState<SupportMessage[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [allUsers, setAllUsers] = useState<User[]>([])

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userData = await authService.getUserData(firebaseUser.uid)
          if (userData) {
            setCurrentUser(userData)
            setViewMode(userData.isAdmin ? 'admin' : 'user')
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
          toast.error('Failed to load user data')
        }
      } else {
        setCurrentUser(null)
        setViewMode('user')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Real-time data subscriptions
  useEffect(() => {
    if (!currentUser) return

    let unsubscribeOrders: (() => void) | undefined
    let unsubscribeMessages: (() => void) | undefined
    let unsubscribeNotifications: (() => void) | undefined

    if (viewMode === 'admin') {
      // Admin sees all data
      unsubscribeOrders = realtimeService.subscribeToAllOrders(setOrders)
      unsubscribeMessages = realtimeService.subscribeToAllMessages(setMessages)
      
      // Load all users for admin
      usersService.getAllUsers().then(setAllUsers).catch(console.error)
    } else {
      // User sees only their data
      unsubscribeOrders = realtimeService.subscribeToUserOrders(currentUser.id, setOrders)
      unsubscribeMessages = realtimeService.subscribeToUserMessages(currentUser.id, setMessages)
      unsubscribeNotifications = realtimeService.subscribeToUserNotifications(currentUser.id, setNotifications)
    }

    return () => {
      unsubscribeOrders?.()
      unsubscribeMessages?.()
      unsubscribeNotifications?.()
    }
  }, [currentUser, viewMode])

  const handleLogout = async () => {
    try {
      await authService.logout()
      setCurrentUser(null)
      setActiveTab('orders')
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  const handleAdminLogin = () => {
    setViewMode('admin')
  }

  const handleAdminLogout = () => {
    setViewMode('user')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Rest of component remains the same...
  // Pass orders, messages, etc. as props to child components
}

export default App
```

---

## Fix #4: Update Auth.tsx to Use Firebase Auth

### Problem
Auth.tsx uses local authentication.

### Solution
Replace Auth.tsx authentication logic:

```typescript
import { useState } from 'react'
import { authService } from '@/lib/firebase-services'
import { ADMIN_CREDENTIALS } from '@/lib/constants'
import { toast } from 'sonner'

export function Auth({ onAdminLogin }: { onAdminLogin: () => void }) {
  const [loginFin, setLoginFin] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [registerFirstName, setRegisterFirstName] = useState('')
  const [registerLastName, setRegisterLastName] = useState('')
  const [registerFin, setRegisterFin] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('login')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Check if admin credentials
      if (loginFin === ADMIN_CREDENTIALS.username && loginPassword === ADMIN_CREDENTIALS.password) {
        // For admin, we need a special flow - check if admin user exists in Firebase
        const adminUser = await authService.getUserByFinCode(loginFin)
        if (adminUser && adminUser.isAdmin) {
          // Create email from FIN for Firebase Auth
          const email = `${loginFin.toLowerCase()}@admin.nextcargo.local`
          await authService.login(email, loginPassword)
          onAdminLogin()
          return
        } else {
          setError('Admin account not found. Please contact system administrator.')
          return
        }
      }

      // Regular user login
      if (!validateFINCode(loginFin)) {
        setError('Invalid FIN code format (7 characters required)')
        return
      }

      // Get user by FIN code
      const user = await authService.getUserByFinCode(loginFin)
      if (!user) {
        setError('User not found. Please register first.')
        return
      }

      // Create email from FIN for Firebase Auth
      const email = `${loginFin.toLowerCase()}@nextcargo.local`
      
      await authService.login(email, loginPassword)
      toast.success('Logged in successfully!')
    } catch (error: any) {
      console.error('Login error:', error)
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        setError('Invalid FIN code or password')
      } else {
        setError('Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!validateName(registerFirstName)) {
        setError('First name must be at least 2 characters')
        return
      }

      if (!validateName(registerLastName)) {
        setError('Last name must be at least 2 characters')
        return
      }

      if (!validateFINCode(registerFin)) {
        setError('Invalid FIN code format (7 characters required)')
        return
      }

      if (!validatePassword(registerPassword)) {
        setError('Password must be at least 6 characters')
        return
      }

      // Check if FIN already exists
      const existingUser = await authService.getUserByFinCode(registerFin)
      if (existingUser) {
        setError('This FIN code is already registered')
        return
      }

      // Create email from FIN for Firebase Auth
      const email = `${registerFin.toLowerCase()}@nextcargo.local`

      // Register with Firebase
      const userId = await authService.register(email, registerPassword, {
        firstName: registerFirstName.trim(),
        lastName: registerLastName.trim(),
        finCode: registerFin.toUpperCase(),
        password: '', // Don't store password in Firestore
        isAdmin: false
      })

      toast.success('Registration successful!')
      
      // Auto-login after registration
      await authService.login(email, registerPassword)
    } catch (error: any) {
      console.error('Registration error:', error)
      if (error.code === 'auth/email-already-in-use') {
        setError('This FIN code is already registered')
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Rest of component JSX remains the same, but buttons should show loading state
}
```

---

## Fix #5: Add Environment Variable Validation

### Problem
No validation that Firebase config exists.

### Solution
Update src/lib/firebase.ts:

```typescript
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
]

// Validate environment variables
const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName])
if (missingVars.length > 0) {
  throw new Error(
    `Missing Firebase environment variables: ${missingVars.join(', ')}. ` +
    'Please create a .env file based on .env.example and add your Firebase credentials.'
  )
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
```

---

## Fix #6: Update AdminPanel to Use Firebase Services

Replace all data manipulation in AdminPanel.tsx with Firebase service calls:

```typescript
import { ordersService, supportService, notificationsService } from '@/lib/firebase-services'

// In AdminPanel component:

const handleUpdateStatus = async (order: Order, newStatus: OrderStatus) => {
  try {
    const now = Date.now()
    
    const newTrackingEvent: TrackingEvent = {
      id: `event_${now}`,
      timestamp: now,
      status: newStatus,
      location: newStatus === 'in_transit' ? 'Poland - In Transit' : 
                newStatus === 'at_warehouse' ? 'Azerbaijan Warehouse' : 
                'Delivered to Customer',
      description: `Order status updated to ${STATUS_LABELS[newStatus]}`,
      updatedBy: 'Admin'
    }

    // Update in Firebase
    await ordersService.updateOrder(order.id, {
      status: newStatus,
      trackingHistory: [...(order.trackingHistory || []), newTrackingEvent]
    })

    // Send notification via Firebase
    await notificationsService.createNotification({
      userId: order.userId,
      message: `Your order ${order.trackingNumber} status changed to ${STATUS_LABELS[newStatus]}`,
      read: false,
      orderId: order.id
    })

    toast.success('Order status updated and notification sent')
    setEditingOrder(null)
  } catch (error) {
    console.error('Error updating order:', error)
    toast.error('Failed to update order status')
  }
}

const handleAddOrder = async () => {
  if (!newOrder.userId || !newOrder.trackingNumber || !newOrder.description) {
    toast.error('Please fill all required fields')
    return
  }

  try {
    const now = Date.now()

    const initialTrackingEvent: TrackingEvent = {
      id: `event_${now}`,
      timestamp: now,
      status: newOrder.status,
      location: newOrder.status === 'in_transit' ? 'Poland - In Transit' : 
                newOrder.status === 'at_warehouse' ? 'Azerbaijan Warehouse' : 
                'Delivered to Customer',
      description: `Order created with status: ${STATUS_LABELS[newOrder.status]}`,
      updatedBy: 'Admin'
    }

    // Create in Firebase
    const orderId = await ordersService.createOrder({
      userId: newOrder.userId,
      trackingNumber: newOrder.trackingNumber,
      description: newOrder.description,
      status: newOrder.status,
      createdAt: now,
      updatedAt: now,
      origin: newOrder.origin || undefined,
      destination: newOrder.destination || undefined,
      weight: newOrder.weight || undefined,
      trackingHistory: [initialTrackingEvent]
    })

    // Send notification
    await notificationsService.createNotification({
      userId: newOrder.userId,
      message: `New order ${newOrder.trackingNumber} has been added to your account`,
      read: false,
      orderId
    })

    toast.success('Order added and user notified')
    setIsAddingOrder(false)
    setCustomerSearchOpen(false)
    setNewOrder({
      userId: '',
      trackingNumber: '',
      description: '',
      status: 'in_transit',
      origin: 'Poland',
      destination: 'Azerbaijan',
      weight: ''
    })
  } catch (error) {
    console.error('Error adding order:', error)
    toast.error('Failed to add order')
  }
}

const handleDeleteOrder = async (orderId: string) => {
  if (confirm('Are you sure you want to delete this order?')) {
    try {
      await ordersService.deleteOrder(orderId)
      toast.success('Order deleted')
    } catch (error) {
      console.error('Error deleting order:', error)
      toast.error('Failed to delete order')
    }
  }
}

const handleSendReply = async () => {
  if (!replyText.trim() || !selectedConversation) return

  try {
    await supportService.sendMessage({
      userId: selectedConversation,
      userName: 'Support Team',
      message: replyText.trim(),
      timestamp: Date.now(),
      isAdmin: true,
      conversationId: selectedConversation
    })

    setReplyText('')
    toast.success('Reply sent')
  } catch (error) {
    console.error('Error sending message:', error)
    toast.error('Failed to send reply')
  }
}
```

---

## Fix #7: Update Support.tsx

```typescript
import { supportService } from '@/lib/firebase-services'

const handleSend = async () => {
  if (!messageText.trim()) return

  try {
    await supportService.sendMessage({
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      message: messageText.trim(),
      timestamp: Date.now(),
      isAdmin: false,
      conversationId: user.id
    })

    setMessageText('')
  } catch (error) {
    console.error('Error sending message:', error)
    toast.error('Failed to send message')
  }
}
```

---

## Testing Checklist

After implementing these fixes:

1. Create `.env` file with Firebase credentials
2. Create Firebase project
3. Enable Email/Password auth in Firebase Console
4. Deploy Firestore rules and indexes
5. Test registration flow
6. Test login flow
7. Test admin login
8. Test order creation (admin)
9. Test real-time order updates
10. Test support messaging
11. Test notifications
12. Test security rules (try accessing other users' data)

---

## Deployment Steps

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Initialize Firebase project
firebase init

# Select:
# - Firestore
# - Hosting

# 4. Deploy Firestore rules and indexes
firebase deploy --only firestore

# 5. Build the app
npm run build

# 6. Deploy to Firebase Hosting
firebase deploy --only hosting
```

---

## Summary

These fixes will:
- ✅ Connect app to Firebase Authentication
- ✅ Store all data in Firestore
- ✅ Enable real-time updates
- ✅ Implement proper security
- ✅ Handle errors gracefully
- ✅ Make app production-ready
