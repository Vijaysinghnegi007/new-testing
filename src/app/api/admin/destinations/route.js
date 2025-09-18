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

export async function GET(request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10)))
  const skip = (page - 1) * limit
  const q = searchParams.get('q')?.trim() || ''

  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { slug: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      }
    : {}

  const [items, totalCount] = await Promise.all([
    prisma.destination.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
    prisma.destination.count({ where }),
  ])

  return NextResponse.json({
    items,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      hasMore: skip + limit < totalCount,
    },
  })
}

export async function POST(request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const json = await request.json()
  const parsed = DestinationUpsertSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const data = parsed.data
  const created = await prisma.destination.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      images: JSON.stringify(data.images || []),
      featured: data.featured ?? false,
      isActive: data.isActive ?? true,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      country: data.country || '',
      state: data.state || null,
      city: data.city || '',
    },
  })
  return NextResponse.json({ item: created }, { status: 201 })
}

