import { Truck, Home, ShieldCheck, Star, CheckCircle2, Package, Sofa, Trees } from 'lucide-react'
import { SearchBar } from '@/components/search/SearchBar'

// ─────────────────────────────────────────────────────────────────────────────
// JUNK REMOVAL — Option A: "Royal Blue"
// Clean, professional gradient. Solid and trustworthy.
// ─────────────────────────────────────────────────────────────────────────────
function JunkCardA() {
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl shadow-xl shadow-blue-900/30"
      style={{
        height: 320,
        background: 'linear-gradient(150deg, #1e3a5f 0%, #1d4ed8 55%, #3b82f6 100%)',
      }}
    >
      {/* Top shimmer */}
      <div className="absolute top-0 inset-x-0 h-[3px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)' }} />

      {/* Diagonal stripes */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(-55deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 24px)' }} />

      {/* Watermark icon */}
      <div className="absolute -bottom-6 -right-6 opacity-[0.08] pointer-events-none">
        <Truck style={{ width: 180, height: 180, color: 'white', strokeWidth: 1 }} />
      </div>

      <div className="relative z-10 p-6 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <Truck className="h-6 w-6 text-white" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-blue-200 text-[10px] font-bold uppercase tracking-[0.15em]">Category</p>
            <h3 className="font-bold text-xl text-white leading-tight">Junk Removal</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {['Same-Day Pickup', 'Free Estimates', 'All Items Taken'].map((tag) => (
            <span key={tag} className="text-[11px] font-semibold text-white px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.18)' }}>{tag}</span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-auto">
          <div className="p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.22)' }}>
            <p className="text-2xl font-extrabold text-white leading-none">500+</p>
            <p className="text-blue-200 text-xs mt-0.5">Verified Pros</p>
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.22)' }}>
            <div className="flex items-center gap-1">
              <p className="text-2xl font-extrabold text-white leading-none">4.8</p>
              <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
            </div>
            <p className="text-blue-200 text-xs mt-0.5">Avg. Rating</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <ShieldCheck className="h-4 w-4 text-blue-200 shrink-0" />
          <span className="text-blue-100/80 text-xs font-medium">Licensed & insured professionals</span>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// JUNK REMOVAL — Option B: "Industrial Forge"
// Dark charcoal → rust → amber. Earthy, rugged, trades-oriented.
// Evokes a work yard at dusk — trucks, heavy lifting, blue collar craft.
// ─────────────────────────────────────────────────────────────────────────────
function JunkCardB() {
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl shadow-xl shadow-orange-900/40"
      style={{
        height: 320,
        background: [
          'radial-gradient(ellipse at 50% -10%, rgba(251,146,60,0.45) 0%, transparent 55%)',
          'radial-gradient(ellipse at 90% 100%, rgba(0,0,0,0.6) 0%, transparent 50%)',
          'linear-gradient(165deg, #1a0a04 0%, #7c2d12 45%, #b45309 100%)',
        ].join(', '),
      }}
    >
      {/* Top shimmer — amber tint */}
      <div className="absolute top-0 inset-x-0 h-[3px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(251,146,60,0.9), transparent)' }} />

      {/* Metal crosshatch texture */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.4) 0px, rgba(0,0,0,0.4) 1px, transparent 1px, transparent 18px), repeating-linear-gradient(90deg, rgba(0,0,0,0.4) 0px, rgba(0,0,0,0.4) 1px, transparent 1px, transparent 18px)' }} />

      {/* Atmospheric glow at bottom center */}
      <div className="absolute bottom-0 inset-x-0 h-32 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(194,65,12,0.5) 0%, transparent 70%)' }} />

      {/* Watermark truck — amber tint */}
      <div className="absolute -bottom-6 -right-6 opacity-[0.15] pointer-events-none">
        <Truck style={{ width: 180, height: 180, color: '#fb923c', strokeWidth: 1 }} />
      </div>

      <div className="relative z-10 p-6 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl" style={{ background: 'rgba(251,146,60,0.25)', border: '1px solid rgba(251,146,60,0.35)' }}>
            <Truck className="h-6 w-6 text-orange-300" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-orange-300/80 text-[10px] font-bold uppercase tracking-[0.15em]">Category</p>
            <h3 className="font-bold text-xl text-white leading-tight">Junk Removal</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {['Same-Day Pickup', 'Free Estimates', 'All Items Taken'].map((tag) => (
            <span key={tag} className="text-[11px] font-semibold text-orange-100 px-2.5 py-1 rounded-full" style={{ background: 'rgba(251,146,60,0.2)', border: '1px solid rgba(251,146,60,0.25)' }}>{tag}</span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-auto">
          <div className="p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(251,146,60,0.15)' }}>
            <p className="text-2xl font-extrabold text-white leading-none">500+</p>
            <p className="text-orange-300/80 text-xs mt-0.5">Verified Pros</p>
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(251,146,60,0.15)' }}>
            <div className="flex items-center gap-1">
              <p className="text-2xl font-extrabold text-white leading-none">4.8</p>
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            </div>
            <p className="text-orange-300/80 text-xs mt-0.5">Avg. Rating</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: '1px solid rgba(251,146,60,0.2)' }}>
          <ShieldCheck className="h-4 w-4 text-orange-300/80 shrink-0" />
          <span className="text-orange-100/70 text-xs font-medium">Licensed & insured professionals</span>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// JUNK REMOVAL — Option C: "Carbon & Lime"
// Dark carbon base, vivid lime-green accents. Modern urban-industrial look.
// ─────────────────────────────────────────────────────────────────────────────
function JunkCardC() {
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl shadow-xl shadow-lime-900/30"
      style={{
        height: 320,
        background: [
          'radial-gradient(ellipse at 75% 15%, rgba(132,204,22,0.18) 0%, transparent 50%)',
          'radial-gradient(ellipse at 20% 80%, rgba(132,204,22,0.1) 0%, transparent 45%)',
          'linear-gradient(165deg, #0a0f08 0%, #111a0e 50%, #0d1a0a 100%)',
        ].join(', '),
      }}
    >
      {/* Top shimmer — lime */}
      <div className="absolute top-0 inset-x-0 h-[3px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(163,230,53,0.8), transparent)' }} />

      {/* Dot grid — blueprint feel */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(163,230,53,0.12) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      {/* Side accent bar */}
      <div className="absolute top-6 bottom-6 left-0 w-[3px] rounded-full" style={{ background: 'linear-gradient(to bottom, #84cc16, rgba(132,204,22,0.1))' }} />

      {/* Watermark icon — lime tint */}
      <div className="absolute -bottom-6 -right-6 opacity-[0.08] pointer-events-none">
        <Truck style={{ width: 180, height: 180, color: '#84cc16', strokeWidth: 1 }} />
      </div>

      <div className="relative z-10 p-6 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl" style={{ background: 'rgba(132,204,22,0.15)', border: '1px solid rgba(132,204,22,0.3)' }}>
            <Truck className="h-6 w-6 text-lime-400" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-lime-400/70 text-[10px] font-bold uppercase tracking-[0.15em]">Category</p>
            <h3 className="font-bold text-xl text-white leading-tight">Junk Removal</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {['Same-Day Pickup', 'Free Estimates', 'All Items Taken'].map((tag) => (
            <span key={tag} className="text-[11px] font-semibold text-lime-300 px-2.5 py-1 rounded-full" style={{ background: 'rgba(132,204,22,0.12)', border: '1px solid rgba(132,204,22,0.2)' }}>{tag}</span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-auto">
          <div className="p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(132,204,22,0.15)' }}>
            <p className="text-2xl font-extrabold text-lime-300 leading-none">500+</p>
            <p className="text-lime-400/60 text-xs mt-0.5">Verified Pros</p>
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(132,204,22,0.15)' }}>
            <div className="flex items-center gap-1">
              <p className="text-2xl font-extrabold text-lime-300 leading-none">4.8</p>
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            </div>
            <p className="text-lime-400/60 text-xs mt-0.5">Avg. Rating</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: '1px solid rgba(132,204,22,0.15)' }}>
          <ShieldCheck className="h-4 w-4 text-lime-400/70 shrink-0" />
          <span className="text-lime-100/60 text-xs font-medium">Licensed & insured professionals</span>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ESTATE CLEANOUT — Option A: "Forest Emerald"
// Deep green gradient. Fresh, professional, traditional.
// ─────────────────────────────────────────────────────────────────────────────
function EstateCardA() {
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl shadow-xl shadow-green-900/30"
      style={{
        height: 320,
        background: 'linear-gradient(150deg, #064e3b 0%, #047857 55%, #10b981 100%)',
      }}
    >
      {/* Top shimmer */}
      <div className="absolute top-0 inset-x-0 h-[3px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)' }} />

      {/* Diagonal stripes */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(-55deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 24px)' }} />

      {/* Watermark icon */}
      <div className="absolute -bottom-6 -right-6 opacity-[0.08] pointer-events-none">
        <Home style={{ width: 180, height: 180, color: 'white', strokeWidth: 1 }} />
      </div>

      <div className="relative z-10 p-6 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <Home className="h-6 w-6 text-white" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-emerald-200 text-[10px] font-bold uppercase tracking-[0.15em]">Category</p>
            <h3 className="font-bold text-xl text-white leading-tight">Estate Cleanout</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {['Full Property', 'Downsizing', 'Fast Turnaround'].map((tag) => (
            <span key={tag} className="text-[11px] font-semibold text-white px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.18)' }}>{tag}</span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-auto">
          <div className="p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.22)' }}>
            <p className="text-2xl font-extrabold text-white leading-none">200+</p>
            <p className="text-emerald-200 text-xs mt-0.5">Markets Served</p>
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.22)' }}>
            <div className="flex items-center gap-1">
              <p className="text-2xl font-extrabold text-white leading-none">4.9</p>
              <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
            </div>
            <p className="text-emerald-200 text-xs mt-0.5">Avg. Rating</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <CheckCircle2 className="h-4 w-4 text-emerald-200 shrink-0" />
          <span className="text-emerald-100/80 text-xs font-medium">Compassionate, bonded specialists</span>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ESTATE CLEANOUT — Option B: "Warm Walnut"
// Rich walnut/amber tones. Warm, welcoming, heritage feel.
// Evokes the warmth of a family home — trusted, careful, personal.
// ─────────────────────────────────────────────────────────────────────────────
function EstateCardB() {
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl shadow-xl shadow-amber-900/40"
      style={{
        height: 320,
        background: [
          'radial-gradient(ellipse at 50% -15%, rgba(251,191,36,0.4) 0%, transparent 55%)',
          'radial-gradient(ellipse at 20% 100%, rgba(0,0,0,0.5) 0%, transparent 50%)',
          'linear-gradient(160deg, #1c0905 0%, #78350f 45%, #a16207 100%)',
        ].join(', '),
      }}
    >
      {/* Top shimmer — gold */}
      <div className="absolute top-0 inset-x-0 h-[3px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.9), transparent)' }} />

      {/* Diamond lattice pattern — old wallpaper feel */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(251,191,36,0.5) 0px, rgba(251,191,36,0.5) 1px, transparent 1px, transparent 16px), repeating-linear-gradient(-45deg, rgba(251,191,36,0.5) 0px, rgba(251,191,36,0.5) 1px, transparent 1px, transparent 16px)',
        }}
      />

      {/* Atmospheric warmth glow center */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(217,119,6,0.25) 0%, transparent 65%)' }} />

      {/* Watermark home — amber tint */}
      <div className="absolute -bottom-6 -right-6 opacity-[0.15] pointer-events-none">
        <Home style={{ width: 180, height: 180, color: '#fbbf24', strokeWidth: 1 }} />
      </div>

      <div className="relative z-10 p-6 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl" style={{ background: 'rgba(251,191,36,0.2)', border: '1px solid rgba(251,191,36,0.3)' }}>
            <Home className="h-6 w-6 text-amber-300" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-amber-300/80 text-[10px] font-bold uppercase tracking-[0.15em]">Category</p>
            <h3 className="font-bold text-xl text-white leading-tight">Estate Cleanout</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {['Full Property', 'Downsizing', 'Fast Turnaround'].map((tag) => (
            <span key={tag} className="text-[11px] font-semibold text-amber-100 px-2.5 py-1 rounded-full" style={{ background: 'rgba(251,191,36,0.18)', border: '1px solid rgba(251,191,36,0.22)' }}>{tag}</span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-auto">
          <div className="p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(251,191,36,0.15)' }}>
            <p className="text-2xl font-extrabold text-white leading-none">200+</p>
            <p className="text-amber-300/80 text-xs mt-0.5">Markets Served</p>
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(251,191,36,0.15)' }}>
            <div className="flex items-center gap-1">
              <p className="text-2xl font-extrabold text-white leading-none">4.9</p>
              <Star className="h-4 w-4 text-amber-300 fill-amber-300" />
            </div>
            <p className="text-amber-300/80 text-xs mt-0.5">Avg. Rating</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: '1px solid rgba(251,191,36,0.18)' }}>
          <CheckCircle2 className="h-4 w-4 text-amber-300/80 shrink-0" />
          <span className="text-amber-100/70 text-xs font-medium">Compassionate, bonded specialists</span>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ESTATE CLEANOUT — Option C: "Midnight Navy & Gold"
// Deep navy blue with rich gold accents. Prestigious, high-trust, classic.
// Evokes a well-established firm — professional, careful, reliable.
// ─────────────────────────────────────────────────────────────────────────────
function EstateCardC() {
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl shadow-xl shadow-blue-950/50"
      style={{
        height: 320,
        background: [
          'radial-gradient(ellipse at 50% -10%, rgba(245,158,11,0.2) 0%, transparent 55%)',
          'radial-gradient(ellipse at 80% 100%, rgba(245,158,11,0.1) 0%, transparent 45%)',
          'linear-gradient(150deg, #0b1120 0%, #0f2344 50%, #1a3872 100%)',
        ].join(', '),
      }}
    >
      {/* Top gold shimmer */}
      <div className="absolute top-0 inset-x-0 h-[3px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.9), transparent)' }} />

      {/* Pinstripe texture */}
      <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(245,158,11,0.6) 0px, rgba(245,158,11,0.6) 1px, transparent 1px, transparent 28px)' }} />

      {/* Right edge gold accent */}
      <div className="absolute top-6 bottom-6 right-0 w-[3px] rounded-full" style={{ background: 'linear-gradient(to bottom, rgba(245,158,11,0.8), rgba(245,158,11,0.1))' }} />

      {/* Watermark home — gold tint */}
      <div className="absolute -bottom-6 -right-6 opacity-[0.1] pointer-events-none">
        <Home style={{ width: 180, height: 180, color: '#f59e0b', strokeWidth: 1 }} />
      </div>

      <div className="relative z-10 p-6 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl" style={{ background: 'rgba(245,158,11,0.18)', border: '1px solid rgba(245,158,11,0.35)' }}>
            <Home className="h-6 w-6 text-amber-400" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-amber-400/70 text-[10px] font-bold uppercase tracking-[0.15em]">Category</p>
            <h3 className="font-bold text-xl text-white leading-tight">Estate Cleanout</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {['Full Property', 'Downsizing', 'Fast Turnaround'].map((tag) => (
            <span key={tag} className="text-[11px] font-semibold text-blue-100 px-2.5 py-1 rounded-full" style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}>{tag}</span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-auto">
          <div className="p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <p className="text-2xl font-extrabold text-white leading-none">200+</p>
            <p className="text-amber-400/70 text-xs mt-0.5">Markets Served</p>
          </div>
          <div className="p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <div className="flex items-center gap-1">
              <p className="text-2xl font-extrabold text-white leading-none">4.9</p>
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
            </div>
            <p className="text-amber-400/70 text-xs mt-0.5">Avg. Rating</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: '1px solid rgba(245,158,11,0.2)' }}>
          <CheckCircle2 className="h-4 w-4 text-amber-400/80 shrink-0" />
          <span className="text-blue-100/70 text-xs font-medium">Compassionate, bonded specialists</span>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Full hero preview using Option 3 (Premium Light) layout with chosen cards
// ─────────────────────────────────────────────────────────────────────────────
function HeroPreview({ junkCard, estateCard }: { junkCard: React.ReactNode; estateCard: React.ReactNode }) {
  return (
    <section
      className="relative py-16 overflow-hidden"
      style={{
        background: [
          'radial-gradient(ellipse at 30% 50%, rgba(99,102,241,0.08) 0%, transparent 60%)',
          'radial-gradient(ellipse at 70% 50%, rgba(14,165,233,0.06) 0%, transparent 60%)',
          'linear-gradient(135deg, #f8faff 0%, #eef2ff 45%, #f0f9ff 100%)',
        ].join(', '),
      }}
    >
      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.15) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* Left: heading + search */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 text-xs font-bold text-indigo-600 uppercase tracking-widest" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
              Junk Removal · Estate Cleanout · Nationwide
            </div>

            <h1 className="text-5xl xl:text-6xl font-bold tracking-tight text-slate-900 leading-[1.05] mb-5">
              Find the Right<br />
              <span style={{ background: 'linear-gradient(90deg, #2563eb, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Hauling Pro
              </span>{' '}
              Near You
            </h1>

            <p className="text-slate-500 text-lg mb-7 leading-relaxed">
              Search thousands of trusted junk removal and estate cleanout professionals nationwide.
            </p>

            <div className="max-w-md">
              <SearchBar placeholder="Enter city, state, or zip code..." large />
            </div>

            <div className="mt-5 flex items-center gap-3">
              <div className="flex -space-x-2">
                {['#6366f1','#2563eb','#0891b2','#059669'].map((c, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold" style={{ background: c }}>
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(s => <Star key={s} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-slate-400 text-xs mt-0.5">Trusted by 50,000+ homeowners</p>
              </div>
            </div>
          </div>

          {/* Right: stacked cards */}
          <div className="flex flex-col gap-4">
            {junkCard}
            {estateCard}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Page header */}
      <div className="bg-white border-b px-8 py-5 sticky top-0 z-50 flex items-center gap-4 shadow-sm">
        <div>
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Design Preview</p>
          <h1 className="text-xl font-bold text-slate-900">Card Background Options — Option 3 (Premium Light)</h1>
        </div>
      </div>

      {/* ──────────────────────────────────────────────
          JUNK REMOVAL: 3 card options
      ────────────────────────────────────────────── */}
      <div className="px-8 py-12 max-w-7xl mx-auto">
        <div className="mb-8">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2">Junk Removal</span>
          <h2 className="text-2xl font-bold text-slate-900">Pick a background style for the Junk Removal card</h2>
          <p className="text-slate-500 mt-1 text-sm">All use the same layout — only the color, texture, and atmosphere changes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg font-bold text-slate-800">A</span>
              <div>
                <p className="font-semibold text-slate-800 leading-tight">Royal Blue</p>
                <p className="text-slate-400 text-xs">Clean · Professional · Trustworthy</p>
              </div>
            </div>
            <JunkCardA />
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">Classic deep-blue gradient. Solid and approachable — a trusted uniform color for service companies.</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg font-bold text-slate-800">B</span>
              <div>
                <p className="font-semibold text-slate-800 leading-tight">Industrial Forge</p>
                <p className="text-slate-400 text-xs">Rugged · Earthy · Blue-Collar Craft</p>
              </div>
            </div>
            <JunkCardB />
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">Dark charcoal-to-rust gradient with a warm amber glow and steel crosshatch texture. Feels like a work yard at dusk — heavy lifting, real trucks, real work.</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg font-bold text-slate-800">C</span>
              <div>
                <p className="font-semibold text-slate-800 leading-tight">Carbon & Lime</p>
                <p className="text-slate-400 text-xs">Modern · Urban · Striking</p>
              </div>
            </div>
            <JunkCardC />
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">Very dark carbon base with vivid lime-green accents and a dot-grid overlay. Urban and modern — stands out in any feed.</p>
          </div>

        </div>
      </div>

      {/* ──────────────────────────────────────────────
          ESTATE CLEANOUT: 3 card options
      ────────────────────────────────────────────── */}
      <div className="px-8 py-12 max-w-7xl mx-auto border-t border-slate-200">
        <div className="mb-8">
          <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2">Estate Cleanout</span>
          <h2 className="text-2xl font-bold text-slate-900">Pick a background style for the Estate Cleanout card</h2>
          <p className="text-slate-500 mt-1 text-sm">Same layout and content — different emotional tone.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg font-bold text-slate-800">A</span>
              <div>
                <p className="font-semibold text-slate-800 leading-tight">Forest Emerald</p>
                <p className="text-slate-400 text-xs">Fresh · Professional · Traditional</p>
              </div>
            </div>
            <EstateCardA />
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">Clean forest-green gradient. Classic and recognizable — green signals care, growth, and trust.</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg font-bold text-slate-800">B</span>
              <div>
                <p className="font-semibold text-slate-800 leading-tight">Warm Walnut</p>
                <p className="text-slate-400 text-xs">Welcoming · Heritage · Personal</p>
              </div>
            </div>
            <EstateCardB />
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">Rich walnut-to-amber gradient with a gold diamond lattice and warm glow. Evokes the warmth of a family home — compassionate, careful, trusted.</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg font-bold text-slate-800">C</span>
              <div>
                <p className="font-semibold text-slate-800 leading-tight">Midnight Navy & Gold</p>
                <p className="text-slate-400 text-xs">Prestigious · Classic · High-Trust</p>
              </div>
            </div>
            <EstateCardC />
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">Deep midnight navy with gold pinstripes and accents. Feels established and premium — like a firm you'd trust with a valuable estate.</p>
          </div>

        </div>
      </div>

      {/* ──────────────────────────────────────────────
          HERO PREVIEWS: See how combos look together
      ────────────────────────────────────────────── */}
      <div className="border-t border-slate-200">
        <div className="px-8 py-12 max-w-7xl mx-auto">
          <div className="mb-8">
            <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2">Full Hero Preview</span>
            <h2 className="text-2xl font-bold text-slate-900">Suggested pairings — how the cards look together in context</h2>
            <p className="text-slate-500 mt-1 text-sm">These are 3 recommended combinations. Tell me which one (or mix-and-match) you prefer.</p>
          </div>
        </div>

        {/* Pairing 1: A + A — Clean Professional */}
        <div className="border-t border-slate-100">
          <div className="px-8 pt-6 max-w-7xl mx-auto">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Combo 1 — "Classic Professional"</p>
            <p className="text-slate-400 text-xs mb-4">Junk: Royal Blue (A) + Estate: Forest Emerald (A)</p>
          </div>
          <HeroPreview junkCard={<JunkCardA />} estateCard={<EstateCardA />} />
        </div>

        {/* Pairing 2: B + B — Earthy Warmth */}
        <div className="border-t border-slate-100 mt-2">
          <div className="px-8 pt-6 max-w-7xl mx-auto">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Combo 2 — "Earthy & Warm"</p>
            <p className="text-slate-400 text-xs mb-4">Junk: Industrial Forge (B) + Estate: Warm Walnut (B)</p>
          </div>
          <HeroPreview junkCard={<JunkCardB />} estateCard={<EstateCardB />} />
        </div>

        {/* Pairing 3: B + C — Bold contrast */}
        <div className="border-t border-slate-100 mt-2">
          <div className="px-8 pt-6 max-w-7xl mx-auto">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Combo 3 — "Bold Contrast"</p>
            <p className="text-slate-400 text-xs mb-4">Junk: Industrial Forge (B) + Estate: Midnight Navy & Gold (C)</p>
          </div>
          <HeroPreview junkCard={<JunkCardB />} estateCard={<EstateCardC />} />
        </div>

        {/* Pairing 4: C + C — Ultra Modern */}
        <div className="border-t border-slate-100 mt-2">
          <div className="px-8 pt-6 max-w-7xl mx-auto">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Combo 4 — "Ultra Modern"</p>
            <p className="text-slate-400 text-xs mb-4">Junk: Carbon & Lime (C) + Estate: Midnight Navy & Gold (C)</p>
          </div>
          <HeroPreview junkCard={<JunkCardC />} estateCard={<EstateCardC />} />
        </div>
      </div>

      {/* Note about photo backgrounds */}
      <div className="px-8 py-10 max-w-7xl mx-auto border-t border-slate-200">
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
          <p className="text-sm font-bold text-indigo-700 mb-2">Note: About actual background photos</p>
          <p className="text-sm text-slate-600 leading-relaxed">
            All options above use rich CSS gradients and textures. Once you pick a direction,
            real photographs (e.g., a junk truck on-site, or a beautifully staged estate interior) can be layered
            behind these cards using Next.js <code className="bg-indigo-100 px-1 rounded text-xs">Image</code> with a semi-transparent gradient overlay —
            images stored in Supabase Storage or a stock photo service like Unsplash. Just let me know
            if you'd like photo backgrounds and I'll wire that up after you pick a card style.
          </p>
        </div>
      </div>

    </div>
  )
}
