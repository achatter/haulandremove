'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { BusinessImage } from '@/types'

const FALLBACK_URL = 'https://images.unsplash.com/photo-1704756082548-af7c773aa0ef?w=800&q=80'

interface ListingCardImageProps {
  image: BusinessImage
  tileBg: string
  tileAccent: string
  businessName: string
}

export function ListingCardImage({ image, tileBg, tileAccent, businessName }: ListingCardImageProps) {
  const [src, setSrc] = useState(image.url)

  return (
    <>
      <Image
        src={src}
        alt={image.alt_text}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-700"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={() => { if (src !== FALLBACK_URL) setSrc(FALLBACK_URL) }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
    </>
  )
}
