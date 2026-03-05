import { NextRequest, NextResponse } from 'next/server'
import { insertReview, validateReview } from '@/lib/db/reviews'

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { valid, error } = validateReview(body)
  if (!valid) {
    return NextResponse.json({ error }, { status: 400 })
  }

  try {
    const review = await insertReview(body as Parameters<typeof insertReview>[0])
    return NextResponse.json(review, { status: 201 })
  } catch (err) {
    console.error('Failed to insert review:', err)
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}
