import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedSection } from '@/components/home/FeaturedSection'
import { CategorySection } from '@/components/home/CategorySection'
import { Container } from '@/components/layout/Container'
import { getFeaturedBusinesses } from '@/lib/db/businesses'

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
