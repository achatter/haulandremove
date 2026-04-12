import { SearchBar } from '@/components/search/SearchBar'
import { Truck, Home, ShieldCheck, CheckCircle2, Star, ArrowRight } from 'lucide-react'

// Option D — "Modern Photo Cards"
// Cards are redesigned with a prominent photo area at the top (60% of card height)
// and a clean dark info panel below. This gives a magazine / modern-app feel.
// The hero background stays minimal (very dark) so the photo cards pop.
// Swap photo URLs for real licensed hauling and estate images.

const JUNK_PHOTO = 'https://picsum.photos/seed/junkremoval/600/400'
const ESTATE_PHOTO = 'https://picsum.photos/seed/estatecleanout/600/400'

function JunkRemovalCard() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
        background: '#0d1117',
      }}
    >
      {/* Photo area — top 55% of card */}
      <div
        className="relative overflow-hidden"
        style={{ height: 180, backgroundImage: `url(${JUNK_PHOTO})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* Gradient fade into dark panel below */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.10) 0%, rgba(13,17,23,0.70) 80%, #0d1117 100%)' }} />

        {/* Category badge overlaid on photo */}
        <div className="absolute top-4 left-4">
          <span
            className="text-[10px] font-bold uppercase tracking-[0.15em] text-white px-2.5 py-1"
            style={{ background: 'rgba(14,165,233,0.80)', borderRadius: 4, backdropFilter: 'blur(4px)' }}
          >
            Junk Removal
          </span>
        </div>

        {/* Rating badge overlaid on photo */}
        <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1" style={{ background: 'rgba(0,0,0,0.60)', borderRadius: 4, backdropFilter: 'blur(4px)' }}>
          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-bold text-white">4.8</span>
        </div>
      </div>

      {/* Info panel */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2" style={{ background: 'rgba(14,165,233,0.18)', borderRadius: 6 }}>
              <Truck className="h-5 w-5 text-sky-400" strokeWidth={1.8} />
            </div>
            <div>
              <h3 className="font-bold text-white text-base leading-tight">Junk Removal</h3>
              <p className="text-sky-400 text-[11px] mt-0.5">500+ Verified Pros</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-500 mt-1 shrink-0" />
        </div>

        {/* Feature tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {['Same-Day Pickup', 'Free Estimates', 'All Items Taken'].map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium text-sky-300 px-2 py-0.5"
              style={{ background: 'rgba(14,165,233,0.10)', border: '1px solid rgba(14,165,233,0.20)', borderRadius: 4 }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Trust line */}
        <div className="flex items-center gap-1.5 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <ShieldCheck className="h-3.5 w-3.5 text-sky-500 shrink-0" />
          <span className="text-slate-400 text-[11px]">Licensed &amp; insured professionals</span>
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
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
        background: '#0d1117',
      }}
    >
      {/* Photo area */}
      <div
        className="relative overflow-hidden"
        style={{ height: 180, backgroundImage: `url(${ESTATE_PHOTO})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* Gradient fade */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.10) 0%, rgba(13,17,23,0.70) 80%, #0d1117 100%)' }} />

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span
            className="text-[10px] font-bold uppercase tracking-[0.15em] text-white px-2.5 py-1"
            style={{ background: 'rgba(124,58,237,0.80)', borderRadius: 4, backdropFilter: 'blur(4px)' }}
          >
            Estate Cleanout
          </span>
        </div>

        {/* Rating badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1" style={{ background: 'rgba(0,0,0,0.60)', borderRadius: 4, backdropFilter: 'blur(4px)' }}>
          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-bold text-white">4.9</span>
        </div>
      </div>

      {/* Info panel */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2" style={{ background: 'rgba(124,58,237,0.18)', borderRadius: 6 }}>
              <Home className="h-5 w-5 text-violet-400" strokeWidth={1.8} />
            </div>
            <div>
              <h3 className="font-bold text-white text-base leading-tight">Estate Cleanout</h3>
              <p className="text-violet-400 text-[11px] mt-0.5">200+ Markets Served</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-500 mt-1 shrink-0" />
        </div>

        {/* Feature tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {['Full Property', 'Downsizing', 'Fast Turnaround'].map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium text-violet-300 px-2 py-0.5"
              style={{ background: 'rgba(124,58,237,0.10)', border: '1px solid rgba(124,58,237,0.20)', borderRadius: 4 }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Trust line */}
        <div className="flex items-center gap-1.5 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <CheckCircle2 className="h-3.5 w-3.5 text-violet-500 shrink-0" />
          <span className="text-slate-400 text-[11px]">Compassionate, bonded specialists</span>
        </div>
      </div>
    </div>
  )
}

export function HeroSectionD() {
  return (
    <section
      className="relative py-20 border-b overflow-hidden"
      style={{ background: '#060a12' }}
    >
      {/* Very subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
          backgroundSize: '150px 150px',
        }}
      />

      {/* Subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-10" style={{ background: 'radial-gradient(ellipse, #3b82f6, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[290px_1fr_290px] gap-12 items-center">

          {/* Left: Junk Removal */}
          <div className="hidden lg:block">
            <JunkRemovalCard />
          </div>

          {/* Center */}
          <div className="text-center">
            {/* Stats strip above heading */}
            <div className="flex items-center justify-center gap-5 mb-7">
              <div className="text-center">
                <p className="text-2xl font-extrabold text-white leading-none">10K+</p>
                <p className="text-slate-400 text-[11px] mt-0.5">Jobs Listed</p>
              </div>
              <div className="w-px h-8 bg-slate-700" />
              <div className="text-center">
                <p className="text-2xl font-extrabold text-white leading-none">All 50</p>
                <p className="text-slate-400 text-[11px] mt-0.5">States</p>
              </div>
              <div className="w-px h-8 bg-slate-700" />
              <div className="flex items-center gap-1 text-center">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <div>
                  <p className="text-2xl font-extrabold text-white leading-none">4.8</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Avg. Rating</p>
                </div>
              </div>
            </div>

            <h1 className="font-serif text-5xl xl:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
              Search for Hauling Services
            </h1>
            <p className="mt-4 text-xl text-slate-400">
              Search thousands of trusted junk removal and estate cleanout professionals nationwide.
            </p>
            <div className="mt-8 max-w-2xl mx-auto">
              <SearchBar placeholder="Enter city, state, or zip code..." large />
            </div>
            <div className="mt-4 flex items-center justify-center gap-6 text-sm text-slate-500">
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
