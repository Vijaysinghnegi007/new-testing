import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const id = params.id
    const body = await request.json()

    const existing = await prisma.itinerary.findUnique({ where: { id } })
    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const title = body.title ? body.title.toString().slice(0, 120) : undefined
    const days = body.days != null ? Math.max(1, Number(body.days)) : undefined
    const isPublic = body.isPublic != null ? Boolean(body.isPublic) : undefined

    const items = Array.isArray(body.items) ? body.items : null

    const updated = await prisma.$transaction(async (tx) => {
      if (items) {
        await tx.itineraryItem.deleteMany({ where: { itineraryId: id } })
        await tx.itineraryItem.createMany({
          data: items.map((it, idx) => ({
            itineraryId: id,
            day: Math.max(1, Number(it.day || 1)),
            orderIndex: Number(it.orderIndex ?? idx),
            tourId: it.tourId || null,
            destinationId: it.destinationId || null,
            title: it.title || null,
            notes: it.notes || null,
          }))
        })
      }
      return tx.itinerary.update({
        where: { id },
        data: {
          ...(title !== undefined ? { title } : {}),
          ...(days !== undefined ? { days } : {}),
          ...(isPublic !== undefined ? { isPublic } : {}),
        },
        select: { id: true }
      })
    })

    return NextResponse.json({ success: true, itinerary: updated })
  } catch (e) {
    console.error('PATCH /api/itineraries/[id] error', e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function DELETE(_request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const id = params.id
    const existing = await prisma.itinerary.findUnique({ where: { id } })
    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    await prisma.itinerary.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('DELETE /api/itineraries/[id] error', e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

