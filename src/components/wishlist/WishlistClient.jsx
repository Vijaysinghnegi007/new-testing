'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Star, Heart, XCircle } from 'lucide-react';

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

export default function WishlistClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/wishlist', { cache: 'no-store' });
      if (res.status === 401) {
        setError('Please sign in to view your wishlist.');
        setItems([]);
        return;
      }
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setItems(data.items || []);
    } catch (e) {
      setError('Failed to load wishlist');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeItem = async (tourId) => {
    try {
      const res = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tourId }),
      });
      if (res.ok) {
        setItems((prev) => prev.filter((it) => (it.tourId || it.tour?.id) !== tourId));
      }
    } catch {}
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          {[1,2,3].map((i) => (
            <div key={i} className="h-28 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
        {error.includes('sign in') && (
          <div className="mt-4">
            <Button onClick={() => router.push('/auth/signin')}>
              Sign In
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Your wishlist is empty</CardTitle>
            <CardDescription>Browse tours and tap the heart icon to save them here.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/tours">Browse Tours</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it) => {
          const tour = it.tour || {};
          const images = parseImages(tour.images);
          const price = tour.discountPrice ?? tour.basePrice ?? 0;
          const orig = tour.discountPrice ? tour.basePrice : null;
          const slug = tour.slug;
          return (
            <Card key={(it.id || tour.id)} className="overflow-hidden">
              <div className="relative">
                <Image
                  src={images[0] || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop'}
                  alt={tour.title || 'Tour'}
                  width={400}
                  height={240}
                  className="w-full h-44 object-cover"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-3 right-3 bg-white/90"
                  onClick={() => removeItem(tour.id)}
                  aria-label="Remove from wishlist"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">
                  <Link href={`/tours/${slug}`}>{tour.title}</Link>
                </CardTitle>
                <CardDescription className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {tour.destination || 'Various locations'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-2xl font-bold text-primary">${Number(price)}</span>
                    {orig && orig > price && (
                      <span className="text-sm text-muted-foreground line-through ml-2">${Number(orig)}</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
                    <span className="font-medium text-foreground">{Number(tour.rating ?? 0)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <Button variant="outline" asChild>
                  <Link href={`/tours/${slug}`}>View Details</Link>
                </Button>
                <Button variant="gradient" asChild>
                  <Link href={`/tours/${slug}`}>Book Now</Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
