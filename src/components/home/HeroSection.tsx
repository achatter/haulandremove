import { SearchBar } from '@/components/search/SearchBar'
import { Truck, Home, CheckCircle2, Zap, ShieldCheck, Star } from 'lucide-react'

function JunkRemovalCard() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ background: 'linear-gradient(150deg, #0369A1 0%, #0EA5E9 60%, #38BDF8 100%)', height: 340, borderRadius: 6 }}
    >
      {/* Top shimmer line */}
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)' }} />

      {/* Watermark truck */}
      <div className="absolute -bottom-4 -right-8 opacity-[0.12] pointer-events-none">
        <Truck style={{ width: 180, height: 180, color: 'white', strokeWidth: 1 }} />
      </div>

      {/* Diagonal stripe accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(-55deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 22px)',
        }}
      />

      <div className="relative z-10 p-6 flex flex-col h-full">
        {/* Header row */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5" style={{ background: 'rgba(255,255,255,0.22)', borderRadius: 6 }}>
            <Truck className="h-7 w-7 text-white" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-sky-200 text-[10px] font-bold uppercase tracking-[0.15em]">Category</p>
            <h3 className="font-serif text-xl font-bold text-white leading-tight">Junk Removal</h3>
          </div>
        </div>

        {/* Feature tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {['Same-Day Pickup', 'Free Estimates', 'All Items Taken'].map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-semibold text-white px-2.5 py-1"
              style={{ background: 'rgba(255,255,255,0.18)', borderRadius: 3 }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-auto">
          <div className="p-3" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 4 }}>
            <p className="text-2xl font-extrabold text-white leading-none">500+</p>
            <p className="text-sky-200 text-xs mt-0.5">Verified Pros</p>
          </div>
          <div className="p-3" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 4 }}>
            <div className="flex items-center gap-1">
              <p className="text-2xl font-extrabold text-white leading-none">4.8</p>
              <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
            </div>
            <p className="text-sky-200 text-xs mt-0.5">Avg. Rating</p>
          </div>
        </div>

        {/* Footer trust line */}
        <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <ShieldCheck className="h-4 w-4 text-sky-200 shrink-0" />
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
      style={{ background: 'linear-gradient(150deg, #5B21B6 0%, #7C3AED 60%, #A78BFA 100%)', height: 340, borderRadius: 6 }}
    >
      {/* Top shimmer line */}
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)' }} />

      {/* Watermark home */}
      <div className="absolute -bottom-4 -right-8 opacity-[0.12] pointer-events-none">
        <Home style={{ width: 180, height: 180, color: 'white', strokeWidth: 1 }} />
      </div>

      {/* Diagonal stripe accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(-55deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 22px)',
        }}
      />

      <div className="relative z-10 p-6 flex flex-col h-full">
        {/* Header row */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5" style={{ background: 'rgba(255,255,255,0.22)', borderRadius: 6 }}>
            <Home className="h-7 w-7 text-white" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-violet-200 text-[10px] font-bold uppercase tracking-[0.15em]">Category</p>
            <h3 className="font-serif text-xl font-bold text-white leading-tight">Estate Cleanout</h3>
          </div>
        </div>

        {/* Feature tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {['Full Property', 'Downsizing', 'Fast Turnaround'].map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-semibold text-white px-2.5 py-1"
              style={{ background: 'rgba(255,255,255,0.18)', borderRadius: 3 }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-auto">
          <div className="p-3" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 4 }}>
            <p className="text-2xl font-extrabold text-white leading-none">200+</p>
            <p className="text-violet-200 text-xs mt-0.5">Markets Served</p>
          </div>
          <div className="p-3" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 4 }}>
            <div className="flex items-center gap-1">
              <p className="text-2xl font-extrabold text-white leading-none">4.9</p>
              <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
            </div>
            <p className="text-violet-200 text-xs mt-0.5">Avg. Rating</p>
          </div>
        </div>

        {/* Footer trust line */}
        <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <CheckCircle2 className="h-4 w-4 text-violet-200 shrink-0" />
          <span className="text-violet-100/80 text-xs font-medium">Compassionate, bonded specialists</span>
        </div>
      </div>
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="relative py-20 border-b overflow-hidden" style={{ background: 'linear-gradient(135deg, #020817 0%, #0f172a 40%, #0f172a 70%, #0d1224 100%)' }}>
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]" />
      {/* Glow blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-[500px] h-[500px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }} />
      <div className="absolute bottom-[-100px] right-[-80px] w-[600px] h-[600px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-10 items-center">

          {/* Left: Junk Removal */}
          <div className="hidden lg:block">
            <JunkRemovalCard />
          </div>

          {/* Center: text + search */}
          <div className="text-center">
            <h1 className="font-serif text-5xl xl:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
              Search for Hauling Services
            </h1>
            <p className="mt-4 text-xl text-blue-100/80">
              Search thousands of trusted junk removal and estate cleanout professionals nationwide.
            </p>
            <div className="mt-8 max-w-2xl mx-auto">
              <SearchBar placeholder="Enter city, state, or zip code..." large />
            </div>
            <div className="mt-4 flex items-center justify-center gap-6 text-sm text-blue-200/70">
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
