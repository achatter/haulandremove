import type { SocialMedia } from '@/types'

interface SocialLinksProps {
  social: SocialMedia
}

const SOCIAL_PLATFORMS = [
  { key: 'facebook',  label: 'Facebook' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'linkedin',  label: 'LinkedIn' },
  { key: 'youtube',   label: 'YouTube' },
] as const

export function SocialLinks({ social }: SocialLinksProps) {
  const links = SOCIAL_PLATFORMS
    .map(p => ({ label: p.label as string, url: social[p.key] as string | null | undefined }))
    .filter((l): l is { label: string; url: string } => Boolean(l.url))

  if (links.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {links.map(link => (
        <a
          key={link.label}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-muted-foreground hover:text-foreground border rounded-full px-3 py-1 transition-colors"
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}
