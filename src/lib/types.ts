export type OrderStatus = 'in_transit' | 'at_warehouse' | 'delivered'

export interface User {
  id: string
  firstName: string
  lastName: string
  finCode: string
  password: string
  isAdmin: boolean
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

export interface SupportMessage {
  id: string
  userId: string
  userName: string
  message: string
  timestamp: number
  isAdmin: boolean
  conversationId: string
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
