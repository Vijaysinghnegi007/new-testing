import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

const DEMO = () => String(process.env.DEMO_MODE || '').toLowerCase() === 'true' || process.env.DEMO_MODE === '1'

function readDemoWishlist() {
  try {
    const raw = cookies().get('demo_wishlist')?.value || '[]'
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr : []
  } catch { return [] }
}
function writeDemoWishlist(items) {
  cookies().set('demo_wishlist', JSON.stringify(items.slice(0,100)), { path: '/', httpOnly: false, sameSite: 'lax' })
}

export async function GET() {
  if (DEMO()) {
    const items = readDemoWishlist().map(id => ({ tourId: id }))
    return NextResponse.json({ items })
  }
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
  if (DEMO()) {
    const body = await req.json()
    const { tourId } = body
    if (!tourId) return NextResponse.json({ error: 'tourId is required' }, { status: 400 })
    const arr = readDemoWishlist()
    if (!arr.includes(tourId)) arr.push(tourId)
    writeDemoWishlist(arr)
    return NextResponse.json({ item: { tourId } })
  }
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
  if (DEMO()) {
    const body = await req.json()
    const { tourId } = body
    if (!tourId) return NextResponse.json({ error: 'tourId is required' }, { status: 400 })
    const arr = readDemoWishlist().filter(id => id !== tourId)
    writeDemoWishlist(arr)
    return NextResponse.json({ success: true })
  }
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

