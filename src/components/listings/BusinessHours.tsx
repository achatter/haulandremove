import { Clock } from 'lucide-react'
import type { BusinessHours as BusinessHoursType } from '@/types'

interface BusinessHoursProps {
  hours: BusinessHoursType
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const

function getTodayName(): string {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' })
}

export function BusinessHours({ hours }: BusinessHoursProps) {
  const today = getTodayName()

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Clock className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold">Hours</span>
      </div>
      <dl className="space-y-1 text-sm">
        {DAYS.map(day => {
          const isToday = day === today
          const hoursText = hours[day as keyof BusinessHoursType] ?? 'Closed'
          return (
            <div
              key={day}
              className={`flex justify-between gap-4 ${
                isToday ? 'font-semibold text-foreground' : 'text-muted-foreground'
              }`}
            >
              <dt className="w-24 shrink-0">{day}</dt>
              <dd>{hoursText}</dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}
