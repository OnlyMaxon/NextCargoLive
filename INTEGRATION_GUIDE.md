# Руководство по интеграции Firebase в NextCargo

## Обзор

Этот документ описывает, как интегрировать Firebase Authentication и Firestore в существующее приложение NextCargo.

## Текущая архитектура

Сейчас приложение использует:
- `useKV` хук для локального хранения данных
- Локальное состояние для управления пользователями, заказами, сообщениями
- Простую проверку учетных данных

## Новая архитектура с Firebase

После интеграции приложение будет использовать:
- Firebase Authentication для регистрации/входа
- Firestore для хранения всех данных
- Real-time обновления (опционально)

## Пошаговая интеграция

### 1. Установка зависимостей

```bash
npm install firebase
```

### 2. Модификация компонента Auth.tsx

Замените существующую логику аутентификации на Firebase:

```typescript
import { authService } from '@/lib/firebase-services'

// В функции handleLogin
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  setError('')
  setLoading(true)

  try {
    // Проверка на админа (оставляем как есть для простоты)
    if (loginFin === ADMIN_CREDENTIALS.username && loginPassword === ADMIN_CREDENTIALS.password) {
      onAdminLogin()
      return
    }

    // Получаем пользователя по FIN коду
    const user = await authService.getUserByFinCode(loginFin)
    
    if (!user) {
      setError('User not found')
      return
    }

    // Логинимся через Firebase Auth (используем email как fincode@nextcargo.az)
    const email = `${loginFin.toLowerCase()}@nextcargo.az`
    await authService.login(email, loginPassword)
    
    onLogin(user)
  } catch (error: any) {
    setError(error.message || 'Login failed')
  } finally {
    setLoading(false)
  }
}

// В функции handleRegister
const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault()
  setError('')
  setLoading(true)

  try {
    // Валидация...
    
    // Создаем email из FIN кода
    const email = `${registerFin.toLowerCase()}@nextcargo.az`
    
    // Регистрируем в Firebase
    const userId = await authService.register(email, registerPassword, {
      firstName: registerFirstName.trim(),
      lastName: registerLastName.trim(),
      finCode: registerFin.toUpperCase(),
      password: '', // не храним пароль в Firestore
      isAdmin: false
    })

    const newUser = {
      id: userId,
      firstName: registerFirstName.trim(),
      lastName: registerLastName.trim(),
      finCode: registerFin.toUpperCase(),
      password: '',
      isAdmin: false
    }

    onLogin(newUser)
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      setError('This FIN code is already registered')
    } else {
      setError(error.message || 'Registration failed')
    }
  } finally {
    setLoading(false)
  }
}
```

### 3. Модификация App.tsx

Замените `useKV` на Firebase сервисы:

```typescript
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { authService, ordersService, supportService, notificationsService } from '@/lib/firebase-services'

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [messages, setMessages] = useState<SupportMessage[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('user')
  const [activeTab, setActiveTab] = useState<Tab>('orders')

  // Слушаем изменения состояния аутентификации
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Получаем данные пользователя из Firestore
        const userData = await authService.getUserData(firebaseUser.uid)
        setCurrentUser(userData)
        
        // Загружаем заказы пользователя
        const userOrders = await ordersService.getUserOrders(firebaseUser.uid)
        setOrders(userOrders)
        
        // Загружаем сообщения
        const userMessages = await supportService.getUserMessages(firebaseUser.uid)
        setMessages(userMessages)
        
        // Загружаем уведомления
        const userNotifications = await notificationsService.getUserNotifications(firebaseUser.uid)
        setNotifications(userNotifications)
      } else {
        setCurrentUser(null)
        setOrders([])
        setMessages([])
        setNotifications([])
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    await authService.logout()
    setCurrentUser(null)
    setActiveTab('orders')
  }

  // ... остальной код
}
```

### 4. Модификация AdminPanel.tsx

Обновите функции для работы с Firebase:

```typescript
import { ordersService, usersService, notificationsService } from '@/lib/firebase-services'

// При загрузке компонента
useEffect(() => {
  const loadData = async () => {
    const allOrders = await ordersService.getAllOrders()
    setOrders(allOrders)
    
    const allUsers = await usersService.getAllUsers()
    setUsers(allUsers)
  }
  
  loadData()
}, [])

// При добавлении заказа
const handleAddOrder = async (newOrder: Omit<Order, 'id'>) => {
  try {
    const orderId = await ordersService.createOrder(newOrder)
    
    // Отправляем уведомление пользователю
    await notificationsService.createNotification({
      userId: newOrder.userId,
      title: 'New order added',
      message: `Order ${newOrder.trackingNumber} has been added`,
      read: false
    })
    
    // Обновляем локальное состояние
    setOrders([...orders, { ...newOrder, id: orderId }])
    
    toast.success('Order added successfully')
  } catch (error: any) {
    toast.error(error.message || 'Failed to add order')
  }
}

// При обновлении заказа
const handleUpdateOrder = async (orderId: string, updates: Partial<Order>) => {
  try {
    await ordersService.updateOrder(orderId, updates)
    
    // Если статус изменился, отправляем уведомление
    if (updates.status) {
      const order = orders.find(o => o.id === orderId)
      if (order) {
        await notificationsService.createNotification({
          userId: order.userId,
          title: 'Order status updated',
          message: `Order ${order.trackingNumber} is now: ${updates.status}`,
          read: false
        })
      }
    }
    
    // Обновляем локальное состояние
    setOrders(orders.map(o => o.id === orderId ? { ...o, ...updates } : o))
    
    toast.success('Order updated successfully')
  } catch (error: any) {
    toast.error(error.message || 'Failed to update order')
  }
}

// При удалении заказа
const handleDeleteOrder = async (orderId: string) => {
  try {
    await ordersService.deleteOrder(orderId)
    setOrders(orders.filter(o => o.id !== orderId))
    toast.success('Order deleted successfully')
  } catch (error: any) {
    toast.error(error.message || 'Failed to delete order')
  }
}

// Поиск пользователей
const handleSearchUsers = async (searchTerm: string) => {
  try {
    const results = await usersService.searchUsers(searchTerm)
    setSearchResults(results)
  } catch (error: any) {
    toast.error(error.message || 'Search failed')
  }
}
```

### 5. Модификация Support.tsx

```typescript
import { supportService } from '@/lib/firebase-services'

const handleSendMessage = async (message: string) => {
  try {
    await supportService.sendMessage({
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      message,
      isAdmin: false
    })
    
    // Обновляем локальное состояние
    const newMessage = {
      id: Date.now().toString(),
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      message,
      isAdmin: false,
      timestamp: new Date().toISOString()
    }
    
    onSendMessage(newMessage)
    setMessageText('')
    toast.success('Message sent')
  } catch (error: any) {
    toast.error(error.message || 'Failed to send message')
  }
}
```

## Real-time обновления (опционально)

Для real-time обновлений используйте `onSnapshot`:

```typescript
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'

// В компоненте
useEffect(() => {
  if (!currentUser) return

  const ordersQuery = query(
    collection(db, 'orders'),
    where('userId', '==', currentUser.id),
    orderBy('createdAt', 'desc')
  )

  const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
    const updatedOrders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order))
    
    setOrders(updatedOrders)
  })

  return () => unsubscribe()
}, [currentUser])
```

## Миграция существующих данных

Если у вас есть данные в `useKV`, вы можете мигрировать их:

```typescript
// Скрипт миграции (запустить один раз)
const migrateData = async () => {
  const [existingUsers] = useKV<User[]>('users', [])
  const [existingOrders] = useKV<Order[]>('orders', [])
  
  // Миграция пользователей
  for (const user of existingUsers) {
    const email = `${user.finCode.toLowerCase()}@nextcargo.az`
    try {
      await authService.register(email, 'tempPassword123', user)
    } catch (error) {
      console.error('Failed to migrate user:', user.finCode, error)
    }
  }
  
  // Миграция заказов
  for (const order of existingOrders) {
    try {
      await ordersService.createOrder(order)
    } catch (error) {
      console.error('Failed to migrate order:', order.id, error)
    }
  }
}
```

## Тестирование

1. Зарегистрируйте нового пользователя
2. Войдите с его учетными данными
3. Войдите как админ
4. Добавьте заказ для пользователя
5. Проверьте уведомления
6. Отправьте сообщение в поддержку

## Troubleshooting

### Ошибка "Firebase: Error (auth/configuration-not-found)"
- Проверьте, что `.env` файл создан и заполнен
- Убедитесь, что Email/Password authentication включен в Firebase Console

### Ошибка "Missing or insufficient permissions"
- Проверьте Security Rules в Firestore
- Убедитесь, что пользователь аутентифицирован

### Данные не обновляются
- Проверьте консоль браузера на ошибки
- Убедитесь, что используете правильные ID пользователей
- Проверьте, что индексы созданы в Firestore

## Следующие шаги

После успешной интеграции вы можете:
1. Добавить push-уведомления через Firebase Cloud Messaging
2. Настроить Cloud Functions для автоматизации
3. Добавить Analytics для отслеживания использования
4. Настроить резервное копирование данных
