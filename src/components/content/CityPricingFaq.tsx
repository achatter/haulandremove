import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CityContent } from '@/lib/content/city-content'

interface CityPricingFaqProps {
  cityName: string
  stateAbbr: string
  categoryLabel: string
  content: CityContent
}

export function CityPricingFaq({ cityName, stateAbbr, categoryLabel, content }: CityPricingFaqProps) {
  const { priceRange, faqs } = content

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  }

  return (
    <div className="mt-10 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            Typical Cost of {categoryLabel} in {cityName}, {stateAbbr}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold text-foreground">
            ${priceRange.low.toLocaleString()}–${priceRange.high.toLocaleString()}{' '}
            <span className="text-base font-normal text-muted-foreground">{priceRange.unit}</span>
          </p>
          {priceRange.note && (
            <p className="text-sm text-muted-foreground mt-2">{priceRange.note}</p>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            Exact pricing varies by provider — request free quotes from local companies above to compare.
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-4">
          Frequently Asked Questions — {categoryLabel} in {cityName}, {stateAbbr}
        </h2>
        <div className="space-y-4">
          {faqs.map(faq => (
            <div key={faq.q}>
              <h3 className="font-medium text-foreground">{faq.q}</h3>
              <p className="text-sm text-muted-foreground mt-1">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
