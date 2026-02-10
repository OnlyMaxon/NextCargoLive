import { TrackingEvent } from '@/lib/types'
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/constants'
import { MapPin, Package, CheckCircle, Clock, Sparkle } from '@phosphor-icons/react'
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

  const getStatusGradient = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'from-green-500 to-emerald-500'
      case 'at_warehouse':
        return 'from-amber-500 to-orange-500'
      case 'in_transit':
        return 'from-blue-500 to-primary'
      default:
        return 'from-gray-400 to-gray-500'
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
      <div className="text-center py-12 text-muted-foreground text-sm">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-violet-500/5 flex items-center justify-center mx-auto mb-4">
          <Package size={32} className="text-primary/50" />
        </div>
        <p>No tracking history available yet</p>
        <p className="text-xs mt-1">Updates will appear here when your order ships</p>
      </div>
    )
  }

  return (
    <div className="relative space-y-0">
      {sortedEvents.map((event, index) => {
        const Icon = getStatusIcon(event.status)
        const { date, time } = formatDateTime(event.timestamp)
        const isLatest = index === 0
        const gradient = getStatusGradient(event.status)

        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="relative flex gap-4 pb-8 last:pb-0"
          >
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-11 h-11 rounded-full flex items-center justify-center z-10 flex-shrink-0 transition-all duration-300
                  ${isLatest 
                    ? `bg-gradient-to-br ${gradient} shadow-lg shadow-primary/30 ring-4 ring-primary/10` 
                    : 'bg-white/80 dark:bg-slate-800/80 border-2 border-white/30 shadow-md'
                  }
                `}
              >
                <Icon
                  size={20}
                  weight={isLatest ? 'fill' : 'regular'}
                  className={isLatest ? 'text-white' : 'text-muted-foreground'}
                />
              </div>
              {index < sortedEvents.length - 1 && (
                <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/30 to-transparent mt-2 min-h-[20px]" />
              )}
            </div>

            <div className={`flex-1 -mt-1 pb-2 ${isLatest ? '' : 'opacity-70'}`}>
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`
                          inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm
                          ${isLatest ? `bg-gradient-to-r ${gradient} text-white shadow-md` : 'bg-white/70 dark:bg-slate-800/70 text-muted-foreground border border-white/20'}
                        `}
                      >
                        {STATUS_LABELS[event.status]}
                      </span>
                      {isLatest && (
                        <span className="text-xs font-semibold text-primary flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-md">
                          <Sparkle size={12} weight="fill" className="animate-pulse" />
                          Latest
                        </span>
                      )}
                    </div>
                    <p className="text-sm sm:text-base font-medium text-foreground">{event.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground bg-white/50 dark:bg-slate-800/50 rounded-lg px-3 py-2 w-fit border border-white/20">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-primary/70" />
                    <span className="font-medium">{time}</span>
                  </div>
                  <span className="text-primary/30">•</span>
                  <span>{date}</span>
                </div>

                {event.location && (
                  <div className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground bg-gradient-to-r from-primary/5 to-transparent rounded-lg px-3 py-2 w-fit">
                    <MapPin size={16} className="mt-0.5 flex-shrink-0 text-primary" weight="fill" />
                    <span className="font-medium">{event.location}</span>
                  </div>
                )}

                {event.updatedBy && (
                  <div className="text-xs text-muted-foreground/70 italic">
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
