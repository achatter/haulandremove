'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { BusinessImage } from '@/types'

interface ImageGalleryProps {
  images: BusinessImage[]
  businessName: string
}

export function ImageGallery({ images, businessName }: ImageGalleryProps) {
  const [errorIds, setErrorIds] = useState<Set<string>>(new Set())

  if (images.length === 0) return null

  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order)
  const primary = sorted.find((img) => img.is_primary) ?? sorted[0]
  const rest = sorted.filter((img) => img.id !== primary.id)

  const handleError = (id: string) => {
    setErrorIds((prev) => new Set([...prev, id]))
  }

  const primaryFailed = errorIds.has(primary.id)
  const visibleThumbnails = rest.filter((img) => !errorIds.has(img.id))

  return (
    <div className="space-y-3">
      {/* Primary image */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
        {primaryFailed ? (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <span className="text-muted-foreground text-sm">Image unavailable</span>
          </div>
        ) : (
          <Image
            src={primary.url}
            alt={primary.alt_text || businessName}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 800px"
            onError={() => handleError(primary.id)}
          />
        )}
      </div>

      {/* Thumbnail strip */}
      {visibleThumbnails.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {visibleThumbnails.map((img) => (
            <div
              key={img.id}
              className="relative shrink-0 w-24 h-16 rounded-lg overflow-hidden bg-muted"
            >
              <Image
                src={img.url}
                alt={img.alt_text || businessName}
                fill
                className="object-cover"
                sizes="96px"
                onError={() => handleError(img.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
