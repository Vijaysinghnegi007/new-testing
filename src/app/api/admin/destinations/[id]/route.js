import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const DestinationUpsertSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  description: z.string().optional().nullable(),
  images: z.array(z.string().url()).optional().default([]),
  featured: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  country: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
})

export async function GET(_req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const id = params.id
  const item = await prisma.destination.findUnique({ where: { id } })
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
  const parsed = DestinationUpsertSchema.partial().safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const data = parsed.data
  const updated = await prisma.destination.update({
    where: { id },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.slug !== undefined ? { slug: data.slug } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.images !== undefined ? { images: JSON.stringify(data.images) } : {}),
      ...(data.featured !== undefined ? { featured: data.featured } : {}),
      ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
      ...(data.latitude !== undefined ? { latitude: data.latitude } : {}),
      ...(data.longitude !== undefined ? { longitude: data.longitude } : {}),
      ...(data.country !== undefined ? { country: data.country || '' } : {}),
      ...(data.state !== undefined ? { state: data.state || null } : {}),
      ...(data.city !== undefined ? { city: data.city || '' } : {}),
    },
  })
  return NextResponse.json({ item: updated })
}

export async function DELETE(_req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const id = params.id
  await prisma.destination.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

