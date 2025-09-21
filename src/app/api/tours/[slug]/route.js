import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function parseJSON(value, fallback = []) {
  try {
    if (!value) return fallback;
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export async function GET(request, { params }) {
  try {
    const slug = decodeURIComponent(params.slug);
    if (!slug) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    }

    const tour = await prisma.tour.findUnique({
      where: { slug },
      include: {
        destination: true,
      },
    });

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    // Availability
    let availability = [];
    try {
      const slots = await prisma.tourAvailability.findMany({
        where: { tourId: tour.id },
        orderBy: { startDate: 'asc' },
        take: 50,
      });
      availability = (slots || []).map((s) => ({
        date: s.startDate?.toISOString()?.slice(0, 10),
        available: (s.availableSpots ?? 0) > (s.bookedSpots ?? 0),
        price: Number(s.price ?? tour.discountPrice ?? tour.basePrice ?? 0),
      }));
    } catch {
      availability = [];
    }

    const images = parseJSON(tour.images, []);
    const highlights = parseJSON(tour.highlights, []);
    const included = parseJSON(tour.included, []);
    const excluded = parseJSON(tour.excluded, []);
    const itinerary = parseJSON(tour.itinerary, []);

    const dest = tour.destination;
    const destImages = dest?.images ? parseJSON(dest.images, []) : [];

    const mapped = {
      id: tour.id,
      title: tour.title,
      slug: tour.slug,
      destination: dest?.name || null,
      destinationInfo: dest
        ? {
            id: dest.id,
            name: dest.name,
            slug: dest.slug,
            country: dest.country,
            state: dest.state,
            city: dest.city,
            latitude: dest.latitude,
            longitude: dest.longitude,
            images: destImages,
          }
        : null,
      description: tour.description,
      longDescription: tour.description,
      images,
      duration: tour.duration,
      maxGroupSize: tour.maxGroupSize ?? null,
      minAge: tour.minAge ?? 0,
      difficulty: tour.difficulty || null,
      price: Number(tour.discountPrice ?? tour.basePrice ?? 0),
      originalPrice: tour.discountPrice ? Number(tour.basePrice ?? 0) : null,
      rating: Number(tour.rating ?? 0),
      reviews: Number(tour.totalReviews ?? 0),
      category: tour.category,
      highlights,
      included,
      excluded,
      itinerary,
      availability,
    };

    return NextResponse.json({ tour: mapped });
  } catch (error) {
    console.error('GET /api/tours/[slug] error', error);
    return NextResponse.json({ error: 'Failed to fetch tour' }, { status: 500 });
  }
}
