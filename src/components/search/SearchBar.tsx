'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { buildSearchUrl } from '@/lib/utils'

interface SearchBarProps {
  initialQuery?: string
  placeholder?: string
  large?: boolean
  currentCategory?: string
  currentState?: string
}

export function SearchBar({
  initialQuery = '',
  placeholder = 'Search by city, state, or zip code...',
  large = false,
  currentCategory = '',
  currentState = '',
}: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const url = buildSearchUrl({
      q: query,
      ...(currentCategory && { category: currentCategory }),
      ...(currentState && { state: currentState }),
    })
    router.push(url)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      // Debounce: only push on explicit submit, not on every keystroke
    }, 300)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className={large ? 'pl-10 h-12 text-base' : 'pl-10'}
        />
      </div>
      <Button type="submit" className={large ? 'h-12 px-6' : ''}>
        Search
      </Button>
    </form>
  )
}
