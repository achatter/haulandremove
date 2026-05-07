import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { US_STATES } from '@/lib/constants'
import { toSlug } from '@/lib/utils'

export function StateSection() {
  return (
    <section className="py-16">
      <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Nationwide</p>
      <h2 className="text-4xl font-bold text-slate-900 mb-2">Browse by State</h2>
      <p className="text-slate-500 mb-10 text-base">Find hauling &amp; removal services in your state</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {US_STATES.map(state => (
          <Link
            key={state.abbr}
            href={`/junk-removal/${toSlug(state.name)}`}
            className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
          >
            <MapPin className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-blue-500" />
            <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600">{state.name}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
