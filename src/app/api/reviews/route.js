import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const tourId = searchParams.get('tourId')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = Math.min(50, parseInt(searchParams.get('pageSize') || '10', 10))

    if (!tourId) {
      return NextResponse.json({ error: 'tourId is required' }, { status: 400 })
    }

    const [aggregate, items] = await Promise.all([
      prisma.review.aggregate({
        where: { tourId },
        _avg: { rating: true },
        _count: { _all: true },
      }),
      prisma.review.findMany({
        where: { tourId },
        orderBy: { createdAt: 'desc' },
        skip: (Math.max(1, page) - 1) * pageSize,
        take: pageSize,
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, profileImage: true }
          }
        }
      })
    ])

    const average = Number(aggregate._avg.rating || 0)
    const count = aggregate._count._all || 0

    return NextResponse.json({
      average: Math.round(average * 10) / 10,
      count,
      items,
      page,
      pageSize,
    })
  } catch (e) {
    console.error('GET /api/reviews error', e)
    return NextResponse.json({ error: 'Failed to load reviews' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const tourId = (body.tourId || '').toString()
    const rating = Number(body.rating)
    const title = (body.title || '').toString().slice(0, 120)
    const comment = (body.comment || '').toString().slice(0, 2000)
    const images = body.images && Array.isArray(body.images) ? JSON.stringify(body.images.slice(0, 6)) : null

    if (!tourId || !(rating >= 1 && rating <= 5)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    // Ensure tour exists and is active
    const tour = await prisma.tour.findUnique({ where: { id: tourId }, select: { id: true } })
    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 })
    }

    // Create review and recompute aggregates in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const created = await tx.review.create({
        data: {
          userId: session.user.id,
          tourId,
          rating,
          title: title || null,
          comment: comment || null,
          images,
          isVerified: true,
        },
      })

      const agg = await tx.review.aggregate({
        where: { tourId },
        _avg: { rating: true },
        _count: { _all: true },
      })

      await tx.tour.update({
        where: { id: tourId },
        data: {
          rating: agg._avg.rating || 0,
          totalReviews: agg._count._all || 0,
        },
      })

      return created
    })

    return NextResponse.json({ success: true, review: result })
  } catch (e) {
    if (e?.code === 'P2002') {
      return NextResponse.json({ error: 'You have already reviewed this tour' }, { status: 400 })
    }
    console.error('POST /api/reviews error', e)
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}

