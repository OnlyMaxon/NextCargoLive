import { useState, useEffect } from 'react'
import { User, Order, SupportMessage, Notification, ViewMode, AuthTab } from '@/lib/types'
import { LandingPage } from '@/components/LandingPage'
import { Auth } from '@/components/Auth'
import { AdminPanel } from '@/components/AdminPanel'
import { OrderList } from '@/components/OrderList'
import { Support } from '@/components/Support'
import { Profile } from '@/components/Profile'
import { Marketplaces } from '@/components/Marketplaces'
import { Toaster } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import { Package, ChatCircle, User as UserIcon, AppWindow } from '@phosphor-icons/react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { 
  authService, 
  ordersService, 
  supportService, 
  notificationsService, 
  usersService 
} from '@/lib/firebase-services'
import { toast } from 'sonner'

type Tab = 'orders' | 'support' | 'profile' | 'apps'

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [messages, setMessages] = useState<SupportMessage[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('landing')
  const [authTab, setAuthTab] = useState<AuthTab>('login')
  const [activeTab, setActiveTab] = useState<Tab>('orders')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userData = await authService.getUserData(firebaseUser.uid)
          if (userData) {
            setCurrentUser(userData)
            // Auto-switch to admin mode if user is admin
            if (userData.isAdmin) {
              setViewMode('admin')
            } else {
              setViewMode('user')
            }
            await loadUserData(userData)
          }
        } else {
          setCurrentUser(null)
          setOrders([])
          setMessages([])
          setNotifications([])
          setViewMode('landing')
        }
      } catch (error) {
        console.error('Auth state change error:', error)
        toast.error('Failed to load user data')
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const loadUserData = async (user: User) => {
    try {
      if (user.isAdmin) {
        const [allOrders, allMessages, allUsers] = await Promise.all([
          ordersService.getAllOrders(),
          supportService.getAllMessages(),
          usersService.getAllUsers()
        ])
        setOrders(allOrders)
        setMessages(allMessages)
        setUsers(allUsers)
      } else {
        const [userOrders, userMessages, userNotifications] = await Promise.all([
          ordersService.getUserOrders(user.id),
          supportService.getUserMessages(user.id),
          notificationsService.getUserNotifications(user.id)
        ])
        setOrders(userOrders)
        setMessages(userMessages)
        setNotifications(userNotifications)
      }
    } catch (error) {
      console.error('Failed to load user data:', error)
      toast.error('Failed to load data')
    }
  }

  const handleLogin = (user: User) => {
    setCurrentUser(user)
    loadUserData(user)
  }

  const handleRegister = async (user: User) => {
    try {
      await loadUserData(user)
    } catch (error) {
      console.error('Failed to load registered user data:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      setCurrentUser(null)
      setOrders([])
      setMessages([])
      setNotifications([])
      setUsers([])
      setActiveTab('orders')
      setViewMode('landing')
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
    }
  }

  const handleAdminLogin = () => {
    setViewMode('admin')
  }

  const handleAdminLogout = async () => {
    try {
      await authService.logout()
      setCurrentUser(null)
      setOrders([])
      setMessages([])
      setNotifications([])
      setUsers([])
      setActiveTab('orders')
      setViewMode('landing')
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
    }
  }

  const handleUpdateOrder = async (updatedOrder: Order) => {
    try {
      await ordersService.updateOrder(updatedOrder.id, updatedOrder)
      setOrders((current) => current.map(o => o.id === updatedOrder.id ? updatedOrder : o))
      toast.success('Order updated successfully')
    } catch (error) {
      console.error('Failed to update order:', error)
      toast.error('Failed to update order')
    }
  }

  const handleAddOrder = async (newOrder: Order) => {
    try {
      const orderId = await ordersService.createOrder(newOrder)
      const orderWithId = { ...newOrder, id: orderId }
      setOrders((current) => [...current, orderWithId])
      toast.success('Order added successfully')
    } catch (error) {
      console.error('Failed to add order:', error)
      toast.error('Failed to add order')
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await ordersService.deleteOrder(orderId)
      setOrders((current) => current.filter(o => o.id !== orderId))
      toast.success('Order deleted successfully')
    } catch (error) {
      console.error('Failed to delete order:', error)
      toast.error('Failed to delete order')
    }
  }

  const handleSendMessage = async (message: SupportMessage) => {
    try {
      const messageId = await supportService.sendMessage(message)
      const messageWithId = { ...message, id: messageId }
      setMessages((current) => [...current, messageWithId])
    } catch (error) {
      console.error('Failed to send message:', error)
      toast.error('Failed to send message')
    }
  }

  const handleSendNotification = async (notification: Notification) => {
    try {
      const notificationId = await notificationsService.createNotification(notification)
      const notificationWithId = { ...notification, id: notificationId }
      setNotifications((current) => [...current, notificationWithId])
    } catch (error) {
      console.error('Failed to send notification:', error)
      toast.error('Failed to send notification')
    }
  }

  const handleLoginClick = () => {
    setAuthTab('login')
    setViewMode('auth')
  }

  const handleRegisterClick = () => {
    setAuthTab('register')
    setViewMode('auth')
  }

  const handleBackToLanding = () => {
    setViewMode('landing')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Package size={32} weight="bold" className="text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (viewMode === 'landing') {
    return (
      <>
        <LandingPage 
          onLoginClick={handleLoginClick}
          onRegisterClick={handleRegisterClick}
        />
        <Toaster />
      </>
    )
  }

  if (viewMode === 'admin') {
    return (
      <>
        <AdminPanel
          orders={orders}
          users={users}
          messages={messages}
          onUpdateOrder={handleUpdateOrder}
          onAddOrder={handleAddOrder}
          onDeleteOrder={handleDeleteOrder}
          onSendNotification={handleSendNotification}
          onSendMessage={handleSendMessage}
          onLogout={handleAdminLogout}
        />
        <Toaster />
      </>
    )
  }

  if (viewMode === 'auth') {
    return (
      <>
        <Auth 
          onLogin={handleLogin} 
          users={users} 
          onRegister={handleRegister}
          onAdminLogin={handleAdminLogin}
          defaultTab={authTab}
          onBackClick={handleBackToLanding}
        />
        <Toaster />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="px-4 py-3 sm:py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Package size={22} weight="bold" className="text-primary-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight truncate">NextCargo</h1>
            <p className="text-xs text-muted-foreground truncate">Welcome, {currentUser.firstName}</p>
          </div>
        </div>
      </header>

      <main className={activeTab === 'support' ? '' : 'pb-16'}>
        {activeTab === 'orders' && <OrderList orders={orders} user={currentUser} />}
        {activeTab === 'support' && (
          <Support messages={messages} user={currentUser} onSendMessage={handleSendMessage} />
        )}
        {activeTab === 'profile' && <Profile user={currentUser} onLogout={handleLogout} />}
        {activeTab === 'apps' && <Marketplaces />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-20 safe-area-inset-bottom">
        <div className="flex items-center justify-around px-1 py-1.5">
          {[
            { id: 'orders' as Tab, icon: Package, label: 'Orders' },
            { id: 'support' as Tab, icon: ChatCircle, label: 'Support' },
            { id: 'profile' as Tab, icon: UserIcon, label: 'Profile' },
            { id: 'apps' as Tab, icon: AppWindow, label: 'Apps' }
          ].map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={`flex-col h-auto py-2 px-4 gap-1 min-w-[60px] rounded-lg ${
                activeTab === item.id 
                  ? 'text-primary' 
                  : 'text-muted-foreground'
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon 
                size={20} 
                weight={activeTab === item.id ? 'fill' : 'regular'} 
              />
              <span className="text-[10px] font-medium">
                {item.label}
              </span>
            </Button>
          ))}
        </div>
      </nav>

      <Toaster />
    </div>
  )
}

export default App
