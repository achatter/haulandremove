'use client'

import { SearchBar } from '@/components/search/SearchBar'
import { Truck, Home, ShieldCheck, CheckCircle2, Star, MapPin } from 'lucide-react'

function JunkRemovalCard() {
  return (
    <div
      className="relative w-full overflow-hidden flex flex-col"
      style={{
        borderRadius: 16,
        height: 360,
        background: 'white',
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 8px 40px rgba(37,99,235,0.13), 0 2px 8px rgba(0,0,0,0.07)',
      }}
    >
      {/* Image top area — blue truck illustration */}
      <div
        className="relative w-full shrink-0 overflow-hidden"
        style={{ height: 150, background: '#a8d4f5' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/junk-removal-hero.png"
          alt="Junk removal truck"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Rating badge */}
        <div
          className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1"
          style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 20 }}
        >
          <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
          <span className="text-slate-700 text-xs font-bold">4.8</span>
        </div>
        {/* Label badge */}
        <div
          className="absolute bottom-3 left-4 flex items-center gap-2 px-3 py-1.5"
          style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 20 }}
        >
          <Truck className="h-3.5 w-3.5 text-blue-700" strokeWidth={2} />
          <span className="text-blue-800 text-xs font-bold uppercase tracking-wider">Junk Removal</span>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5">
        <p className="text-slate-600 text-sm leading-relaxed mb-4">
          Same-day pickup for furniture, appliances, yard waste &amp; more. Fast, reliable pros available nationwide.
        </p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {['Same-Day Pickup', 'Free Estimates', 'All Items'].map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-semibold px-2.5 py-1"
              style={{
                background: 'rgba(37,99,235,0.08)',
                color: '#1d4ed8',
                borderRadius: 20,
                border: '1px solid rgba(37,99,235,0.18)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-auto pt-3" style={{ borderTop: '1px solid rgba(37,99,235,0.10)' }}>
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
        background: 'white',
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 8px 40px rgba(5,150,105,0.13), 0 2px 8px rgba(0,0,0,0.07)',
      }}
    >
      {/* Image top area — green house illustration */}
      <div
        className="relative w-full shrink-0 overflow-hidden"
        style={{ height: 150, background: '#8ecfbc' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/estate-cleanout-hero.png"
          alt="Estate cleanout house"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Rating badge */}
        <div
          className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1"
          style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 20 }}
        >
          <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
          <span className="text-slate-700 text-xs font-bold">4.9</span>
        </div>
        {/* Label badge */}
        <div
          className="absolute bottom-3 left-4 flex items-center gap-2 px-3 py-1.5"
          style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 20 }}
        >
          <Home className="h-3.5 w-3.5 text-emerald-700" strokeWidth={2} />
          <span className="text-emerald-800 text-xs font-bold uppercase tracking-wider">Estate Cleanout</span>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5">
        <p className="text-slate-600 text-sm leading-relaxed mb-4">
          Compassionate, thorough property cleanouts for estates, downsizing &amp; transitions — available in all 50 states.
        </p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {['Full Property', 'Downsizing', 'Fast Turnaround'].map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-semibold px-2.5 py-1"
              style={{
                background: 'rgba(5,150,105,0.08)',
                color: '#047857',
                borderRadius: 20,
                border: '1px solid rgba(5,150,105,0.18)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-auto pt-3" style={{ borderTop: '1px solid rgba(5,150,105,0.10)' }}>
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
      {/* Very faint city background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1600&h=700&fit=crop&auto=format"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0, opacity: 0.08 }}
      />

      {/* Nearly white background */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background: 'linear-gradient(160deg, #f8fafc 0%, #eff6ff 50%, #f0fdf4 100%)',
        }}
      />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          backgroundImage: 'radial-gradient(rgba(37,99,235,0.10) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative py-16 px-6 max-w-7xl mx-auto" style={{ zIndex: 3 }}>

        {/* Trust badge */}
        <div className="flex justify-center mb-6">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-600"
            style={{
              background: 'rgba(255,255,255,0.90)',
              borderRadius: 24,
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <MapPin className="h-3.5 w-3.5 text-blue-500" />
            Trusted by 50,000+ homeowners nationwide
            <span className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 text-amber-400 fill-amber-400" />
              ))}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-8 items-center">

          {/* Left: Junk Removal card */}
          <div className="hidden lg:block">
            <JunkRemovalCard />
          </div>

          {/* Center: heading + search */}
          <div className="text-center">
            <h1 className="text-5xl xl:text-6xl font-bold tracking-tight text-slate-900 leading-tight" style={{ fontFamily: 'inherit' }}>
              Find the Right<br />
              <span style={{ color: '#2563eb' }}>Hauling Pro</span>{' '}
              <span className="text-slate-900">Near You</span>
            </h1>
            <p className="mt-4 text-base text-slate-500 max-w-md mx-auto leading-relaxed">
              Search thousands of trusted junk removal and estate cleanout professionals across all 50 states.
            </p>

            <div className="mt-8 max-w-xl mx-auto">
              <div
                style={{
                  borderRadius: 12,
                  background: 'white',
                  border: '1px solid rgba(0,0,0,0.10)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                }}
              >
                <SearchBar placeholder="Enter city, state, or zip code..." large />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-3 text-sm flex-wrap">
              <span
                className="flex items-center gap-1.5 font-medium cursor-pointer"
                style={{
                  background: 'rgba(37,99,235,0.06)',
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: '1px solid rgba(37,99,235,0.15)',
                  color: '#1d4ed8',
                }}
              >
                <Truck className="h-3.5 w-3.5" /> Junk Removal
              </span>
              <span
                className="flex items-center gap-1.5 font-medium cursor-pointer"
                style={{
                  background: 'rgba(5,150,105,0.06)',
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: '1px solid rgba(5,150,105,0.15)',
                  color: '#047857',
                }}
              >
                <Home className="h-3.5 w-3.5" /> Estate Cleanout
              </span>
              <span
                className="flex items-center gap-1.5 text-slate-500 font-medium cursor-pointer"
                style={{
                  background: 'rgba(0,0,0,0.04)',
                  padding: '6px 14px',
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
