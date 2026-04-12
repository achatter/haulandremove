import { SearchBar } from '@/components/search/SearchBar'
import { Truck, Home, CheckCircle2, ShieldCheck, Star, ArrowRight } from 'lucide-react'

function JunkRemovalCardD() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: 340,
        borderRadius: 16,
        background: '#fff',
        boxShadow: '0 12px 40px rgba(14,165,233,0.18), 0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid rgba(14,165,233,0.15)',
      }}
    >
      {/* Photo top section */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: 140,
          backgroundImage: 'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
          borderRadius: '16px 16px 0 0',
        }}
      />
      {/* Gradient fade from photo to white */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: 100,
          height: 60,
          background: 'linear-gradient(to bottom, rgba(3,105,161,0.45), rgba(255,255,255,0))',
        }}
      />

      {/* Info panel */}
      <div className="absolute bottom-0 left-0 right-0 p-5" style={{ top: 140 }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2" style={{ background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)', borderRadius: 8 }}>
              <Truck className="h-4 w-4 text-white" strokeWidth={2} />
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-800">Junk Removal</h3>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(14,165,233,0.10)' }}>
            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-sky-700">4.8</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {['Same-Day', 'Free Estimates', 'All Items'].map((tag) => (
            <span key={tag} className="text-[10px] font-semibold text-sky-700 px-2 py-0.5 rounded-full" style={{ background: 'rgba(14,165,233,0.10)', border: '1px solid rgba(14,165,233,0.20)' }}>
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="text-center">
            <p className="text-xl font-extrabold text-sky-600">500+</p>
            <p className="text-slate-400 text-[10px]">Verified Pros</p>
          </div>
          <div className="h-8 w-px bg-slate-100" />
          <div className="text-center">
            <p className="text-xl font-extrabold text-sky-600">10K+</p>
            <p className="text-slate-400 text-[10px]">Jobs Done</p>
          </div>
          <div className="h-8 w-px bg-slate-100" />
          <div className="text-center">
            <p className="text-xl font-extrabold text-sky-600">50</p>
            <p className="text-slate-400 text-[10px]">States</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid #f1f5f9' }}>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-sky-400" />
            <span className="text-[11px] text-slate-400">Licensed &amp; insured</span>
          </div>
          <div className="flex items-center gap-1 text-sky-600 text-xs font-semibold cursor-pointer hover:gap-2 transition-all">
            Browse <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </div>
    </div>
  )
}

function EstateCleanoutCardD() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: 340,
        borderRadius: 16,
        background: '#fff',
        boxShadow: '0 12px 40px rgba(16,185,129,0.18), 0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid rgba(16,185,129,0.15)',
      }}
    >
      {/* Photo top section */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: 140,
          backgroundImage: 'url(https://images.unsplash.com/photo-1560440021-33f9b867899d?w=600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          borderRadius: '16px 16px 0 0',
        }}
      />
      {/* Gradient fade */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: 100,
          height: 60,
          background: 'linear-gradient(to bottom, rgba(5,150,105,0.45), rgba(255,255,255,0))',
        }}
      />

      {/* Info panel */}
      <div className="absolute bottom-0 left-0 right-0 p-5" style={{ top: 140 }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', borderRadius: 8 }}>
              <Home className="h-4 w-4 text-white" strokeWidth={2} />
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-800">Estate Cleanout</h3>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(16,185,129,0.10)' }}>
            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-emerald-700">4.9</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {['Full Property', 'Downsizing', 'Fast Turn'].map((tag) => (
            <span key={tag} className="text-[10px] font-semibold text-emerald-700 px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.20)' }}>
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="text-center">
            <p className="text-xl font-extrabold text-emerald-600">200+</p>
            <p className="text-slate-400 text-[10px]">Markets</p>
          </div>
          <div className="h-8 w-px bg-slate-100" />
          <div className="text-center">
            <p className="text-xl font-extrabold text-emerald-600">5K+</p>
            <p className="text-slate-400 text-[10px]">Jobs Done</p>
          </div>
          <div className="h-8 w-px bg-slate-100" />
          <div className="text-center">
            <p className="text-xl font-extrabold text-emerald-600">50</p>
            <p className="text-slate-400 text-[10px]">States</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid #f1f5f9' }}>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-[11px] text-slate-400">Compassionate specialists</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold cursor-pointer hover:gap-2 transition-all">
            Browse <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function HeroSectionBrightD() {
  return (
    <section
      className="relative py-20 border-b overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #f8fafc 0%, #f0f9ff 50%, #f0fdf4 100%)' }}
    >
      {/* Light dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.40,
        }}
      />
      {/* Soft corner blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[400px] rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top right, #bae6fd, transparent 70%)' }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[300px] rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(ellipse at bottom left, #a7f3d0, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Stats strip */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-6 px-6 py-2.5 rounded-full text-sm font-semibold" style={{ background: 'rgba(255,255,255,0.80)', border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', color: '#334155' }}>
            <span>10,000+ Jobs</span>
            <span className="text-slate-200">|</span>
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              4.8 Rating
            </span>
            <span className="text-slate-200">|</span>
            <span>All 50 States</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] gap-10 items-center">

          {/* Left card */}
          <div className="hidden lg:block">
            <JunkRemovalCardD />
          </div>

          {/* Center */}
          <div className="text-center">
            <h1 className="font-serif text-5xl xl:text-6xl font-bold tracking-tight" style={{ color: '#0f172a' }}>
              Search for{' '}
              <span style={{ background: 'linear-gradient(135deg, #0284c7, #0ea5e9, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Hauling Services
              </span>
            </h1>
            <p className="mt-4 text-xl" style={{ color: '#475569' }}>
              Search thousands of trusted junk removal and estate cleanout professionals nationwide.
            </p>
            <div className="mt-8 max-w-2xl mx-auto">
              <SearchBar placeholder="Enter city, state, or zip code..." large />
            </div>
            <div className="mt-5 flex items-center justify-center gap-6 text-sm font-medium" style={{ color: '#64748b' }}>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-sky-400" />
                Junk Removal
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                Estate Cleanout
              </span>
              <span>·</span>
              <span>Nationwide Coverage</span>
            </div>
          </div>

          {/* Right card */}
          <div className="hidden lg:block">
            <EstateCleanoutCardD />
          </div>

        </div>
      </div>
    </section>
  )
}
