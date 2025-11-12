import { Marketplace } from './types'

export const ADMIN_CREDENTIALS = {
  username: 'CRG_ADMIN_PL2024',
  password: 'Crg0!Plnd#Az2024$SecureAdmin!'
}

export const MARKETPLACES: Marketplace[] = [
  {
    id: 'allegro',
    name: 'Allegro.pl',
    url: 'https://allegro.pl',
    logo: '🛍️',
    description: 'Poland\'s largest online marketplace'
  },
  {
    id: 'amazon',
    name: 'Amazon.pl',
    url: 'https://amazon.pl',
    logo: '📦',
    description: 'Global e-commerce platform'
  },
  {
    id: 'ikea',
    name: 'IKEA.pl',
    url: 'https://www.ikea.com/pl/pl/',
    logo: '🪑',
    description: 'Furniture and home accessories'
  },
  {
    id: 'maktrans',
    name: 'Maktrans.pl',
    url: 'https://maktrans.pl',
    logo: '🚚',
    description: 'Transport and logistics services'
  }
]

export const STATUS_LABELS = {
  in_transit: 'In Transit',
  at_warehouse: 'At Warehouse',
  delivered: 'Delivered'
}

export const STATUS_COLORS = {
  in_transit: 'bg-[oklch(0.70_0.15_85)] text-[oklch(0.25_0.02_85)]',
  at_warehouse: 'bg-[oklch(0.55_0.15_250)] text-white',
  delivered: 'bg-[oklch(0.60_0.15_145)] text-white'
}
