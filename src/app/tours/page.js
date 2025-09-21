import React from 'react';
import { prisma } from '@/lib/prisma';
import ToursGridClient from '@/components/tours/ToursGridClient.jsx';
import T from '@/components/common/T.jsx';
import { searchToursAction } from './actions';

export const metadata = {
  title: 'All Tours - TravelWeb',
  description: 'Browse our complete collection of amazing travel tours and destinations.',
};

async function getInitialTours(searchParams) {
  const q = (searchParams?.q || '').trim();
  const category = searchParams?.category || undefined;
  const priceMin = Number.parseFloat(searchParams?.priceMin || '');
  const priceMax = Number.parseFloat(searchParams?.priceMax || '');
  const durationMin = Number.parseInt(searchParams?.durationMin || '');
  const durationMax = Number.parseInt(searchParams?.durationMax || '');

  const where = {
    isActive: true,
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        }
      : {}),
    ...(category ? { category } : {}),
    ...(Number.isFinite(priceMin) ? { basePrice: { gte: priceMin } } : {}),
    ...(Number.isFinite(priceMax) ? { basePrice: { lte: priceMax } } : {}),
    ...(Number.isFinite(durationMin) ? { duration: { gte: durationMin } } : {}),
    ...(Number.isFinite(durationMax) ? { duration: { lte: durationMax } } : {}),
  };

  const toursRaw = await prisma.tour.findMany({
    where,
    take: 24,
    orderBy: { rating: 'desc' },
    include: { destination: true },
  });

  return toursRaw.map((t) => ({
    id: t.id,
    title: t.title,
    slug: t.slug,
    images: t.images,
    duration: t.duration,
    rating: t.rating,
    basePrice: t.basePrice,
    discountPrice: t.discountPrice,
    category: t.category,
    destination: t.destination?.name || null,
  }));
}

export const dynamic = 'force-dynamic';

export default async function ToursPage({ searchParams }) {
  const initialTours = await getInitialTours(searchParams);
  const initialParams = {
    q: searchParams?.q || '',
    category: searchParams?.category || '',
    priceMin: searchParams?.priceMin || '',
    priceMax: searchParams?.priceMax || '',
    durationMin: searchParams?.durationMin || '',
    durationMax: searchParams?.durationMax || '',
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-r from-primary via-primary-hover to-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4"><T k="tours.title" f="All Tours & Experiences" /></h1>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              <T k="tours.subtitle" f="Discover amazing destinations and create unforgettable memories with our curated travel experiences." />
            </p>
          </div>
        </div>
      </section>

      {/* Server-render initial results; client handles further filtering */}
      <ToursGridClient initialTours={initialTours} initialParams={initialParams} skipInitialFetch={true} searchAction={searchToursAction} />
    </div>
  );
}
