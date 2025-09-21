'use server'

import { redirect } from 'next/navigation'

export async function searchToursAction(formData) {
  // Extract and sanitize
  const q = (formData.get('q') || '').toString().trim()
  const category = (formData.get('category') || '').toString().trim()
  const priceMin = (formData.get('priceMin') || '').toString().trim()
  const priceMax = (formData.get('priceMax') || '').toString().trim()
  const durationMin = (formData.get('durationMin') || '').toString().trim()
  const durationMax = (formData.get('durationMax') || '').toString().trim()

  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (category && category !== 'All') params.set('category', category)
  if (priceMin) params.set('priceMin', priceMin)
  if (priceMax) params.set('priceMax', priceMax)
  if (durationMin) params.set('durationMin', durationMin)
  if (durationMax) params.set('durationMax', durationMax)

  // Navigate to SSR page with filters applied
  const qs = params.toString()
  redirect(qs ? `/tours?${qs}` : '/tours')
}

