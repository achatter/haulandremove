import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  showNumber?: boolean
  className?: string
}

export function StarRating({
  rating,
  max = 5,
  size = 'sm',
  showNumber = false,
  className,
}: StarRatingProps) {
  const sizeMap = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating)
        const partial = !filled && i < rating

        return (
          <span key={i} className="relative inline-block">
            <Star className={cn(sizeMap[size], 'text-zinc-200 fill-zinc-200')} />
            {(filled || partial) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: filled ? '100%' : `${(rating % 1) * 100}%` }}
              >
                <Star className={cn(sizeMap[size], 'fill-yellow-400 text-yellow-400')} />
              </span>
            )}
          </span>
        )
      })}
      {showNumber && (
        <span className="text-sm font-medium text-foreground ml-0.5">{rating.toFixed(1)}</span>
      )}
    </div>
  )
}
