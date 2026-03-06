import Link from 'next/link'
import { Truck } from 'lucide-react'
import { Container } from './Container'

export function Footer() {
  return (
    <footer className="border-t bg-white mt-16">
      <Container className="py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <Truck className="h-5 w-5 text-primary" />
              <span>Hauling Services Directory</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
              Nationwide directory for hauling &amp; removal services.
            </p>
          </div>

          <nav className="flex flex-col md:flex-row gap-4 text-sm text-muted-foreground">
            <Link href="/categories/junk-removal" className="hover:text-foreground transition-colors">
              Junk Removal
            </Link>
            <Link href="/categories/estate-cleanout" className="hover:text-foreground transition-colors">
              Estate Cleanout
            </Link>
            <Link href="/search" className="hover:text-foreground transition-colors">
              Browse All
            </Link>
          </nav>
        </div>

        <p className="text-xs text-muted-foreground mt-8">
          &copy; {new Date().getFullYear()} Hauling Services Directory. All rights reserved.
        </p>
      </Container>
    </footer>
  )
}
