'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  Clock, 
  CheckCircle, 
  XCircle,
  ArrowLeft,
  Share2,
  Heart,
  CreditCard,
  Shield,
  Award
} from 'lucide-react';
import { toast } from 'react-toastify';
import { formatPrice, formatDate } from '@/lib/utils';
import ReviewsSection from '@/components/reviews/ReviewsSection';

export default function TourDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [travelers, setTravelers] = useState(2);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishProcessing, setWishProcessing] = useState(false);

  useEffect(() => {
    const fetchTour = async () => {
      if (!params.slug) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/tours/${params.slug}`);
        if (!res.ok) {
          setTour(null);
          setLoading(false);
          return;
        }
        const data = await res.json();
        const t = data.tour;
        setTour(t);
        // Preselect first available date if present
        if (t?.availability?.length) {
          const first = t.availability.find(a => a.available) || t.availability[0];
          if (first?.date) setSelectedDate(first.date);
        }
      } catch (e) {
        console.error('Failed to load tour', e);
        setTour(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [params.slug]);

  const handleBookNow = () => {
    if (!selectedDate) {
      toast.error('Please select a travel date');
      return;
    }

    // Prepare tour data for URL parameters
    const tourData = {
      id: tour.id,
      title: tour.title,
      destination: tour.destination,
      duration: tour.duration,
      price: tour.price,
      category: tour.category,
      image: tour.images?.[0]
    };

    // Create URL parameters for booking page
    const params = new URLSearchParams({
      tour: encodeURIComponent(JSON.stringify(tourData)),
      startDate: selectedDate,
      guests: travelers.toString()
    });

    // Navigate to booking flow with parameters
    router.push(`/booking?${params.toString()}`);
  };

  useEffect(() => {
    // When user is logged in and tour is loaded, check wishlist status
    const checkWishlist = async () => {
      try {
        if (!tour?.id || !session?.user) return;
        const res = await fetch('/api/wishlist');
        if (!res.ok) return;
        const data = await res.json();
        const exists = (data.items || []).some((it) => it.tourId === tour.id || it.tour?.id === tour.id);
        setIsWishlisted(exists);
      } catch (e) {
        // silent fail
      }
    };
    checkWishlist();
  }, [tour?.id, session?.user]);

  const handleWishlist = async () => {
    if (!tour?.id) return;
    if (!session?.user) {
      toast.error('Please sign in to use wishlist');
      router.push('/auth/signin');
      return;
    }
    if (wishProcessing) return;
    setWishProcessing(true);
    try {
      if (isWishlisted) {
        const res = await fetch('/api/wishlist', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tourId: tour.id }),
        });
        if (res.ok) {
          setIsWishlisted(false);
          toast.success('Removed from wishlist');
        } else {
          toast.error('Failed to remove from wishlist');
        }
      } else {
        const res = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tourId: tour.id }),
        });
        if (res.ok) {
          setIsWishlisted(true);
          toast.success('Added to wishlist');
        } else {
          toast.error('Failed to add to wishlist');
        }
      }
    } catch (e) {
      toast.error('Wishlist action failed');
    } finally {
      setWishProcessing(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: tour.title,
          text: `Check out this amazing tour: ${tour.title}`,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copy URL
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const jsonLd = tour ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: tour.title,
    description: tour.description,
    image: Array.isArray(tour.images) ? tour.images : [],
    brand: { '@type': 'Brand', name: 'TravelWeb' },
    category: tour.category,
    aggregateRating: tour.rating ? {
      '@type': 'AggregateRating',
      ratingValue: String(tour.rating || 0),
      reviewCount: String(tour.reviews || 0)
    } : undefined,
    offers: {
      '@type': 'Offer',
      price: String(tour.price || 0),
      priceCurrency: 'USD',
      availability: (tour.availability?.some(a => a.available)) ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
    }
  } : null;

  if (!tour) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Tour not found</h1>
          <Button asChild>
            <Link href="/tours">View All Tours</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-section-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tours
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleWishlist}
                disabled={wishProcessing}
                aria-pressed={isWishlisted}
                className={isWishlisted ? 'text-red-500' : ''}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="outline" onClick={() => {
                try {
                  const raw = localStorage.getItem('tripDraft')
                  const draft = raw ? JSON.parse(raw) : { title: 'My Trip', days: 1, items: [] }
                  const title = tour?.title || 'Tour'
                  draft.items.push({ day: 1, orderIndex: draft.items.length, tourId: tour.id, title })
                  localStorage.setItem('tripDraft', JSON.stringify(draft))
                  router.push('/itinerary/builder')
                } catch {
                  router.push('/itinerary/builder')
                }
              }}>
                Add to Itinerary
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* JSON-LD SEO */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* Destination info */}
      {tour.destinationInfo && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>
                  {tour.destinationInfo.city ? `${tour.destinationInfo.city}, ` : ''}
                  {tour.destinationInfo.state ? `${tour.destinationInfo.state}, ` : ''}
                  {tour.destinationInfo.country || tour.destination}
                </span>
              </div>
              {tour.destinationInfo.latitude && tour.destinationInfo.longitude && (
                <a
                  className="text-primary hover:underline"
                  href={`https://www.google.com/maps?q=${tour.destinationInfo.latitude},${tour.destinationInfo.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on Maps
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src={tour.images[selectedImage]}
                  alt={tour.title}
                  fill
                  className="object-cover"
                  priority
                />
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                  {tour.category}
                </Badge>
              </div>
              
              {tour.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {tour.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square rounded-md overflow-hidden ${
                        selectedImage === index ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${tour.title} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tour Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>{tour.destination}</span>
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-4">{tour.title}</h1>
                
                <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{tour.duration} days</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>Max {tour.maxGroupSize} people</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>{tour.rating} ({tour.reviews} reviews)</span>
                  </div>
                </div>

                <p className="text-foreground leading-relaxed">{tour.description}</p>
              </div>

              {/* Highlights */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Tour Highlights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {tour.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-foreground">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Included/Excluded */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">What&apos;s Included</h3>
                  <ul className="space-y-2">
                    {tour.included.map((item, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-foreground text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">What&apos;s Excluded</h3>
                  <ul className="space-y-2">
                    {tour.excluded.map((item, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-foreground text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Itinerary */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Daily Itinerary</h2>
                <div className="space-y-4">
                  {tour.itinerary.map((day) => (
                    <Card key={day.day}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Day {day.day}: {day.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {day.activities.map((activity, index) => (
                            <li key={index} className="text-foreground text-sm">• {activity}</li>
                          ))}
                        </ul>
                        <div className="mt-2 text-xs text-muted-foreground">
                          Meals: {day.meals.join(', ')}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-primary">
                          {formatPrice(tour.price)}
                        </span>
                        {tour.originalPrice > tour.price && (
                          <span className="text-lg text-muted-foreground line-through">
                            {formatPrice(tour.originalPrice)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">per person</p>
                    </div>
                    {tour.originalPrice > tour.price && (
                      <Badge variant="destructive">
                        Save {formatPrice(tour.originalPrice - tour.price)}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Date Selection */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Select Date
                    </label>
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    >
                      <option value="">Choose a date</option>
                      {tour.availability.map((slot) => (
                        <option 
                          key={slot.date} 
                          value={slot.date}
                          disabled={!slot.available}
                        >
                          {formatDate(slot.date)} {!slot.available && '(Sold Out)'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Travelers */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Number of Travelers
                    </label>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTravelers(Math.max(1, travelers - 1))}
                      >
                        -
                      </Button>
                      <span className="text-lg font-medium w-8 text-center">{travelers}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTravelers(Math.min(tour.maxGroupSize, travelers + 1))}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Total Price */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between text-lg font-semibold">
                      <span>Total Price:</span>
                      <span className="text-primary">
                        {formatPrice(tour.price * travelers)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {travelers} {travelers === 1 ? 'traveler' : 'travelers'} × {formatPrice(tour.price)}
                    </p>
                  </div>

                  {/* Booking Button */}
                  <Button 
                    variant="premium" 
                    size="lg" 
                    className="w-full"
                    onClick={handleBookNow}
                    disabled={!selectedDate}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Book Now
                  </Button>

                  {/* Security Badges */}
                  <div className="flex items-center justify-center space-x-4 pt-4 border-t text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Shield className="h-4 w-4" />
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="h-4 w-4" />
                      <span>Best Price</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {tour?.id && (
        <div className="mt-8">
          <ReviewsSection tourId={tour.id} />
        </div>
      )}
    </div>
  );
}
