import { ReviewCard } from './ReviewCard'
import type { Review } from '@/types'

interface ReviewListProps {
  reviews: Review[]
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <p className="text-muted-foreground text-sm py-4">
        No reviews on this site yet. Be the first to leave one!
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  )
}
