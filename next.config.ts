import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Allow all HTTPS image sources — needed for scraped business photos
        // from arbitrary CDNs (Google, GoDaddy, Wix, Squarespace, etc.)
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default nextConfig
