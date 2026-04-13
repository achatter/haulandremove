import Link from 'next/link'
import { Trash2, Home, ArrowUpRight } from 'lucide-react'

const categories = [
  {
    href: '/categories/junk-removal',
    icon: Trash2,
    label: 'Junk Removal',
    description: 'Same-day pickup for furniture, appliances, yard waste, and more. Fast, reliable professionals available nationwide.',
    bg: '#C14B1A',
    accentColor: '#FFB07A',
    image: '/images/junk-removal-category.png',
    imageAlt: 'Junk removal truck illustration',
    imageBg: '#a8d4f5',
  },
  {
    href: '/categories/estate-cleanout',
    icon: Home,
    label: 'Estate Cleanout',
    description: 'Professional cleanouts for estates, downsizing, and property transitions. Compassionate, thorough service.',
    bg: '#6B3A1F',
    accentColor: '#FFCDA0',
    image: '/images/estate-cleanout-category.png',
    imageAlt: 'Estate cleanout room illustration',
    imageBg: '#c0622a',
  },
]

export function CategorySection() {
  return (
    <section className="py-16">
      <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Services</p>
      <h2 className="text-4xl font-bold text-slate-900 mb-2">Browse by Category</h2>
      <p className="text-slate-500 mb-10 text-base">Find the right service for your needs</p>

      <div
        className="grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden"
        style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.15)' }}
      >
        {categories.map((cat) => {
          const Icon = cat.icon
          return (
            <Link
              key={cat.href}
              href={cat.href}
              className="group relative overflow-hidden flex flex-col justify-between min-h-[280px] hover:brightness-105 transition-all duration-300"
              style={{ backgroundColor: cat.bg }}
            >
              {/* Subtle diagonal texture */}
              <div
                className="absolute inset-0 opacity-[0.04]"
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

              {/* Illustration image — right side */}
              <div
                className="absolute right-0 top-0 bottom-0 w-2/5 overflow-hidden"
                style={{ background: cat.imageBg }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.imageAlt}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                {/* Fade left edge into card color */}
                <div
                  className="absolute inset-y-0 left-0 w-16"
                  style={{
                    background: `linear-gradient(to right, ${cat.bg}, transparent)`,
                  }}
                />
              </div>

              {/* Text content */}
              <div className="relative z-10 p-10 pr-[45%]">
                <div
                  className="inline-flex p-3 mb-6 rounded-lg"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.12)',
                    border: '1px solid rgba(255,255,255,0.20)',
                  }}
                >
                  <Icon className="h-6 w-6" style={{ color: cat.accentColor }} strokeWidth={2} />
                </div>
                <h3 className="text-3xl font-bold text-white mb-3">{cat.label}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{cat.description}</p>
              </div>

              <div className="relative z-10 flex items-center justify-between mx-10 mb-8 pt-5 border-t border-white/10">
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
