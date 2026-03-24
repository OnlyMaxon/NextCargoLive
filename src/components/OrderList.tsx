import { useState } from 'react'
import { Order, User } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Package, MapPin, Barcode, Calendar, ClockClockwise, CheckCircle, Copy, Scales, WhatsappLogo } from '@phosphor-icons/react'
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

// Pricing table data with original prices
const PRICING = [
  { weight: 'documents', price: 23, priceStr: '23€' },
  { weight: '0-5', price: 47, priceStr: '47€' },
  { weight: '5-10', price: 70, priceStr: '70€' },
  { weight: '10-23', price: 140, priceStr: '140€' }
]

// Calculate discounted price
const getDiscountedPrice = (price: number, discountPercent: number): string => {
  const discounted = Math.round(price * (1 - discountPercent / 100))
  return `${discounted}€`
}

interface OrderListProps {
  orders: Order[]
  user: User
}

export function OrderList({ orders, user }: OrderListProps) {
  const { language } = useTranslation()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Calculate user's completed orders count
  const userOrders = orders
    .filter(order => order.userId === user.id)
    .sort((a, b) => b.createdAt - a.createdAt)
  
  // Check if user is eligible for first order discount (0 completed orders)
  const completedOrdersCount = userOrders.filter(o => o.status === 'delivered').length
  const isFirstOrder = completedOrdersCount === 0
  const discountPercent = isFirstOrder ? 50 : 0

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

  // Get weight label translation
  const getWeightLabel = (weight: string) => {
    if (weight === 'documents') {
      return txt.documents[language]
    }
    return `${weight} ${language === 'ru' ? 'кг' : language === 'az' ? 'kq' : 'kg'}`
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }



  // Discount Banner Component
  const DiscountBanner = () => {
    if (!isFirstOrder) return null
    
    return (
      <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-xl p-4 shadow-lg mb-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <span className="text-2xl">🎁</span>
            </div>
            <div className="flex-1">
              <Badge className="bg-yellow-400 text-yellow-900 text-[10px] font-bold mb-1">
                {txt.newCustomer[language]}
              </Badge>
              <h3 className="text-white font-bold text-lg">{txt.firstOrderDiscount[language]}</h3>
              <p className="text-white/80 text-xs">{txt.discountValidUntil[language]}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black text-white">-50%</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Pricing Card Component with discount
  const PricingCard = () => (
    <Card className="border shadow-sm overflow-hidden">
      <div className={`px-4 py-3 ${isFirstOrder ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-blue-600 to-blue-700'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scales size={18} weight="bold" className="text-white" />
            <div>
              <h3 className="font-bold text-white text-sm">{txt.pricingTitle[language]}</h3>
              <p className="text-white/70 text-[10px]">{txt.pricingSubtitle[language]} 🇵🇱 → 🇦🇿</p>
            </div>
          </div>
          {isFirstOrder && (
            <Badge className="bg-yellow-400 text-yellow-900 text-xs font-bold animate-pulse">
              -50%
            </Badge>
          )}
        </div>
      </div>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {PRICING.map((item, index) => (
            <div key={index} className={`flex items-center justify-between px-4 py-3 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
              <span className="text-sm text-gray-700 font-medium">{getWeightLabel(item.weight)}</span>
              <div className="flex items-center gap-2">
                {isFirstOrder ? (
                  <>
                    <span className="text-xs text-gray-400 line-through">{item.priceStr}</span>
                    <span className="text-sm font-bold text-green-600">{getDiscountedPrice(item.price, discountPercent)}</span>
                  </>
                ) : (
                  <span className="text-sm font-bold text-blue-600">{item.priceStr}</span>
                )}
              </div>
            </div>
          ))}
        </div>
        {isFirstOrder && (
          <div className="px-4 py-2 bg-green-50 border-t border-green-100">
            <p className="text-xs text-green-700 text-center font-medium">
              ✨ {txt.discountApplied[language]}: 50% {language === 'ru' ? 'на первый заказ' : language === 'az' ? 'ilk sifariş üçün' : 'on first order'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )

  // WhatsApp Contact Card
  const WhatsAppCard = () => {
    const openWhatsApp = () => {
      const message = language === 'ru' 
        ? 'Здравствуйте! Отправляю скриншот заказа. Мой FIN: ' + user.finCode
        : language === 'az'
        ? 'Salam! Sifariş skrinşotunu göndərirəm. Mənim FIN: ' + user.finCode
        : 'Hello! Sending order screenshot. My FIN: ' + user.finCode
      window.open(`https://wa.me/994508700969?text=${encodeURIComponent(message)}`, '_blank')
    }

    return (
      <Card className="border shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={openWhatsApp}>
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-3">
          <div className="flex items-center gap-2">
            <WhatsappLogo size={20} weight="fill" className="text-white" />
            <div>
              <h3 className="font-bold text-white text-sm">{txt.whatsappTitle[language]}</h3>
              <p className="text-green-100 text-[10px]">{txt.whatsappHint[language]}</p>
            </div>
          </div>
        </div>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono font-bold text-green-600">+994 50 870 0969</span>
            <Badge className="bg-green-100 text-green-700 text-[10px]">WhatsApp</Badge>
          </div>
        </CardContent>
      </Card>
    )
  }



  return (
    <>
      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="p-3 space-y-3">
          {/* Discount Banner for New Customers */}
          <DiscountBanner />
          
          {/* Pricing and WhatsApp Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <PricingCard />
            <WhatsAppCard />
          </div>

          {/* My Packages Section */}
          <div className="flex items-center gap-3 pt-2">
            <div className="h-px flex-1 bg-border" />
            <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Package size={16} weight="bold" className="text-blue-600" />
              {txt.myOrders[language]}
            </h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          
          {userOrders.length === 0 ? (
            <Alert className="bg-blue-50 border-blue-200">
              <Package className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm text-blue-800 leading-relaxed">
                {txt.noOrders[language]}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-2">
              {userOrders.map((order) => (
                <Card
                  key={order.id}
                  className="cursor-pointer hover:bg-muted/30 border shadow-sm transition-all hover:shadow-md"
                  onClick={() => setSelectedOrder(order)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 space-y-1.5 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <Package size={14} className="text-blue-600 flex-shrink-0" />
                          <span className="font-mono font-semibold text-sm truncate">{order.trackingNumber}</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {order.description}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          <Calendar size={10} />
                          {formatDate(order.createdAt)}
                          {order.weight && (
                            <>
                              <span>•</span>
                              <Scales size={10} />
                              {order.weight}
                            </>
                          )}
                        </div>
                      </div>
                      <Badge className={`${STATUS_COLORS[order.status]} text-[10px] flex-shrink-0 font-semibold`}>
                        {getStatusLabel(order.status)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Package size={18} className="text-blue-600" />
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
                    <Badge className={`${STATUS_COLORS[selectedOrder.status]} text-sm font-semibold`}>
                      {getStatusLabel(selectedOrder.status)}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Barcode size={20} className="text-blue-600 mt-1 flex-shrink-0 sm:w-[22px] sm:h-[22px]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1">{txt.trackingNumber[language]}</p>
                        <p className="font-mono font-bold text-sm sm:text-base break-all">{selectedOrder.trackingNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Package size={20} className="text-blue-600 mt-1 flex-shrink-0 sm:w-[22px] sm:h-[22px]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1">{txt.description[language]}</p>
                        <p className="font-medium text-sm sm:text-base">{selectedOrder.description}</p>
                      </div>
                    </div>

                    {selectedOrder.origin && (
                      <div className="flex items-start gap-3">
                        <MapPin size={20} className="text-blue-600 mt-1 flex-shrink-0 sm:w-[22px] sm:h-[22px]" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-muted-foreground mb-1">{txt.origin[language]}</p>
                          <p className="font-medium text-sm sm:text-base">{selectedOrder.origin}</p>
                        </div>
                      </div>
                    )}

                    {selectedOrder.destination && (
                      <div className="flex items-start gap-3">
                        <MapPin size={20} weight="fill" className="text-green-600 mt-1 flex-shrink-0 sm:w-[22px] sm:h-[22px]" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-muted-foreground mb-1">{txt.destination[language]}</p>
                          <p className="font-medium text-sm sm:text-base">{selectedOrder.destination}</p>
                        </div>
                      </div>
                    )}

                    {selectedOrder.weight && (
                      <div className="flex items-start gap-3">
                        <Scales size={20} className="text-blue-600 mt-1 flex-shrink-0 sm:w-[22px] sm:h-[22px]" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-muted-foreground mb-1">{txt.weight[language]}</p>
                          <p className="font-bold text-sm sm:text-base text-blue-600">{selectedOrder.weight}</p>
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
