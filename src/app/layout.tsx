import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: {
    default: 'JunkRemovalSearch | Find Local Junk Removal & Estate Cleanout Services',
    template: '%s | JunkRemovalSearch',
  },
  description:
    'Find trusted junk removal and estate cleanout professionals nationwide. Search by city, state, or zip code.',

   // Canonical URL base
  metadataBase: new URL('https://junkremovalsearch.com'),

  // Open Graph — controls how your site looks when shared on Facebook, LinkedIn etc
  openGraph: {
    type: 'website',
    siteName: 'JunkRemovalSearch',
    title: 'JunkRemovalSearch | Find Local Junk Removal & Estate Cleanout Services',
    description: 'Find trusted junk removal and estate cleanout companies near you. Compare local providers across the US, read reviews, and get free quotes.',
    url: 'https://junkremovalsearch.com',
    images: [
      {
        url: '/og-image.png', // Create this image — more on this below
        width: 1200,
        height: 630,
        alt: 'JunkRemovalSearch - Find Local Junk Removal Services',
      },
    ],
  },

  // Twitter/X card
  twitter: {
    card: 'summary_large_image',
    title: 'JunkRemovalSearch | Find Local Junk Removal & Estate Cleanout Services',
    description: 'Find trusted junk removal and estate cleanout companies near you.',
    images: ['/og-image.png'],
  },

  // Robots — tells Google to index everything by default
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
