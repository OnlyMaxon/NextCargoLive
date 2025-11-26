import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
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

type Tab = 'orders' | 'support' | 'profile' | 'apps'
type ViewMode = 'user' | 'admin'

function App() {
  const [users, setUsers] = useKV<User[]>('users', [])
  const [orders, setOrders] = useKV<Order[]>('orders', [])
  const [messages, setMessages] = useKV<SupportMessage[]>('support_messages', [])
  const [notifications, setNotifications] = useKV<Notification[]>('notifications', [])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('user')
  const [activeTab, setActiveTab] = useState<Tab>('orders')

  const handleLogin = (user: User) => {
    setCurrentUser(user)
  }

  const handleRegister = (user: User) => {
    setUsers((current) => [...(current || []), user])
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setActiveTab('orders')
  }

  const handleAdminLogin = () => {
    setViewMode('admin')
  }

  const handleAdminLogout = () => {
    setViewMode('user')
  }

  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders((current) => (current || []).map(o => o.id === updatedOrder.id ? updatedOrder : o))
  }

  const handleAddOrder = (newOrder: Order) => {
    setOrders((current) => [...(current || []), newOrder])
  }

  const handleDeleteOrder = (orderId: string) => {
    setOrders((current) => (current || []).filter(o => o.id !== orderId))
  }

  const handleSendMessage = (message: SupportMessage) => {
    setMessages((current) => [...(current || []), message])
  }

  const handleSendNotification = (notification: Notification) => {
    setNotifications((current) => [...(current || []), notification])
  }

  if (viewMode === 'admin') {
    return (
      <>
        <AdminPanel
          orders={orders || []}
          users={users || []}
          messages={messages || []}
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

  if (!currentUser) {
    return (
      <>
        <Auth 
          onLogin={handleLogin} 
          users={users || []} 
          onRegister={handleRegister}
          onAdminLogin={handleAdminLogin}
        />
        <Toaster />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
        <div className="px-4 py-4 sm:py-5 flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <Package size={24} weight="bold" className="text-primary-foreground sm:w-7 sm:h-7" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">NextCargo</h1>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">Welcome, {currentUser.firstName}</p>
          </div>
        </div>
      </header>

      <main className={activeTab === 'support' ? '' : 'pb-20 sm:pb-24'}>
        {activeTab === 'orders' && <OrderList orders={orders || []} user={currentUser} />}
        {activeTab === 'support' && (
          <Support messages={messages || []} user={currentUser} onSendMessage={handleSendMessage} />
        )}
        {activeTab === 'profile' && <Profile user={currentUser} onLogout={handleLogout} />}
        {activeTab === 'apps' && <Marketplaces />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t z-20 shadow-lg safe-area-inset-bottom">
        <div className="flex items-center justify-around px-1 sm:px-2 py-3 sm:py-4">
          <Button
            variant={activeTab === 'orders' ? 'default' : 'ghost'}
            className="flex-col h-auto py-2 sm:py-3 px-2 sm:px-4 gap-1 sm:gap-1.5 min-w-[60px] sm:min-w-[70px]"
            onClick={() => setActiveTab('orders')}
          >
            <Package size={22} weight={activeTab === 'orders' ? 'fill' : 'regular'} className="sm:w-[26px] sm:h-[26px]" />
            <span className="text-[11px] sm:text-xs font-medium">Orders</span>
          </Button>

          <Button
            variant={activeTab === 'support' ? 'default' : 'ghost'}
            className="flex-col h-auto py-2 sm:py-3 px-2 sm:px-4 gap-1 sm:gap-1.5 min-w-[60px] sm:min-w-[70px]"
            onClick={() => setActiveTab('support')}
          >
            <ChatCircle size={22} weight={activeTab === 'support' ? 'fill' : 'regular'} className="sm:w-[26px] sm:h-[26px]" />
            <span className="text-[11px] sm:text-xs font-medium">Support</span>
          </Button>

          <Button
            variant={activeTab === 'profile' ? 'default' : 'ghost'}
            className="flex-col h-auto py-2 sm:py-3 px-2 sm:px-4 gap-1 sm:gap-1.5 min-w-[60px] sm:min-w-[70px]"
            onClick={() => setActiveTab('profile')}
          >
            <UserIcon size={22} weight={activeTab === 'profile' ? 'fill' : 'regular'} className="sm:w-[26px] sm:h-[26px]" />
            <span className="text-[11px] sm:text-xs font-medium">Profile</span>
          </Button>

          <Button
            variant={activeTab === 'apps' ? 'default' : 'ghost'}
            className="flex-col h-auto py-2 sm:py-3 px-2 sm:px-4 gap-1 sm:gap-1.5 min-w-[60px] sm:min-w-[70px]"
            onClick={() => setActiveTab('apps')}
          >
            <AppWindow size={22} weight={activeTab === 'apps' ? 'fill' : 'regular'} className="sm:w-[26px] sm:h-[26px]" />
            <span className="text-[11px] sm:text-xs font-medium">Apps</span>
          </Button>
        </div>
      </nav>

      <Toaster />
    </div>
  )
}

export default App