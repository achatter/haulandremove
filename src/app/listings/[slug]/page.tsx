import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { ListingDetail } from '@/components/listings/ListingDetail'
import { ReviewList } from '@/components/reviews/ReviewList'
import { ReviewForm } from '@/components/reviews/ReviewForm'
import { Separator } from '@/components/ui/separator'
import { getBusinessBySlug } from '@/lib/db/businesses'
import { getReviewsForBusiness } from '@/lib/db/reviews'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const business = await getBusinessBySlug(slug)
  if (!business) return { title: 'Not Found' }
  return {
    title: business.name,
    description: business.description,
  }
}

export default async function ListingPage({ params }: PageProps) {
  const { slug } = await params
  const business = await getBusinessBySlug(slug)
  if (!business) notFound()

  const reviews = await getReviewsForBusiness(business.id)

  return (
    <Container className="py-10">
      <ListingDetail business={business} />

      <Separator className="my-10" />

      <section>
        <h2 className="text-2xl font-semibold mb-6">
          Reviews
          {business.review_count > 0 && (
            <span className="text-muted-foreground font-normal text-lg ml-2">
              ({business.review_count})
            </span>
          )}
        </h2>
        <ReviewList reviews={reviews} />
      </section>

      <Separator className="my-10" />

      <section>
        <h2 className="text-2xl font-semibold mb-6">Write a Review</h2>
        <div className="max-w-2xl">
          <ReviewForm businessId={business.id} />
        </div>
      </section>
    </Container>
  )
}
