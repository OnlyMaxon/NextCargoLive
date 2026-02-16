import { useState } from 'react'
import { Order, User, Notification, OrderStatus, TrackingEvent } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/constants'
import { MagnifyingGlass, Plus, PencilSimple, Trash, SignOut, Package, CaretUpDown, Check, Envelope, Copy } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useTranslation, LanguageSelector, Language } from '@/lib/i18n'

// Admin translations
const adminTxt = {
  adminPanel: { ru: 'Панель администратора', en: 'Admin Panel', az: 'Admin paneli' },
  cargoManagement: { ru: 'Управление грузами', en: 'Cargo Management', az: 'Yük idarəetməsi' },
  logout: { ru: 'Выйти', en: 'Logout', az: 'Çıxış' },
  orders: { ru: 'Заказы', en: 'Orders', az: 'Sifarişlər' },
  searchFilter: { ru: 'Поиск и фильтр', en: 'Search & Filter', az: 'Axtar və filtrələ' },
  searchByFin: { ru: 'Поиск по FIN коду...', en: 'Search by FIN code...', az: 'FIN kodu ilə axtarış...' },
  addOrder: { ru: 'Добавить заказ', en: 'Add Order', az: 'Sifariş əlavə et' },
  allOrders: { ru: 'Все заказы', en: 'All Orders', az: 'Bütün sifarişlər' },
  noOrdersFound: { ru: 'Заказы не найдены', en: 'No orders found', az: 'Sifariş tapılmadı' },
  trackingNumber: { ru: 'Номер отслеживания', en: 'Tracking Number', az: 'İzləmə nömrəsi' },
  customer: { ru: 'Клиент', en: 'Customer', az: 'Müştəri' },
  status: { ru: 'Статус', en: 'Status', az: 'Status' },
  description: { ru: 'Описание', en: 'Description', az: 'Təsvir' },
  origin: { ru: 'Откуда', en: 'Origin', az: 'Haradan' },
  destination: { ru: 'Куда', en: 'Destination', az: 'Haraya' },
  weight: { ru: 'Вес', en: 'Weight', az: 'Çəki' },
  edit: { ru: 'Редактировать', en: 'Edit', az: 'Redaktə et' },
  delete: { ru: 'Удалить', en: 'Delete', az: 'Sil' },
  save: { ru: 'Сохранить', en: 'Save', az: 'Yadda saxla' },
  cancel: { ru: 'Отмена', en: 'Cancel', az: 'Ləğv et' },
  selectCustomer: { ru: 'Выберите клиента...', en: 'Select customer...', az: 'Müştəri seçin...' },
  searchCustomer: { ru: 'Поиск по имени или FIN...', en: 'Search by name or FIN...', az: 'Ad və ya FIN ilə axtarış...' },
  noCustomerFound: { ru: 'Клиент не найден.', en: 'No customer found.', az: 'Müştəri tapılmadı.' },
  editOrder: { ru: 'Редактировать заказ', en: 'Edit Order', az: 'Sifarişi redaktə et' },
  addNewOrder: { ru: 'Добавить новый заказ', en: 'Add New Order', az: 'Yeni sifariş əlavə et' },
  orderAdded: { ru: 'Заказ добавлен', en: 'Order added', az: 'Sifariş əlavə edildi' },
  orderUpdated: { ru: 'Заказ обновлен', en: 'Order updated', az: 'Sifariş yeniləndi' },
  orderDeleted: { ru: 'Заказ удален', en: 'Order deleted', az: 'Sifariş silindi' },
  inTransit: { ru: 'В пути', en: 'In Transit', az: 'Yolda' },
  atWarehouse: { ru: 'На складе', en: 'At Warehouse', az: 'Anbarda' },
  delivered: { ru: 'Доставлен', en: 'Delivered', az: 'Çatdırılıb' },
  finCopied: { ru: 'FIN скопирован', en: 'FIN copied', az: 'FIN kopyalandı' },
  copyFin: { ru: 'Копировать FIN', en: 'Copy FIN', az: 'FIN kopyala' }
}

// Status labels by language
const getStatusLabel = (status: OrderStatus, lang: Language): string => {
  const labels: Record<OrderStatus, Record<Language, string>> = {
    'in_transit': { ru: 'В пути', en: 'In Transit', az: 'Yolda' },
    'at_warehouse': { ru: 'На складе', en: 'At Warehouse', az: 'Anbarda' },
    'delivered': { ru: 'Доставлен', en: 'Delivered', az: 'Çatdırılıb' }
  }
  return labels[status][lang]
}

interface AdminPanelProps {
  orders: Order[]
  users: User[]
  onUpdateOrder: (order: Order) => void
  onAddOrder: (order: Order) => void
  onDeleteOrder: (orderId: string) => void
  onSendNotification: (notification: Notification) => void
  onLogout: () => void
}

export function AdminPanel({
  orders,
  users,
  onUpdateOrder,
  onAddOrder,
  onDeleteOrder,
  onSendNotification,
  onLogout
}: AdminPanelProps) {
  const [searchFin, setSearchFin] = useState('')
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [isAddingOrder, setIsAddingOrder] = useState(false)
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

  const { language } = useTranslation()
  const txt = adminTxt

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
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Package size={22} weight="bold" className="text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-semibold tracking-tight truncate">{txt.adminPanel[language]}</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">{txt.cargoManagement[language]}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector className="hidden sm:flex" />
            <Button variant="destructive" size="sm" onClick={onLogout} className="flex-shrink-0">
              <SignOut size={16} className="sm:mr-2" />
              <span className="hidden sm:inline">{txt.logout[language]}</span>
            </Button>
          </div>
        </div>
        {/* Mobile Language Selector */}
        <div className="sm:hidden flex justify-center py-2 border-t bg-gray-50">
          <LanguageSelector />
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:container lg:mx-auto py-4">
        <Tabs defaultValue="orders">
          <TabsList className="mb-4 h-10">
            <TabsTrigger value="orders" className="text-sm">{txt.orders[language]}</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MagnifyingGlass size={18} className="text-muted-foreground" />
                  {txt.searchFilter[language]}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      placeholder={txt.searchByFin[language]}
                      value={searchFin}
                      onChange={(e) => setSearchFin(e.target.value)}
                      className="pl-9 h-10"
                    />
                  </div>
                  <Button onClick={() => setIsAddingOrder(true)} className="h-10 w-full sm:w-auto">
                    <Plus size={18} className="mr-2" />
                    {txt.addOrder[language]}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Package size={18} className="text-muted-foreground" />
                  {txt.allOrders[language]}
                  <Badge variant="secondary" className="ml-auto">
                    {sortedOrders.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="hidden lg:block">
                  <ScrollArea className="h-[500px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-medium">{txt.trackingNumber[language]}</TableHead>
                          <TableHead className="font-medium">{txt.customer[language]}</TableHead>
                          <TableHead className="font-medium">FIN</TableHead>
                          <TableHead className="font-medium">{txt.description[language]}</TableHead>
                          <TableHead className="font-medium">{txt.status[language]}</TableHead>
                          <TableHead className="font-medium">{language === 'ru' ? 'Создан' : language === 'az' ? 'Yaradılıb' : 'Created'}</TableHead>
                          <TableHead className="font-medium">{language === 'ru' ? 'Действия' : language === 'az' ? 'Hərəkətlər' : 'Actions'}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedOrders.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                              {txt.noOrdersFound[language]}
                            </TableCell>
                          </TableRow>
                        ) : (
                          sortedOrders.map((order) => {
                            const user = users.find(u => u.id === order.userId)
                            return (
                              <TableRow key={order.id}>
                                <TableCell className="font-mono text-sm">{order.trackingNumber}</TableCell>
                                <TableCell>
                                  <div className="flex flex-col">
                                    <span className="text-sm">{getUserName(order.userId)}</span>
                                    <span className="text-xs text-muted-foreground cursor-pointer hover:text-primary" onClick={() => {
                                      navigator.clipboard.writeText(user?.email || '')
                                      toast.success('Email copied!')
                                    }}>
                                      {user?.email}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="font-mono text-sm text-muted-foreground">{user?.finCode}</TableCell>
                                <TableCell className="max-w-xs truncate">{order.description}</TableCell>
                                <TableCell>
                                  <Badge className={`${STATUS_COLORS[order.status]} shadow-sm`}>
                                    {getStatusLabel(order.status, language)}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</TableCell>
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
                </div>

                <ScrollArea className="h-[calc(100vh-320px)] lg:hidden">
                  {sortedOrders.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground">
                      <Package size={48} className="mx-auto mb-3 text-muted-foreground/50" />
                      <p>{txt.noOrdersFound[language]}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sortedOrders.map((order) => {
                        const user = users.find(u => u.id === order.userId)
                        return (
                          <Card key={order.id} className="border shadow-sm">
                            <CardContent className="p-4 space-y-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <p className="font-mono font-medium text-base mb-1 break-all">{order.trackingNumber}</p>
                                  <p className="font-medium text-sm mb-1">{getUserName(order.userId)}</p>
                                  <p className="text-xs text-muted-foreground font-mono">FIN: {user?.finCode}</p>
                                  <p 
                                    className="text-xs text-muted-foreground cursor-pointer hover:underline mt-1 flex items-center gap-1"
                                    onClick={() => {
                                      navigator.clipboard.writeText(user?.email || '')
                                      toast.success('Email copied!')
                                    }}
                                  >
                                    <Envelope size={12} />
                                    {user?.email}
                                  </p>
                                </div>
                                <Badge className={`${STATUS_COLORS[order.status]} flex-shrink-0`}>
                                  {getStatusLabel(order.status, language)}
                                </Badge>
                              </div>

                              <div className="space-y-2">
                                <p className="text-sm line-clamp-2">{order.description}</p>
                                <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                              </div>

                              <div className="flex gap-2 pt-2 border-t">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingOrder(order)}
                                  className="flex-1"
                                >
                                  <PencilSimple size={18} className="mr-2" />
                                  {txt.edit[language]}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteOrder(order.id)}
                                  className="flex-1"
                                >
                                  <Trash size={18} className="mr-2" />
                                  {txt.delete[language]}
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
        </Tabs>
      </div>

      <Dialog open={isAddingOrder} onOpenChange={handleCloseAddDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Plus size={18} weight="bold" className="text-primary-foreground" />
              </div>
              {txt.addNewOrder[language]}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm sm:text-base font-medium">{txt.customer[language]}</Label>
              <Popover open={customerSearchOpen} onOpenChange={setCustomerSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={customerSearchOpen}
                    className="w-full justify-between h-10"
                  >
                    {newOrder.userId ? (
                      <span className="truncate">
                        {getSelectedCustomer()?.firstName} {getSelectedCustomer()?.lastName} ({getSelectedCustomer()?.finCode})
                      </span>
                    ) : (
                      <span className="text-muted-foreground">{txt.selectCustomer[language]}</span>
                    )}
                    <CaretUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[calc(95vw-2rem)] sm:w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder={txt.searchCustomer[language]} />
                    <CommandList>
                      <CommandEmpty>{txt.noCustomerFound[language]}</CommandEmpty>
                      <CommandGroup>
                        {users.filter(u => !u.isAdmin).map((user) => (
                          <CommandItem
                            key={user.id}
                            value={`${user.firstName} ${user.lastName} ${user.finCode} ${user.email}`}
                            onSelect={() => {
                              setNewOrder({ ...newOrder, userId: user.id })
                              setCustomerSearchOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                newOrder.userId === user.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">{user.firstName} {user.lastName}</span>
                              <span className="text-xs text-muted-foreground font-mono">{user.finCode}</span>
                              <span className="text-xs text-muted-foreground">{user.email}</span>
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
                <div className="mt-2 p-3 bg-muted/50 border rounded-lg">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Envelope size={16} className="text-muted-foreground" />
                      </div>
                      <span className="text-sm font-medium truncate">
                        {getSelectedCustomer()?.email}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                      onClick={() => {
                        navigator.clipboard.writeText(getSelectedCustomer()?.email || '')
                        toast.success('Email copied!')
                      }}
                    >
                      <Copy size={16} />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {language === 'ru' ? 'Скопируйте email для уведомления клиента' : 
                     language === 'az' ? 'Müştəriyə bildiriş göndərmək üçün emaili kopyalayın' : 
                     'Copy email to notify customer via Outlook'}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm sm:text-base font-medium">{txt.trackingNumber[language]}</Label>
              <Input
                placeholder="e.g., PL123456789"
                value={newOrder.trackingNumber}
                onChange={(e) => setNewOrder({ ...newOrder, trackingNumber: e.target.value })}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm sm:text-base font-medium">{txt.description[language]}</Label>
              <Textarea
                placeholder={language === 'ru' ? 'Описание заказа' : language === 'az' ? 'Sifariş təsviri' : 'Order description'}
                value={newOrder.description}
                onChange={(e) => setNewOrder({ ...newOrder, description: e.target.value })}
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm sm:text-base font-medium">{txt.status[language]}</Label>
              <Select value={newOrder.status} onValueChange={(value: OrderStatus) => setNewOrder({ ...newOrder, status: value })}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_transit">{txt.inTransit[language]}</SelectItem>
                  <SelectItem value="at_warehouse">{txt.atWarehouse[language]}</SelectItem>
                  <SelectItem value="delivered">{txt.delivered[language]}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm sm:text-base font-medium">{txt.origin[language]}</Label>
                <Input
                  placeholder="Poland"
                  value={newOrder.origin}
                  onChange={(e) => setNewOrder({ ...newOrder, origin: e.target.value })}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm sm:text-base font-medium">{txt.destination[language]}</Label>
                <Input
                  placeholder="Azerbaijan"
                  value={newOrder.destination}
                  onChange={(e) => setNewOrder({ ...newOrder, destination: e.target.value })}
                  className="h-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm sm:text-base font-medium">{txt.weight[language]}</Label>
              <Input
                placeholder="e.g., 5.2 kg"
                value={newOrder.weight}
                onChange={(e) => setNewOrder({ ...newOrder, weight: e.target.value })}
                className="h-10"
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleCloseAddDialog} className="w-full sm:w-auto h-10">{txt.cancel[language]}</Button>
            <Button onClick={handleAddOrder} className="w-full sm:w-auto h-10">{txt.addOrder[language]}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingOrder} onOpenChange={() => setEditingOrder(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <PencilSimple size={18} weight="bold" className="text-primary-foreground" />
              </div>
              {txt.editOrder[language]}
            </DialogTitle>
          </DialogHeader>
          {editingOrder && (
            <div className="space-y-4 py-4">
              <div className="p-4 rounded-lg bg-muted/50 border">
                <p className="text-xs text-muted-foreground mb-1">{txt.trackingNumber[language]}</p>
                <p className="font-mono font-semibold text-base sm:text-lg break-all">{editingOrder.trackingNumber}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{txt.customer[language]}</p>
                <p className="font-medium">{getUserName(editingOrder.userId)}</p>
              </div>

              <div className="space-y-3">
                <Label className="text-sm sm:text-base font-medium">{language === 'ru' ? 'Новый статус' : language === 'az' ? 'Yeni status' : 'New Status'}</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant={editingOrder.status === 'in_transit' ? 'default' : 'outline'}
                    className={cn(
                      "flex-1 h-10",
                      editingOrder.status === 'in_transit' && "bg-blue-600 hover:bg-blue-700"
                    )}
                    onClick={() => handleUpdateStatus(editingOrder, 'in_transit')}
                  >
                    {txt.inTransit[language]}
                  </Button>
                  <Button
                    variant={editingOrder.status === 'at_warehouse' ? 'default' : 'outline'}
                    className={cn(
                      "flex-1 h-10",
                      editingOrder.status === 'at_warehouse' && "bg-amber-600 hover:bg-amber-700"
                    )}
                    onClick={() => handleUpdateStatus(editingOrder, 'at_warehouse')}
                  >
                    {txt.atWarehouse[language]}
                  </Button>
                  <Button
                    variant={editingOrder.status === 'delivered' ? 'default' : 'outline'}
                    className={cn(
                      "flex-1 h-10",
                      editingOrder.status === 'delivered' && "bg-green-600 hover:bg-green-700"
                    )}
                    onClick={() => handleUpdateStatus(editingOrder, 'delivered')}
                  >
                    {txt.delivered[language]}
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
