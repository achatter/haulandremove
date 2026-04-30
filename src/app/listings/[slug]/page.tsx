import { Container } from '@/components/layout/Container'
import { ListingDetail } from '@/components/listings/ListingDetail'
import { ReviewList } from '@/components/reviews/ReviewList'
import { ReviewForm } from '@/components/reviews/ReviewForm'
import { Separator } from '@/components/ui/separator'
import { getBusinessBySlug } from '@/lib/db/businesses'
import { getReviewsForBusiness } from '@/lib/db/reviews'
import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const { data: biz } = await supabase
    .from('businesses')
    .select('name, city, state, category, description, phone')
    .eq('slug', slug)
    .single()

  if (!biz) {
    return {
      title: 'Business Not Found',
    }
  }

  const categoryLabel = biz.category
    .split('_')
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  const title = `${biz.name} | ${categoryLabel} in ${biz.city}, ${biz.state}`
  const description = biz.description
    ? biz.description.slice(0, 157) + (biz.description.length > 157 ? '...' : '')
    : `${biz.name} is a trusted ${categoryLabel} company serving ${biz.city}, ${biz.state}. Contact them for a free quote today.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://junkremovalsearch.com/listings/${slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: `https://junkremovalsearch.com/listings/${slug}`,
    },
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
