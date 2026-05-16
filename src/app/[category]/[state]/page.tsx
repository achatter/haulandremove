import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { SearchBar } from '@/components/search/SearchBar'
import { CATEGORIES, CITIES_BY_STATE, US_STATES } from '@/lib/constants'
import { categorySlugToKey, stateSlugToAbbr, toSlug } from '@/lib/utils'

interface PageProps {
  params: Promise<{ category: string; state: string }>
}

export async function generateStaticParams() {
  const params: { category: string; state: string }[] = []
  for (const categorySlug of ['junk-removal', 'estate-cleanout']) {
    for (const state of US_STATES) {
      params.push({ category: categorySlug, state: toSlug(state.name) })
    }
  }
  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categorySlug, state: stateSlug } = await params
  const categoryKey = categorySlugToKey(categorySlug)
  const stateAbbr = stateSlugToAbbr(stateSlug)
  if (!categoryKey || !stateAbbr) return {}

  const categoryLabel = CATEGORIES[categoryKey].label
  const stateName = US_STATES.find(s => s.abbr === stateAbbr)?.name ?? stateAbbr

  const title = `${categoryLabel} Services in ${stateName}`
  const description = `Find trusted ${categoryLabel.toLowerCase()} companies across ${stateName}. Browse by city to find local providers, read verified reviews, and get free quotes.`
  const url = `https://junkremovalsearch.com/${categorySlug}/${stateSlug}`

  return {
    title,
    description,
    openGraph: { title, description, url, type: 'website' },
    twitter: { card: 'summary', title, description },
    alternates: { canonical: url },
  }
}

export default async function StatePage({ params }: PageProps) {
  const { category: categorySlug, state: stateSlug } = await params
  const categoryKey = categorySlugToKey(categorySlug)
  if (!categoryKey) notFound()

  const stateAbbr = stateSlugToAbbr(stateSlug)
  if (!stateAbbr) notFound()

  const stateInfo = US_STATES.find(s => s.abbr === stateAbbr)
  if (!stateInfo) notFound()

  const categoryLabel = CATEGORIES[categoryKey].label
  const cities = CITIES_BY_STATE[stateAbbr] ?? []

  return (
    <Container className="py-10">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/categories/${categorySlug}`} className="hover:text-foreground transition-colors">
          {categoryLabel}
        </Link>
        <span>/</span>
        <span className="text-foreground">{stateInfo.name}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {categoryLabel} in {stateInfo.name}
        </h1>
        <p className="text-muted-foreground mb-6">
          Browse cities in {stateInfo.name} to find local {categoryLabel.toLowerCase()} professionals.
        </p>
        <SearchBar currentCategory={categoryKey} />
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4">
          Cities in {stateInfo.name} ({cities.length})
        </h2>

        {cities.length === 0 ? (
          <p className="text-muted-foreground">No cities listed for this state yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {cities.map(city => (
              <Link
                key={city}
                href={`/${categorySlug}/${stateSlug}/${toSlug(city)}`}
                className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
              >
                <MapPin className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-blue-500" />
                <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600">{city}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </Container>
  )
}
