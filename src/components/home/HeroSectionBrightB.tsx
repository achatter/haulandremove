import { SearchBar } from '@/components/search/SearchBar'
import { Truck, Home, CheckCircle2, ShieldCheck, Star, MapPin } from 'lucide-react'

export function HeroSectionBrightB() {
  return (
    <section
      className="relative py-20 border-b overflow-hidden"
      style={{ minHeight: 480 }}
    >
      {/* Panoramic photo background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1800&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
        }}
      />
      {/* Bright airy overlay — white-to-sky gradient, very light */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(224,242,254,0.82) 40%, rgba(209,250,229,0.80) 80%, rgba(255,255,255,0.85) 100%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Trust badge */}
        <div className="flex justify-center mb-6">
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{ background: 'rgba(255,255,255,0.85)', color: '#0369a1', border: '1px solid rgba(14,165,233,0.35)', boxShadow: '0 2px 12px rgba(14,165,233,0.15)' }}
          >
            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            Trusted by 50,000+ homeowners nationwide
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_260px] gap-10 items-center">

          {/* Left: Junk Removal frosted card */}
          <div className="hidden lg:block">
            <div
              className="relative w-full overflow-hidden"
              style={{
                height: 340,
                borderRadius: 16,
                background: 'rgba(255,255,255,0.72)',
                backdropFilter: 'blur(16px)',
                border: '1.5px solid rgba(14,165,233,0.30)',
                boxShadow: '0 8px 40px rgba(14,165,233,0.20), inset 0 1px 0 rgba(255,255,255,0.8)',
              }}
            >
              {/* Photo peek strip at top */}
              <div
                className="absolute top-0 left-0 right-0 h-[72px]"
                style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center 30%',
                  borderRadius: '16px 16px 0 0',
                }}
              />
              <div className="absolute top-0 left-0 right-0 h-[72px]" style={{ background: 'linear-gradient(to bottom, rgba(14,165,233,0.50), rgba(255,255,255,0.0))', borderRadius: '16px 16px 0 0' }} />

              <div className="relative z-10 p-5 pt-[80px] flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2" style={{ background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)', borderRadius: 8 }}>
                    <Truck className="h-5 w-5 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sky-500 text-[10px] font-bold uppercase tracking-[0.15em]">Category</p>
                    <h3 className="font-serif text-lg font-bold text-slate-800 leading-tight">Junk Removal</h3>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {['Same-Day Pickup', 'Free Estimates', 'All Items'].map((tag) => (
                    <span key={tag} className="text-[11px] font-semibold text-sky-700 px-2.5 py-1" style={{ background: 'rgba(14,165,233,0.12)', borderRadius: 20, border: '1px solid rgba(14,165,233,0.25)' }}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 mb-auto">
                  <div className="p-2.5" style={{ background: 'rgba(14,165,233,0.08)', borderRadius: 8 }}>
                    <p className="text-xl font-extrabold text-sky-700 leading-none">500+</p>
                    <p className="text-slate-500 text-xs mt-0.5">Verified Pros</p>
                  </div>
                  <div className="p-2.5" style={{ background: 'rgba(14,165,233,0.08)', borderRadius: 8 }}>
                    <div className="flex items-center gap-1">
                      <p className="text-xl font-extrabold text-sky-700 leading-none">4.8</p>
                      <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5">Avg. Rating</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: '1px solid rgba(14,165,233,0.15)' }}>
                  <ShieldCheck className="h-4 w-4 text-sky-500 shrink-0" />
                  <span className="text-slate-500 text-xs">Licensed &amp; insured</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center */}
          <div className="text-center">
            <h1
              className="font-serif text-5xl xl:text-6xl font-bold tracking-tight"
              style={{ color: '#0f172a' }}
            >
              Search for{' '}
              <span style={{ background: 'linear-gradient(135deg, #0284c7, #059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Hauling Services
              </span>
            </h1>
            <p className="mt-4 text-xl" style={{ color: '#475569' }}>
              Find trusted junk removal and estate cleanout professionals in your area.
            </p>
            <div className="mt-8 max-w-2xl mx-auto">
              <SearchBar placeholder="Enter city, state, or zip code..." large />
            </div>
            <div className="mt-5 flex items-center justify-center gap-6 text-sm font-medium" style={{ color: '#64748b' }}>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-sky-500" />
                Junk Removal
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                Estate Cleanout
              </span>
              <span>·</span>
              <span>All 50 States</span>
            </div>
          </div>

          {/* Right: Estate Cleanout frosted card */}
          <div className="hidden lg:block">
            <div
              className="relative w-full overflow-hidden"
              style={{
                height: 340,
                borderRadius: 16,
                background: 'rgba(255,255,255,0.72)',
                backdropFilter: 'blur(16px)',
                border: '1.5px solid rgba(16,185,129,0.30)',
                boxShadow: '0 8px 40px rgba(16,185,129,0.20), inset 0 1px 0 rgba(255,255,255,0.8)',
              }}
            >
              {/* Photo peek strip at top */}
              <div
                className="absolute top-0 left-0 right-0 h-[72px]"
                style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1560440021-33f9b867899d?w=400&q=70)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center 30%',
                  borderRadius: '16px 16px 0 0',
                }}
              />
              <div className="absolute top-0 left-0 right-0 h-[72px]" style={{ background: 'linear-gradient(to bottom, rgba(16,185,129,0.50), rgba(255,255,255,0.0))', borderRadius: '16px 16px 0 0' }} />

              <div className="relative z-10 p-5 pt-[80px] flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', borderRadius: 8 }}>
                    <Home className="h-5 w-5 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-[0.15em]">Category</p>
                    <h3 className="font-serif text-lg font-bold text-slate-800 leading-tight">Estate Cleanout</h3>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {['Full Property', 'Downsizing', 'Fast Turn'].map((tag) => (
                    <span key={tag} className="text-[11px] font-semibold text-emerald-700 px-2.5 py-1" style={{ background: 'rgba(16,185,129,0.12)', borderRadius: 20, border: '1px solid rgba(16,185,129,0.25)' }}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 mb-auto">
                  <div className="p-2.5" style={{ background: 'rgba(16,185,129,0.08)', borderRadius: 8 }}>
                    <p className="text-xl font-extrabold text-emerald-700 leading-none">200+</p>
                    <p className="text-slate-500 text-xs mt-0.5">Markets Served</p>
                  </div>
                  <div className="p-2.5" style={{ background: 'rgba(16,185,129,0.08)', borderRadius: 8 }}>
                    <div className="flex items-center gap-1">
                      <p className="text-xl font-extrabold text-emerald-700 leading-none">4.9</p>
                      <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5">Avg. Rating</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: '1px solid rgba(16,185,129,0.15)' }}>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="text-slate-500 text-xs">Compassionate specialists</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
