import { SearchBar } from '@/components/search/SearchBar'
import { Truck, Home, CheckCircle2, ShieldCheck, Star } from 'lucide-react'
import Image from 'next/image'

function JunkRemovalCardA() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: 340, borderRadius: 12, boxShadow: '0 20px 60px rgba(14,165,233,0.25)' }}
    >
      {/* Photo background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Sky blue overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(150deg, rgba(3,105,161,0.82) 0%, rgba(14,165,233,0.72) 60%, rgba(56,189,248,0.60) 100%)' }}
      />

      {/* Top shimmer */}
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)' }} />

      <div className="relative z-10 p-6 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5" style={{ background: 'rgba(255,255,255,0.30)', borderRadius: 8 }}>
            <Truck className="h-7 w-7 text-white" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-sky-100 text-[10px] font-bold uppercase tracking-[0.15em]">Category</p>
            <h3 className="font-serif text-xl font-bold text-white leading-tight">Junk Removal</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {['Same-Day Pickup', 'Free Estimates', 'All Items Taken'].map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-semibold text-white px-2.5 py-1"
              style={{ background: 'rgba(255,255,255,0.22)', borderRadius: 20 }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-auto">
          <div className="p-3" style={{ background: 'rgba(255,255,255,0.18)', borderRadius: 8 }}>
            <p className="text-2xl font-extrabold text-white leading-none">500+</p>
            <p className="text-sky-100 text-xs mt-0.5">Verified Pros</p>
          </div>
          <div className="p-3" style={{ background: 'rgba(255,255,255,0.18)', borderRadius: 8 }}>
            <div className="flex items-center gap-1">
              <p className="text-2xl font-extrabold text-white leading-none">4.8</p>
              <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
            </div>
            <p className="text-sky-100 text-xs mt-0.5">Avg. Rating</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.25)' }}>
          <ShieldCheck className="h-4 w-4 text-white shrink-0" />
          <span className="text-white/90 text-xs font-medium">Licensed &amp; insured professionals</span>
        </div>
      </div>
    </div>
  )
}

function EstateCleanoutCardA() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: 340, borderRadius: 12, boxShadow: '0 20px 60px rgba(16,185,129,0.25)' }}
    >
      {/* Photo background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1560440021-33f9b867899d?w=600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Emerald overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(150deg, rgba(6,78,59,0.82) 0%, rgba(5,150,105,0.72) 60%, rgba(16,185,129,0.60) 100%)' }}
      />

      {/* Top shimmer */}
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)' }} />

      <div className="relative z-10 p-6 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5" style={{ background: 'rgba(255,255,255,0.30)', borderRadius: 8 }}>
            <Home className="h-7 w-7 text-white" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-[0.15em]">Category</p>
            <h3 className="font-serif text-xl font-bold text-white leading-tight">Estate Cleanout</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {['Full Property', 'Downsizing', 'Fast Turnaround'].map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-semibold text-white px-2.5 py-1"
              style={{ background: 'rgba(255,255,255,0.22)', borderRadius: 20 }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-auto">
          <div className="p-3" style={{ background: 'rgba(255,255,255,0.18)', borderRadius: 8 }}>
            <p className="text-2xl font-extrabold text-white leading-none">200+</p>
            <p className="text-emerald-100 text-xs mt-0.5">Markets Served</p>
          </div>
          <div className="p-3" style={{ background: 'rgba(255,255,255,0.18)', borderRadius: 8 }}>
            <div className="flex items-center gap-1">
              <p className="text-2xl font-extrabold text-white leading-none">4.9</p>
              <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
            </div>
            <p className="text-emerald-100 text-xs mt-0.5">Avg. Rating</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.25)' }}>
          <CheckCircle2 className="h-4 w-4 text-white shrink-0" />
          <span className="text-white/90 text-xs font-medium">Compassionate, bonded specialists</span>
        </div>
      </div>
    </div>
  )
}

export function HeroSectionBrightA() {
  return (
    <section className="relative py-20 border-b overflow-hidden" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 40%, #f0fdf4 80%, #fefce8 100%)' }}>
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.15,
        }}
      />
      {/* Soft color blobs */}
      <div className="absolute top-[-60px] left-[-60px] w-[400px] h-[400px] rounded-full opacity-30" style={{ background: 'radial-gradient(circle, #bae6fd, transparent 70%)' }} />
      <div className="absolute bottom-[-80px] right-[-60px] w-[500px] h-[500px] rounded-full opacity-25" style={{ background: 'radial-gradient(circle, #a7f3d0, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] gap-10 items-center">

          {/* Left: Junk Removal */}
          <div className="hidden lg:block">
            <JunkRemovalCardA />
          </div>

          {/* Center */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-bold uppercase tracking-widest" style={{ background: 'rgba(14,165,233,0.12)', color: '#0369a1', border: '1px solid rgba(14,165,233,0.25)' }}>
              America&apos;s #1 Hauling Directory
            </div>
            <h1 className="font-serif text-5xl xl:text-6xl font-bold tracking-tight" style={{ color: '#0f172a' }}>
              Search for{' '}
              <span style={{ background: 'linear-gradient(135deg, #0ea5e9, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Hauling Services
              </span>
            </h1>
            <p className="mt-4 text-xl" style={{ color: '#475569' }}>
              Search thousands of trusted junk removal and estate cleanout professionals nationwide.
            </p>
            <div className="mt-8 max-w-2xl mx-auto">
              <SearchBar placeholder="Enter city, state, or zip code..." large />
            </div>
            <div className="mt-5 flex items-center justify-center gap-6 text-sm" style={{ color: '#64748b' }}>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full" style={{ background: '#0ea5e9' }} />
                Junk Removal
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full" style={{ background: '#10b981' }} />
                Estate Cleanout
              </span>
              <span>·</span>
              <span>Nationwide Coverage</span>
            </div>
            {/* Stats strip */}
            <div className="mt-6 flex items-center justify-center gap-6 text-sm font-semibold" style={{ color: '#334155' }}>
              <span>10,000+ Jobs</span>
              <span style={{ color: '#cbd5e1' }}>|</span>
              <span>4.8 ★ Rating</span>
              <span style={{ color: '#cbd5e1' }}>|</span>
              <span>All 50 States</span>
            </div>
          </div>

          {/* Right: Estate Cleanout */}
          <div className="hidden lg:block">
            <EstateCleanoutCardA />
          </div>

        </div>
      </div>
    </section>
  )
}
