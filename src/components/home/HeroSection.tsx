import { SearchBar } from '@/components/search/SearchBar'
import { Truck, Package, PackageOpen, Trash2, Home, Archive, Tag } from 'lucide-react'

function TruckIllustration() {
  return (
    <div
      className="relative w-full h-64 rounded-2xl overflow-hidden border border-white/15"
      style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.22) 0%, rgba(59,130,246,0.18) 100%)', backdropFilter: 'blur(8px)' }}
    >
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full" style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.35), transparent 70%)' }} />
      <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.25), transparent 70%)' }} />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <div className="p-5 rounded-2xl border border-white/20" style={{ background: 'rgba(255,255,255,0.12)' }}>
          <Truck className="h-14 w-14 text-white" strokeWidth={1.5} />
        </div>
        <div className="flex items-center gap-3">
          {[Package, Trash2, PackageOpen].map((Icon, i) => (
            <div key={i} className="p-2.5 rounded-xl border border-white/15" style={{ background: 'rgba(255,255,255,0.09)' }}>
              <Icon className="h-5 w-5 text-cyan-200" strokeWidth={1.5} />
            </div>
          ))}
        </div>
        <span className="text-xs font-bold tracking-widest text-white/70 uppercase">Junk Removal</span>
      </div>
    </div>
  )
}

function EstateIllustration() {
  return (
    <div
      className="relative w-full h-64 rounded-2xl overflow-hidden border border-white/15"
      style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.22) 0%, rgba(99,102,241,0.18) 100%)', backdropFilter: 'blur(8px)' }}
    >
      <div className="absolute -top-8 -left-8 w-40 h-40 rounded-full" style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.35), transparent 70%)' }} />
      <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.25), transparent 70%)' }} />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <div className="p-5 rounded-2xl border border-white/20" style={{ background: 'rgba(255,255,255,0.12)' }}>
          <Home className="h-14 w-14 text-white" strokeWidth={1.5} />
        </div>
        <div className="flex items-center gap-3">
          {[Archive, Tag, Package].map((Icon, i) => (
            <div key={i} className="p-2.5 rounded-xl border border-white/15" style={{ background: 'rgba(255,255,255,0.09)' }}>
              <Icon className="h-5 w-5 text-violet-200" strokeWidth={1.5} />
            </div>
          ))}
        </div>
        <span className="text-xs font-bold tracking-widest text-white/70 uppercase">Estate Cleanout</span>
      </div>
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="relative py-20 border-b overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #1e40af 70%, #312e81 100%)' }}>
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]" />
      {/* Glow blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-[500px] h-[500px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }} />
      <div className="absolute bottom-[-100px] right-[-80px] w-[600px] h-[600px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-10 items-center">

          {/* Left: Junk Removal */}
          <div className="hidden lg:block">
            <TruckIllustration />
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
            <EstateIllustration />
          </div>

        </div>
      </div>
    </section>
  )
}
