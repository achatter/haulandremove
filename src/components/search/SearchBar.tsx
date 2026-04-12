'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
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

interface CitySuggestion {
  city: string
  state: string
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
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState(-1)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const fetchSuggestions = useCallback(async (val: string) => {
    if (val.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    try {
      const res = await fetch(`/api/cities?q=${encodeURIComponent(val)}`)
      if (res.ok) {
        const data: CitySuggestion[] = await res.json()
        setSuggestions(data)
        setShowSuggestions(data.length > 0)
      }
    } catch {
      setSuggestions([])
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
        setActiveSuggestion(-1)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setShowSuggestions(false)
    setActiveSuggestion(-1)
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
    setActiveSuggestion(-1)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(val)
    }, 250)
  }

  function handleSelectSuggestion(suggestion: CitySuggestion) {
    const value = `${suggestion.city}, ${suggestion.state}`
    setQuery(value)
    setShowSuggestions(false)
    setActiveSuggestion(-1)
    const url = buildSearchUrl({
      q: value,
      ...(currentCategory && { category: currentCategory }),
      ...(currentState && { state: currentState }),
    })
    router.push(url)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showSuggestions || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveSuggestion((prev) => Math.min(prev + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveSuggestion((prev) => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter' && activeSuggestion >= 0) {
      e.preventDefault()
      handleSelectSuggestion(suggestions[activeSuggestion])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setActiveSuggestion(-1)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <div className="relative flex-1" ref={containerRef}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
        <Input
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true)
          }}
          placeholder={placeholder}
          className={large ? 'pl-10 h-12 text-base' : 'pl-10'}
          autoComplete="off"
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-50 left-0 right-0 top-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((s, i) => (
              <li
                key={`${s.city}-${s.state}`}
                className={`flex items-center gap-2 px-4 py-2 cursor-pointer text-sm ${
                  i === activeSuggestion
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleSelectSuggestion(s)
                }}
              >
                <Search className="h-3 w-3 text-muted-foreground shrink-0" />
                <span>
                  {s.city}, <span className="font-medium">{s.state}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Button type="submit" className={large ? 'h-12 px-6' : ''}>
        Search
      </Button>
    </form>
  )
}
