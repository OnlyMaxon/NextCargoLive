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
import { Badge } from '@/components/ui/badge'
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

  const unreadNotifications = currentUser
    ? (notifications || []).filter(n => n.userId === currentUser.id && !n.read).length
    : 0

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
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Package size={24} weight="bold" className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">NextCargo</h1>
              <p className="text-xs text-muted-foreground">Welcome, {currentUser.firstName}</p>
            </div>
          </div>
          {unreadNotifications > 0 && (
            <Badge variant="destructive" className="h-6 px-2">
              {unreadNotifications} new
            </Badge>
          )}
        </div>
      </header>

      <main>
        {activeTab === 'orders' && <OrderList orders={orders || []} user={currentUser} />}
        {activeTab === 'support' && (
          <Support messages={messages || []} user={currentUser} onSendMessage={handleSendMessage} />
        )}
        {activeTab === 'profile' && <Profile user={currentUser} onLogout={handleLogout} />}
        {activeTab === 'apps' && <Marketplaces />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t z-20">
        <div className="flex items-center justify-around px-6 py-3">
          <Button
            variant={activeTab === 'orders' ? 'default' : 'ghost'}
            className="flex-col h-auto py-2 gap-1"
            onClick={() => setActiveTab('orders')}
          >
            <Package size={24} weight={activeTab === 'orders' ? 'fill' : 'regular'} />
            <span className="text-xs">Orders</span>
          </Button>

          <Button
            variant={activeTab === 'support' ? 'default' : 'ghost'}
            className="flex-col h-auto py-2 gap-1"
            onClick={() => setActiveTab('support')}
          >
            <ChatCircle size={24} weight={activeTab === 'support' ? 'fill' : 'regular'} />
            <span className="text-xs">Support</span>
          </Button>

          <Button
            variant={activeTab === 'profile' ? 'default' : 'ghost'}
            className="flex-col h-auto py-2 gap-1"
            onClick={() => setActiveTab('profile')}
          >
            <UserIcon size={24} weight={activeTab === 'profile' ? 'fill' : 'regular'} />
            <span className="text-xs">Profile</span>
          </Button>

          <Button
            variant={activeTab === 'apps' ? 'default' : 'ghost'}
            className="flex-col h-auto py-2 gap-1"
            onClick={() => setActiveTab('apps')}
          >
            <AppWindow size={24} weight={activeTab === 'apps' ? 'fill' : 'regular'} />
            <span className="text-xs">Apps</span>
          </Button>
        </div>
      </nav>

      <Toaster />
    </div>
  )
}

export default App