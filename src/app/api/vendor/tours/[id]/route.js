import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function ensureOwnership(tourId, userId, allowAdmin = true, userRole = 'USER') {
  const tour = await prisma.tour.findUnique({ where: { id: tourId } });
  if (!tour) return { ok: false, status: 404 };
  if (tour.vendorId !== userId && !(allowAdmin && userRole === 'ADMIN')) return { ok: false, status: 403 };
  return { ok: true, tour };
}

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const tourId = params.id;
    const own = await ensureOwnership(tourId, session.user.id, true, session.user.role);
    if (!own.ok) return NextResponse.json({ error: 'Forbidden' }, { status: own.status });

    const tour = await prisma.tour.findUnique({ where: { id: tourId }, include: { destination: true } });
    if (!tour) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ tour });
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 200 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const tourId = params.id;
    const own = await ensureOwnership(tourId, session.user.id, true, session.user.role);
    if (!own.ok) return NextResponse.json({ error: 'Forbidden' }, { status: own.status });

    const body = await request.json();
    const allowed = ['title', 'description', 'category', 'duration', 'basePrice', 'discountPrice', 'images', 'included', 'excluded', 'highlights', 'itinerary', 'status', 'destinationId'];
    const data = {};
    for (const k of allowed) if (k in body) data[k] = body[k];
    if (data.images) data.images = JSON.stringify(data.images);
    if (data.included) data.included = JSON.stringify(data.included);
    if (data.excluded) data.excluded = JSON.stringify(data.excluded);
    if (data.highlights) data.highlights = JSON.stringify(data.highlights);
    if (data.itinerary) data.itinerary = JSON.stringify(data.itinerary);

    const updated = await prisma.tour.update({ where: { id: tourId }, data });
    return NextResponse.json({ tour: updated });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 200 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const tourId = params.id;
    const own = await ensureOwnership(tourId, session.user.id, true, session.user.role);
    if (!own.ok) return NextResponse.json({ error: 'Forbidden' }, { status: own.status });

    await prisma.tour.delete({ where: { id: tourId } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 200 });
  }
}
