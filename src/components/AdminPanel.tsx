import { useState } from 'react'
import { Order, User, SupportMessage, Notification, OrderStatus } from '@/lib/types'
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
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/constants'
import { MagnifyingGlass, Plus, PencilSimple, Trash, SignOut, ChatCircle, Package, PaperPlaneRight } from '@phosphor-icons/react'
import { toast } from 'sonner'

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
    const updatedOrder = { ...order, status: newStatus, updatedAt: Date.now() }
    onUpdateOrder(updatedOrder)

    const notification: Notification = {
      id: `notif_${Date.now()}`,
      userId: order.userId,
      message: `Your order ${order.trackingNumber} status changed to ${STATUS_LABELS[newStatus]}`,
      timestamp: Date.now(),
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

    const order: Order = {
      id: `order_${Date.now()}`,
      userId: newOrder.userId,
      trackingNumber: newOrder.trackingNumber,
      description: newOrder.description,
      status: newOrder.status,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      origin: newOrder.origin || undefined,
      destination: newOrder.destination || undefined,
      weight: newOrder.weight || undefined
    }

    onAddOrder(order)
    
    const notification: Notification = {
      id: `notif_${Date.now()}`,
      userId: newOrder.userId,
      message: `New order ${newOrder.trackingNumber} has been added to your account`,
      timestamp: Date.now(),
      read: false,
      orderId: order.id
    }
    onSendNotification(notification)

    toast.success('Order added and user notified')
    setIsAddingOrder(false)
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Package size={24} weight="bold" className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">Cargo Management System</p>
            </div>
          </div>
          <Button variant="destructive" onClick={onLogout}>
            <SignOut size={20} weight="bold" className="mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <Tabs defaultValue="orders">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="orders">Orders Management</TabsTrigger>
            <TabsTrigger value="support">Support Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Search & Filter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <Input
                      placeholder="Search by FIN code..."
                      value={searchFin}
                      onChange={(e) => setSearchFin(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button onClick={() => setIsAddingOrder(true)}>
                    <Plus size={20} weight="bold" className="mr-2" />
                    Add Order
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>All Orders ({sortedOrders.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tracking</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>FIN</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedOrders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground">
                            No orders found
                          </TableCell>
                        </TableRow>
                      ) : (
                        sortedOrders.map((order) => {
                          const user = users.find(u => u.id === order.userId)
                          return (
                            <TableRow key={order.id}>
                              <TableCell className="font-mono font-semibold">{order.trackingNumber}</TableCell>
                              <TableCell>{getUserName(order.userId)}</TableCell>
                              <TableCell className="font-mono">{user?.finCode}</TableCell>
                              <TableCell className="max-w-xs truncate">{order.description}</TableCell>
                              <TableCell>
                                <Badge className={STATUS_COLORS[order.status]}>
                                  {STATUS_LABELS[order.status]}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">{formatDate(order.createdAt)}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingOrder(order)}
                                  >
                                    <PencilSimple size={16} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDeleteOrder(order.id)}
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Conversations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px]">
                    {conversations.length === 0 ? (
                      <Alert>
                        <ChatCircle className="h-4 w-4" />
                        <AlertDescription>No support messages yet</AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-2">
                        {conversations.map((conv) => (
                          <Card
                            key={conv.conversationId}
                            className={`cursor-pointer transition-all ${
                              selectedConversation === conv.conversationId
                                ? 'border-primary shadow-md'
                                : 'hover:shadow-sm'
                            }`}
                            onClick={() => setSelectedConversation(conv.conversationId)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold truncate">
                                    {conv.user ? `${conv.user.firstName} ${conv.user.lastName}` : 'Unknown'}
                                  </p>
                                  <p className="text-xs text-muted-foreground font-mono">
                                    {conv.user?.finCode}
                                  </p>
                                  <p className="text-sm text-muted-foreground truncate mt-1">
                                    {conv.lastMessage?.message}
                                  </p>
                                </div>
                                {conv.unreadCount > 0 && (
                                  <Badge variant="destructive">{conv.unreadCount}</Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  {!selectedConversation ? (
                    <Alert>
                      <ChatCircle className="h-4 w-4" />
                      <AlertDescription>Select a conversation to view messages</AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-4">
                      <ScrollArea className="h-[480px]">
                        <div className="space-y-3">
                          {messages
                            .filter(m => m.conversationId === selectedConversation)
                            .sort((a, b) => a.timestamp - b.timestamp)
                            .map((msg) => (
                              <div
                                key={msg.id}
                                className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}
                              >
                                <Card className={`max-w-[80%] ${msg.isAdmin ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                                  <CardContent className="p-3 space-y-1">
                                    {!msg.isAdmin && (
                                      <p className="text-xs font-semibold">{msg.userName}</p>
                                    )}
                                    <p className="text-sm leading-relaxed">{msg.message}</p>
                                    <p className={`text-xs ${msg.isAdmin ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                      {formatDate(msg.timestamp)}
                                    </p>
                                  </CardContent>
                                </Card>
                              </div>
                            ))}
                        </div>
                      </ScrollArea>

                      <div className="flex gap-2 pt-4 border-t">
                        <Textarea
                          placeholder="Type your reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="flex-1 min-h-[60px]"
                        />
                        <Button onClick={handleSendReply} disabled={!replyText.trim()}>
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

      <Dialog open={isAddingOrder} onOpenChange={setIsAddingOrder}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Customer</Label>
              <Select value={newOrder.userId} onValueChange={(value) => setNewOrder({ ...newOrder, userId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {users.filter(u => !u.isAdmin).map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.finCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tracking Number</Label>
              <Input
                placeholder="e.g., PL123456789"
                value={newOrder.trackingNumber}
                onChange={(e) => setNewOrder({ ...newOrder, trackingNumber: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Order description"
                value={newOrder.description}
                onChange={(e) => setNewOrder({ ...newOrder, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={newOrder.status} onValueChange={(value: OrderStatus) => setNewOrder({ ...newOrder, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="at_warehouse">At Warehouse</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Origin</Label>
                <Input
                  placeholder="Poland"
                  value={newOrder.origin}
                  onChange={(e) => setNewOrder({ ...newOrder, origin: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Destination</Label>
                <Input
                  placeholder="Azerbaijan"
                  value={newOrder.destination}
                  onChange={(e) => setNewOrder({ ...newOrder, destination: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Weight</Label>
              <Input
                placeholder="e.g., 5.2 kg"
                value={newOrder.weight}
                onChange={(e) => setNewOrder({ ...newOrder, weight: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingOrder(false)}>Cancel</Button>
            <Button onClick={handleAddOrder}>Add Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingOrder} onOpenChange={() => setEditingOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>
          {editingOrder && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Tracking Number</p>
                <p className="font-mono font-semibold text-lg">{editingOrder.trackingNumber}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium">{getUserName(editingOrder.userId)}</p>
              </div>

              <div className="space-y-2">
                <Label>New Status</Label>
                <div className="flex gap-2">
                  <Button
                    variant={editingOrder.status === 'in_transit' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => handleUpdateStatus(editingOrder, 'in_transit')}
                  >
                    In Transit
                  </Button>
                  <Button
                    variant={editingOrder.status === 'at_warehouse' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => handleUpdateStatus(editingOrder, 'at_warehouse')}
                  >
                    At Warehouse
                  </Button>
                  <Button
                    variant={editingOrder.status === 'delivered' ? 'default' : 'outline'}
                    className="flex-1"
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
