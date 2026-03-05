import { StarRating } from './StarRating'
import type { Review } from '@/types'

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  const date = new Date(review.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="border rounded-xl p-5 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">{review.reviewer_name}</span>
            <span className="text-muted-foreground text-xs">·</span>
            <span className="text-muted-foreground text-xs">{date}</span>
          </div>
          <StarRating rating={review.rating} size="sm" />
        </div>
      </div>

      <h4 className="font-semibold text-sm mt-3">{review.title}</h4>
      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{review.body}</p>
    </div>
  )
}
