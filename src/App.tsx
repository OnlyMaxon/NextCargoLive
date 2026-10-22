import { useState, useEffect, lazy, Suspense } from 'react'
import { User, Order, Notification, ViewMode, AuthTab } from '@/lib/types'
import LandingPage from '@/components/LandingPage'
import { Auth } from '@/components/Auth'
import { OrderList } from '@/components/OrderList'
import { Profile } from '@/components/Profile'
import { Marketplaces } from '@/components/Marketplaces'
import { Instructions } from '@/components/Instructions'
import { NotificationsBell } from '@/components/NotificationsBell'
import { Toaster } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Package, User as UserIcon, AppWindow, Warning, IdentificationCard, BookOpen } from '@phosphor-icons/react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import {
  authService,
  ordersService,
  notificationsService,
  usersService
} from '@/lib/firebase-services'
import { toast } from 'sonner'
import { useTranslation, translations } from '@/lib/i18n'

// Админка нужна одному человеку, а весила 700 строк в общем бандле.
const AdminPanel = lazy(() =>
  import('@/components/AdminPanel').then(m => ({ default: m.AdminPanel }))
)

const navTxt = translations.nav
const commonTxt = translations.common
const appTxt = translations.app

type Tab = 'orders' | 'profile' | 'apps' | 'instructions'

function LoadingScreen({ label }: { label: string }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
          <Package size={32} weight="bold" className="text-white" />
        </div>
        <p className="text-gray-500">{label}</p>
      </div>
    </div>
  )
}

function App() {
  const { language } = useTranslation()
  const [users, setUsers] = useState<User[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('landing')
  const [authTab, setAuthTab] = useState<AuthTab>('login')
  const [activeTab, setActiveTab] = useState<Tab>('orders')
  const [loading, setLoading] = useState(true)
  const [showProfileWarning, setShowProfileWarning] = useState(false)

  const isProfileComplete = (user: User | null): boolean => {
    if (!user) return true
    return Boolean(user.documentSerial && user.birthDate)
  }

  useEffect(() => {
    if (currentUser && !currentUser.isAdmin && !isProfileComplete(currentUser)) {
      setShowProfileWarning(true)
    }
  }, [currentUser])

  const handleUserUpdate = (updatedUser: User) => {
    setCurrentUser(updatedUser)
    if (isProfileComplete(updatedUser)) {
      setShowProfileWarning(false)
    }
  }

  const resetSession = () => {
    setCurrentUser(null)
    setOrders([])
    setNotifications([])
    setUsers([])
    setActiveTab('orders')
    setViewMode('landing')
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          resetSession()
          return
        }

        const userData = await authService.getUserData(firebaseUser.uid)

        if (!userData) {
          // Аккаунт есть, профиля в Firestore нет. Раньше приложение молча
          // оставалось на лендинге в залогиненном состоянии — выйти или
          // зарегистрироваться заново было невозможно.
          console.error('Authenticated user has no profile document:', firebaseUser.uid)
          toast.error(appTxt.profileMissing[language])
          await authService.logout()
          return
        }

        setCurrentUser(userData)
        setViewMode(userData.isAdmin ? 'admin' : 'user')
        await loadUserData(userData)
      } catch (error) {
        console.error('Auth state change error:', error)
        toast.error(appTxt.loadFailed[language])
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
    // language читается только для текста тоста; переподписка на auth не нужна.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * Живые данные админки. Без подписок панель показывала срез на момент входа:
   * клиент, зарегистрировавшийся минуту назад, не находился в списке.
   */
  useEffect(() => {
    if (!currentUser?.isAdmin) return

    const unsubscribeOrders = ordersService.subscribeToAllOrders(
      setOrders,
      () => toast.error(appTxt.loadFailed[language])
    )
    const unsubscribeUsers = usersService.subscribeToAllUsers(
      setUsers,
      () => toast.error(appTxt.loadFailed[language])
    )

    return () => {
      unsubscribeOrders()
      unsubscribeUsers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.isAdmin])

  const loadUserData = async (user: User) => {
    // Данные админки целиком держат подписки выше: onSnapshot отдаёт полный
    // снимок сразу, поэтому отдельный стартовый запрос только дублировал бы его.
    if (user.isAdmin) return

    try {
      const [userOrders, userNotifications] = await Promise.all([
        ordersService.getUserOrders(user.id),
        notificationsService.getUserNotifications(user.id)
      ])
      setOrders(userOrders)
      setNotifications(userNotifications)
    } catch (error) {
      console.error('Failed to load user data:', error)
      toast.error(appTxt.loadFailed[language])
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
      resetSession()
      toast.success(appTxt.loggedOut[language])
    } catch (error) {
      console.error('Logout error:', error)
      toast.error(appTxt.logoutFailed[language])
    }
  }

  const handleUpdateOrder = async (updatedOrder: Order) => {
    try {
      await ordersService.updateOrder(updatedOrder.id, updatedOrder)
      setOrders((current) => current.map(o => o.id === updatedOrder.id ? updatedOrder : o))
      toast.success(appTxt.orderUpdated[language])
    } catch (error) {
      console.error('Failed to update order:', error)
      toast.error(appTxt.orderUpdateFailed[language])
    }
  }

  /** Возвращает id созданного документа — AdminPanel привязывает к нему уведомление. */
  const handleAddOrder = async (newOrder: Omit<Order, 'id'>): Promise<string | null> => {
    try {
      const orderId = await ordersService.createOrder(newOrder)
      setOrders((current) => [...current, { ...newOrder, id: orderId }])
      return orderId
    } catch (error) {
      console.error('Failed to add order:', error)
      return null
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await ordersService.deleteOrder(orderId)
      setOrders((current) => current.filter(o => o.id !== orderId))
    } catch (error) {
      console.error('Failed to delete order:', error)
      toast.error(appTxt.orderDeleteFailed[language])
    }
  }

  const handleSendNotification = async (notification: Omit<Notification, 'id'>) => {
    try {
      const notificationId = await notificationsService.createNotification(notification)
      setNotifications((current) => [...current, { ...notification, id: notificationId }])
    } catch (error) {
      console.error('Failed to send notification:', error)
      toast.error(appTxt.notificationFailed[language])
    }
  }

  const handleMarkNotificationsRead = async () => {
    const unread = notifications.filter(n => !n.read)
    if (unread.length === 0) return

    setNotifications((current) => current.map(n => ({ ...n, read: true })))
    try {
      await Promise.all(unread.map(n => notificationsService.markAsRead(n.id)))
    } catch (error) {
      console.error('Failed to mark notifications as read:', error)
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
    return <LoadingScreen label={commonTxt.loading[language]} />
  }

  if (viewMode === 'auth') {
    return (
      <>
        <Auth
          onLogin={handleLogin}
          onRegister={handleRegister}
          defaultTab={authTab}
          onBackClick={handleBackToLanding}
        />
        <Toaster />
      </>
    )
  }

  // Все экраны ниже требуют загруженный профиль. Раньше здесь читался
  // currentUser.firstName без проверки — при viewMode 'user' и currentUser null
  // это был краш, который скрывался флагом --noCheck в сборке.
  if (viewMode === 'landing' || !currentUser) {
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
        <Suspense fallback={<LoadingScreen label={commonTxt.loading[language]} />}>
          <AdminPanel
            orders={orders}
            users={users}
            onUpdateOrder={handleUpdateOrder}
            onAddOrder={handleAddOrder}
            onDeleteOrder={handleDeleteOrder}
            onSendNotification={handleSendNotification}
            onLogout={handleLogout}
          />
        </Suspense>
        <Toaster />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Package size={20} weight="bold" className="text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-semibold tracking-tight truncate text-gray-900">NextCargo</h1>
            <p className="text-xs text-gray-500 truncate">
              {appTxt.welcome[language]}, {currentUser.firstName}
            </p>
          </div>
          <NotificationsBell
            notifications={notifications}
            onMarkAllRead={handleMarkNotificationsRead}
          />
        </div>
      </header>

      <main className="pb-14">
        {activeTab === 'orders' && <OrderList orders={orders} user={currentUser} />}
        {activeTab === 'profile' && <Profile user={currentUser} onLogout={handleLogout} onUserUpdate={handleUserUpdate} />}
        {activeTab === 'apps' && <Marketplaces />}
        {activeTab === 'instructions' && <Instructions />}
      </main>

      {/* Profile Warning Modal */}
      <Dialog open={showProfileWarning} onOpenChange={setShowProfileWarning}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Warning size={24} weight="fill" className="text-amber-600" />
              </div>
              <div>
                <DialogTitle className="text-lg">{appTxt.completeProfileTitle[language]}</DialogTitle>
              </div>
            </div>
            <DialogDescription className="text-sm text-gray-600">
              {appTxt.completeProfileBody[language]}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowProfileWarning(false)}
            >
              {appTxt.later[language]}
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setShowProfileWarning(false)
                setActiveTab('profile')
              }}
            >
              <IdentificationCard size={16} className="mr-1.5" />
              {appTxt.fillNow[language]}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20 safe-area-inset-bottom">
        <div className="grid grid-cols-4 px-2 py-1">
          {[
            { id: 'orders' as Tab, icon: Package, label: navTxt.orders[language] },
            { id: 'profile' as Tab, icon: UserIcon, label: navTxt.profile[language] },
            { id: 'instructions' as Tab, icon: BookOpen, label: navTxt.instructions[language] },
            { id: 'apps' as Tab, icon: AppWindow, label: navTxt.apps[language] }
          ].map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              aria-current={activeTab === item.id ? 'page' : undefined}
              className={`flex-col h-auto py-1.5 px-1 gap-0.5 w-full rounded-lg ${
                activeTab === item.id
                  ? 'text-blue-600'
                  : 'text-gray-400'
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon
                size={18}
                weight={activeTab === item.id ? 'fill' : 'regular'}
              />
              <span className="text-[10px] font-medium truncate max-w-full">
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
