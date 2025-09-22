import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  const DEMO_MODE = String(process.env.DEMO_MODE || '').toLowerCase() === 'true' || process.env.DEMO_MODE === '1'
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
    if (DEMO_MODE) {
      const tours = [
        {
          id: 'demo-1',
          title: 'Bali Cultural Adventure',
          slug: 'bali-cultural-adventure',
          images: ['https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop'],
          duration: 7,
          rating: 4.8,
          basePrice: 1299,
          discountPrice: 999,
          category: 'CULTURAL',
          destination: 'Bali, Indonesia',
        },
        {
          id: 'demo-2',
          title: 'Swiss Alps Hiking Experience',
          slug: 'swiss-alps-hiking-experience',
          images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'],
          duration: 10,
          rating: 4.9,
          basePrice: 2499,
          discountPrice: 2199,
          category: 'ADVENTURE',
          destination: 'Swiss Alps, Switzerland',
        },
        {
          id: 'demo-3',
          title: 'Maldives Luxury Retreat',
          slug: 'maldives-luxury-retreat',
          images: ['https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=600&fit=crop'],
          duration: 5,
          rating: 5.0,
          basePrice: 4799,
          discountPrice: 3999,
          category: 'LUXURY',
          destination: 'Maldives',
        },
      ]
      const destinations = [
        { id: 'dest-1', name: 'Paris, France', slug: 'paris-france', country: 'France' },
        { id: 'dest-2', name: 'Tokyo, Japan', slug: 'tokyo-japan', country: 'Japan' },
        { id: 'dest-3', name: 'Bali, Indonesia', slug: 'bali-indonesia', country: 'Indonesia' },
      ]
      return NextResponse.json({ tours, destinations })
    }
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}

