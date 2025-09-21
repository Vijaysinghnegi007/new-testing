'use server'

import { redirect } from 'next/navigation'

export async function searchDestinationsAction(formData) {
  const q = (formData.get('q') || '').toString().trim()
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  redirect(params.toString() ? `/destinations?${params.toString()}` : '/destinations')
}

