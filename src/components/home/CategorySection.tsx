import Link from 'next/link'
import { Trash2, Home } from 'lucide-react'

const categories = [
  {
    href: '/categories/junk-removal',
    icon: Trash2,
    label: 'Junk Removal',
    description: 'Same-day pickup for furniture, appliances, yard waste, and more.',
    color: 'bg-green-50 text-green-700',
    iconColor: 'text-green-600',
  },
  {
    href: '/categories/estate-cleanout',
    icon: Home,
    label: 'Estate Cleanout',
    description: 'Professional cleanouts for estates, downsizing, and property transitions.',
    color: 'bg-blue-50 text-blue-700',
    iconColor: 'text-blue-600',
  },
]

export function CategorySection() {
  return (
    <section className="py-16 border-t">
      <h2 className="text-3xl font-semibold tracking-tight mb-2">Browse by Category</h2>
      <p className="text-muted-foreground mb-8">Find the right service for your needs</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const Icon = cat.icon
          return (
            <Link
              key={cat.href}
              href={cat.href}
              className="group border rounded-xl p-6 hover:shadow-md transition-shadow bg-white"
            >
              <div className={`inline-flex p-3 rounded-lg ${cat.color} mb-4`}>
                <Icon className={`h-6 w-6 ${cat.iconColor}`} />
              </div>
              <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                {cat.label}
              </h3>
              <p className="text-muted-foreground mt-1">{cat.description}</p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
