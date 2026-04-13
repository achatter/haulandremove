'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SORT_OPTIONS } from '@/lib/constants'

export function SearchFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const sort = searchParams.get('sort') || 'rating'

  function updateSort(value: string) {
    const sp = new URLSearchParams(searchParams.toString())
    sp.set('sort', value)
    router.push(`${pathname}?${sp.toString()}`, { scroll: false })
  }

  return (
    <Select value={sort} onValueChange={updateSort}>
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
  )
}
