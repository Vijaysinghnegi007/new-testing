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
import toast from 'react-hot-toast';
import { formatPrice, formatDate } from '@/lib/utils';

// Mock tour data (in production, this would come from API/database)
const getTourBySlug = (slug) => {
  const tours = {
    'bali-cultural-adventure': {
      id: 1,
      title: "Bali Cultural Adventure",
      slug: "bali-cultural-adventure",
      destination: "Bali, Indonesia",
      description: "Immerse yourself in the rich cultural heritage of Bali with this comprehensive 7-day journey. Experience ancient temples, traditional villages, authentic cuisine, and breathtaking landscapes that make Bali truly magical.",
      longDescription: `
        Discover the heart and soul of Bali on this extraordinary cultural adventure. Over 7 unforgettable days, you'll explore ancient Hindu temples, witness traditional Balinese ceremonies, learn about local crafts, and taste authentic cuisine in family-run warungs.

        Our expert local guides will take you off the beaten path to hidden gems that most tourists never see. From the terraced rice fields of Jatiluwih to the artistic village of Mas, every day brings new discoveries and authentic cultural encounters.

        This tour is perfect for travelers who want to go beyond the surface and truly understand Balinese culture, traditions, and way of life.
      `,
      images: [
        "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1544531586-fbb6c80cd02b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&h=600&fit=crop"
      ],
      duration: 7,
      maxGroupSize: 12,
      minAge: 16,
      difficulty: "Easy",
      price: 1299,
      originalPrice: 1599,
      rating: 4.8,
      reviews: 245,
      category: "Cultural",
      highlights: [
        "Visit ancient temples including Tanah Lot and Besakih",
        "Explore traditional villages and meet local families",
        "Learn traditional Balinese cooking",
        "Witness a traditional Kecak fire dance",
        "Trek through stunning rice terraces",
        "Visit local art workshops and galleries"
      ],
      included: [
        "Accommodation in traditional Balinese guesthouses",
        "All meals as specified in itinerary",
        "Professional English-speaking guide",
        "Transportation in comfortable AC vehicle",
        "All entrance fees and permits",
        "Cultural workshop experiences",
        "Airport transfers"
      ],
      excluded: [
        "International flights",
        "Travel insurance",
        "Personal expenses and souvenirs",
        "Alcoholic beverages",
        "Tips for guides and drivers",
        "Optional activities not mentioned"
      ],
      itinerary: [
        {
          day: 1,
          title: "Arrival in Ubud",
          activities: ["Airport pickup", "Check-in to traditional guesthouse", "Welcome dinner with local family"],
          meals: ["Dinner"]
        },
        {
          day: 2,
          title: "Temples and Villages",
          activities: ["Visit Tirta Empul holy spring temple", "Explore Penglipuran traditional village", "Traditional weaving workshop"],
          meals: ["Breakfast", "Lunch", "Dinner"]
        },
        {
          day: 3,
          title: "Rice Terraces and Culture",
          activities: ["Sunrise at Jatiluwih rice terraces", "Traditional farming experience", "Balinese cooking class"],
          meals: ["Breakfast", "Lunch", "Dinner"]
        },
        {
          day: 4,
          title: "Art and Craft Villages",
          activities: ["Visit Mas wood carving village", "Silver jewelry workshop in Celuk", "Traditional painting class"],
          meals: ["Breakfast", "Lunch", "Dinner"]
        },
        {
          day: 5,
          title: "Spiritual Journey",
          activities: ["Visit Besakih Mother Temple", "Meditation session with local monk", "Traditional purification ceremony"],
          meals: ["Breakfast", "Lunch", "Dinner"]
        },
        {
          day: 6,
          title: "Coastal Temples",
          activities: ["Tanah Lot temple at sunset", "Local market visit", "Kecak fire dance performance"],
          meals: ["Breakfast", "Lunch", "Dinner"]
        },
        {
          day: 7,
          title: "Departure",
          activities: ["Final breakfast", "Souvenir shopping", "Airport transfer"],
          meals: ["Breakfast"]
        }
      ],
      availability: [
        { date: "2024-03-15", available: true, price: 1299 },
        { date: "2024-03-22", available: true, price: 1299 },
        { date: "2024-04-05", available: false, price: 1299 },
        { date: "2024-04-12", available: true, price: 1399 },
      ]
    }
  };
  
  return tours[slug] || null;
};

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

  useEffect(() => {
    if (params.slug) {
      const tourData = getTourBySlug(params.slug);
      setTour(tourData);
      setLoading(false);
    }
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
      image: tour.images[0]
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

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
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
                className={isWishlisted ? 'text-red-500' : ''}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
}
