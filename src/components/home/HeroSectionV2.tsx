import { SearchBar } from '@/components/search/SearchBar'
import { Truck, Home, CheckCircle2, ShieldCheck, Star, Sparkles } from 'lucide-react'

function JunkRemovalCard() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        height: 340,
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
      }}
    >
      {/* Top shimmer */}
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.8), transparent)' }} />

      {/* Blue glow accent */}
      <div
        className="absolute -top-10 -left-10 w-40 h-40 rounded-full opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #38bdf8, transparent 70%)' }}
      />

      {/* Watermark truck */}
      <div className="absolute -bottom-4 -right-6 opacity-[0.08] pointer-events-none">
        <Truck style={{ width: 200, height: 200, color: 'white', strokeWidth: 0.8 }} />
      </div>

      <div className="relative z-10 p-6 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-5">
          <div
            className="p-2.5"
            style={{
              background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
              borderRadius: 12,
              boxShadow: '0 4px 14px rgba(14,165,233,0.4)',
            }}
          >
            <Truck className="h-7 w-7 text-white" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-sky-300 text-[10px] font-bold uppercase tracking-[0.15em]">Category</p>
            <h3 className="font-serif text-xl font-bold text-white leading-tight">Junk Removal</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {['Same-Day Pickup', 'Free Estimates', 'All Items Taken'].map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-semibold text-sky-200 px-2.5 py-1"
              style={{
                background: 'rgba(14,165,233,0.18)',
                borderRadius: 100,
                border: '1px solid rgba(56,189,248,0.3)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-auto">
          <div className="p-3" style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-2xl font-extrabold text-white leading-none">500+</p>
            <p className="text-sky-300 text-xs mt-0.5">Verified Pros</p>
          </div>
          <div className="p-3" style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-1">
              <p className="text-2xl font-extrabold text-white leading-none">4.8</p>
              <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
            </div>
            <p className="text-sky-300 text-xs mt-0.5">Avg. Rating</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <ShieldCheck className="h-4 w-4 text-sky-300 shrink-0" />
          <span className="text-sky-100/70 text-xs font-medium">Licensed &amp; insured professionals</span>
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
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        height: 340,
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
      }}
    >
      {/* Top shimmer */}
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.8), transparent)' }} />

      {/* Purple glow accent */}
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #a78bfa, transparent 70%)' }}
      />

      {/* Watermark home */}
      <div className="absolute -bottom-4 -right-6 opacity-[0.08] pointer-events-none">
        <Home style={{ width: 200, height: 200, color: 'white', strokeWidth: 0.8 }} />
      </div>

      <div className="relative z-10 p-6 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-5">
          <div
            className="p-2.5"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
              borderRadius: 12,
              boxShadow: '0 4px 14px rgba(124,58,237,0.4)',
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
              className="text-[11px] font-semibold text-violet-200 px-2.5 py-1"
              style={{
                background: 'rgba(124,58,237,0.18)',
                borderRadius: 100,
                border: '1px solid rgba(167,139,250,0.3)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-auto">
          <div className="p-3" style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-2xl font-extrabold text-white leading-none">200+</p>
            <p className="text-violet-300 text-xs mt-0.5">Markets Served</p>
          </div>
          <div className="p-3" style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)' }}>
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
      style={{ background: 'linear-gradient(135deg, #060918 0%, #0d1b4b 35%, #1a0b3d 65%, #060918 100%)' }}
    >
      {/* Vivid glow orbs */}
      <div
        className="absolute top-[-60px] left-[-60px] w-[550px] h-[550px] rounded-full opacity-25"
        style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }}
      />
      <div
        className="absolute top-[-40px] right-[-80px] w-[500px] h-[500px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 70%)' }}
      />
      <div
        className="absolute bottom-[-120px] left-[30%] w-[600px] h-[400px] rounded-full opacity-15"
        style={{ background: 'radial-gradient(ellipse, #06b6d4, transparent 70%)' }}
      />

      {/* Dot grid overlay */}
      <div className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-10 items-center">

          {/* Left: Junk Removal */}
          <div className="hidden lg:block">
            <JunkRemovalCard />
          </div>

          {/* Center */}
          <div className="text-center">
            {/* Social proof badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-semibold text-cyan-300"
              style={{
                background: 'rgba(6,182,212,0.1)',
                borderRadius: 100,
                border: '1px solid rgba(6,182,212,0.25)',
              }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Trusted by 50,000+ homeowners nationwide
            </div>

            <h1 className="font-serif text-5xl xl:text-6xl font-bold tracking-tight leading-tight">
              <span className="text-white">Search for</span>
              <br />
              <span
                style={{
                  background: 'linear-gradient(90deg, #60a5fa, #a78bfa, #38bdf8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Hauling Services
              </span>
            </h1>

            <p className="mt-4 text-xl text-blue-100/70">
              Search thousands of trusted junk removal and estate cleanout professionals nationwide.
            </p>

            <div className="mt-8 max-w-2xl mx-auto">
              {/* Glow ring around search */}
              <div
                className="rounded-xl p-[1px]"
                style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)' }}
              >
                <div className="bg-[#0d1b4b] rounded-xl">
                  <SearchBar placeholder="Enter city, state, or zip code..." large />
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-6 text-sm text-blue-200/60">
              <span>Junk Removal</span>
              <span>·</span>
              <span>Estate Cleanout</span>
              <span>·</span>
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
