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
}

export function ReviewsModal({ rating, reviewCount, reviews }: ReviewsModalProps) {
  const [open, setOpen] = useState(false)
  const hasReviews = reviews.length > 0

  return (
    <>
      <button
        type="button"
        onClick={() => hasReviews && setOpen(true)}
        className={`flex items-center gap-2 ${hasReviews ? 'cursor-pointer hover:opacity-80' : 'cursor-default'} transition-opacity`}
        aria-label={hasReviews ? `View ${reviewCount} reviews` : undefined}
      >
        <StarRating rating={rating} size="md" />
        <span className="font-semibold">{rating > 0 ? rating.toFixed(1) : '—'}</span>
        <span className="text-muted-foreground text-sm">
          ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
        </span>
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
