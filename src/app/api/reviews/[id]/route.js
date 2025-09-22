import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function DELETE(_request, { params }) {
  const DEMO = String(process.env.DEMO_MODE || '').toLowerCase() === 'true' || process.env.DEMO_MODE === '1'
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const id = params.id
    if (DEMO) {
      return NextResponse.json({ success: true })
    }
    const review = await prisma.review.findUnique({ where: { id } })
    if (!review) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Only author or admin can delete
    const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'admin'
    if (review.userId !== session.user.id && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.$transaction(async (tx) => {
      await tx.review.delete({ where: { id } })
      const agg = await tx.review.aggregate({
        where: { tourId: review.tourId },
        _avg: { rating: true },
        _count: { _all: true },
      })
      await tx.tour.update({
        where: { id: review.tourId },
        data: {
          rating: agg._avg.rating || 0,
          totalReviews: agg._count._all || 0,
        },
      })
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('DELETE /api/reviews/[id] error', e)
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
  }
}

