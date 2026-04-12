import { NextRequest, NextResponse } from 'next/server'
import { getCitySuggestions } from '@/lib/db/businesses'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') ?? ''
  if (q.trim().length < 2) {
    return NextResponse.json([])
  }

  try {
    const suggestions = await getCitySuggestions(q)
    return NextResponse.json(suggestions)
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}
