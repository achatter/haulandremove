import { SearchBar } from '@/components/search/SearchBar'
import { Truck, Home, ShieldCheck, CheckCircle2, Star } from 'lucide-react'

// Option A — "Photo Cards on Dark Navy"
// Same 3-column layout as the reference screenshot.
// Cards have photographic backgrounds with strong color overlays.
// Swap the picsum URLs below for your own branded photos.

const JUNK_PHOTO = 'https://picsum.photos/seed/junkremoval/600/800'
const ESTATE_PHOTO = 'https://picsum.photos/seed/estatecleanout/600/800'

function JunkRemovalCard() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: 360, borderRadius: 8, backgroundImage: `url(${JUNK_PHOTO})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Deep blue photo overlay — keeps card readable while showing photo texture */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(2,52,89,0.92) 0%, rgba(3,105,161,0.82) 50%, rgba(14,165,233,0.70) 100%)' }} />

      {/* Top shimmer */}
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.9), transparent)' }} />

      <div className="relative z-10 p-6 flex flex-col h-full">
        {/* Category header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5" style={{ background: 'rgba(255,255,255,0.20)', borderRadius: 8, backdropFilter: 'blur(4px)' }}>
            <Truck className="h-7 w-7 text-white" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-sky-300 text-[10px] font-bold uppercase tracking-[0.18em]">Category</p>
            <h3 className="font-serif text-xl font-bold text-white leading-tight">Junk Removal</h3>
          </div>
        </div>

        {/* Feature tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {['Same-Day Pickup', 'Free Estimates', 'All Items Taken'].map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-semibold text-white px-2.5 py-1"
              style={{ background: 'rgba(56,189,248,0.25)', border: '1px solid rgba(56,189,248,0.40)', borderRadius: 4, backdropFilter: 'blur(4px)' }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2.5 mb-auto">
          <div className="p-3" style={{ background: 'rgba(0,0,0,0.35)', borderRadius: 6, backdropFilter: 'blur(8px)' }}>
            <p className="text-2xl font-extrabold text-white leading-none">500+</p>
            <p className="text-sky-200 text-xs mt-0.5">Verified Pros</p>
          </div>
          <div className="p-3" style={{ background: 'rgba(0,0,0,0.35)', borderRadius: 6, backdropFilter: 'blur(8px)' }}>
            <div className="flex items-center gap-1">
              <p className="text-2xl font-extrabold text-white leading-none">4.8</p>
              <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
            </div>
            <p className="text-sky-200 text-xs mt-0.5">Avg. Rating</p>
          </div>
        </div>

        {/* Trust footer */}
        <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.20)' }}>
          <ShieldCheck className="h-4 w-4 text-sky-300 shrink-0" />
          <span className="text-sky-100/80 text-xs font-medium">Licensed &amp; insured professionals</span>
        </div>
      </div>
    </div>
  )
}

function EstateCleanoutCard() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: 360, borderRadius: 8, backgroundImage: `url(${ESTATE_PHOTO})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Deep violet photo overlay */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(46,16,101,0.92) 0%, rgba(91,33,182,0.82) 50%, rgba(124,58,237,0.70) 100%)' }} />

      {/* Top shimmer */}
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.9), transparent)' }} />

      <div className="relative z-10 p-6 flex flex-col h-full">
        {/* Category header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5" style={{ background: 'rgba(255,255,255,0.20)', borderRadius: 8, backdropFilter: 'blur(4px)' }}>
            <Home className="h-7 w-7 text-white" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-violet-300 text-[10px] font-bold uppercase tracking-[0.18em]">Category</p>
            <h3 className="font-serif text-xl font-bold text-white leading-tight">Estate Cleanout</h3>
          </div>
        </div>

        {/* Feature tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {['Full Property', 'Downsizing', 'Fast Turnaround'].map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-semibold text-white px-2.5 py-1"
              style={{ background: 'rgba(167,139,250,0.25)', border: '1px solid rgba(167,139,250,0.40)', borderRadius: 4, backdropFilter: 'blur(4px)' }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2.5 mb-auto">
          <div className="p-3" style={{ background: 'rgba(0,0,0,0.35)', borderRadius: 6, backdropFilter: 'blur(8px)' }}>
            <p className="text-2xl font-extrabold text-white leading-none">200+</p>
            <p className="text-violet-200 text-xs mt-0.5">Markets Served</p>
          </div>
          <div className="p-3" style={{ background: 'rgba(0,0,0,0.35)', borderRadius: 6, backdropFilter: 'blur(8px)' }}>
            <div className="flex items-center gap-1">
              <p className="text-2xl font-extrabold text-white leading-none">4.9</p>
              <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
            </div>
            <p className="text-violet-200 text-xs mt-0.5">Avg. Rating</p>
          </div>
        </div>

        {/* Trust footer */}
        <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.20)' }}>
          <CheckCircle2 className="h-4 w-4 text-violet-300 shrink-0" />
          <span className="text-violet-100/80 text-xs font-medium">Compassionate, bonded specialists</span>
        </div>
      </div>
    </div>
  )
}

export function HeroSectionA() {
  return (
    <section
      className="relative py-20 border-b overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #020817 0%, #0a1628 40%, #0f172a 70%, #080f1e 100%)' }}
    >
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Glow blobs */}
      <div className="absolute top-[-60px] left-[-60px] w-[480px] h-[480px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #0ea5e9, transparent 70%)' }} />
      <div className="absolute bottom-[-80px] right-[-60px] w-[560px] h-[560px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
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
            <p className="mt-4 text-xl text-blue-100/70">
              Search thousands of trusted junk removal and estate cleanout professionals nationwide.
            </p>
            <div className="mt-8 max-w-2xl mx-auto">
              <SearchBar placeholder="Enter city, state, or zip code..." large />
            </div>
            <div className="mt-4 flex items-center justify-center gap-6 text-sm text-blue-200/60">
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
