'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { BusinessImage } from '@/types'

interface ListingCardImageProps {
  image: BusinessImage
  tileBg: string
  tileAccent: string
  businessName: string
}

export function ListingCardImage({ image, tileBg, tileAccent, businessName }: ListingCardImageProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div className="absolute inset-0" style={{ backgroundColor: tileBg }}>
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              rgba(255,255,255,0.8) 0px,
              rgba(255,255,255,0.8) 1px,
              transparent 1px,
              transparent 18px
            )`,
          }}
        />
        <div
          className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-10"
          style={{ backgroundColor: tileAccent }}
        />
        <div
          className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10"
          style={{ backgroundColor: tileAccent }}
        />
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <p className="text-white font-serif font-bold text-xl leading-tight line-clamp-3">
            {businessName}
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Image
        src={image.url}
        alt={image.alt_text}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-700"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={() => setHasError(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
    </>
  )
}
