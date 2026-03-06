import Link from 'next/link'
import { Trash2, Home, ArrowUpRight } from 'lucide-react'

const categories = [
  {
    href: '/categories/junk-removal',
    icon: Trash2,
    label: 'Junk Removal',
    description: 'Same-day pickup for furniture, appliances, yard waste, and more. Fast, reliable professionals available nationwide.',
    bg: '#002B5B',
    accentColor: '#00C2C2',
    patternColor: 'rgba(0,194,194,0.08)',
  },
  {
    href: '/categories/estate-cleanout',
    icon: Home,
    label: 'Estate Cleanout',
    description: 'Professional cleanouts for estates, downsizing, and property transitions. Compassionate, thorough service.',
    bg: '#003D3D',
    accentColor: '#7EDDB0',
    patternColor: 'rgba(126,221,176,0.08)',
  },
]

export function CategorySection() {
  return (
    <section className="py-16 border-t-2 border-slate-900">
      <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Services</p>
      <h2 className="font-serif text-4xl font-bold text-slate-900 mb-2">Browse by Category</h2>
      <p className="text-slate-500 mb-10 text-base">Find the right service for your needs</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {categories.map((cat, i) => {
          const Icon = cat.icon
          return (
            <Link
              key={cat.href}
              href={cat.href}
              className="group relative overflow-hidden p-10 flex flex-col justify-between min-h-[280px] hover:brightness-110 transition-all duration-300"
              style={{ backgroundColor: cat.bg }}
            >
              {/* Diagonal line pattern */}
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    -45deg,
                    rgba(255,255,255,0.8) 0px,
                    rgba(255,255,255,0.8) 1px,
                    transparent 1px,
                    transparent 20px
                  )`,
                }}
              />
              {/* Large decorative circle */}
              <div
                className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full opacity-10"
                style={{ backgroundColor: cat.accentColor }}
              />

              <div className="relative z-10">
                <div
                  className="inline-flex p-3 mb-6"
                  style={{ backgroundColor: cat.accentColor + '22', border: `1px solid ${cat.accentColor}44` }}
                >
                  <Icon className="h-6 w-6" style={{ color: cat.accentColor }} strokeWidth={2} />
                </div>
                <h3 className="font-serif text-3xl font-bold text-white mb-3">{cat.label}</h3>
                <p className="text-white/60 text-sm leading-relaxed max-w-xs">{cat.description}</p>
              </div>

              <div className="relative z-10 flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: cat.accentColor }}>
                  Browse listings
                </span>
                <ArrowUpRight
                  className="h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  style={{ color: cat.accentColor }}
                />
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
