import { useState } from 'react'
import { Order, User } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/constants'
import { Package, MapPin, Barcode, Calendar, ArrowsClockwise, ClockClockwise, Copy, CheckCircle, Warehouse } from '@phosphor-icons/react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { TrackingTimeline } from '@/components/TrackingTimeline'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [copied, setCopied] = useState(false)

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
    toast.success('Address copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  // Warehouse Address Card Component
  const WarehouseAddressCard = () => (
    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 shadow-lg shadow-primary/10 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
      <CardContent className="relative p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
                <Warehouse size={20} weight="bold" className="text-white" />
              </div>
              <div>
                <span className="font-bold text-base sm:text-lg">Your Warehouse Address</span>
                <p className="text-xs text-muted-foreground">Use this for Polish online stores</p>
              </div>
            </div>
            <div className="space-y-1.5 text-sm font-mono bg-white/50 rounded-xl p-4 border border-white/50">
              <p className="font-bold text-foreground">{WAREHOUSE_ADDRESS.name}</p>
              <p className="text-primary font-bold text-base">{user.firstName} {user.lastName} - {user.finCode}</p>
              <p className="text-muted-foreground">{WAREHOUSE_ADDRESS.street}</p>
              <p className="text-muted-foreground">{WAREHOUSE_ADDRESS.postalCode} {WAREHOUSE_ADDRESS.city}</p>
              <p className="text-muted-foreground">{WAREHOUSE_ADDRESS.country}</p>
              <p className="text-muted-foreground pt-1">Tel: {WAREHOUSE_ADDRESS.phone}</p>
            </div>
          </div>
          <Button 
            variant="default"
            size="sm" 
            onClick={copyWarehouseAddress}
            className={`flex-shrink-0 gap-2 shadow-lg transition-all duration-300 ${
              copied 
                ? 'bg-green-500 hover:bg-green-600 shadow-green-500/25' 
                : 'gradient-bg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5'
            }`}
          >
            {copied ? (
              <>
                <CheckCircle size={16} weight="bold" />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy
              </>
            )}
          </Button>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground bg-amber-50 border border-amber-200 p-3 rounded-lg">
          <span className="text-lg">💡</span>
          <span>Your <span className="font-semibold text-amber-700">FIN code ({user.finCode})</span> helps us identify your packages</span>
        </div>
      </CardContent>
    </Card>
  )

  if (userOrders.length === 0) {
    return (
      <div className="p-4 space-y-4">
        <WarehouseAddressCard />
        <Alert className="text-base">
          <Package className="h-5 w-5" />
          <AlertDescription className="text-base leading-relaxed">
            You don't have any orders yet. Visit the Apps tab to shop from Polish marketplaces and ship to our warehouse!
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <>
      <ScrollArea className="h-[calc(100vh-180px)] sm:h-[calc(100vh-160px)]">
        <div className="p-4 space-y-5">
          <WarehouseAddressCard />
          
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-muted-foreground">My Orders</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-border via-transparent to-transparent" />
          </div>
          
          <div className="space-y-4">
            {userOrders.map((order) => (
              <Card
                key={order.id}
                className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 active:scale-[0.98] bg-white/80 backdrop-blur border-white/50 overflow-hidden group"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardContent className="relative p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Package size={18} weight="bold" className="text-primary" />
                        </div>
                        <span className="font-bold text-sm sm:text-base truncate">{order.trackingNumber}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {order.description}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        📅 {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <Badge className={`${STATUS_COLORS[order.status]} text-xs whitespace-nowrap flex-shrink-0 shadow-sm`}>
                      {STATUS_LABELS[order.status]}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ScrollArea>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col bg-white/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-lg sm:text-xl">
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
                <Package size={20} weight="bold" className="text-white" />
              </div>
              Order Details
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <Tabs defaultValue="details" className="flex-1 flex flex-col min-h-0">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details" className="text-xs sm:text-sm">
                  Details
                </TabsTrigger>
                <TabsTrigger value="tracking" className="text-xs sm:text-sm">
                  <ClockClockwise size={16} className="mr-1.5" />
                  Tracking History
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1 mt-4">
                <TabsContent value="details" className="mt-0 space-y-5 pr-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base text-muted-foreground">Status</span>
                    <Badge className={`${STATUS_COLORS[selectedOrder.status]} text-sm`}>
                      {STATUS_LABELS[selectedOrder.status]}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Barcode size={20} className="text-muted-foreground mt-1 flex-shrink-0 sm:w-[22px] sm:h-[22px]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1">Tracking Number</p>
                        <p className="font-semibold text-sm sm:text-base break-all">{selectedOrder.trackingNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Package size={20} className="text-muted-foreground mt-1 flex-shrink-0 sm:w-[22px] sm:h-[22px]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1">Description</p>
                        <p className="font-medium text-sm sm:text-base">{selectedOrder.description}</p>
                      </div>
                    </div>

                    {selectedOrder.origin && (
                      <div className="flex items-start gap-3">
                        <MapPin size={20} className="text-muted-foreground mt-1 flex-shrink-0 sm:w-[22px] sm:h-[22px]" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-muted-foreground mb-1">Origin</p>
                          <p className="font-medium text-sm sm:text-base">{selectedOrder.origin}</p>
                        </div>
                      </div>
                    )}

                    {selectedOrder.destination && (
                      <div className="flex items-start gap-3">
                        <MapPin size={20} weight="fill" className="text-muted-foreground mt-1 flex-shrink-0 sm:w-[22px] sm:h-[22px]" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-muted-foreground mb-1">Destination</p>
                          <p className="font-medium text-sm sm:text-base">{selectedOrder.destination}</p>
                        </div>
                      </div>
                    )}

                    {selectedOrder.weight && (
                      <div className="flex items-start gap-3">
                        <ArrowsClockwise size={20} className="text-muted-foreground mt-1 flex-shrink-0 sm:w-[22px] sm:h-[22px]" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-muted-foreground mb-1">Weight</p>
                          <p className="font-medium text-sm sm:text-base">{selectedOrder.weight}</p>
                        </div>
                      </div>
                    )}

                    <Separator />

                    <div className="flex items-start gap-3">
                      <Calendar size={20} className="text-muted-foreground mt-1 flex-shrink-0 sm:w-[22px] sm:h-[22px]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1">Created</p>
                        <p className="font-medium text-sm sm:text-base">{formatDate(selectedOrder.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar size={20} weight="fill" className="text-muted-foreground mt-1 flex-shrink-0 sm:w-[22px] sm:h-[22px]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1">Last Updated</p>
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
