import { ReviewCard } from './ReviewCard'
import type { Review } from '@/types'

interface ReviewListProps {
  reviews: Review[]
  hasGoogleReviews?: boolean
}

export function ReviewList({ reviews, hasGoogleReviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <p className="text-muted-foreground text-sm py-4">
        {hasGoogleReviews
          ? 'No reviews submitted directly on this site yet — see the reviews on Google above, or be the first to leave one here.'
          : 'No reviews on this site yet. Be the first to leave one!'}
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
