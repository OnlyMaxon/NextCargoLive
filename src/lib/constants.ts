import { Marketplace, OrderStatus } from './types'

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

/**
 * Единственный источник правды по статусам заказа.
 *
 * Record<OrderStatus, ...> важен: раньше OrderList держал свою копию карты со
 * ключом 'in_warehouse', которого в OrderStatus нет. Реальный 'at_warehouse'
 * не находился ни в цветах (бейдж получал класс "undefined"), ни в переводах
 * (клиент видел сырую строку at_warehouse). Теперь любой новый статус, не
 * добавленный во все три карты, ломает сборку, а не продакшен.
 */
export const STATUS_TRANSLATION_KEY: Record<OrderStatus, 'inTransit' | 'inWarehouse' | 'delivered'> = {
  in_transit: 'inTransit',
  at_warehouse: 'inWarehouse',
  delivered: 'delivered'
}

/** Классы бейджа статуса (списки заказов, карточки). */
export const STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  in_transit: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  at_warehouse: 'bg-amber-100 text-amber-800 border-amber-200',
  delivered: 'bg-green-100 text-green-800 border-green-200'
}

/** Насыщенный фон для точки таймлайна и активной кнопки статуса. */
export const STATUS_ACCENT_CLASSES: Record<OrderStatus, string> = {
  in_transit: 'bg-blue-600',
  at_warehouse: 'bg-amber-600',
  delivered: 'bg-green-600'
}

/** Локация по умолчанию, подставляемая в событие трекинга. */
export const STATUS_DEFAULT_LOCATION: Record<OrderStatus, string> = {
  in_transit: 'Poland - In Transit',
  at_warehouse: 'Azerbaijan Warehouse',
  delivered: 'Delivered to Customer'
}
