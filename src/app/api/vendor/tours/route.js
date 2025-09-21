import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateSlug as utilGenerateSlug } from '@/lib/utils';

async function generateUniqueSlug(title) {
  const base = utilGenerateSlug(title || 'tour');
  let slug = base;
  let n = 1;
  while (true) {
    const exists = await prisma.tour.findUnique({ where: { slug } }).catch(() => null);
    if (!exists) return slug;
    slug = `${base}-${n++}`;
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Only vendor or admin can list vendor tours; admins see all their assigned tours as vendor too
    const vendorId = session.user.id;
    const tours = await prisma.tour.findMany({
      where: { vendorId },
      include: { destination: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ tours });
  } catch (e) {
    return NextResponse.json({ tours: [] }, { status: 200 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.user.role !== 'VENDOR' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, destinationId, category, duration, basePrice, images = [], highlights = [], included = [], excluded = [], itinerary = [] } = body || {};

    if (!title || !description || !destinationId || !category || !duration || !basePrice) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const slug = await generateUniqueSlug(title);

    const created = await prisma.tour.create({
      data: {
        title,
        slug,
        description,
        shortDescription: description.slice(0, 160),
        images: JSON.stringify(images),
        category,
        duration: Number(duration),
        maxGroupSize: 12,
        minAge: 0,
        difficulty: null,
        basePrice: Number(basePrice),
        discountPrice: null,
        included: JSON.stringify(included),
        excluded: JSON.stringify(excluded),
        highlights: JSON.stringify(highlights),
        itinerary: JSON.stringify(itinerary),
        status: 'DRAFT',
        featured: false,
        vendorId: session.user.id,
        destinationId,
      }
    });

    return NextResponse.json({ tour: created });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create tour' }, { status: 200 });
  }
}
