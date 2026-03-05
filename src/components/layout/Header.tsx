'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PackageOpen } from 'lucide-react'
import { Container } from './Container'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/categories/junk-removal', label: 'Junk Removal' },
  { href: '/categories/estate-cleanout', label: 'Estate Cleanout' },
  { href: '/search', label: 'Browse All' },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <Container>
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-foreground">
            <PackageOpen className="h-6 w-6 text-primary" />
            <span>Hauling Services</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </header>
  )
}
