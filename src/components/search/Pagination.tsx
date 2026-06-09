'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PAGE_SIZE } from '@/lib/constants'

interface PaginationProps {
  count: number
  currentPage: number
}

export function Pagination({ count, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const totalPages = Math.ceil(count / PAGE_SIZE)

  if (totalPages <= 1) return null

  function buildPageUrl(page: number) {
    const sp = new URLSearchParams(searchParams.toString())
    sp.set('page', String(page))
    return `${pathname}?${sp.toString()}`
  }

  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  const pages: (number | 'ellipsis')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push('ellipsis')
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push('ellipsis')
    pages.push(totalPages)
  }

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 mt-8">
      {hasPrev ? (
        <Link
          href={buildPageUrl(currentPage - 1)}
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1')}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
          Previous
        </Link>
      ) : (
        <span className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1 pointer-events-none opacity-50')}>
          <ChevronLeft className="size-4" />
          Previous
        </span>
      )}

      <div className="flex items-center gap-1">
        {pages.map((page, i) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-sm text-muted-foreground select-none">
              &hellip;
            </span>
          ) : (
            <Link
              key={page}
              href={buildPageUrl(page)}
              className={cn(buttonVariants({ variant: page === currentPage ? 'default' : 'ghost', size: 'icon-sm' }))}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </Link>
          )
        )}
      </div>

      {hasNext ? (
        <Link
          href={buildPageUrl(currentPage + 1)}
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1')}
          aria-label="Next page"
        >
          Next
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1 pointer-events-none opacity-50')}>
          Next
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  )
}
