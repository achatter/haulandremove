'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { US_STATES, CATEGORIES } from '@/lib/constants'
import { toSlug } from '@/lib/utils'
import type { Category } from '@/types'

const CATEGORY_TOGGLE_OPTIONS: { value: Category; label: string }[] = [
  { value: 'junk_removal', label: CATEGORIES.junk_removal.label },
  { value: 'estate_cleanout', label: CATEGORIES.estate_cleanout.label },
]

export function StateSection() {
  const [category, setCategory] = useState<Category>('junk_removal')
  const categorySlug = CATEGORIES[category].slug

  return (
    <section className="py-16">
      <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Nationwide</p>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <h2 className="text-4xl font-bold text-slate-900 mb-2">Browse by State</h2>
          <p className="text-slate-500 text-base">Find hauling &amp; removal services in your state</p>
        </div>
        <div className="flex gap-2 shrink-0" role="group" aria-label="Filter states by service category">
          {CATEGORY_TOGGLE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setCategory(opt.value)}
              aria-pressed={category === opt.value}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                category === opt.value
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {US_STATES.map(state => (
          <Link
            key={state.abbr}
            href={`/${categorySlug}/${toSlug(state.name)}`}
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
