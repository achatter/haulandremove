import { SearchBar } from '@/components/search/SearchBar'
import { Truck, Home, CheckCircle2, ShieldCheck, Star } from 'lucide-react'

export function HeroSectionBrightC() {
  return (
    <section className="relative border-b overflow-hidden" style={{ minHeight: 480 }}>
      {/* Split background: left = warm peach (junk), right = soft mint (estate), white center */}
      <div className="absolute inset-0 flex">
        {/* Left 38% — warm amber/peach — junk removal photo with tint */}
        <div
          className="flex-none"
          style={{
            width: '38%',
            backgroundImage: 'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, rgba(254,215,170,0.75) 0%, rgba(253,186,116,0.65) 100%)' }} />
        </div>
        {/* Center 24% — clean white gradient bridge */}
        <div
          className="flex-none"
          style={{
            width: '24%',
            background: 'linear-gradient(to right, rgba(255,237,213,0.80), rgba(255,255,255,1) 35%, rgba(255,255,255,1) 65%, rgba(209,250,229,0.80))',
          }}
        />
        {/* Right 38% — soft mint/sage — estate photo with tint */}
        <div
          className="flex-none"
          style={{
            width: '38%',
            backgroundImage: 'url(https://images.unsplash.com/photo-1560440021-33f9b867899d?w=800&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, rgba(167,243,208,0.75) 0%, rgba(110,231,183,0.65) 100%)' }} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] gap-10 items-center">

          {/* Left card */}
          <div className="hidden lg:block">
            <div
              className="relative w-full overflow-hidden"
              style={{ height: 340, borderRadius: 12, boxShadow: '0 16px 48px rgba(234,88,12,0.25)' }}
            >
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.22) 0%, rgba(255,237,213,0.30) 100%)', backdropFilter: 'blur(2px)' }}
              />
              <div className="absolute inset-0" style={{ border: '1.5px solid rgba(251,146,60,0.40)', borderRadius: 12 }} />

              <div className="relative z-10 p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5" style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)', borderRadius: 8 }}>
                    <Truck className="h-6 w-6 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-orange-600 text-[10px] font-bold uppercase tracking-[0.15em]">Category</p>
                    <h3 className="font-serif text-xl font-bold text-orange-900 leading-tight">Junk Removal</h3>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {['Same-Day Pickup', 'Free Estimates', 'All Items Taken'].map((tag) => (
                    <span key={tag} className="text-[11px] font-semibold text-orange-800 px-2.5 py-1" style={{ background: 'rgba(234,88,12,0.12)', borderRadius: 20, border: '1px solid rgba(234,88,12,0.25)' }}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2.5 mb-auto">
                  <div className="p-3" style={{ background: 'rgba(255,255,255,0.70)', borderRadius: 8 }}>
                    <p className="text-2xl font-extrabold text-orange-700 leading-none">500+</p>
                    <p className="text-orange-600/70 text-xs mt-0.5">Verified Pros</p>
                  </div>
                  <div className="p-3" style={{ background: 'rgba(255,255,255,0.70)', borderRadius: 8 }}>
                    <div className="flex items-center gap-1">
                      <p className="text-2xl font-extrabold text-orange-700 leading-none">4.8</p>
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    </div>
                    <p className="text-orange-600/70 text-xs mt-0.5">Avg. Rating</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: '1px solid rgba(234,88,12,0.20)' }}>
                  <ShieldCheck className="h-4 w-4 text-orange-600 shrink-0" />
                  <span className="text-orange-800/80 text-xs font-medium">Licensed &amp; insured professionals</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center */}
          <div className="text-center">
            <h1 className="font-serif text-5xl xl:text-6xl font-bold tracking-tight" style={{ color: '#0f172a' }}>
              Search for{' '}
              <span style={{ background: 'linear-gradient(135deg, #ea580c, #059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Hauling Services
              </span>
            </h1>
            <p className="mt-4 text-xl" style={{ color: '#475569' }}>
              Find trusted junk removal and estate cleanout professionals nationwide.
            </p>
            <div className="mt-8 max-w-2xl mx-auto">
              <SearchBar placeholder="Enter city, state, or zip code..." large />
            </div>
            <div className="mt-5 flex items-center justify-center gap-6 text-sm font-medium" style={{ color: '#64748b' }}>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-orange-500" />
                Junk Removal
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                Estate Cleanout
              </span>
              <span>·</span>
              <span>All 50 States</span>
            </div>
          </div>

          {/* Right card */}
          <div className="hidden lg:block">
            <div
              className="relative w-full overflow-hidden"
              style={{ height: 340, borderRadius: 12, boxShadow: '0 16px 48px rgba(16,185,129,0.25)' }}
            >
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.22) 0%, rgba(209,250,229,0.30) 100%)', backdropFilter: 'blur(2px)' }}
              />
              <div className="absolute inset-0" style={{ border: '1.5px solid rgba(16,185,129,0.40)', borderRadius: 12 }} />

              <div className="relative z-10 p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5" style={{ background: 'linear-gradient(135deg, #059669, #10b981)', borderRadius: 8 }}>
                    <Home className="h-6 w-6 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-[0.15em]">Category</p>
                    <h3 className="font-serif text-xl font-bold text-emerald-900 leading-tight">Estate Cleanout</h3>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {['Full Property', 'Downsizing', 'Fast Turnaround'].map((tag) => (
                    <span key={tag} className="text-[11px] font-semibold text-emerald-800 px-2.5 py-1" style={{ background: 'rgba(16,185,129,0.12)', borderRadius: 20, border: '1px solid rgba(16,185,129,0.25)' }}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2.5 mb-auto">
                  <div className="p-3" style={{ background: 'rgba(255,255,255,0.70)', borderRadius: 8 }}>
                    <p className="text-2xl font-extrabold text-emerald-700 leading-none">200+</p>
                    <p className="text-emerald-600/70 text-xs mt-0.5">Markets Served</p>
                  </div>
                  <div className="p-3" style={{ background: 'rgba(255,255,255,0.70)', borderRadius: 8 }}>
                    <div className="flex items-center gap-1">
                      <p className="text-2xl font-extrabold text-emerald-700 leading-none">4.9</p>
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    </div>
                    <p className="text-emerald-600/70 text-xs mt-0.5">Avg. Rating</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: '1px solid rgba(16,185,129,0.20)' }}>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="text-emerald-800/80 text-xs font-medium">Compassionate, bonded specialists</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
