import { SearchBar } from '@/components/search/SearchBar'
import { Truck, Home, CheckCircle2, ShieldCheck, Star, ArrowRight } from 'lucide-react'

function JunkRemovalCard() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 60%, #2563eb 100%)',
        boxShadow: '0 20px 60px rgba(29,78,216,0.35)',
      }}
    >
      <div className="p-6 pb-5">
        <div className="flex items-start justify-between mb-4">
          <div
            className="p-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <Truck className="h-6 w-6 text-white" strokeWidth={2} />
          </div>
          <span
            className="text-[10px] font-bold uppercase tracking-widest text-blue-200 px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.12)' }}
          >
            Popular
          </span>
        </div>

        <h3 className="font-serif text-2xl font-bold text-white mb-1">Junk Removal</h3>
        <p className="text-blue-200/80 text-sm mb-4">Fast pickup for any size job</p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {['Same-Day', 'Free Estimates', 'All Items'].map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium text-white px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <p className="text-2xl font-extrabold text-white leading-none">500+</p>
            <p className="text-blue-200 text-xs mt-0.5">Verified Pros</p>
          </div>
          <div className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <div className="flex items-center gap-1">
              <p className="text-2xl font-extrabold text-white leading-none">4.8</p>
              <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
            </div>
            <p className="text-blue-200 text-xs mt-0.5">Avg. Rating</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-3 flex items-center justify-between" style={{ background: 'rgba(0,0,0,0.2)' }}>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-blue-200" />
          <span className="text-blue-100/70 text-xs">Licensed &amp; insured</span>
        </div>
        <ArrowRight className="h-4 w-4 text-blue-200" />
      </div>
    </div>
  )
}

function EstateCleanoutCard() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #059669 60%, #10b981 100%)',
        boxShadow: '0 20px 60px rgba(5,150,105,0.3)',
      }}
    >
      <div className="p-6 pb-5">
        <div className="flex items-start justify-between mb-4">
          <div
            className="p-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <Home className="h-6 w-6 text-white" strokeWidth={2} />
          </div>
          <span
            className="text-[10px] font-bold uppercase tracking-widest text-emerald-200 px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.12)' }}
          >
            Top Rated
          </span>
        </div>

        <h3 className="font-serif text-2xl font-bold text-white mb-1">Estate Cleanout</h3>
        <p className="text-emerald-200/80 text-sm mb-4">Compassionate, thorough service</p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {['Full Property', 'Downsizing', 'Fast'].map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium text-white px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <p className="text-2xl font-extrabold text-white leading-none">200+</p>
            <p className="text-emerald-200 text-xs mt-0.5">Markets Served</p>
          </div>
          <div className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <div className="flex items-center gap-1">
              <p className="text-2xl font-extrabold text-white leading-none">4.9</p>
              <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
            </div>
            <p className="text-emerald-200 text-xs mt-0.5">Avg. Rating</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-3 flex items-center justify-between" style={{ background: 'rgba(0,0,0,0.2)' }}>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-200" />
          <span className="text-emerald-100/70 text-xs">Bonded specialists</span>
        </div>
        <ArrowRight className="h-4 w-4 text-emerald-200" />
      </div>
    </div>
  )
}

export function HeroSectionV3() {
  return (
    <section
      className="relative py-20 border-b overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #f8faff 0%, #eef2ff 40%, #f0f9ff 100%)' }}
    >
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(#c7d2fe 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Light blue glow top-left */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #bfdbfe, transparent 70%)' }}
      />
      {/* Green glow bottom-right */}
      <div
        className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full opacity-25 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #bbf7d0, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 items-center">

          {/* Left: text + search */}
          <div>
            {/* Pill tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 px-3 py-1.5 rounded-full bg-blue-100">
                <Truck className="h-3.5 w-3.5" /> Junk Removal
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 px-3 py-1.5 rounded-full bg-emerald-100">
                <Home className="h-3.5 w-3.5" /> Estate Cleanout
              </span>
              <span className="text-xs font-semibold text-slate-500 px-3 py-1.5 rounded-full bg-slate-100">
                All 50 States
              </span>
            </div>

            <h1 className="font-serif text-5xl xl:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
              Find the Right<br />
              <span className="text-blue-600">Hauling Pro</span>
              <br />Near You
            </h1>

            <p className="mt-5 text-xl text-slate-500 max-w-lg">
              Search thousands of trusted junk removal and estate cleanout professionals nationwide. Free quotes, fast service.
            </p>

            {/* Trust indicators */}
            <div className="mt-6 flex items-center gap-4">
              <div className="flex -space-x-2">
                {['bg-blue-400', 'bg-emerald-400', 'bg-violet-400', 'bg-orange-400'].map((color, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full border-2 border-white ${color} flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                  ))}
                  <span className="text-sm font-bold text-slate-900 ml-1">4.8</span>
                </div>
                <p className="text-xs text-slate-500">from 10,000+ verified reviews</p>
              </div>
            </div>

            <div className="mt-8 max-w-xl">
              <SearchBar placeholder="Enter city, state, or zip code..." large />
            </div>
          </div>

          {/* Right: stacked cards */}
          <div className="hidden lg:flex flex-col gap-5">
            <JunkRemovalCard />
            <EstateCleanoutCard />
          </div>

        </div>
      </div>
    </section>
  )
}
