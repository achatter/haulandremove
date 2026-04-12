import { HeroSectionBrightA } from '@/components/home/HeroSectionBrightA'
import { HeroSectionBrightB } from '@/components/home/HeroSectionBrightB'
import { HeroSectionBrightC } from '@/components/home/HeroSectionBrightC'
import { HeroSectionBrightD } from '@/components/home/HeroSectionBrightD'

function Label({ letter, title, description }: { letter: string; title: string; description: string }) {
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    A: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
    B: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
    C: { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' },
    D: { bg: '#fdf4ff', text: '#7e22ce', border: '#e9d5ff' },
  }
  const c = colorMap[letter]
  return (
    <div
      className="flex items-center gap-4 px-6 py-4"
      style={{ background: c.bg, borderBottom: `2px solid ${c.border}` }}
    >
      <div
        className="flex items-center justify-center w-10 h-10 rounded-full text-xl font-black"
        style={{ background: c.text, color: '#fff', flexShrink: 0 }}
      >
        {letter}
      </div>
      <div>
        <p className="font-bold text-sm" style={{ color: c.text }}>{title}</p>
        <p className="text-xs" style={{ color: '#64748b' }}>{description}</p>
      </div>
    </div>
  )
}

export default function PreviewPage() {
  return (
    <div>
      <div style={{ background: '#0f172a', color: '#94a3b8', padding: '12px 24px', fontSize: 13, textAlign: 'center' }}>
        Issue #24 — Bright Hero Section Variants &nbsp;·&nbsp; Reply with <strong style={{ color: '#f1f5f9' }}>A</strong>, <strong style={{ color: '#f1f5f9' }}>B</strong>, <strong style={{ color: '#f1f5f9' }}>C</strong>, or <strong style={{ color: '#f1f5f9' }}>D</strong> to apply as the live HeroSection
      </div>

      {/* Option A */}
      <div>
        <Label
          letter="A"
          title='Option A — "Bright Photo Cards"'
          description="Sky-to-mint gradient background · Photo cards with blue/emerald overlay · Colorful dot grid · Floating badge"
        />
        <HeroSectionBrightA />
      </div>

      {/* Option B */}
      <div>
        <Label
          letter="B"
          title='Option B — "Airy Panorama"'
          description="Full-width photo background with soft white overlay · Frosted-glass cards with photo peek strip · Crisp dark text"
        />
        <HeroSectionBrightB />
      </div>

      {/* Option C */}
      <div>
        <Label
          letter="C"
          title='Option C — "Pastel Split Scene"'
          description="Split photo bg: warm peach left · soft mint right · white center · Lightly frosted cards matching each side"
        />
        <HeroSectionBrightC />
      </div>

      {/* Option D */}
      <div>
        <Label
          letter="D"
          title='Option D — "Magazine Light"'
          description="Clean white/pearl background · Magazine-style cards (full photo top + info panel below) · Stats pill above heading"
        />
        <HeroSectionBrightD />
      </div>
    </div>
  )
}
