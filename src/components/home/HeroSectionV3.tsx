import { SearchBar } from '@/components/search/SearchBar'
import { Truck, Home, CheckCircle2, ShieldCheck, Star } from 'lucide-react'

function JunkRemovalCardV3() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        background: 'linear-gradient(150deg, #1e3a5f 0%, #1d4ed8 60%, #2563eb 100%)',
        borderRadius: 14,
        boxShadow: '0 12px 40px rgba(37,99,235,0.4)',
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)' }} />
      <div className="absolute -bottom-4 -right-8 opacity-[0.12] pointer-events-none">
        <Truck style={{ width: 160, height: 160, color: 'white', strokeWidth: 1 }} />
      </div>

      <div className="relative z-10 p-5 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5" style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 8 }}>
            <Truck className="h-6 w-6 text-white" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-blue-200 text-[10px] font-bold uppercase tracking-[0.15em]">Category</p>
            <h3 className="font-sans text-lg font-bold text-white leading-tight">Junk Removal</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {['Same-Day Pickup', 'Free Estimates', 'All Items Taken'].map((tag) => (
            <span key={tag} className="text-[11px] font-semibold text-white px-3 py-1" style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 999 }}>
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="p-2.5" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
            <p className="text-xl font-extrabold text-white leading-none">500+</p>
            <p className="text-blue-200 text-xs mt-0.5">Verified Pros</p>
          </div>
          <div className="p-2.5" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
            <div className="flex items-center gap-1">
              <p className="text-xl font-extrabold text-white leading-none">4.8</p>
              <Star className="h-3.5 w-3.5 text-yellow-300 fill-yellow-300" />
            </div>
            <p className="text-blue-200 text-xs mt-0.5">Avg. Rating</p>
          </div>
        </div>

        {/* Card footer bar */}
        <div
          className="flex items-center gap-2 -mx-5 -mb-0 px-5 py-2.5"
          style={{ background: 'rgba(0,0,0,0.25)' }}
        >
          <ShieldCheck className="h-4 w-4 text-blue-200 shrink-0" />
          <span className="text-blue-100/80 text-xs font-medium">Licensed &amp; insured professionals</span>
        </div>
      </div>
    </div>
  )
}

function EstateCleanoutCardV3() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        background: 'linear-gradient(150deg, #064e3b 0%, #059669 60%, #10b981 100%)',
        borderRadius: 14,
        boxShadow: '0 12px 40px rgba(16,185,129,0.35)',
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)' }} />
      <div className="absolute -bottom-4 -right-8 opacity-[0.12] pointer-events-none">
        <Home style={{ width: 160, height: 160, color: 'white', strokeWidth: 1 }} />
      </div>

      <div className="relative z-10 p-5 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5" style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 8 }}>
            <Home className="h-6 w-6 text-white" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-emerald-200 text-[10px] font-bold uppercase tracking-[0.15em]">Category</p>
            <h3 className="font-sans text-lg font-bold text-white leading-tight">Estate Cleanout</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {['Full Property', 'Downsizing', 'Fast Turnaround'].map((tag) => (
            <span key={tag} className="text-[11px] font-semibold text-white px-3 py-1" style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 999 }}>
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="p-2.5" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
            <p className="text-xl font-extrabold text-white leading-none">200+</p>
            <p className="text-emerald-200 text-xs mt-0.5">Markets Served</p>
          </div>
          <div className="p-2.5" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
            <div className="flex items-center gap-1">
              <p className="text-xl font-extrabold text-white leading-none">4.9</p>
              <Star className="h-3.5 w-3.5 text-yellow-300 fill-yellow-300" />
            </div>
            <p className="text-emerald-200 text-xs mt-0.5">Avg. Rating</p>
          </div>
        </div>

        {/* Card footer bar */}
        <div
          className="flex items-center gap-2 -mx-5 -mb-0 px-5 py-2.5"
          style={{ background: 'rgba(0,0,0,0.2)' }}
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-200 shrink-0" />
          <span className="text-emerald-100/80 text-xs font-medium">Compassionate, bonded specialists</span>
        </div>
      </div>
    </div>
  )
}

export function HeroSectionV3() {
  return (
    <section
      className="relative py-20 border-b overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #f8faff 0%, #eef2ff 50%, #f0f9ff 100%)' }}
    >
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: heading + search */}
          <div>
            {/* Pill category tags above heading */}
            <div className="flex gap-2 mb-5">
              <span className="text-xs font-semibold text-blue-700 px-3 py-1.5" style={{ background: '#dbeafe', borderRadius: 999 }}>Junk Removal</span>
              <span className="text-xs font-semibold text-emerald-700 px-3 py-1.5" style={{ background: '#d1fae5', borderRadius: 999 }}>Estate Cleanout</span>
              <span className="text-xs font-semibold text-slate-600 px-3 py-1.5" style={{ background: '#f1f5f9', borderRadius: 999 }}>Nationwide</span>
            </div>

            <h1 className="font-serif text-5xl xl:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
              Find the Right{' '}
              <span className="text-blue-600">Hauling Pro</span>{' '}
              Near You
            </h1>
            <p className="mt-4 text-xl text-slate-500">
              Search thousands of trusted junk removal and estate cleanout professionals nationwide.
            </p>

            {/* Social proof avatars */}
            <div className="flex items-center gap-3 mt-6 mb-8">
              <div className="flex -space-x-2">
                {['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'].map((color, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: color, border: '2px solid white' }}
                  >
                    {['JR', 'EC', 'MK', 'LT'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">50,000+ happy customers</p>
              </div>
            </div>

            <SearchBar placeholder="Enter city, state, or zip code..." large />
          </div>

          {/* Right: stacked cards */}
          <div className="hidden lg:flex flex-col gap-4">
            <JunkRemovalCardV3 />
            <EstateCleanoutCardV3 />
          </div>

        </div>
      </div>
    </section>
  )
}
