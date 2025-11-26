import { useState } from 'react'
import { Order, User } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/constants'
import { Package, MapPin, Barcode, Calendar, ArrowsClockwise } from '@phosphor-icons/react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface OrderListProps {
  orders: Order[]
  user: User
}

export function OrderList({ orders, user }: OrderListProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

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

  if (userOrders.length === 0) {
    return (
      <div className="p-4">
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
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">My Orders</h2>
          
          <div className="space-y-4">
            {userOrders.map((order) => (
              <Card
                key={order.id}
                className="cursor-pointer transition-all hover:shadow-md active:scale-[0.98]"
                onClick={() => setSelectedOrder(order)}
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                      <div className="flex items-center gap-2.5">
                        <Package size={20} weight="bold" className="text-primary flex-shrink-0 sm:w-[22px] sm:h-[22px]" />
                        <span className="font-semibold text-sm sm:text-base truncate">{order.trackingNumber}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {order.description}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <Badge className={`${STATUS_COLORS[order.status]} text-xs whitespace-nowrap flex-shrink-0`}>
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
        <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2.5 text-lg sm:text-xl">
              <Package size={24} weight="bold" className="sm:w-[26px] sm:h-[26px]" />
              Order Details
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-5 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base text-muted-foreground">Status</span>
                <Badge className={`${STATUS_COLORS[selectedOrder.status]} text-sm`}>
                  {STATUS_LABELS[selectedOrder.status]}
                </Badge>
              </div>

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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
