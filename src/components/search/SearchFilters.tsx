'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { US_STATES, SORT_OPTIONS, CITIES_BY_STATE } from '@/lib/constants'

export function SearchFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const category = searchParams.get('category') || 'all'
  const state = searchParams.get('state') || 'all'
  const city = searchParams.get('city') || 'all'
  const sort = searchParams.get('sort') || 'rating'

  const cities = state !== 'all' ? (CITIES_BY_STATE[state] ?? []) : []

  function updateParams(key: string, value: string) {
    const sp = new URLSearchParams(searchParams.toString())
    if (value) {
      sp.set(key, value)
    } else {
      sp.delete(key)
    }
    router.push(`${pathname}?${sp.toString()}`, { scroll: false })
  }

  function handleStateChange(value: string) {
    const sp = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      sp.set('state', value)
    } else {
      sp.delete('state')
    }
    // Reset city when state changes
    sp.delete('city')
    router.push(`${pathname}?${sp.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Select
        value={category}
        onValueChange={(v) => updateParams('category', v === 'all' ? '' : v)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="junk_removal">Junk Removal</SelectItem>
          <SelectItem value="estate_cleanout">Estate Cleanout</SelectItem>
        </SelectContent>
      </Select>

      <Select value={state} onValueChange={handleStateChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All States" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All States</SelectItem>
          {US_STATES.map((s) => (
            <SelectItem key={s.abbr} value={s.abbr}>
              {s.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={city}
        onValueChange={(v) => updateParams('city', v === 'all' ? '' : v)}
        disabled={cities.length === 0}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={cities.length === 0 ? 'Select a state first' : 'All Cities'} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Cities</SelectItem>
          {cities.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={sort}
        onValueChange={(v) => updateParams('sort', v)}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
