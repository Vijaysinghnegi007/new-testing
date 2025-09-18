import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const items = await prisma.wishlist.findMany({
    where: { userId: session.user.id },
    include: {
      tour: true,
    },
  })
  return NextResponse.json({ items })
}

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json()
  const { tourId } = body
  if (!tourId) return NextResponse.json({ error: 'tourId is required' }, { status: 400 })

  const item = await prisma.wishlist.upsert({
    where: {
      userId_tourId: {
        userId: session.user.id,
        tourId,
      },
    },
    update: {},
    create: {
      userId: session.user.id,
      tourId,
    },
  })
  return NextResponse.json({ item })
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json()
  const { tourId } = body
  if (!tourId) return NextResponse.json({ error: 'tourId is required' }, { status: 400 })

  await prisma.wishlist.delete({
    where: {
      userId_tourId: {
        userId: session.user.id,
        tourId,
      },
    },
  })
  return NextResponse.json({ success: true })
}

