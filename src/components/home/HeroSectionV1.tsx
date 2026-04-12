import { SearchBar } from '@/components/search/SearchBar'
import { Truck, Home, CheckCircle2, ShieldCheck, Star, Award } from 'lucide-react'

function JunkRemovalCardV1() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        background: 'linear-gradient(150deg, #9a3412 0%, #c2410c 50%, #ea580c 100%)',
        height: 340,
        borderRadius: 12,
        boxShadow: '0 8px 40px rgba(234,88,12,0.35)',
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)' }} />
      <div className="absolute -bottom-4 -right-8 opacity-[0.12] pointer-events-none">
        <Truck style={{ width: 180, height: 180, color: 'white', strokeWidth: 1 }} />
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(-55deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 22px)' }} />

      <div className="relative z-10 p-6 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5" style={{ background: 'rgba(255,255,255,0.22)', borderRadius: 8 }}>
            <Truck className="h-7 w-7 text-white" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-orange-200 text-[10px] font-bold uppercase tracking-[0.15em]">Category</p>
            <h3 className="font-serif text-xl font-bold text-white leading-tight">Junk Removal</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {['Same-Day Pickup', 'Free Estimates', 'All Items Taken'].map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-semibold text-white px-3 py-1"
              style={{ background: 'rgba(255,255,255,0.18)', borderRadius: 999 }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-auto">
          <div className="p-3" style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 8 }}>
            <p className="text-2xl font-extrabold text-white leading-none">500+</p>
            <p className="text-orange-200 text-xs mt-0.5">Verified Pros</p>
          </div>
          <div className="p-3" style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 8 }}>
            <div className="flex items-center gap-1">
              <p className="text-2xl font-extrabold text-white leading-none">4.8</p>
              <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
            </div>
            <p className="text-orange-200 text-xs mt-0.5">Avg. Rating</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <ShieldCheck className="h-4 w-4 text-orange-200 shrink-0" />
          <span className="text-orange-100/80 text-xs font-medium">Licensed &amp; insured professionals</span>
        </div>
      </div>
    </div>
  )
}

function EstateCleanoutCardV1() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        background: 'linear-gradient(150deg, #14532d 0%, #15803d 50%, #16a34a 100%)',
        height: 340,
        borderRadius: 12,
        boxShadow: '0 8px 40px rgba(22,163,74,0.3)',
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)' }} />
      <div className="absolute -bottom-4 -right-8 opacity-[0.12] pointer-events-none">
        <Home style={{ width: 180, height: 180, color: 'white', strokeWidth: 1 }} />
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(-55deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 22px)' }} />

      <div className="relative z-10 p-6 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5" style={{ background: 'rgba(255,255,255,0.22)', borderRadius: 8 }}>
            <Home className="h-7 w-7 text-white" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-green-200 text-[10px] font-bold uppercase tracking-[0.15em]">Category</p>
            <h3 className="font-serif text-xl font-bold text-white leading-tight">Estate Cleanout</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {['Full Property', 'Downsizing', 'Fast Turnaround'].map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-semibold text-white px-3 py-1"
              style={{ background: 'rgba(255,255,255,0.18)', borderRadius: 999 }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-auto">
          <div className="p-3" style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 8 }}>
            <p className="text-2xl font-extrabold text-white leading-none">200+</p>
            <p className="text-green-200 text-xs mt-0.5">Markets Served</p>
          </div>
          <div className="p-3" style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 8 }}>
            <div className="flex items-center gap-1">
              <p className="text-2xl font-extrabold text-white leading-none">4.9</p>
              <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
            </div>
            <p className="text-green-200 text-xs mt-0.5">Avg. Rating</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <CheckCircle2 className="h-4 w-4 text-green-200 shrink-0" />
          <span className="text-green-100/80 text-xs font-medium">Compassionate, bonded specialists</span>
        </div>
      </div>
    </div>
  )
}

export function HeroSectionV1() {
  return (
    <section className="relative py-20 border-b overflow-hidden" style={{ background: 'linear-gradient(135deg, #0c0a06 0%, #1c1008 40%, #1a0e06 70%, #0c0a06 100%)' }}>
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:40px_40px]" />
      {/* Warm amber glow blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-[500px] h-[500px] rounded-full opacity-25" style={{ background: 'radial-gradient(circle, #ea580c, transparent 70%)' }} />
      <div className="absolute bottom-[-100px] right-[-80px] w-[600px] h-[600px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #fbbf24, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-10 items-center">

          {/* Left: Junk Removal */}
          <div className="hidden lg:block">
            <JunkRemovalCardV1 />
          </div>

          {/* Center: text + search */}
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5" style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: 999 }}>
              <Award className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-amber-300 text-xs font-semibold tracking-wide">America&apos;s #1 Hauling Directory</span>
            </div>

            <h1 className="font-serif text-5xl xl:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
              Search for{' '}
              <span style={{ background: 'linear-gradient(90deg, #fb923c, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Hauling Services
              </span>
            </h1>
            <p className="mt-4 text-xl text-amber-100/70">
              Search thousands of trusted junk removal and estate cleanout professionals nationwide.
            </p>
            <div className="mt-8 max-w-2xl mx-auto">
              <SearchBar placeholder="Enter city, state, or zip code..." large />
            </div>

            {/* Stats strip */}
            <div className="mt-5 flex items-center justify-center gap-6 text-sm">
              <span className="text-amber-200/80 font-semibold">10,000+ Jobs</span>
              <span className="text-amber-500/50">·</span>
              <span className="flex items-center gap-1 text-amber-200/80 font-semibold">4.8 <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" /></span>
              <span className="text-amber-500/50">·</span>
              <span className="text-amber-200/80 font-semibold">All 50 States</span>
            </div>
          </div>

          {/* Right: Estate Cleanout */}
          <div className="hidden lg:block">
            <EstateCleanoutCardV1 />
          </div>

        </div>
      </div>
    </section>
  )
}
