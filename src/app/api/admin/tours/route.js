import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const TourUpsertSchema = z.object({
  title: z.string().min(3),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  category: z.string().optional().nullable(),
  duration: z.number().int().positive(),
  maxGroupSize: z.number().int().positive().optional().nullable(),
  minAge: z.number().int().nonnegative().optional().nullable(),
  difficulty: z.string().optional().nullable(),
  basePrice: z.number().nonnegative(),
  discountPrice: z.number().nonnegative().optional().nullable(),
  included: z.array(z.string()).optional().default([]),
  excluded: z.array(z.string()).optional().default([]),
  highlights: z.array(z.string()).optional().default([]),
  itinerary: z.array(z.any()).optional().default([]),
  featured: z.boolean().optional().default(false),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  destinationId: z.string().optional(),
  vendorId: z.string().optional(),
  images: z.array(z.string().url()).optional().default([]),
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
  const status = searchParams.get('status') || undefined

  const where = {
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { slug: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        }
      : {}),
    ...(status ? { status } : {}),
  }

  const [items, totalCount] = await Promise.all([
    prisma.tour.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
    prisma.tour.count({ where }),
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
  const parsed = TourUpsertSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const data = parsed.data
  const created = await prisma.tour.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: json.description || '',
      shortDescription: json.shortDescription || null,
      images: JSON.stringify(data.images || []),
      videos: JSON.stringify(json.videos || []),
      category: data.category || 'ADVENTURE',
      duration: data.duration,
      maxGroupSize: data.maxGroupSize || 0,
      minAge: data.minAge || 0,
      difficulty: data.difficulty || null,
      basePrice: data.basePrice,
      discountPrice: data.discountPrice || null,
      included: JSON.stringify(data.included || []),
      excluded: JSON.stringify(data.excluded || []),
      highlights: JSON.stringify(data.highlights || []),
      itinerary: JSON.stringify(data.itinerary || []),
      status: data.status || 'DRAFT',
      featured: data.featured || false,
      destinationId: data.destinationId,
      vendorId: data.vendorId,
    },
  })
  return NextResponse.json({ item: created }, { status: 201 })
}

