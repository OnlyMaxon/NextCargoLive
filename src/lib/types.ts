export type OrderStatus = 'in_transit' | 'at_warehouse' | 'delivered'

export type ViewMode = 'landing' | 'auth' | 'user' | 'admin'

export type AuthTab = 'login' | 'register'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  finCode: string
  isAdmin: boolean
  documentSerial?: string  // Max 10 characters
  birthDate?: string       // Format: YYYY-MM-DD
}

export interface TrackingEvent {
  id: string
  timestamp: number
  status: OrderStatus
  location: string
  description: string
  updatedBy?: string
}

export interface Order {
  id: string
  userId: string
  trackingNumber: string
  description: string
  status: OrderStatus
  createdAt: number
  updatedAt: number
  origin?: string
  destination?: string
  weight?: string
  trackingHistory?: TrackingEvent[]
}

export interface Notification {
  id: string
  userId: string
  message: string
  timestamp: number
  read: boolean
  orderId?: string
}

export interface Marketplace {
  id: string
  name: string
  url: string
  logo: string
  description: string
}

// Discount system types
export type DiscountType = 'first_order' | 'promo_code' | 'loyalty' | 'referral' | 'seasonal'

export interface Discount {
  id: string
  type: DiscountType
  percentage: number
  code?: string // for promo codes
  description: {
    ru: string
    en: string
    az: string
  }
  validUntil?: number // timestamp
  minOrders?: number // for loyalty discounts
  maxOrders?: number // for first order (0 orders required)
  isActive: boolean
}

export interface UserDiscount {
  discountId: string
  appliedAt: number
  usedOnOrderId?: string
}
