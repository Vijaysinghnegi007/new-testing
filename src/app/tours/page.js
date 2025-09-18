import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Users,
  Star,
  ArrowRight,
  SlidersHorizontal
} from 'lucide-react';

export const metadata = {
  title: 'All Tours - TravelWeb',
  description: 'Browse our complete collection of amazing travel tours and destinations.',
};

export default function ToursPage() {
  // Sample tours data - in real app this would come from database
  const tours = [
    {
      id: 1,
      title: "Bali Cultural Adventure",
      slug: "bali-cultural-adventure",
      destination: "Bali, Indonesia",
      duration: 7,
      price: 1299,
      originalPrice: 1599,
      rating: 4.8,
      reviews: 245,
      image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop",
      category: "Cultural",
      highlights: ["Temple Visits", "Rice Terraces", "Traditional Dance"]
    },
    {
      id: 2,
      title: "Swiss Alps Hiking Experience",
      slug: "swiss-alps-hiking-experience",
      destination: "Swiss Alps, Switzerland",
      duration: 10,
      price: 2499,
      originalPrice: 2899,
      rating: 4.9,
      reviews: 189,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      category: "Adventure",
      highlights: ["Mountain Hiking", "Scenic Views", "Local Cuisine"]
    },
    {
      id: 3,
      title: "Maldives Luxury Retreat",
      slug: "maldives-luxury-retreat",
      destination: "Maldives",
      duration: 5,
      price: 3999,
      originalPrice: 4799,
      rating: 5.0,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=300&fit=crop",
      category: "Luxury",
      highlights: ["Overwater Villa", "Spa Treatments", "Private Beach"]
    },
    {
      id: 4,
      title: "Japan Cherry Blossom Tour",
      slug: "japan-cherry-blossom-tour",
      destination: "Tokyo & Kyoto, Japan",
      duration: 8,
      price: 2199,
      originalPrice: null,
      rating: 4.7,
      reviews: 332,
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop",
      category: "Cultural",
      highlights: ["Cherry Blossoms", "Traditional Gardens", "Sushi Making"]
    },
    {
      id: 5,
      title: "African Safari Adventure",
      slug: "african-safari-adventure",
      destination: "Kenya & Tanzania",
      duration: 12,
      price: 3299,
      originalPrice: 3899,
      rating: 4.9,
      reviews: 198,
      image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&h=300&fit=crop",
      category: "Adventure",
      highlights: ["Big Five", "Serengeti", "Maasai Culture"]
    },
    {
      id: 6,
      title: "Northern Lights Iceland",
      slug: "northern-lights-iceland",
      destination: "Reykjavik, Iceland",
      duration: 6,
      price: 1899,
      originalPrice: null,
      rating: 4.6,
      reviews: 287,
      image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=300&fit=crop",
      category: "Adventure",
      highlights: ["Northern Lights", "Blue Lagoon", "Glacier Tours"]
    }
  ];

  const categories = ["All", "Adventure", "Cultural", "Luxury", "Family", "Romantic"];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary via-primary-hover to-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              All Tours & Experiences
            </h1>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Discover amazing destinations and create unforgettable memories with our curated travel experiences.
            </p>
            
            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg p-6 shadow-xl max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Destination"
                    className="flex-1 outline-none text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="h-5 w-5" />
                  <input
                    type="date"
                    className="flex-1 outline-none text-gray-900"
                  />
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Users className="h-5 w-5" />
                  <select className="flex-1 outline-none text-gray-900">
                    <option>2 Guests</option>
                    <option>1 Guest</option>
                    <option>3 Guests</option>
                    <option>4+ Guests</option>
                  </select>
                </div>
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  <SlidersHorizontal className="h-5 w-5 mr-2" />
                  Filters
                </Button>
                <Button variant="gradient">
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tours Grid Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {tours.length} Tours Found
              </h2>
              <p className="text-muted-foreground">
                Showing all available tours and experiences
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select className="border border-border rounded-md px-3 py-2 bg-card text-foreground">
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating</option>
                <option>Duration</option>
                <option>Popularity</option>
              </select>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Tours Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour) => (
              <Card key={tour.id} className="overflow-hidden card transition-all duration-300 bg-card border-border hover:shadow-lg">
                <div className="relative">
                  <Image 
                    src={tour.image} 
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
                  {tour.originalPrice && tour.originalPrice > tour.price && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="destructive" className="shadow-md">
                        Save ${tour.originalPrice - tour.price}
                      </Badge>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-xl hover:text-primary transition-colors">
                    <Link href={`/tours/${tour.slug}`}>
                      {tour.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {tour.destination}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {tour.duration} days
                      </span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
                        <span className="font-medium text-foreground">{tour.rating}</span>
                        <span className="text-muted-foreground ml-1">({tour.reviews})</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {tour.highlights.slice(0, 3).map((highlight, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-primary">${tour.price}</span>
                      {tour.originalPrice && tour.originalPrice > tour.price && (
                        <span className="text-lg text-muted-foreground line-through">${tour.originalPrice}</span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">per person</span>
                  </div>
                  <Button variant="gradient" asChild>
                    <Link href={`/tours/${tour.slug}`}>
                      View Details
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Tours
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
