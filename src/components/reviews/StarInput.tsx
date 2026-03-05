'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarInputProps {
  value: number
  onChange: (rating: number) => void
  className?: string
}

export function StarInput({ value, onChange, className }: StarInputProps) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= (hovered || value)
        return (
          <button
            key={star}
            type="button"
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="focus:outline-none"
          >
            <Star
              className={cn(
                'h-7 w-7 transition-colors',
                active ? 'fill-yellow-400 text-yellow-400' : 'fill-zinc-200 text-zinc-200'
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
