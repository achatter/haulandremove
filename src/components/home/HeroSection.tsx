import { SearchBar } from '@/components/search/SearchBar'
import { Truck, Home, ShieldCheck, CheckCircle2, Star, MapPin } from 'lucide-react'

function JunkRemovalCard() {
  return (
    <div
      className="relative w-full overflow-hidden flex flex-col"
      style={{
        borderRadius: 16,
        height: 360,
        background: 'rgba(255,255,255,0.70)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: '1px solid rgba(255,255,255,0.85)',
        boxShadow: '0 8px 40px rgba(37,99,235,0.13), 0 2px 8px rgba(0,0,0,0.07)',
      }}
    >
      {/* Photo peek strip at top */}
      <div className="relative w-full overflow-hidden shrink-0" style={{ height: 130 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=200&fit=crop&auto=format"
          alt="Junk removal truck"
          className="w-full h-full object-cover"
        />
        {/* Blue-amber tint overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(30,58,138,0.55) 0%, rgba(234,88,12,0.35) 100%)' }}
        />
        {/* Icon badge over photo */}
        <div
          className="absolute bottom-3 left-4 flex items-center gap-2 px-3 py-1.5"
          style={{ background: 'rgba(255,255,255,0.92)', borderRadius: 20, backdropFilter: 'blur(8px)' }}
        >
          <Truck className="h-4 w-4 text-blue-700" strokeWidth={2} />
          <span className="text-blue-800 text-xs font-bold uppercase tracking-wider">Junk Removal</span>
        </div>
        {/* Rating badge */}
        <div
          className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1"
          style={{ background: 'rgba(255,255,255,0.92)', borderRadius: 20 }}
        >
          <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
          <span className="text-slate-700 text-xs font-bold">4.8</span>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5">
        <p className="text-slate-600 text-sm leading-relaxed mb-4">
          Same-day pickup for furniture, appliances, yard waste &amp; more. Fast, reliable pros available nationwide.
        </p>

        {/* Accent tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {['Same-Day Pickup', 'Free Estimates', 'All Items'].map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-semibold px-2.5 py-1"
              style={{
                background: 'rgba(37,99,235,0.09)',
                color: '#1d4ed8',
                borderRadius: 20,
                border: '1px solid rgba(37,99,235,0.2)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Trust line */}
        <div className="flex items-center gap-2 mt-auto pt-3" style={{ borderTop: '1px solid rgba(37,99,235,0.12)' }}>
          <ShieldCheck className="h-4 w-4 shrink-0" style={{ color: '#2563eb' }} />
          <span className="text-slate-500 text-xs font-medium">500+ Licensed &amp; insured pros</span>
        </div>
      </div>
    </div>
  )
}

function EstateCleanoutCard() {
  return (
    <div
      className="relative w-full overflow-hidden flex flex-col"
      style={{
        borderRadius: 16,
        height: 360,
        background: 'rgba(255,255,255,0.70)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: '1px solid rgba(255,255,255,0.85)',
        boxShadow: '0 8px 40px rgba(5,150,105,0.13), 0 2px 8px rgba(0,0,0,0.07)',
      }}
    >
      {/* Photo peek strip at top */}
      <div className="relative w-full overflow-hidden shrink-0" style={{ height: 130 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=200&fit=crop&auto=format"
          alt="Estate cleanout home"
          className="w-full h-full object-cover"
        />
        {/* Emerald tint overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(6,78,59,0.50) 0%, rgba(16,185,129,0.30) 100%)' }}
        />
        {/* Icon badge over photo */}
        <div
          className="absolute bottom-3 left-4 flex items-center gap-2 px-3 py-1.5"
          style={{ background: 'rgba(255,255,255,0.92)', borderRadius: 20, backdropFilter: 'blur(8px)' }}
        >
          <Home className="h-4 w-4 text-emerald-700" strokeWidth={2} />
          <span className="text-emerald-800 text-xs font-bold uppercase tracking-wider">Estate Cleanout</span>
        </div>
        {/* Rating badge */}
        <div
          className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1"
          style={{ background: 'rgba(255,255,255,0.92)', borderRadius: 20 }}
        >
          <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
          <span className="text-slate-700 text-xs font-bold">4.9</span>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5">
        <p className="text-slate-600 text-sm leading-relaxed mb-4">
          Compassionate, thorough property cleanouts for estates, downsizing &amp; transitions — available in all 50 states.
        </p>

        {/* Accent tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {['Full Property', 'Downsizing', 'Fast Turnaround'].map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-semibold px-2.5 py-1"
              style={{
                background: 'rgba(5,150,105,0.09)',
                color: '#047857',
                borderRadius: 20,
                border: '1px solid rgba(5,150,105,0.2)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Trust line */}
        <div className="flex items-center gap-2 mt-auto pt-3" style={{ borderTop: '1px solid rgba(5,150,105,0.12)' }}>
          <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: '#059669' }} />
          <span className="text-slate-500 text-xs font-medium">200+ markets · Bonded specialists</span>
        </div>
      </div>
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="relative" style={{ minHeight: 520 }}>
      {/* Full-width panoramic background photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1600&h=700&fit=crop&auto=format"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      />

      {/* Bright airy overlay — white+sky gradient so the photo shows subtly underneath */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(219,234,254,0.80) 50%, rgba(186,230,253,0.82) 100%)',
        }}
      />

      {/* Subtle dot grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          backgroundImage: 'radial-gradient(rgba(37,99,235,0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative py-16 px-6 max-w-7xl mx-auto" style={{ zIndex: 3 }}>

        {/* Trust badge */}
        <div className="flex justify-center mb-6">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-blue-700"
            style={{
              background: 'rgba(255,255,255,0.80)',
              borderRadius: 24,
              border: '1px solid rgba(37,99,235,0.2)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 2px 8px rgba(37,99,235,0.10)',
            }}
          >
            <MapPin className="h-3.5 w-3.5 text-blue-500" />
            Trusted by 50,000+ homeowners nationwide
            <span className="flex items-center gap-0.5">
              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] gap-10 items-center">

          {/* Left: Junk Removal card */}
          <div className="hidden lg:block">
            <JunkRemovalCard />
          </div>

          {/* Center: heading + search */}
          <div className="text-center">
            <h1 className="font-serif text-5xl xl:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
              Find the Right<br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #0ea5e9 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Hauling Pro
              </span>{' '}
              <span className="text-slate-900">Near You</span>
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-md mx-auto">
              Search thousands of trusted junk removal and estate cleanout professionals across all 50 states.
            </p>

            <div className="mt-8 max-w-xl mx-auto">
              <div
                style={{
                  borderRadius: 14,
                  padding: 3,
                  background: 'linear-gradient(135deg, #2563eb, #7c3aed, #0ea5e9)',
                  boxShadow: '0 4px 24px rgba(37,99,235,0.2)',
                }}
              >
                <div style={{ borderRadius: 11, background: 'white' }}>
                  <SearchBar placeholder="Enter city, state, or zip code..." large />
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-5 text-sm">
              <span
                className="flex items-center gap-1.5 font-medium"
                style={{
                  background: 'rgba(255,255,255,0.70)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px 12px',
                  borderRadius: 20,
                  border: '1px solid rgba(37,99,235,0.15)',
                  color: '#1d4ed8',
                }}
              >
                <Truck className="h-3.5 w-3.5" /> Junk Removal
              </span>
              <span
                className="flex items-center gap-1.5 font-medium"
                style={{
                  background: 'rgba(255,255,255,0.70)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px 12px',
                  borderRadius: 20,
                  border: '1px solid rgba(5,150,105,0.15)',
                  color: '#047857',
                }}
              >
                <Home className="h-3.5 w-3.5" /> Estate Cleanout
              </span>
              <span
                className="flex items-center gap-1.5 text-slate-500 font-medium"
                style={{
                  background: 'rgba(255,255,255,0.70)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px 12px',
                  borderRadius: 20,
                  border: '1px solid rgba(0,0,0,0.08)',
                }}
              >
                <MapPin className="h-3.5 w-3.5" /> All 50 States
              </span>
            </div>
          </div>

          {/* Right: Estate Cleanout card */}
          <div className="hidden lg:block">
            <EstateCleanoutCard />
          </div>

        </div>
      </div>
    </section>
  )
}
