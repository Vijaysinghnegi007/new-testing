import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const Role = z.enum(['GUEST', 'USER', 'PREMIUM', 'ADMIN', 'VENDOR'])

export async function GET(_req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const id = params.id
  const item = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true,
    }
  })
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
  const parsed = z.object({
    role: Role.optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  }).safeParse(json)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const data = parsed.data
  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(data.role ? { role: data.role } : {}),
      ...(data.firstName !== undefined ? { firstName: data.firstName } : {}),
      ...(data.lastName !== undefined ? { lastName: data.lastName } : {}),
    },
    select: { id: true, email: true, firstName: true, lastName: true, role: true }
  })

  return NextResponse.json({ item: updated })
}

