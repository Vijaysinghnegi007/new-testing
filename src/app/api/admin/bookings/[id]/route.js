import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const BookingStatus = z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'REFUNDED'])
const PaymentStatus = z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED'])

export async function GET(_req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const id = params.id
  const item = await prisma.booking.findUnique({ where: { id } })
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ item })
}

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const id = params.id
  const json = await req.json()
  const parsed = z
    .object({
      bookingStatus: BookingStatus.optional(),
      paymentStatus: PaymentStatus.optional(),
    })
    .safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const current = await prisma.booking.findUnique({ where: { id } })
  if (!current) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Validate transitions
  const allowedBooking = new Set([
    `${'PENDING'}->${'CONFIRMED'}`,
    `${'PENDING'}->${'CANCELLED'}`,
    `${'CONFIRMED'}->${'COMPLETED'}`,
    `${'CONFIRMED'}->${'CANCELLED'}`,
  ])
  const allowedPayment = new Set([
    `${'PENDING'}->${'PAID'}`,
    `${'PENDING'}->${'FAILED'}`,
    `${'PAID'}->${'REFUNDED'}`,
  ])

  if (parsed.data.bookingStatus) {
    const key = `${current.bookingStatus}->${parsed.data.bookingStatus}`
    if (!allowedBooking.has(key)) {
      return NextResponse.json({ error: `Invalid booking status transition ${key}` }, { status: 400 })
    }
  }
  if (parsed.data.paymentStatus) {
    const key = `${current.paymentStatus}->${parsed.data.paymentStatus}`
    if (!allowedPayment.has(key)) {
      return NextResponse.json({ error: `Invalid payment status transition ${key}` }, { status: 400 })
    }
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: {
      ...(parsed.data.bookingStatus ? { bookingStatus: parsed.data.bookingStatus } : {}),
      ...(parsed.data.paymentStatus ? { paymentStatus: parsed.data.paymentStatus } : {}),
    },
  })

  return NextResponse.json({ item: updated })
}

