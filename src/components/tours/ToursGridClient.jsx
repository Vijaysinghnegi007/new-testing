'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Star, Search, SlidersHorizontal } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { formatPrice } from '@/lib/utils';

// initial client-side helpers
const parseImages = (imagesField) => {
  try {
    if (!imagesField) return [];
    if (Array.isArray(imagesField)) return imagesField;
    const arr = JSON.parse(imagesField);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
};

export default function ToursGridClient({ initialTours = [], initialParams = {}, skipInitialFetch = false, searchAction }) {
  const { t, locale } = useI18n();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(initialTours.length === 0);
  const [error, setError] = useState('');
  const [tours, setTours] = useState(initialTours);
  const [q, setQ] = useState(initialParams.q || '');
  const [category, setCategory] = useState(initialParams.category || '');
  const [sort, setSort] = useState('rating');
  const [priceMin, setPriceMin] = useState(initialParams.priceMin || '');
  const [priceMax, setPriceMax] = useState(initialParams.priceMax || '');
  const [durationMin, setDurationMin] = useState(initialParams.durationMin || '');
  const [durationMax, setDurationMax] = useState(initialParams.durationMax || '');
  const [wish, setWish] = useState(new Set());

  const fetchTours = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (category && category !== 'All') params.set('category', category.toUpperCase());
      if (priceMin) params.set('priceMin', String(priceMin));
      if (priceMax) params.set('priceMax', String(priceMax));
      if (durationMin) params.set('durationMin', String(durationMin));
      if (durationMax) params.set('durationMax', String(durationMax));
      const res = await fetch(`/api/search?${params.toString()}`);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setTours(data.tours || []);
    } catch (e) {
      setError('Failed to load tours');
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (skipInitialFetch && initialTours.length) {
      // we already have data from the server
      setLoading(false);
      return;
    }
    fetchTours();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Prefetch wishlist for signed-in users
  useEffect(() => {
    const prefetchWishlist = async () => {
      try {
        if (!session?.user) return;
        const res = await fetch('/api/wishlist', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        const s = new Set((data.items || []).map((it) => it.tourId || it.tour?.id).filter(Boolean));
        setWish(s);
      } catch {}
    };
    prefetchWishlist();
  }, [session?.user]);

  const sortedTours = useMemo(() => {
    const list = [...tours];
    switch (sort) {
      case 'price_asc':
        return list.sort((a, b) => (a.basePrice || 0) - (b.basePrice || 0));
      case 'price_desc':
        return list.sort((a, b) => (b.basePrice || 0) - (a.basePrice || 0));
      case 'duration':
        return list.sort((a, b) => (b.duration || 0) - (a.duration || 0));
      case 'rating':
      default:
        return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
  }, [tours, sort]);

  const categories = ['All', 'ADVENTURE', 'CULTURAL', 'LUXURY', 'FAMILY'];

  const toggleWish = async (tourId) => {
    try {
      if (!session?.user) {
        window.location.href = '/auth/signin';
        return;
      }
      if (wish.has(tourId)) {
        const res = await fetch('/api/wishlist', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tourId }),
        });
        if (res.ok) {
          const next = new Set(wish);
          next.delete(tourId);
          setWish(next);
        }
      } else {
        const res = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tourId }),
        });
        if (res.ok) {
          const next = new Set(wish);
          next.add(tourId);
          setWish(next);
        }
      }
    } catch {}
  };

  return (
    <>
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-5xl mx-auto -mt-10 relative z-10">
        <form
          className="grid grid-cols-1 md:grid-cols-5 gap-4"
          action={typeof searchAction === 'function' ? searchAction : undefined}
          method={typeof searchAction === 'function' ? 'POST' : undefined}
        >
          <div className="col-span-2 flex items-center space-x-2 text-gray-600">
            <input
              type="text"
              name="q"
              placeholder={t('tours.search.placeholder', 'Search tours...')}
              className="w-full outline-none text-gray-900 placeholder-gray-500 border border-gray-200 rounded-md px-3 py-2"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <select
              name="category"
              aria-label={t('tours.filters.category', 'Category')}
              className="w-full border border-gray-200 rounded-md px-3 py-2 bg-white text-gray-900"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? t('tours.categories.all', 'All') : t(`tours.categories.${c.toLowerCase()}`, c.charAt(0) + c.slice(1).toLowerCase())}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              name="priceMin"
              inputMode="numeric"
              placeholder="Min $"
              className="w-full border border-gray-200 rounded-md px-2 py-2"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
            />
            <input
              type="number"
              name="priceMax"
              inputMode="numeric"
              placeholder="Max $"
              className="w-full border border-gray-200 rounded-md px-2 py-2"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              name="durationMin"
              inputMode="numeric"
              placeholder="Min days"
              className="w-full border border-gray-200 rounded-md px-2 py-2"
              value={durationMin}
              onChange={(e) => setDurationMin(e.target.value)}
            />
            <input
              type="number"
              name="durationMax"
              inputMode="numeric"
              placeholder="Max days"
              className="w-full border border-gray-200 rounded-md px-2 py-2"
              value={durationMax}
              onChange={(e) => setDurationMax(e.target.value)}
            />
          </div>
          <Button type="button" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50" onClick={() => { setCategory(''); setQ(''); setPriceMin(''); setPriceMax(''); setDurationMin(''); setDurationMax(''); } }>
            <SlidersHorizontal className="h-5 w-5 mr-2" />
            {t('actions.reset', 'Reset')}
          </Button>
          {/* If a server action was provided, let the button submit the form; otherwise fall back to client fetch */}
          <Button
            variant="gradient"
            type={typeof searchAction === 'function' ? 'submit' : 'button'}
            onClick={typeof searchAction === 'function' ? undefined : fetchTours}
            formAction={typeof searchAction === 'function' ? searchAction : undefined}
          >
            <Search className="h-5 w-5 mr-2" />
            {t('actions.search', 'Search')}
          </Button>
        </form>
      </div>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {loading ? t('tours.loading', 'Loading tours...') : `${sortedTours.length} ${t('tours.found', 'Tours Found')}`}
              </h2>
              {error && <p className="text-destructive text-sm mt-1">{error}</p>}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">{t('tours.sortBy', 'Sort by:')}</span>
              <select
                aria-label={t('tours.sortBy', 'Sort by:')}
                className="border border-border rounded-md px-3 py-2 bg-card text-foreground"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="price_asc">{t('tours.sort.priceAsc', 'Price: Low to High')}</option>
                <option value="price_desc">{t('tours.sort.priceDesc', 'Price: High to Low')}</option>
                <option value="rating">{t('tours.sort.rating', 'Rating')}</option>
                <option value="duration">{t('tours.sort.duration', 'Duration')}</option>
              </select>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((c) => (
              <Button
                key={c}
                variant={category === c ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategory(c)}
              >
                {c === 'All' ? t('tours.categories.all', 'All') : t(`tours.categories.${c.toLowerCase()}`, c.charAt(0) + c.slice(1).toLowerCase())}
              </Button>
            ))}
          </div>

          {/* Tours Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {!loading && sortedTours.map((tour) => {
              const images = parseImages(tour.images);
              const price = tour.discountPrice ?? tour.basePrice ?? 0;
              const orig = tour.discountPrice ? tour.basePrice : null;
              const slug = tour.slug;
              const wished = wish.has(tour.id);
              return (
                <Card key={tour.id} className="overflow-hidden card transition-all duration-300 bg-card border-border hover:shadow-lg">
                  <div className="relative">
                    <Image 
                      src={images[0] || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop'} 
                      alt={tour.title}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-primary text-primary-foreground shadow-md">
                        {tour.category}
                      </Badge>
                    </div>
                    {orig && orig > price && (
                      <div className="absolute top-4 right-4">
                        <Badge variant="destructive" className="shadow-md">
                          Save ${Math.max(0, Math.round(orig - price))}
                        </Badge>
                      </div>
                    )}
                    <button
                      type="button"
                      aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
                      className={`absolute top-4 left-4 h-9 w-9 flex items-center justify-center rounded-full bg-white/90 ${wished ? 'text-red-500' : 'text-gray-700'}`}
                      onClick={() => toggleWish(tour.id)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1 4.22 2.44C11.09 5 12.76 4 14.5 4 17 4 19 6 19 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </button>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl hover:text-primary transition-colors">
                      <Link href={`/tours/${slug}`}>
                        {tour.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {tour.destination || 'Various locations'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {tour.duration || 0} days
                        </span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
                          <span className="font-medium text-foreground">{tour.rating ?? 0}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between">
                    <div className="text-left">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-primary">{formatPrice(price, locale === 'es' ? 'EUR' : 'USD', locale)}</span>
                        {orig && orig > price && (
                          <span className="text-lg text-muted-foreground line-through">{formatPrice(orig, locale === 'es' ? 'EUR' : 'USD', locale)}</span>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">{t('tours.perPerson', 'per person')}</span>
                    </div>
                    <Button variant="gradient" asChild>
                      <Link href={`/tours/${slug}`}>
                        {t('actions.viewDetails', 'View Details')}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
