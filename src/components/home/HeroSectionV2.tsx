import { SearchBar } from '@/components/search/SearchBar'
import { Truck, Home, CheckCircle2, ShieldCheck, Star, Users } from 'lucide-react'

function JunkRemovalCardV2() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: 340,
        borderRadius: 16,
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 8px 40px rgba(59,130,246,0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(96,165,250,0.8), transparent)' }} />

      <div className="relative z-10 p-6 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-5">
          <div
            className="p-2.5"
            style={{
              background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
              borderRadius: 10,
              boxShadow: '0 4px 15px rgba(59,130,246,0.5)',
            }}
          >
            <Truck className="h-7 w-7 text-white" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-blue-300 text-[10px] font-bold uppercase tracking-[0.15em]">Category</p>
            <h3 className="font-serif text-xl font-bold text-white leading-tight">Junk Removal</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {['Same-Day Pickup', 'Free Estimates', 'All Items Taken'].map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-semibold text-blue-300 px-3 py-1"
              style={{ border: '1px solid rgba(96,165,250,0.4)', borderRadius: 999, background: 'rgba(59,130,246,0.12)' }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-auto">
          <div className="p-3" style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-2xl font-extrabold text-white leading-none">500+</p>
            <p className="text-blue-300 text-xs mt-0.5">Verified Pros</p>
          </div>
          <div className="p-3" style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-1">
              <p className="text-2xl font-extrabold text-white leading-none">4.8</p>
              <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
            </div>
            <p className="text-blue-300 text-xs mt-0.5">Avg. Rating</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <ShieldCheck className="h-4 w-4 text-blue-300 shrink-0" />
          <span className="text-blue-100/70 text-xs font-medium">Licensed &amp; insured professionals</span>
        </div>
      </div>
    </div>
  )
}

function EstateCleanoutCardV2() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: 340,
        borderRadius: 16,
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 8px 40px rgba(139,92,246,0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.8), transparent)' }} />

      <div className="relative z-10 p-6 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-5">
          <div
            className="p-2.5"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
              borderRadius: 10,
              boxShadow: '0 4px 15px rgba(139,92,246,0.5)',
            }}
          >
            <Home className="h-7 w-7 text-white" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-violet-300 text-[10px] font-bold uppercase tracking-[0.15em]">Category</p>
            <h3 className="font-serif text-xl font-bold text-white leading-tight">Estate Cleanout</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {['Full Property', 'Downsizing', 'Fast Turnaround'].map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-semibold text-violet-300 px-3 py-1"
              style={{ border: '1px solid rgba(167,139,250,0.4)', borderRadius: 999, background: 'rgba(139,92,246,0.12)' }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-auto">
          <div className="p-3" style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-2xl font-extrabold text-white leading-none">200+</p>
            <p className="text-violet-300 text-xs mt-0.5">Markets Served</p>
          </div>
          <div className="p-3" style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-1">
              <p className="text-2xl font-extrabold text-white leading-none">4.9</p>
              <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
            </div>
            <p className="text-violet-300 text-xs mt-0.5">Avg. Rating</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <CheckCircle2 className="h-4 w-4 text-violet-300 shrink-0" />
          <span className="text-violet-100/70 text-xs font-medium">Compassionate, bonded specialists</span>
        </div>
      </div>
    </div>
  )
}

export function HeroSectionV2() {
  return (
    <section
      className="relative py-20 border-b overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #060918 0%, #0d1b4b 45%, #1a0b3d 100%)' }}
    >
      {/* Dot grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      {/* Vivid glow orbs */}
      <div className="absolute top-[-120px] left-[-100px] w-[600px] h-[600px] rounded-full opacity-30" style={{ background: 'radial-gradient(circle, #3b82f6, transparent 65%)' }} />
      <div className="absolute bottom-[-150px] right-[-100px] w-[700px] h-[700px] rounded-full opacity-25" style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 65%)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #06b6d4, transparent 65%)' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-10 items-center">

          {/* Left: Junk Removal */}
          <div className="hidden lg:block">
            <JunkRemovalCardV2 />
          </div>

          {/* Center: text + search */}
          <div className="text-center">
            {/* Social proof badge */}
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5" style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: 999 }}>
              <Users className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-cyan-300 text-xs font-semibold tracking-wide">Trusted by 50,000+ homeowners nationwide</span>
            </div>

            <h1 className="font-serif text-5xl xl:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
              Search for{' '}
              <span style={{ background: 'linear-gradient(90deg, #60a5fa, #a78bfa, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Hauling Services
              </span>
            </h1>
            <p className="mt-4 text-xl text-blue-100/70">
              Search thousands of trusted junk removal and estate cleanout professionals nationwide.
            </p>

            {/* Search bar with gradient border ring */}
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="p-[2px] rounded-xl" style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)' }}>
                <div className="bg-[#060918] rounded-xl">
                  <SearchBar placeholder="Enter city, state, or zip code..." large />
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-6 text-sm text-blue-200/60">
              <span>Junk Removal</span>
              <span>·</span>
              <span>Estate Cleanout</span>
              <span>·</span>
              <span>Nationwide Coverage</span>
            </div>
          </div>

          {/* Right: Estate Cleanout */}
          <div className="hidden lg:block">
            <EstateCleanoutCardV2 />
          </div>

        </div>
      </div>
    </section>
  )
}
