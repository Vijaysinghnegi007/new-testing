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

export async function GET(_req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const id = params.id
  const item = await prisma.tour.findUnique({ where: { id } })
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
  const parsed = TourUpsertSchema.partial().safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const data = parsed.data
  const updated = await prisma.tour.update({
    where: { id },
    data: {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.slug !== undefined ? { slug: data.slug } : {}),
      ...(json.description !== undefined ? { description: json.description } : {}),
      ...(json.shortDescription !== undefined ? { shortDescription: json.shortDescription } : {}),
      ...(data.images !== undefined ? { images: JSON.stringify(data.images) } : {}),
      ...(json.videos !== undefined ? { videos: JSON.stringify(json.videos) } : {}),
      ...(data.category !== undefined ? { category: data.category || null } : {}),
      ...(data.duration !== undefined ? { duration: data.duration } : {}),
      ...(data.maxGroupSize !== undefined ? { maxGroupSize: data.maxGroupSize || 0 } : {}),
      ...(data.minAge !== undefined ? { minAge: data.minAge || 0 } : {}),
      ...(data.difficulty !== undefined ? { difficulty: data.difficulty || null } : {}),
      ...(data.basePrice !== undefined ? { basePrice: data.basePrice } : {}),
      ...(data.discountPrice !== undefined ? { discountPrice: data.discountPrice || null } : {}),
      ...(data.included !== undefined ? { included: JSON.stringify(data.included) } : {}),
      ...(data.excluded !== undefined ? { excluded: JSON.stringify(data.excluded) } : {}),
      ...(data.highlights !== undefined ? { highlights: JSON.stringify(data.highlights) } : {}),
      ...(data.itinerary !== undefined ? { itinerary: JSON.stringify(data.itinerary) } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.featured !== undefined ? { featured: data.featured } : {}),
      ...(data.destinationId !== undefined ? { destinationId: data.destinationId } : {}),
      ...(data.vendorId !== undefined ? { vendorId: data.vendorId } : {}),
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
  await prisma.tour.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

