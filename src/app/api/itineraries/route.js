import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { randomBytes } from 'crypto'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ items: [] })

    const items = await prisma.itinerary.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        days: true,
        isPublic: true,
        shareId: true,
        updatedAt: true,
        _count: { select: { items: true } },
      }
    })
    return NextResponse.json({ items })
  } catch (e) {
    console.error('GET /api/itineraries error', e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const title = (body.title || 'My Trip').toString().slice(0, 120)
    const items = Array.isArray(body.items) ? body.items : []
    const days = Math.max(1, Number(body.days || 1))
    const isPublic = Boolean(body.isPublic)

    const shareId = randomBytes(8).toString('hex')

    const created = await prisma.itinerary.create({
      data: {
        userId: session.user.id,
        title,
        days,
        isPublic,
        shareId,
        items: {
          create: items.map((it, idx) => ({
            day: Math.max(1, Number(it.day || 1)),
            orderIndex: Number(it.orderIndex ?? idx),
            tourId: it.tourId || null,
            destinationId: it.destinationId || null,
            title: it.title || null,
            notes: it.notes || null,
          }))
        }
      },
      select: { id: true, shareId: true }
    })

    return NextResponse.json({ success: true, itinerary: created })
  } catch (e) {
    console.error('POST /api/itineraries error', e)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}

