import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <Container className="py-20 text-center">
      <h2 className="text-3xl font-bold mb-2">Business Not Found</h2>
      <p className="text-muted-foreground mb-6">
        This listing may have been removed or the URL is incorrect.
      </p>
      <Button asChild>
        <Link href="/search">Browse All Services</Link>
      </Button>
    </Container>
  )
}
