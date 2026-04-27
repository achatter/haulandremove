import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedSection } from '@/components/home/FeaturedSection'
import { CategorySection } from '@/components/home/CategorySection'
import { Container } from '@/components/layout/Container'
import { getFeaturedBusinesses } from '@/lib/db/businesses'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Find Junk Removal & Estate Cleanout Services Near You',
  description: 'Search thousands of local junk removal and estate cleanout companies across the US. Find trusted providers in your city, compare reviews, and get free quotes today.',
  openGraph: {
    title: 'Find Junk Removal & Estate Cleanout Services Near You',
    description: 'Search thousands of local junk removal and estate cleanout companies across the US. Find trusted providers in your city, compare reviews, and get free quotes today.',
    url: 'https://junkremovalsearch.com',
  },
}

export default async function HomePage() {
  const featured = await getFeaturedBusinesses()

  return (
    <>
      <HeroSection />
      <div className="bg-white">
        <Container>
          <FeaturedSection businesses={featured} />
          <CategorySection />
        </Container>
      </div>
    </>
  )
}
