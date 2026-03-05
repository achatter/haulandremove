import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="text-primary font-semibold text-sm mb-3">404</p>
      <h1 className="text-4xl font-bold tracking-tight mb-3">Page not found</h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        We couldn&apos;t find the page you were looking for. It may have been moved or deleted.
      </p>
      <div className="flex gap-3 justify-center">
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/search">Browse Listings</Link>
        </Button>
      </div>
    </Container>
  )
}
