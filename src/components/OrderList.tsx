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
      <div className="p-6">
        <Alert>
          <Package className="h-4 w-4" />
          <AlertDescription>
            You don't have any orders yet. Visit the Apps tab to shop from Polish marketplaces and ship to our warehouse!
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <>
      <ScrollArea className="h-[calc(100vh-140px)]">
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">My Orders</h2>
          
          <div className="space-y-3">
            {userOrders.map((order) => (
              <Card
                key={order.id}
                className="cursor-pointer transition-all hover:shadow-md"
                onClick={() => setSelectedOrder(order)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Package size={20} weight="bold" className="text-primary" />
                        <span className="font-semibold text-lg">{order.trackingNumber}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {order.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <Badge className={STATUS_COLORS[order.status]}>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package size={24} weight="bold" />
              Order Details
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge className={STATUS_COLORS[selectedOrder.status]}>
                  {STATUS_LABELS[selectedOrder.status]}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Barcode size={20} className="text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Tracking Number</p>
                    <p className="font-semibold">{selectedOrder.trackingNumber}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Package size={20} className="text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="font-medium">{selectedOrder.description}</p>
                  </div>
                </div>

                {selectedOrder.origin && (
                  <div className="flex items-start gap-3">
                    <MapPin size={20} className="text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Origin</p>
                      <p className="font-medium">{selectedOrder.origin}</p>
                    </div>
                  </div>
                )}

                {selectedOrder.destination && (
                  <div className="flex items-start gap-3">
                    <MapPin size={20} weight="fill" className="text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Destination</p>
                      <p className="font-medium">{selectedOrder.destination}</p>
                    </div>
                  </div>
                )}

                {selectedOrder.weight && (
                  <div className="flex items-start gap-3">
                    <ArrowsClockwise size={20} className="text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Weight</p>
                      <p className="font-medium">{selectedOrder.weight}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Calendar size={20} className="text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar size={20} weight="fill" className="text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{formatDate(selectedOrder.updatedAt)}</p>
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
