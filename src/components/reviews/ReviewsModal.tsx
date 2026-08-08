'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { StarRating } from './StarRating'
import type { Review } from '@/types'

interface ReviewsModalProps {
  rating: number
  reviewCount: number
  reviews: Review[]
  googleMapsUrl?: string | null
}

export function ReviewsModal({ rating, reviewCount, reviews, googleMapsUrl }: ReviewsModalProps) {
  const [open, setOpen] = useState(false)
  const hasReviews = reviews.length > 0
  // review_count/average_rating are a Google-sourced aggregate on scraped
  // listings — there's often no on-site review behind them. Link out to
  // Google rather than opening an empty modal in that case.
  const isGoogleAggregate = !hasReviews && reviewCount > 0

  const ratingBadge = (
    <>
      <StarRating rating={rating} size="md" />
      <span className="font-semibold">{rating > 0 ? rating.toFixed(1) : '—'}</span>
      <span className="text-muted-foreground text-sm">
        ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
        {isGoogleAggregate ? ' on Google' : ''})
      </span>
    </>
  )

  if (isGoogleAggregate) {
    return googleMapsUrl ? (
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        aria-label={`See ${reviewCount} reviews on Google`}
      >
        {ratingBadge}
      </a>
    ) : (
      <div className="flex items-center gap-2">{ratingBadge}</div>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => hasReviews && setOpen(true)}
        className={`flex items-center gap-2 ${hasReviews ? 'cursor-pointer hover:opacity-80' : 'cursor-default'} transition-opacity`}
        aria-label={hasReviews ? `View ${reviewCount} reviews` : undefined}
      >
        {ratingBadge}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Reviews ({reviewCount})</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 space-y-4 pr-1">
            {reviews.map((review) => {
              const date = new Date(review.created_at).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric',
              })
              return (
                <div key={review.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{review.reviewer_name}</span>
                    <span className="text-muted-foreground text-xs">·</span>
                    <span className="text-muted-foreground text-xs">{date}</span>
                  </div>
                  <StarRating rating={review.rating} size="sm" />
                  {review.title && (
                    <p className="font-semibold text-sm mt-2">{review.title}</p>
                  )}
                  {review.body && (
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{review.body}</p>
                  )}
                </div>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
