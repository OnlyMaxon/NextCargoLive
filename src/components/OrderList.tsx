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
    <Card className="border shadow-sm">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                <Warehouse size={18} weight="bold" className="text-white" />
              </div>
              <div>
                <span className="font-semibold text-sm sm:text-base">Your Warehouse Address</span>
                <p className="text-xs text-muted-foreground">Use this for Polish online stores</p>
              </div>
            </div>
            <div className="space-y-1 text-sm font-mono bg-muted/50 rounded-lg p-3 border">
              <p className="font-semibold text-foreground">{WAREHOUSE_ADDRESS.name}</p>
              <p className="text-primary font-semibold">{user.firstName} {user.lastName} - {user.finCode}</p>
              <p className="text-muted-foreground">{WAREHOUSE_ADDRESS.street}</p>
              <p className="text-muted-foreground">{WAREHOUSE_ADDRESS.postalCode} {WAREHOUSE_ADDRESS.city}</p>
              <p className="text-muted-foreground">{WAREHOUSE_ADDRESS.country}</p>
              <p className="text-muted-foreground pt-1">Tel: {WAREHOUSE_ADDRESS.phone}</p>
            </div>
          </div>
          <Button 
            variant={copied ? "default" : "outline"}
            size="sm" 
            onClick={copyWarehouseAddress}
            className={`flex-shrink-0 gap-1.5 ${copied ? 'bg-green-600 hover:bg-green-700' : ''}`}
          >
            {copied ? (
              <>
                <CheckCircle size={14} weight="bold" />
                Copied
              </>
            ) : (
              <>
                <Copy size={14} />
                Copy
              </>
            )}
          </Button>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 border p-2.5 rounded-lg">
          <span>💡</span>
          <span>Your <span className="font-medium">FIN code ({user.finCode})</span> helps us identify your packages</span>
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
      <ScrollArea className="h-[calc(100vh-140px)]">
        <div className="p-4 space-y-4">
          <WarehouseAddressCard />
          
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <h2 className="text-sm font-medium text-muted-foreground">My Orders</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          
          <div className="space-y-3">
            {userOrders.map((order) => (
              <Card
                key={order.id}
                className="cursor-pointer hover:bg-muted/30 border shadow-sm"
                onClick={() => setSelectedOrder(order)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex items-center gap-2">
                        <Package size={16} className="text-muted-foreground" />
                        <span className="font-medium text-sm truncate">{order.trackingNumber}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {order.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <Badge className={`${STATUS_COLORS[order.status]} text-xs flex-shrink-0`}>
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
        <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Package size={18} className="text-primary" />
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
