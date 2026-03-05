import { Badge } from '@/components/ui/badge'
import { CATEGORIES } from '@/lib/constants'
import type { Category } from '@/types'
import { cn } from '@/lib/utils'

interface CategoryBadgeProps {
  category: Category
  className?: string
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const label = CATEGORIES[category]?.label ?? category

  return (
    <Badge
      variant="secondary"
      className={cn(
        'text-xs font-medium',
        category === 'estate_cleanout'
          ? 'bg-blue-50 text-blue-700 hover:bg-blue-50'
          : 'bg-green-50 text-green-700 hover:bg-green-50',
        className
      )}
    >
      {label}
    </Badge>
  )
}
