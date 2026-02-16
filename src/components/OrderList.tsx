import { useState } from 'react'
import { Order, User } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Package, MapPin, Barcode, Calendar, ArrowsClockwise, ClockClockwise, Copy, CheckCircle, Warehouse } from '@phosphor-icons/react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { TrackingTimeline } from '@/components/TrackingTimeline'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { useTranslation, translations } from '@/lib/i18n'

const txt = translations.orders
const statusTxt = translations.statuses

// Status colors
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  processing: 'bg-blue-100 text-blue-800 border-blue-200',
  shipped: 'bg-purple-100 text-purple-800 border-purple-200',
  in_transit: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  in_warehouse: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  out_for_delivery: 'bg-orange-100 text-orange-800 border-orange-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200'
}

// Warehouse address constant
const WAREHOUSE_ADDRESS = {
  name: 'NextCargo Logistics',
  street: 'Wierchow 25',
  postalCode: '04-653',
  city: 'Warsaw',
  country: 'Poland',
  phone: '+48 576 925 110'
}

interface OrderListProps {
  orders: Order[]
  user: User
}

export function OrderList({ orders, user }: OrderListProps) {
  const { language } = useTranslation()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [copied, setCopied] = useState(false)

  // Get translated status label
  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, keyof typeof statusTxt> = {
      'pending': 'pending',
      'processing': 'processing',
      'shipped': 'shipped',
      'in_transit': 'inTransit',
      'in_warehouse': 'inWarehouse',
      'out_for_delivery': 'outForDelivery',
      'delivered': 'delivered',
      'cancelled': 'cancelled'
    }
    const key = statusMap[status]
    return key ? statusTxt[key][language] : status
  }

  const userOrders = orders
    .filter(order => order.userId === user.id)
    .sort((a, b) => b.createdAt - a.createdAt)

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const copyWarehouseAddress = () => {
    const addressText = `${WAREHOUSE_ADDRESS.name}
${user.firstName} ${user.lastName} - ${user.finCode}
${WAREHOUSE_ADDRESS.street}
${WAREHOUSE_ADDRESS.postalCode} ${WAREHOUSE_ADDRESS.city}
${WAREHOUSE_ADDRESS.country}
Tel: ${WAREHOUSE_ADDRESS.phone}`
    
    navigator.clipboard.writeText(addressText)
    setCopied(true)
    toast.success(txt.addressCopied[language])
    setTimeout(() => setCopied(false), 2000)
  }

  // Warehouse Address Card Component
  const WarehouseAddressCard = () => (
    <Card className="border shadow-sm">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Warehouse size={16} weight="bold" className="text-white" />
              </div>
              <div className="min-w-0">
                <span className="font-semibold text-sm">{txt.warehouseTitle[language]}</span>
                <p className="text-[10px] text-muted-foreground">{txt.warehouseHint[language]}</p>
              </div>
            </div>
            <div className="space-y-0.5 text-xs font-mono bg-gray-50 rounded-lg p-2.5 border border-gray-200">
              <p className="font-semibold text-gray-900">{WAREHOUSE_ADDRESS.name}</p>
              <p className="text-blue-600 font-semibold">{user.firstName} {user.lastName} - {user.finCode}</p>
              <p className="text-gray-600">{WAREHOUSE_ADDRESS.street}</p>
              <p className="text-gray-600">{WAREHOUSE_ADDRESS.postalCode} {WAREHOUSE_ADDRESS.city}</p>
              <p className="text-gray-600">{WAREHOUSE_ADDRESS.country}</p>
              <p className="text-gray-600 pt-0.5">Tel: {WAREHOUSE_ADDRESS.phone}</p>
            </div>
          </div>
          <Button 
            variant={copied ? "default" : "outline"}
            size="sm" 
            onClick={copyWarehouseAddress}
            className={`flex-shrink-0 gap-1 h-8 text-xs ${copied ? 'bg-green-500 hover:bg-green-600 text-white' : 'border-blue-600 text-blue-600 hover:bg-blue-50'}`}
          >
            {copied ? (
              <>
                <CheckCircle size={12} weight="bold" />
                {txt.copied[language]}
              </>
            ) : (
              <>
                <Copy size={12} />
                {txt.copy[language]}
              </>
            )}
          </Button>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-gray-600 bg-blue-50 border border-blue-100 p-2 rounded-lg">
          <span>💡</span>
          <span>{txt.finCodeHelp[language].replace('FIN', '')} <span className="font-medium text-blue-600">FIN ({user.finCode})</span></span>
        </div>
      </CardContent>
    </Card>
  )

  if (userOrders.length === 0) {
    return (
      <div className="p-3 space-y-3">
        <WarehouseAddressCard />
        <Alert className="text-sm">
          <Package className="h-4 w-4" />
          <AlertDescription className="text-sm leading-relaxed">
            {txt.noOrders[language]}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <>
      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="p-3 space-y-3">
          <WarehouseAddressCard />
          
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <h2 className="text-sm font-medium text-muted-foreground">{txt.myOrders[language]}</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          
          <div className="space-y-2">
            {userOrders.map((order) => (
              <Card
                key={order.id}
                className="cursor-pointer hover:bg-muted/30 border shadow-sm"
                onClick={() => setSelectedOrder(order)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Package size={14} className="text-muted-foreground flex-shrink-0" />
                        <span className="font-medium text-sm truncate">{order.trackingNumber}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {order.description}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <Badge className={`${STATUS_COLORS[order.status]} text-[10px] flex-shrink-0`}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ScrollArea>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Package size={18} className="text-primary" />
              {txt.orderDetails[language]}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <Tabs defaultValue="details" className="flex-1 flex flex-col min-h-0">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details" className="text-xs sm:text-sm">
                  {txt.details[language]}
                </TabsTrigger>
                <TabsTrigger value="tracking" className="text-xs sm:text-sm">
                  <ClockClockwise size={16} className="mr-1.5" />
                  {txt.trackingHistory[language]}
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1 mt-4">
                <TabsContent value="details" className="mt-0 space-y-5 pr-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base text-muted-foreground">{txt.status[language]}</span>
                    <Badge className={`${STATUS_COLORS[selectedOrder.status]} text-sm`}>
                      {getStatusLabel(selectedOrder.status)}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Barcode size={20} className="text-muted-foreground mt-1 flex-shrink-0 sm:w-[22px] sm:h-[22px]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1">{txt.trackingNumber[language]}</p>
                        <p className="font-semibold text-sm sm:text-base break-all">{selectedOrder.trackingNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Package size={20} className="text-muted-foreground mt-1 flex-shrink-0 sm:w-[22px] sm:h-[22px]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1">{txt.description[language]}</p>
                        <p className="font-medium text-sm sm:text-base">{selectedOrder.description}</p>
                      </div>
                    </div>

                    {selectedOrder.origin && (
                      <div className="flex items-start gap-3">
                        <MapPin size={20} className="text-muted-foreground mt-1 flex-shrink-0 sm:w-[22px] sm:h-[22px]" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-muted-foreground mb-1">{txt.origin[language]}</p>
                          <p className="font-medium text-sm sm:text-base">{selectedOrder.origin}</p>
                        </div>
                      </div>
                    )}

                    {selectedOrder.destination && (
                      <div className="flex items-start gap-3">
                        <MapPin size={20} weight="fill" className="text-muted-foreground mt-1 flex-shrink-0 sm:w-[22px] sm:h-[22px]" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-muted-foreground mb-1">{txt.destination[language]}</p>
                          <p className="font-medium text-sm sm:text-base">{selectedOrder.destination}</p>
                        </div>
                      </div>
                    )}

                    {selectedOrder.weight && (
                      <div className="flex items-start gap-3">
                        <ArrowsClockwise size={20} className="text-muted-foreground mt-1 flex-shrink-0 sm:w-[22px] sm:h-[22px]" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-muted-foreground mb-1">{txt.weight[language]}</p>
                          <p className="font-medium text-sm sm:text-base">{selectedOrder.weight}</p>
                        </div>
                      </div>
                    )}

                    <Separator />

                    <div className="flex items-start gap-3">
                      <Calendar size={20} className="text-muted-foreground mt-1 flex-shrink-0 sm:w-[22px] sm:h-[22px]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1">{txt.created[language]}</p>
                        <p className="font-medium text-sm sm:text-base">{formatDate(selectedOrder.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar size={20} weight="fill" className="text-muted-foreground mt-1 flex-shrink-0 sm:w-[22px] sm:h-[22px]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1">{txt.lastUpdated[language]}</p>
                        <p className="font-medium text-sm sm:text-base">{formatDate(selectedOrder.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="tracking" className="mt-0 pr-4">
                  <TrackingTimeline events={selectedOrder.trackingHistory || []} />
                </TabsContent>
              </ScrollArea>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
