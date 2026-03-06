import Link from 'next/link'
import { Trash2, Home } from 'lucide-react'

const categories = [
  {
    href: '/categories/junk-removal',
    icon: Trash2,
    label: 'Junk Removal',
    description: 'Same-day pickup for furniture, appliances, yard waste, and more.',
    gradient: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
    border: '#6ee7b7',
    iconBg: 'linear-gradient(135deg, #10b981, #059669)',
    accent: '#065f46',
  },
  {
    href: '/categories/estate-cleanout',
    icon: Home,
    label: 'Estate Cleanout',
    description: 'Professional cleanouts for estates, downsizing, and property transitions.',
    gradient: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
    border: '#93c5fd',
    iconBg: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    accent: '#1e3a8a',
  },
]

export function CategorySection() {
  return (
    <section className="py-16 border-t border-indigo-100">
      <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-indigo-600 uppercase mb-2">
        <span className="w-6 h-px bg-indigo-400 inline-block" />
        Services
      </div>
      <h2 className="text-3xl font-bold tracking-tight text-slate-800 mb-2">Browse by Category</h2>
      <p className="text-slate-500 mb-8">Find the right service for your needs</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const Icon = cat.icon
          return (
            <Link
              key={cat.href}
              href={cat.href}
              className="group relative rounded-2xl p-7 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 overflow-hidden border"
              style={{ background: cat.gradient, borderColor: cat.border }}
            >
              {/* Decorative circle */}
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20" style={{ background: cat.iconBg }} />
              <div className="inline-flex p-3.5 rounded-xl mb-5 shadow-sm" style={{ background: cat.iconBg }}>
                <Icon className="h-7 w-7 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold mb-1 transition-colors" style={{ color: cat.accent }}>
                {cat.label}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">{cat.description}</p>
              <div className="mt-4 text-xs font-semibold flex items-center gap-1 transition-colors" style={{ color: cat.accent }}>
                Browse listings <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
