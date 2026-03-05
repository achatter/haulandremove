'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { StarInput } from './StarInput'

interface ReviewFormProps {
  businessId: string
}

export function ReviewForm({ businessId }: ReviewFormProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    reviewer_name: '',
    reviewer_email: '',
    rating: 0,
    title: '',
    body: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate(): boolean {
    const newErrors: Record<string, string> = {}
    if (!form.reviewer_name.trim()) newErrors.reviewer_name = 'Name is required'
    if (!form.rating) newErrors.rating = 'Please select a rating'
    if (!form.title.trim()) newErrors.title = 'Title is required'
    if (!form.body.trim()) newErrors.body = 'Review is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, business_id: businessId }),
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || 'Failed to submit review')
        return
      }

      toast.success('Review submitted successfully!')
      setForm({ reviewer_name: '', reviewer_email: '', rating: 0, title: '', body: '' })
      router.refresh()
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-1 block">Your Rating *</label>
        <StarInput
          value={form.rating}
          onChange={(r) => {
            setForm((f) => ({ ...f, rating: r }))
            if (errors.rating) setErrors((e) => ({ ...e, rating: '' }))
          }}
        />
        {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Name *</label>
          <Input
            value={form.reviewer_name}
            onChange={(e) => setForm((f) => ({ ...f, reviewer_name: e.target.value }))}
            placeholder="Jane Smith"
          />
          {errors.reviewer_name && <p className="text-red-500 text-xs mt-1">{errors.reviewer_name}</p>}
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Email (optional)</label>
          <Input
            type="email"
            value={form.reviewer_email}
            onChange={(e) => setForm((f) => ({ ...f, reviewer_email: e.target.value }))}
            placeholder="jane@example.com"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Review Title *</label>
        <Input
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="Great service!"
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Your Review *</label>
        <Textarea
          value={form.body}
          onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
          placeholder="Tell others about your experience..."
          rows={4}
        />
        {errors.body && <p className="text-red-500 text-xs mt-1">{errors.body}</p>}
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? 'Submitting…' : 'Submit Review'}
      </Button>
    </form>
  )
}
