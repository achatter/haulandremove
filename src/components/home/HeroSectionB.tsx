import { SearchBar } from '@/components/search/SearchBar'
import { Truck, Home, ShieldCheck, CheckCircle2, Star } from 'lucide-react'

// Option B — "Cinematic Panorama"
// A full-width photographic backdrop covers the entire hero section.
// Cards use a glassmorphism (frosted-glass) effect — backdrop-blur with translucent panels.
// The panoramic photo adds depth and realism while dark gradients keep text legible.
// Swap the hero photo URL below for a licensed wide-format hauling/outdoor scene.

const HERO_PHOTO = 'https://picsum.photos/seed/hauling-hero/1600/600'
const JUNK_PHOTO = 'https://picsum.photos/seed/junkremoval/600/800'
const ESTATE_PHOTO = 'https://picsum.photos/seed/estatecleanout/600/800'

function JunkRemovalCard() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: 360,
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.18)',
        background: 'rgba(2,8,23,0.45)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
      }}
    >
      {/* Inner photo strip at top — partial glimpse of the theme photo */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: 100,
          backgroundImage: `url(${JUNK_PHOTO})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          opacity: 0.35,
        }}
      />
      {/* Fade photo into glass body */}
      <div className="absolute top-0 left-0 right-0" style={{ height: 120, background: 'linear-gradient(to bottom, transparent, rgba(2,8,23,0.9))' }} />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.8), transparent)' }} />

      <div className="relative z-10 p-6 flex flex-col h-full pt-14">
        {/* Category header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5" style={{ background: 'rgba(14,165,233,0.25)', borderRadius: 8, border: '1px solid rgba(56,189,248,0.35)' }}>
            <Truck className="h-7 w-7 text-sky-300" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-sky-400 text-[10px] font-bold uppercase tracking-[0.18em]">Category</p>
            <h3 className="font-serif text-xl font-bold text-white leading-tight">Junk Removal</h3>
          </div>
        </div>

        {/* Feature tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {['Same-Day Pickup', 'Free Estimates', 'All Items Taken'].map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-semibold text-sky-200 px-2.5 py-1"
              style={{ background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.25)', borderRadius: 20 }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2.5 mb-auto">
          <div className="p-3" style={{ background: 'rgba(0,0,0,0.30)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-2xl font-extrabold text-white leading-none">500+</p>
            <p className="text-sky-300 text-xs mt-0.5">Verified Pros</p>
          </div>
          <div className="p-3" style={{ background: 'rgba(0,0,0,0.30)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-1">
              <p className="text-2xl font-extrabold text-white leading-none">4.8</p>
              <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
            </div>
            <p className="text-sky-300 text-xs mt-0.5">Avg. Rating</p>
          </div>
        </div>

        {/* Trust footer */}
        <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }}>
          <ShieldCheck className="h-4 w-4 text-sky-400 shrink-0" />
          <span className="text-sky-200/70 text-xs font-medium">Licensed &amp; insured professionals</span>
        </div>
      </div>
    </div>
  )
}

function EstateCleanoutCard() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: 360,
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.18)',
        background: 'rgba(10,4,30,0.45)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
      }}
    >
      {/* Inner photo strip at top */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: 100,
          backgroundImage: `url(${ESTATE_PHOTO})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          opacity: 0.35,
        }}
      />
      <div className="absolute top-0 left-0 right-0" style={{ height: 120, background: 'linear-gradient(to bottom, transparent, rgba(10,4,30,0.9))' }} />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.8), transparent)' }} />

      <div className="relative z-10 p-6 flex flex-col h-full pt-14">
        {/* Category header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5" style={{ background: 'rgba(124,58,237,0.25)', borderRadius: 8, border: '1px solid rgba(167,139,250,0.35)' }}>
            <Home className="h-7 w-7 text-violet-300" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-violet-400 text-[10px] font-bold uppercase tracking-[0.18em]">Category</p>
            <h3 className="font-serif text-xl font-bold text-white leading-tight">Estate Cleanout</h3>
          </div>
        </div>

        {/* Feature tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {['Full Property', 'Downsizing', 'Fast Turnaround'].map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-semibold text-violet-200 px-2.5 py-1"
              style={{ background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.25)', borderRadius: 20 }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2.5 mb-auto">
          <div className="p-3" style={{ background: 'rgba(0,0,0,0.30)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-2xl font-extrabold text-white leading-none">200+</p>
            <p className="text-violet-300 text-xs mt-0.5">Markets Served</p>
          </div>
          <div className="p-3" style={{ background: 'rgba(0,0,0,0.30)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-1">
              <p className="text-2xl font-extrabold text-white leading-none">4.9</p>
              <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
            </div>
            <p className="text-violet-300 text-xs mt-0.5">Avg. Rating</p>
          </div>
        </div>

        {/* Trust footer */}
        <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }}>
          <CheckCircle2 className="h-4 w-4 text-violet-400 shrink-0" />
          <span className="text-violet-200/70 text-xs font-medium">Compassionate, bonded specialists</span>
        </div>
      </div>
    </div>
  )
}

export function HeroSectionB() {
  return (
    <section
      className="relative py-20 border-b overflow-hidden"
      style={{
        backgroundImage: `url(${HERO_PHOTO})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark cinematic overlay over the panoramic photo */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, rgba(2,6,23,0.88) 0%, rgba(7,14,40,0.82) 40%, rgba(12,8,36,0.88) 100%)' }}
      />

      {/* Vignette edges */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)' }} />

      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] gap-10 items-center">

          {/* Left: Junk Removal */}
          <div className="hidden lg:block">
            <JunkRemovalCard />
          </div>

          {/* Center */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-sky-300 mb-5"
              style={{ background: 'rgba(14,165,233,0.15)', border: '1px solid rgba(56,189,248,0.30)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 inline-block" />
              America&apos;s #1 Hauling &amp; Removal Directory
            </div>
            <h1 className="font-serif text-5xl xl:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
              Search for Hauling Services
            </h1>
            <p className="mt-4 text-xl text-blue-100/70">
              Search thousands of trusted junk removal and estate cleanout professionals nationwide.
            </p>
            <div className="mt-8 max-w-2xl mx-auto">
              <SearchBar placeholder="Enter city, state, or zip code..." large />
            </div>
            <div className="mt-4 flex items-center justify-center gap-6 text-sm text-blue-200/55">
              <span>Junk Removal</span>
              <span className="opacity-40">·</span>
              <span>Estate Cleanout</span>
              <span className="opacity-40">·</span>
              <span>Nationwide Coverage</span>
            </div>
          </div>

          {/* Right: Estate Cleanout */}
          <div className="hidden lg:block">
            <EstateCleanoutCard />
          </div>

        </div>
      </div>
    </section>
  )
}
