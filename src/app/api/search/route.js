import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = (searchParams.get('q') || '').trim()
    const category = searchParams.get('category') || undefined
    const priceMin = parseFloat(searchParams.get('priceMin') || '')
    const priceMax = parseFloat(searchParams.get('priceMax') || '')
    const durationMin = parseInt(searchParams.get('durationMin') || '')
    const durationMax = parseInt(searchParams.get('durationMax') || '')

    const tourWhere = {
      isActive: true,
      ...(q ? { OR: [ { title: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } } ] } : {}),
      ...(category ? { category } : {}),
      ...(isFinite(priceMin) ? { basePrice: { gte: priceMin } } : {}),
      ...(isFinite(priceMax) ? { basePrice: { lte: priceMax } } : {}),
      ...(isFinite(durationMin) ? { duration: { gte: durationMin } } : {}),
      ...(isFinite(durationMax) ? { duration: { lte: durationMax } } : {}),
    }

    const destWhere = q ? { OR: [ { name: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } } ], isActive: true } : { isActive: true }

    const [toursRaw, destinations] = await Promise.all([
      prisma.tour.findMany({ where: tourWhere, take: 24, orderBy: { rating: 'desc' }, include: { destination: true } }),
      prisma.destination.findMany({ where: destWhere, take: 24, orderBy: { featured: 'desc' } })
    ])

    const tours = toursRaw.map(t => ({
      id: t.id,
      title: t.title,
      slug: t.slug,
      images: t.images,
      duration: t.duration,
      rating: t.rating,
      basePrice: t.basePrice,
      discountPrice: t.discountPrice,
      category: t.category,
      destination: t.destination?.name || null,
    }))

    const res = NextResponse.json({ tours, destinations })
    res.headers.set('Cache-Control', 'public, max-age=15, stale-while-revalidate=60')
    return res
  } catch (e) {
    console.error('Search error', e)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}

