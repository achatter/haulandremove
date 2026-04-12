import { SearchBar } from '@/components/search/SearchBar'
import { Truck, Home, ShieldCheck, CheckCircle2, Star } from 'lucide-react'

// Option C — "Bold Split Scene"
// The hero background is split into two distinct photographic zones —
// left half shows a junk removal scene (warm amber/orange tint),
// right half shows an estate cleanout scene (cool teal/blue tint).
// The center panel is a clean dark overlay with white text and the search bar.
// Cards are positioned within their respective photo zones and float on top.
// Swap photo URLs for real licensed images.

const JUNK_PHOTO = 'https://picsum.photos/seed/junkremoval/800/600'
const ESTATE_PHOTO = 'https://picsum.photos/seed/estatecleanout/800/600'

function JunkRemovalCard() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: 360,
        borderRadius: 10,
        background: 'rgba(0,0,0,0.25)',
        border: '1px solid rgba(251,146,60,0.35)',
        boxShadow: '0 4px 24px rgba(251,146,60,0.20)',
      }}
    >
      {/* Warm amber top glow */}
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(251,146,60,0.9), transparent)' }} />

      <div className="relative z-10 p-6 flex flex-col h-full">
        {/* Category header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5" style={{ background: 'rgba(251,146,60,0.22)', borderRadius: 8, border: '1px solid rgba(251,146,60,0.40)' }}>
            <Truck className="h-7 w-7 text-orange-300" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-orange-400 text-[10px] font-bold uppercase tracking-[0.18em]">Category</p>
            <h3 className="font-serif text-xl font-bold text-white leading-tight">Junk Removal</h3>
          </div>
        </div>

        {/* Feature tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {['Same-Day Pickup', 'Free Estimates', 'All Items Taken'].map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-semibold text-orange-200 px-2.5 py-1"
              style={{ background: 'rgba(251,146,60,0.18)', border: '1px solid rgba(251,146,60,0.30)', borderRadius: 4 }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2.5 mb-auto">
          <div className="p-3" style={{ background: 'rgba(0,0,0,0.40)', borderRadius: 6 }}>
            <p className="text-2xl font-extrabold text-white leading-none">500+</p>
            <p className="text-orange-300 text-xs mt-0.5">Verified Pros</p>
          </div>
          <div className="p-3" style={{ background: 'rgba(0,0,0,0.40)', borderRadius: 6 }}>
            <div className="flex items-center gap-1">
              <p className="text-2xl font-extrabold text-white leading-none">4.8</p>
              <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
            </div>
            <p className="text-orange-300 text-xs mt-0.5">Avg. Rating</p>
          </div>
        </div>

        {/* Trust footer */}
        <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <ShieldCheck className="h-4 w-4 text-orange-300 shrink-0" />
          <span className="text-orange-100/70 text-xs font-medium">Licensed &amp; insured professionals</span>
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
        borderRadius: 10,
        background: 'rgba(0,0,0,0.25)',
        border: '1px solid rgba(20,184,166,0.35)',
        boxShadow: '0 4px 24px rgba(20,184,166,0.20)',
      }}
    >
      {/* Teal top glow */}
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(20,184,166,0.9), transparent)' }} />

      <div className="relative z-10 p-6 flex flex-col h-full">
        {/* Category header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5" style={{ background: 'rgba(20,184,166,0.22)', borderRadius: 8, border: '1px solid rgba(20,184,166,0.40)' }}>
            <Home className="h-7 w-7 text-teal-300" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-teal-400 text-[10px] font-bold uppercase tracking-[0.18em]">Category</p>
            <h3 className="font-serif text-xl font-bold text-white leading-tight">Estate Cleanout</h3>
          </div>
        </div>

        {/* Feature tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {['Full Property', 'Downsizing', 'Fast Turnaround'].map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-semibold text-teal-200 px-2.5 py-1"
              style={{ background: 'rgba(20,184,166,0.18)', border: '1px solid rgba(20,184,166,0.30)', borderRadius: 4 }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2.5 mb-auto">
          <div className="p-3" style={{ background: 'rgba(0,0,0,0.40)', borderRadius: 6 }}>
            <p className="text-2xl font-extrabold text-white leading-none">200+</p>
            <p className="text-teal-300 text-xs mt-0.5">Markets Served</p>
          </div>
          <div className="p-3" style={{ background: 'rgba(0,0,0,0.40)', borderRadius: 6 }}>
            <div className="flex items-center gap-1">
              <p className="text-2xl font-extrabold text-white leading-none">4.9</p>
              <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
            </div>
            <p className="text-teal-300 text-xs mt-0.5">Avg. Rating</p>
          </div>
        </div>

        {/* Trust footer */}
        <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <CheckCircle2 className="h-4 w-4 text-teal-300 shrink-0" />
          <span className="text-teal-100/70 text-xs font-medium">Compassionate, bonded specialists</span>
        </div>
      </div>
    </div>
  )
}

export function HeroSectionC() {
  return (
    <section className="relative border-b overflow-hidden" style={{ minHeight: 480 }}>
      {/* Split photo backgrounds — absolutely positioned left and right halves */}
      {/* Left half: Junk removal photo with warm amber tint */}
      <div
        className="absolute top-0 left-0 bottom-0"
        style={{
          width: '38%',
          backgroundImage: `url(${JUNK_PHOTO})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(120,53,15,0.85) 0%, rgba(154,52,18,0.80) 60%, rgba(180,80,30,0.70) 100%)' }} />
      </div>

      {/* Right half: Estate cleanout photo with cool teal tint */}
      <div
        className="absolute top-0 right-0 bottom-0"
        style={{
          width: '38%',
          backgroundImage: `url(${ESTATE_PHOTO})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to left, rgba(19,78,74,0.85) 0%, rgba(15,118,110,0.80) 60%, rgba(20,150,130,0.70) 100%)' }} />
      </div>

      {/* Center dark panel — narrows to a dark wedge behind the text */}
      <div
        className="absolute top-0 bottom-0"
        style={{
          left: '28%',
          right: '28%',
          background: 'linear-gradient(to bottom, rgba(2,6,23,0.97) 0%, rgba(2,6,23,0.95) 100%)',
        }}
      />

      {/* Soft feather edges blending zones */}
      <div
        className="absolute top-0 bottom-0"
        style={{
          left: '25%',
          width: '10%',
          background: 'linear-gradient(to right, transparent, rgba(2,6,23,0.97))',
        }}
      />
      <div
        className="absolute top-0 bottom-0"
        style={{
          right: '25%',
          width: '10%',
          background: 'linear-gradient(to left, transparent, rgba(2,6,23,0.97))',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] gap-10 items-center">

          {/* Left: Junk Removal */}
          <div className="hidden lg:block">
            <JunkRemovalCard />
          </div>

          {/* Center */}
          <div className="text-center">
            <h1 className="font-serif text-5xl xl:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
              Search for Hauling Services
            </h1>
            <p className="mt-4 text-xl text-slate-300/80">
              Search thousands of trusted junk removal and estate cleanout professionals nationwide.
            </p>
            <div className="mt-8 max-w-2xl mx-auto">
              <SearchBar placeholder="Enter city, state, or zip code..." large />
            </div>
            <div className="mt-5 flex items-center justify-center gap-3 text-sm">
              <span className="px-3 py-1 rounded-full text-orange-300 text-xs font-semibold" style={{ background: 'rgba(251,146,60,0.15)', border: '1px solid rgba(251,146,60,0.30)' }}>
                Junk Removal
              </span>
              <span className="text-slate-500">·</span>
              <span className="px-3 py-1 rounded-full text-teal-300 text-xs font-semibold" style={{ background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.30)' }}>
                Estate Cleanout
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400 text-xs">Nationwide Coverage</span>
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
