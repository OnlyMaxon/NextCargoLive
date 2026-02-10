import { useState } from 'react'
import { Order, User, SupportMessage, Notification, OrderStatus, TrackingEvent } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/constants'
import { MagnifyingGlass, Plus, PencilSimple, Trash, SignOut, ChatCircle, Package, PaperPlaneRight, CaretUpDown, Check, Envelope, Copy } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface AdminPanelProps {
  orders: Order[]
  users: User[]
  messages: SupportMessage[]
  onUpdateOrder: (order: Order) => void
  onAddOrder: (order: Order) => void
  onDeleteOrder: (orderId: string) => void
  onSendNotification: (notification: Notification) => void
  onSendMessage: (message: SupportMessage) => void
  onLogout: () => void
}

export function AdminPanel({
  orders,
  users,
  messages,
  onUpdateOrder,
  onAddOrder,
  onDeleteOrder,
  onSendNotification,
  onSendMessage,
  onLogout
}: AdminPanelProps) {
  const [searchFin, setSearchFin] = useState('')
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [isAddingOrder, setIsAddingOrder] = useState(false)
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [customerSearchOpen, setCustomerSearchOpen] = useState(false)

  const [newOrder, setNewOrder] = useState({
    userId: '',
    trackingNumber: '',
    description: '',
    status: 'in_transit' as OrderStatus,
    origin: 'Poland',
    destination: 'Azerbaijan',
    weight: ''
  })

  const filteredOrders = searchFin
    ? orders.filter(order => {
        const user = users.find(u => u.id === order.userId)
        return user?.finCode.toLowerCase().includes(searchFin.toLowerCase())
      })
    : orders

  const sortedOrders = [...filteredOrders].sort((a, b) => b.createdAt - a.createdAt)

  const conversations = Array.from(new Set(messages.map(m => m.conversationId)))
    .map(convId => {
      const convMessages = messages.filter(m => m.conversationId === convId)
      const lastMessage = convMessages[convMessages.length - 1]
      const user = users.find(u => u.id === convId)
      return {
        conversationId: convId,
        user,
        lastMessage,
        unreadCount: convMessages.filter(m => !m.isAdmin).length
      }
    })
    .sort((a, b) => (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0))

  const handleUpdateStatus = (order: Order, newStatus: OrderStatus) => {
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

    const updatedOrder = { 
      ...order, 
      status: newStatus, 
      updatedAt: now,
      trackingHistory: [...(order.trackingHistory || []), newTrackingEvent]
    }
    
    onUpdateOrder(updatedOrder)

    const notification: Notification = {
      id: `notif_${now}`,
      userId: order.userId,
      message: `Your order ${order.trackingNumber} status changed to ${STATUS_LABELS[newStatus]}`,
      timestamp: now,
      read: false,
      orderId: order.id
    }
    onSendNotification(notification)

    toast.success('Order status updated and notification sent')
    setEditingOrder(null)
  }

  const handleAddOrder = () => {
    if (!newOrder.userId || !newOrder.trackingNumber || !newOrder.description) {
      toast.error('Please fill all required fields')
      return
    }

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

    const order: Order = {
      id: `order_${now}`,
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
    }

    onAddOrder(order)
    
    const notification: Notification = {
      id: `notif_${now}`,
      userId: newOrder.userId,
      message: `New order ${newOrder.trackingNumber} has been added to your account`,
      timestamp: now,
      read: false,
      orderId: order.id
    }
    onSendNotification(notification)

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
  }

  const handleDeleteOrder = (orderId: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      onDeleteOrder(orderId)
      toast.success('Order deleted')
    }
  }

  const handleCloseAddDialog = () => {
    setIsAddingOrder(false)
    setCustomerSearchOpen(false)
  }

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedConversation) return

    const user = users.find(u => u.id === selectedConversation)
    if (!user) return

    const message: SupportMessage = {
      id: `msg_${Date.now()}`,
      userId: selectedConversation,
      userName: 'Support Team',
      message: replyText.trim(),
      timestamp: Date.now(),
      isAdmin: true,
      conversationId: selectedConversation
    }

    onSendMessage(message)
    setReplyText('')
    toast.success('Reply sent')
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId)
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown'
  }

  const getSelectedCustomer = () => {
    return users.find(u => u.id === newOrder.userId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-violet-50 dark:from-slate-950 dark:via-purple-950/30 dark:to-violet-950">
      <header className="border-b border-white/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-10 shadow-lg shadow-purple-500/5">
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary via-purple-600 to-violet-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/30 ring-2 ring-white/30">
              <Package size={24} weight="bold" className="text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight truncate bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">Admin Panel</h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Cargo Management System</p>
            </div>
          </div>
          <Button variant="destructive" size="sm" onClick={onLogout} className="flex-shrink-0 shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all duration-300">
            <SignOut size={18} weight="bold" className="sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:container lg:mx-auto py-4 sm:py-6">
        <Tabs defaultValue="orders">
          <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6 h-11 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 shadow-lg">
            <TabsTrigger value="orders" className="text-sm sm:text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">Orders</TabsTrigger>
            <TabsTrigger value="support" className="text-sm sm:text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4 sm:space-y-6">
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-white/20 shadow-xl shadow-purple-500/5">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <MagnifyingGlass size={22} className="text-primary" />
                  Search & Filter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-1 relative group">
                    <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                    <Input
                      placeholder="Search by FIN code..."
                      value={searchFin}
                      onChange={(e) => setSearchFin(e.target.value)}
                      className="pl-10 h-11 bg-white/50 dark:bg-slate-800/50 border-white/30 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
                    />
                  </div>
                  <Button onClick={() => setIsAddingOrder(true)} className="h-11 w-full sm:w-auto bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300">
                    <Plus size={20} weight="bold" className="mr-2" />
                    Add Order
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-white/20 shadow-xl shadow-purple-500/5">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <Package size={22} className="text-primary" />
                  All Orders
                  <Badge variant="secondary" className="ml-auto bg-gradient-to-r from-primary/10 to-violet-500/10 text-primary border border-primary/20">
                    {sortedOrders.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="hidden lg:block">
                  <ScrollArea className="h-[600px]">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/10 hover:bg-transparent">
                          <TableHead className="text-primary font-semibold">Tracking</TableHead>
                          <TableHead className="text-primary font-semibold">Customer</TableHead>
                          <TableHead className="text-primary font-semibold">FIN</TableHead>
                          <TableHead className="text-primary font-semibold">Description</TableHead>
                          <TableHead className="text-primary font-semibold">Status</TableHead>
                          <TableHead className="text-primary font-semibold">Created</TableHead>
                          <TableHead className="text-primary font-semibold">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedOrders.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                              <div className="flex flex-col items-center gap-2">
                                <Package size={40} className="text-muted-foreground/50" />
                                <p>No orders found</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          sortedOrders.map((order) => {
                            const user = users.find(u => u.id === order.userId)
                            return (
                              <TableRow key={order.id} className="border-white/10 hover:bg-primary/5 transition-colors duration-200">
                                <TableCell className="font-mono font-semibold text-primary">{order.trackingNumber}</TableCell>
                                <TableCell>
                                  <div className="flex flex-col">
                                    <span className="font-medium">{getUserName(order.userId)}</span>
                                    <span className="text-xs text-primary/80 cursor-pointer hover:text-primary hover:underline transition-colors flex items-center gap-1" onClick={() => {
                                      navigator.clipboard.writeText(user?.email || '')
                                      toast.success('Email copied!')
                                    }}>
                                      <Envelope size={12} />
                                      {user?.email}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="font-mono text-muted-foreground">{user?.finCode}</TableCell>
                                <TableCell className="max-w-xs truncate">{order.description}</TableCell>
                                <TableCell>
                                  <Badge className={`${STATUS_COLORS[order.status]} shadow-sm`}>
                                    {STATUS_LABELS[order.status]}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setEditingOrder(order)}
                                      className="hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200"
                                    >
                                      <PencilSimple size={16} />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleDeleteOrder(order.id)}
                                      className="shadow-sm hover:shadow-red-500/20"
                                    >
                                      <Trash size={16} />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )
                          })
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>

                <ScrollArea className="h-[calc(100vh-320px)] lg:hidden">
                  {sortedOrders.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground">
                      <Package size={48} className="mx-auto mb-3 text-muted-foreground/50" />
                      <p>No orders found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sortedOrders.map((order) => {
                        const user = users.find(u => u.id === order.userId)
                        return (
                          <Card key={order.id} className="overflow-hidden bg-white/50 dark:bg-slate-800/50 border-white/20 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/20 transition-all duration-300">
                            <CardContent className="p-4 space-y-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <p className="font-mono font-bold text-base mb-1 break-all text-primary">{order.trackingNumber}</p>
                                  <p className="font-medium text-sm mb-1">{getUserName(order.userId)}</p>
                                  <p className="text-xs text-muted-foreground font-mono">FIN: {user?.finCode}</p>
                                  <p 
                                    className="text-xs text-primary/80 cursor-pointer hover:text-primary hover:underline mt-1 flex items-center gap-1"
                                    onClick={() => {
                                      navigator.clipboard.writeText(user?.email || '')
                                      toast.success('Email copied!')
                                    }}
                                  >
                                    <Envelope size={12} />
                                    {user?.email}
                                  </p>
                                </div>
                                <Badge className={`${STATUS_COLORS[order.status]} flex-shrink-0 shadow-sm`}>
                                  {STATUS_LABELS[order.status]}
                                </Badge>
                              </div>

                              <div className="space-y-2">
                                <p className="text-sm line-clamp-2">{order.description}</p>
                                <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                              </div>

                              <div className="flex gap-2 pt-2 border-t border-white/10">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingOrder(order)}
                                  className="flex-1 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200"
                                >
                                  <PencilSimple size={18} className="mr-2" />
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteOrder(order.id)}
                                  className="flex-1 shadow-sm hover:shadow-red-500/20"
                                >
                                  <Trash size={18} className="mr-2" />
                                  Delete
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="lg:col-span-1 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-white/20 shadow-xl shadow-purple-500/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <ChatCircle size={20} className="text-primary" />
                    Conversations
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {conversations.length} {conversations.length === 1 ? 'conversation' : 'conversations'}
                  </p>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[300px] sm:h-[400px] lg:h-[600px]">
                    {conversations.length === 0 ? (
                      <div className="p-4">
                        <Alert className="bg-primary/5 border-primary/20">
                          <ChatCircle className="h-4 w-4 text-primary" />
                          <AlertDescription>No support messages yet</AlertDescription>
                        </Alert>
                      </div>
                    ) : (
                      <div className="divide-y divide-white/10">
                        {conversations.map((conv) => {
                          const isSelected = selectedConversation === conv.conversationId
                          const lastMessageTime = conv.lastMessage?.timestamp 
                            ? new Date(conv.lastMessage.timestamp).toLocaleTimeString('en-GB', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : ''
                          
                          return (
                            <button
                              key={conv.conversationId}
                              className={cn(
                                "w-full text-left p-3 sm:p-4 transition-all duration-200 hover:bg-primary/5 active:bg-primary/10",
                                isSelected && "bg-gradient-to-r from-primary/10 to-violet-500/5 border-l-4 border-l-primary"
                              )}
                              onClick={() => setSelectedConversation(conv.conversationId)}
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-primary/30 to-violet-500/20 flex items-center justify-center flex-shrink-0 border-2 border-primary/30 shadow-md shadow-primary/10">
                                  <span className="text-sm sm:text-base font-bold text-primary">
                                    {conv.user?.firstName?.[0]}{conv.user?.lastName?.[0]}
                                  </span>
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2 mb-1">
                                    <div className="min-w-0 flex-1">
                                      <p className="font-semibold text-sm sm:text-[15px] truncate">
                                        {conv.user ? `${conv.user.firstName} ${conv.user.lastName}` : 'Unknown'}
                                      </p>
                                      <p className="text-[10px] sm:text-[11px] text-muted-foreground font-mono">
                                        FIN: {conv.user?.finCode || 'N/A'}
                                      </p>
                                    </div>
                                    {conv.lastMessage && (
                                      <span className="text-[10px] sm:text-[11px] text-muted-foreground flex-shrink-0 mt-0.5">
                                        {lastMessageTime}
                                      </span>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center gap-2 mt-2">
                                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 flex-1 min-w-0">
                                      {conv.lastMessage?.isAdmin && (
                                        <span className="text-primary font-medium">You: </span>
                                      )}
                                      {conv.lastMessage?.message || 'No messages'}
                                    </p>
                                    {conv.unreadCount > 0 && (
                                      <Badge variant="destructive" className="flex-shrink-0 h-5 min-w-[20px] px-1.5 text-xs">
                                        {conv.unreadCount}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-white/20 shadow-xl shadow-purple-500/5">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <PaperPlaneRight size={20} className="text-primary" />
                    Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!selectedConversation ? (
                    <Alert className="bg-primary/5 border-primary/20">
                      <ChatCircle className="h-4 w-4 text-primary" />
                      <AlertDescription>Select a conversation to view messages</AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-4">
                      <ScrollArea className="h-[300px] sm:h-[380px] lg:h-[480px]">
                        <div className="space-y-3 pr-4">
                          {messages
                            .filter(m => m.conversationId === selectedConversation)
                            .sort((a, b) => a.timestamp - b.timestamp)
                            .map((msg) => (
                              <div
                                key={msg.id}
                                className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}
                              >
                                <Card className={`max-w-[90%] sm:max-w-[85%] lg:max-w-[80%] shadow-lg ${msg.isAdmin ? 'bg-gradient-to-br from-primary to-violet-600 text-white' : 'bg-white/80 dark:bg-slate-800/80 border-white/20'}`}>
                                  <CardContent className="p-3 space-y-1">
                                    {!msg.isAdmin && (
                                      <p className="text-xs font-semibold text-primary">{msg.userName}</p>
                                    )}
                                    <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">{msg.message}</p>
                                    <p className={`text-xs ${msg.isAdmin ? 'text-white/70' : 'text-muted-foreground'}`}>
                                      {formatDate(msg.timestamp)}
                                    </p>
                                  </CardContent>
                                </Card>
                              </div>
                            ))}
                        </div>
                      </ScrollArea>

                      <div className="flex gap-2 pt-4 border-t border-white/10">
                        <Textarea
                          placeholder="Type your reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="flex-1 min-h-[60px] max-h-[120px] resize-none bg-white/50 dark:bg-slate-800/50 border-white/30 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
                        />
                        <Button onClick={handleSendReply} disabled={!replyText.trim()} className="self-end h-11 w-11 sm:h-auto sm:w-auto sm:px-4 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 shadow-lg shadow-primary/20 hover:shadow-primary/30 disabled:opacity-50 disabled:shadow-none transition-all duration-300">
                          <PaperPlaneRight size={20} weight="bold" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isAddingOrder} onOpenChange={handleCloseAddDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center">
                <Plus size={18} weight="bold" className="text-white" />
              </div>
              Add New Order
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm sm:text-base font-medium">Customer</Label>
              <Popover open={customerSearchOpen} onOpenChange={setCustomerSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={customerSearchOpen}
                    className="w-full justify-between h-11 bg-white/50 dark:bg-slate-800/50 border-white/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                  >
                    {newOrder.userId ? (
                      <span className="truncate">
                        {getSelectedCustomer()?.firstName} {getSelectedCustomer()?.lastName} ({getSelectedCustomer()?.finCode})
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Search customer...</span>
                    )}
                    <CaretUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[calc(95vw-2rem)] sm:w-full p-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20" align="start">
                  <Command>
                    <CommandInput placeholder="Search by name or FIN..." className="border-white/20" />
                    <CommandList>
                      <CommandEmpty>No customer found.</CommandEmpty>
                      <CommandGroup>
                        {users.filter(u => !u.isAdmin).map((user) => (
                          <CommandItem
                            key={user.id}
                            value={`${user.firstName} ${user.lastName} ${user.finCode} ${user.email}`}
                            onSelect={() => {
                              setNewOrder({ ...newOrder, userId: user.id })
                              setCustomerSearchOpen(false)
                            }}
                            className="hover:bg-primary/10 transition-colors"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4 text-primary",
                                newOrder.userId === user.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">{user.firstName} {user.lastName}</span>
                              <span className="text-xs text-muted-foreground font-mono">{user.finCode}</span>
                              <span className="text-xs text-primary/80">{user.email}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              
              {/* Show selected customer email */}
              {newOrder.userId && getSelectedCustomer() && (
                <div className="mt-2 p-3 bg-gradient-to-r from-primary/10 to-violet-500/5 border border-primary/20 rounded-lg">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-violet-500/10 flex items-center justify-center">
                        <Envelope size={16} className="text-primary" />
                      </div>
                      <span className="text-sm text-primary font-medium truncate">
                        {getSelectedCustomer()?.email}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-primary hover:text-primary/80 hover:bg-primary/10"
                      onClick={() => {
                        navigator.clipboard.writeText(getSelectedCustomer()?.email || '')
                        toast.success('Email copied!')
                      }}
                    >
                      <Copy size={16} />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <span className="text-primary">💡</span> Copy email to notify customer via Outlook
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm sm:text-base font-medium">Tracking Number</Label>
              <Input
                placeholder="e.g., PL123456789"
                value={newOrder.trackingNumber}
                onChange={(e) => setNewOrder({ ...newOrder, trackingNumber: e.target.value })}
                className="h-11 bg-white/50 dark:bg-slate-800/50 border-white/30 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm sm:text-base font-medium">Description</Label>
              <Textarea
                placeholder="Order description"
                value={newOrder.description}
                onChange={(e) => setNewOrder({ ...newOrder, description: e.target.value })}
                className="min-h-[80px] bg-white/50 dark:bg-slate-800/50 border-white/30 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm sm:text-base font-medium">Status</Label>
              <Select value={newOrder.status} onValueChange={(value: OrderStatus) => setNewOrder({ ...newOrder, status: value })}>
                <SelectTrigger className="h-11 bg-white/50 dark:bg-slate-800/50 border-white/30 focus:border-primary/50 focus:ring-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20">
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="at_warehouse">At Warehouse</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm sm:text-base font-medium">Origin</Label>
                <Input
                  placeholder="Poland"
                  value={newOrder.origin}
                  onChange={(e) => setNewOrder({ ...newOrder, origin: e.target.value })}
                  className="h-11 bg-white/50 dark:bg-slate-800/50 border-white/30 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm sm:text-base font-medium">Destination</Label>
                <Input
                  placeholder="Azerbaijan"
                  value={newOrder.destination}
                  onChange={(e) => setNewOrder({ ...newOrder, destination: e.target.value })}
                  className="h-11 bg-white/50 dark:bg-slate-800/50 border-white/30 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm sm:text-base font-medium">Weight</Label>
              <Input
                placeholder="e.g., 5.2 kg"
                value={newOrder.weight}
                onChange={(e) => setNewOrder({ ...newOrder, weight: e.target.value })}
                className="h-11 bg-white/50 dark:bg-slate-800/50 border-white/30 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleCloseAddDialog} className="w-full sm:w-auto h-11 border-white/30 hover:bg-white/50 hover:border-primary/30 transition-all duration-200">Cancel</Button>
            <Button onClick={handleAddOrder} className="w-full sm:w-auto h-11 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300">Add Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingOrder} onOpenChange={() => setEditingOrder(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center">
                <PencilSimple size={18} weight="bold" className="text-white" />
              </div>
              Update Order Status
            </DialogTitle>
          </DialogHeader>
          {editingOrder && (
            <div className="space-y-4 py-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-violet-500/5 border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">Tracking Number</p>
                <p className="font-mono font-semibold text-base sm:text-lg break-all text-primary">{editingOrder.trackingNumber}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium">{getUserName(editingOrder.userId)}</p>
              </div>

              <div className="space-y-3">
                <Label className="text-sm sm:text-base font-medium">New Status</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant={editingOrder.status === 'in_transit' ? 'default' : 'outline'}
                    className={cn(
                      "flex-1 h-11 transition-all duration-300",
                      editingOrder.status === 'in_transit' 
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20" 
                        : "border-white/30 hover:bg-blue-500/10 hover:text-blue-600 hover:border-blue-500/30"
                    )}
                    onClick={() => handleUpdateStatus(editingOrder, 'in_transit')}
                  >
                    In Transit
                  </Button>
                  <Button
                    variant={editingOrder.status === 'at_warehouse' ? 'default' : 'outline'}
                    className={cn(
                      "flex-1 h-11 transition-all duration-300",
                      editingOrder.status === 'at_warehouse' 
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20" 
                        : "border-white/30 hover:bg-amber-500/10 hover:text-amber-600 hover:border-amber-500/30"
                    )}
                    onClick={() => handleUpdateStatus(editingOrder, 'at_warehouse')}
                  >
                    At Warehouse
                  </Button>
                  <Button
                    variant={editingOrder.status === 'delivered' ? 'default' : 'outline'}
                    className={cn(
                      "flex-1 h-11 transition-all duration-300",
                      editingOrder.status === 'delivered' 
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/20" 
                        : "border-white/30 hover:bg-green-500/10 hover:text-green-600 hover:border-green-500/30"
                    )}
                    onClick={() => handleUpdateStatus(editingOrder, 'delivered')}
                  >
                    Delivered
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
