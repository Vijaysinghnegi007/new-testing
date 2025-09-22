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
  const DEMO_MODE = String(process.env.DEMO_MODE || '').toLowerCase() === 'true' || process.env.DEMO_MODE === '1'
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
      if (DEMO_MODE) {
        const demo = [
          {
            id: 'demo-1', title: 'Bali Cultural Adventure', slug: 'bali-cultural-adventure',
            images: ['https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop'],
            duration: 7, rating: 4.8, basePrice: 1299, discountPrice: 999, category: 'CULTURAL',
            destination: { id: 'dest-1', name: 'Bali, Indonesia', slug: 'bali-indonesia', country: 'Indonesia', city: 'Bali' },
          },
          {
            id: 'demo-2', title: 'Swiss Alps Hiking Experience', slug: 'swiss-alps-hiking-experience',
            images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'],
            duration: 10, rating: 4.9, basePrice: 2499, discountPrice: 2199, category: 'ADVENTURE',
            destination: { id: 'dest-2', name: 'Swiss Alps', slug: 'swiss-alps', country: 'Switzerland', city: 'Zermatt' },
          },
        ]
        const match = demo.find(d => d.slug === slug)
        if (!match) return NextResponse.json({ error: 'Tour not found' }, { status: 404 })
        const mapped = {
          id: match.id,
          title: match.title,
          slug: match.slug,
          destination: match.destination?.name || null,
          destinationInfo: match.destination ? {
            id: match.destination.id,
            name: match.destination.name,
            slug: match.destination.slug,
            country: match.destination.country,
            city: match.destination.city,
          } : null,
          description: `${match.title} — demo description`,
          longDescription: `${match.title} — demo long description`,
          images: match.images,
          duration: match.duration,
          maxGroupSize: 12,
          minAge: 0,
          difficulty: 'Easy',
          price: Number(match.discountPrice ?? match.basePrice ?? 0),
          originalPrice: match.discountPrice ? Number(match.basePrice ?? 0) : null,
          rating: Number(match.rating ?? 0),
          reviews: 0,
          category: match.category,
          highlights: ['Demo Highlight A', 'Demo Highlight B'],
          included: ['Guide', 'Transfers'],
          excluded: ['Flights'],
          itinerary: [
            { day: 1, title: 'Arrival', activities: ['Airport pickup', 'Hotel check-in'], meals: ['Dinner'] },
            { day: 2, title: 'City Tour', activities: ['Sightseeing'], meals: ['Breakfast'] },
          ],
          availability: [
            { date: new Date().toISOString().slice(0,10), available: true, price: Number(match.discountPrice ?? match.basePrice ?? 0) }
          ],
        }
        return NextResponse.json({ tour: mapped })
      }
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
