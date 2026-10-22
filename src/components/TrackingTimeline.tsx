import { TrackingEvent } from '@/lib/types'
import { STATUS_ACCENT_CLASSES } from '@/lib/constants'
import { MapPin, Package, CheckCircle, Clock } from '@phosphor-icons/react'
import { useTranslation, Language, translations, getStatusLabel } from '@/lib/i18n'

/**
 * Текст события собирается на клиенте из event.status, а не берётся из
 * event.description: описание пишет админка по-английски, и клиент видел
 * английскую строку при любом выбранном языке. description остаётся в базе как
 * аудит-лог и используется только для старых записей с неизвестным статусом.
 */
const getEventText = (event: TrackingEvent, language: Language, isOldest: boolean): string => {
  if (!(event.status in STATUS_ACCENT_CLASSES)) return event.description
  const template = isOldest
    ? translations.tracking.orderCreated[language]
    : translations.tracking.statusChanged[language]
  return template.replace('{status}', getStatusLabel(event.status, language))
}

interface TrackingTimelineProps {
  events: TrackingEvent[]
}

export function TrackingTimeline({ events }: TrackingTimelineProps) {
  const { language } = useTranslation()
  const sortedEvents = [...events].sort((a, b) => b.timestamp - a.timestamp)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return CheckCircle
      case 'at_warehouse':
        return Package
      case 'in_transit':
        return MapPin
      default:
        return Clock
    }
  }

  const getStatusColor = (status: string) =>
    STATUS_ACCENT_CLASSES[status as keyof typeof STATUS_ACCENT_CLASSES] ?? 'bg-gray-400'

  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return {
      date: date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  if (sortedEvents.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground text-sm">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Package size={32} className="text-muted-foreground" />
        </div>
        <p>{language === 'ru' ? 'История отслеживания пока недоступна' : 
           language === 'az' ? 'İzləmə tarixi hələ mövcud deyil' : 
           'No tracking history available yet'}</p>
        <p className="text-xs mt-1">
          {language === 'ru' ? 'Обновления появятся здесь после отправки' : 
           language === 'az' ? 'Sifariş göndərildikdən sonra yenilənmələr burada görünəcək' : 
           'Updates will appear here when your order ships'}
        </p>
      </div>
    )
  }

  return (
    <div className="relative space-y-0">
      {sortedEvents.map((event, index) => {
        const Icon = getStatusIcon(event.status)
        const { date, time } = formatDateTime(event.timestamp)
        const isLatest = index === 0
        const isOldest = index === sortedEvents.length - 1
        const statusColor = getStatusColor(event.status)

        return (
          <div
            key={event.id}
            className="relative flex gap-4 pb-8 last:pb-0"
          >
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center z-10 flex-shrink-0
                  ${isLatest 
                    ? `${statusColor} text-white` 
                    : 'bg-muted border text-muted-foreground'
                  }
                `}
              >
                <Icon
                  size={18}
                  weight={isLatest ? 'fill' : 'regular'}
                />
              </div>
              {index < sortedEvents.length - 1 && (
                <div className="w-px flex-1 bg-border mt-2 min-h-[20px]" />
              )}
            </div>

            <div className={`flex-1 -mt-1 pb-2 ${isLatest ? '' : 'opacity-70'}`}>
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`
                          inline-flex px-2.5 py-1 rounded text-xs font-medium
                          ${isLatest ? `${statusColor} text-white` : 'bg-muted text-muted-foreground'}
                        `}
                      >
                        {getStatusLabel(event.status, language)}
                      </span>
                      {isLatest && (
                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                          {language === 'ru' ? 'Последнее' : language === 'az' ? 'Son' : 'Latest'}
                        </span>
                      )}
                    </div>
                    <p className="text-sm sm:text-base font-medium text-foreground">{getEventText(event, language, isOldest)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground bg-muted/50 rounded px-3 py-2 w-fit">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    <span className="font-medium">{time}</span>
                  </div>
                  <span>•</span>
                  <span>{date}</span>
                </div>

                {event.location && (
                  <div className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground bg-muted/30 rounded px-3 py-2 w-fit">
                    <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{event.location}</span>
                  </div>
                )}

                {event.updatedBy && (
                  <div className="text-xs text-muted-foreground/70 italic">
                    {language === 'ru' ? 'Обновлено:' : language === 'az' ? 'Yeniləyən:' : 'Updated by:'} {event.updatedBy}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
