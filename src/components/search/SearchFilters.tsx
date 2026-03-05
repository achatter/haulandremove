'use client'

import { useRouter, usePathname } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { US_STATES, SORT_OPTIONS } from '@/lib/constants'
import type { SearchParams } from '@/types'

interface SearchFiltersProps {
  params: SearchParams
}

export function SearchFilters({ params }: SearchFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()

  function updateParams(key: string, value: string) {
    const sp = new URLSearchParams()
    if (params.q) sp.set('q', params.q)
    if (params.category) sp.set('category', params.category)
    if (params.state) sp.set('state', params.state)
    if (params.sort) sp.set('sort', params.sort)
    if (value) {
      sp.set(key, value)
    } else {
      sp.delete(key)
    }
    router.push(`${pathname}?${sp.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Select
        value={params.category || 'all'}
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

      <Select
        value={params.state || 'all'}
        onValueChange={(v) => updateParams('state', v === 'all' ? '' : v)}
      >
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
        value={params.sort || 'rating'}
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
