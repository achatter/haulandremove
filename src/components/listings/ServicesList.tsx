import { CheckCircle2 } from 'lucide-react'
import type { ServiceItem } from '@/types'

interface ServicesListProps {
  services: ServiceItem[]
}

export function ServicesList({ services }: ServicesListProps) {
  if (!services || services.length === 0) return null

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Services Offered</h3>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {services.map((service, i) => (
          <li key={i} className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <span className="text-sm font-medium">{service.name}</span>
              {service.description && (
                <p className="text-xs text-muted-foreground mt-0.5">{service.description}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
