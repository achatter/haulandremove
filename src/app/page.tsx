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
      <div className="relative" style={{ background: 'linear-gradient(180deg, #eef2ff 0%, #f5f7ff 50%, #f8faff 100%)' }}>
        {/* Subtle dot grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#c7d2fe_1px,transparent_1px)] bg-[size:28px_28px] opacity-30 pointer-events-none" />
        <div className="relative z-10">
          <Container>
            <FeaturedSection businesses={featured} />
            <CategorySection />
          </Container>
        </div>
      </div>
    </>
  )
}
