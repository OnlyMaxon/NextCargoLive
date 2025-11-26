import { TrackingEvent } from '@/lib/types'
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/constants'
import { MapPin, Package, CheckCircle, Clock } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface TrackingTimelineProps {
  events: TrackingEvent[]
}

export function TrackingTimeline({ events }: TrackingTimelineProps) {
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
      <div className="text-center py-8 text-muted-foreground text-sm">
        No tracking history available yet
      </div>
    )
  }

  return (
    <div className="relative space-y-0">
      {sortedEvents.map((event, index) => {
        const Icon = getStatusIcon(event.status)
        const { date, time } = formatDateTime(event.timestamp)
        const isLatest = index === 0

        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex gap-4 pb-8 last:pb-0"
          >
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center z-10 flex-shrink-0
                  ${isLatest 
                    ? 'bg-primary shadow-lg shadow-primary/20' 
                    : 'bg-muted'
                  }
                `}
              >
                <Icon
                  size={20}
                  weight={isLatest ? 'fill' : 'regular'}
                  className={isLatest ? 'text-primary-foreground' : 'text-muted-foreground'}
                />
              </div>
              {index < sortedEvents.length - 1 && (
                <div className="w-0.5 flex-1 bg-border mt-2 min-h-[20px]" />
              )}
            </div>

            <div className="flex-1 -mt-1 pb-2">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`
                          inline-flex px-2.5 py-1 rounded-md text-xs font-medium
                          ${isLatest ? STATUS_COLORS[event.status] : 'bg-muted text-muted-foreground'}
                        `}
                      >
                        {STATUS_LABELS[event.status]}
                      </span>
                      {isLatest && (
                        <span className="text-xs font-medium text-primary">Latest</span>
                      )}
                    </div>
                    <p className="text-sm sm:text-base font-medium">{event.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>{time}</span>
                  </div>
                  <span>•</span>
                  <span>{date}</span>
                </div>

                {event.location && (
                  <div className="flex items-start gap-1.5 text-xs sm:text-sm text-muted-foreground">
                    <MapPin size={14} className="mt-0.5 flex-shrink-0" weight="fill" />
                    <span>{event.location}</span>
                  </div>
                )}

                {event.updatedBy && (
                  <div className="text-xs text-muted-foreground">
                    Updated by: {event.updatedBy}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
