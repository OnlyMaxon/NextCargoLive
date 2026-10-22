import { useState } from 'react'
import { Notification } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bell } from '@phosphor-icons/react'
import { useTranslation, translations } from '@/lib/i18n'

const txt = translations.notifications

interface NotificationsBellProps {
  notifications: Notification[]
  onMarkAllRead: () => void
}

/**
 * Уведомления грузились в стейт App, но ни один компонент их не отрисовывал:
 * админка их создавала, индекс в Firestore был, а клиент не видел ничего.
 */
export function NotificationsBell({ notifications, onMarkAllRead }: NotificationsBellProps) {
  const { language } = useTranslation()
  const [open, setOpen] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length
  const sorted = [...notifications].sort((a, b) => b.timestamp - a.timestamp)

  const formatDate = (timestamp: number) => {
    if (!timestamp) return '—'
    return new Date(timestamp).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    // Открытие списка и есть подтверждение прочтения.
    if (next && unreadCount > 0) onMarkAllRead()
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative flex-shrink-0 text-gray-500 hover:text-gray-900"
          aria-label={`${txt.title[language]}${unreadCount > 0 ? ` (${unreadCount})` : ''}`}
        >
          <Bell size={20} weight={unreadCount > 0 ? 'fill' : 'regular'} />
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="px-3 py-2 border-b">
          <p className="text-sm font-semibold text-gray-900">{txt.title[language]}</p>
        </div>
        {sorted.length === 0 ? (
          <p className="px-3 py-8 text-center text-sm text-gray-500">{txt.empty[language]}</p>
        ) : (
          <ScrollArea className="max-h-72">
            <ul className="divide-y divide-gray-100">
              {sorted.map((notification) => (
                <li
                  key={notification.id}
                  className={`px-3 py-2.5 ${notification.read ? '' : 'bg-blue-50/60'}`}
                >
                  <p className="text-sm text-gray-800 leading-snug">{notification.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{formatDate(notification.timestamp)}</p>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  )
}
