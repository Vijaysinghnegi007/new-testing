'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Star, ThumbsUp, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'

function Stars({ value = 0, onSelect }) {
  const stars = [1,2,3,4,5]
  return (
    <div className='flex items-center gap-1'>
      {stars.map((n) => (
        <button
          key={n}
          type={onSelect ? 'button' : 'button'}
          onClick={onSelect ? () => onSelect(n) : undefined}
          aria-label={`${n} star`}
          className={`p-0.5 ${onSelect ? 'hover:scale-105 transition-transform' : ''}`}
        >
          <Star className={`h-5 w-5 ${n <= value ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
        </button>
      ))}
    </div>
  )
}

export default function ReviewsSection({ tourId }) {
  const { data: session } = useSession()
  const [items, setItems] = useState([])
  const [avg, setAvg] = useState(0)
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  // form state
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const canPost = Boolean(session?.user)

  const load = async (p = 1) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/reviews?tourId=${encodeURIComponent(tourId)}&page=${p}`)
      if (!res.ok) throw new Error('failed')
      const data = await res.json()
      setItems(data.items || [])
      setAvg(data.average || 0)
      setCount(data.count || 0)
      setPage(data.page || 1)
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (tourId) load(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourId])

  const submit = async (e) => {
    e.preventDefault()
    try {
      if (!canPost) {
        toast.error('Please sign in to write a review')
        return
      }
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tourId, rating, title, comment })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'failed')
      toast.success('Review submitted')
      setTitle(''); setComment(''); setRating(5)
      load(1)
    } catch (err) {
      toast.error(err.message || 'Failed to submit review')
    }
  }

  const markHelpful = async (id) => {
    try {
      await fetch(`/api/reviews/${id}/helpful`, { method: 'POST' })
      setItems((prev) => prev.map((r) => r.id === id ? { ...r, helpfulVotes: (r.helpfulVotes || 0) + 1 } : r))
    } catch {}
  }

  const remove = async (id) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Review removed')
        load(1)
      }
    } catch {}
  }

  return (
    <section className='py-10 border-t'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-3'>
            <Stars value={Math.round(avg)} />
            <span className='text-xl font-semibold'>{avg.toFixed(1)}</span>
            <span className='text-muted-foreground'>({count} reviews)</span>
          </div>
          {canPost ? null : (
            <Link href='/auth/signin' prefetch={false} className='text-primary underline'>Sign in to review</Link>
          )}
        </div>

        {/* Write review */}
        {canPost && (
          <Card className='mb-8'>
            <CardHeader>
              <CardTitle>Write a review</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={submit} className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <span className='text-sm'>Your rating:</span>
                  <Stars value={rating} onSelect={setRating} />
                </div>
                <input
                  type='text'
                  placeholder='Title (optional)'
                  className='w-full border border-border rounded-md px-3 py-2'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                  placeholder='Share your experience...'
                  className='w-full border border-border rounded-md px-3 py-2 min-h-28'
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <div className='flex justify-end'>
                  <Button type='submit' variant='gradient'>Submit</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Reviews list */}
        <div className='space-y-4'>
          {loading && <div className='text-sm text-muted-foreground'>Loading reviews...</div>}
          {!loading && items.length === 0 && (
            <div className='text-sm text-muted-foreground'>No reviews yet. Be the first to review!</div>
          )}
          {items.map((r) => (
            <Card key={r.id}>
              <CardContent className='py-5'>
                <div className='flex items-start gap-3'>
                  {r.user?.profileImage ? (
                    <Image src={r.user.profileImage} alt='User' width={40} height={40} className='rounded-full' />
                  ) : (
                    <div className='h-10 w-10 rounded-full bg-gray-200' />)
                  }
                  <div className='flex-1'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <Stars value={r.rating} />
                        <span className='text-sm text-muted-foreground'>
                          {(r.user?.firstName || '') + ' ' + (r.user?.lastName || '')}
                        </span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <button className='flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground' onClick={() => markHelpful(r.id)}>
                          <ThumbsUp className='h-4 w-4' /> {r.helpfulVotes || 0}
                        </button>
                        {(session?.user?.id === r.userId || session?.user?.role === 'ADMIN' || session?.user?.role === 'admin') && (
                          <button className='text-destructive hover:opacity-80' onClick={() => remove(r.id)}>
                            <Trash2 className='h-4 w-4' />
                          </button>
                        )}
                      </div>
                    </div>
                    {r.title && <div className='font-medium mt-1'>{r.title}</div>}
                    {r.comment && <div className='text-sm mt-1'>{r.comment}</div>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

