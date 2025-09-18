import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Star,
  ArrowRight,
  Plane,
  Camera,
  Mountain,
  Waves,
  TreePine,
  Building
} from 'lucide-react';

export default function Home() {
  // Sample featured tours data
  const featuredTours = [
    {
      id: 1,
      title: "Bali Cultural Adventure",
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
      destination: "Maldives",
      duration: 5,
      price: 3999,
      originalPrice: 4799,
      rating: 5.0,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=300&fit=crop",
      category: "Luxury",
      highlights: ["Overwater Villa", "Spa Treatments", "Private Beach"]
    }
  ];

  const destinations = [
    { name: "Paris, France", tours: 45, icon: Building, color: "bg-pink-500" },
    { name: "Tokyo, Japan", tours: 32, icon: Building, color: "bg-red-500" },
    { name: "New York, USA", tours: 28, icon: Building, color: "bg-blue-500" },
    { name: "Bali, Indonesia", tours: 51, icon: TreePine, color: "bg-green-500" },
    { name: "Swiss Alps", tours: 19, icon: Mountain, color: "bg-gray-500" },
    { name: "Maldives", tours: 23, icon: Waves, color: "bg-cyan-500" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=1080&fit=crop')"
        }}
      >
        <div className="text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Discover Your Next
            <span className="text-blue-400"> Adventure</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Explore breathtaking destinations and create unforgettable memories with our expertly curated travel experiences.
          </p>
          
          {/* Search Bar */}
          <div className="bg-white rounded-lg p-6 shadow-2xl max-w-4xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-5 w-5" />
                <input
                  type="text"
                  placeholder="Where to?"
                  className="flex-1 outline-none text-gray-900"
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
              <Button variant="gradient" className="h-12">
                <Search className="h-5 w-5 mr-2" />
                Search Tours
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="premium" size="xl">
              Explore Tours
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="xl" className="text-white border-white hover:bg-white hover:text-black backdrop-blur-sm">
              Watch Video
              <Plane className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section className="py-16 bg-section-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Featured Tours</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover our most popular and highly-rated travel experiences, carefully selected for unforgettable adventures.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTours.map((tour) => (
            <Card key={tour.id} className="overflow-hidden card transition-all duration-300 bg-card border-border">
                <div className="relative">
                  <Image 
                    src={tour.image} 
                    alt={tour.title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvvW6i6X9HvvKpBHHvaxww"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm font-medium shadow-md">
                      {tour.category}
                    </span>
                  </div>
                  {tour.originalPrice > tour.price && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded-full text-sm font-medium shadow-md">
                        Save ${tour.originalPrice - tour.price}
                      </span>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{tour.title}</CardTitle>
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
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="font-medium text-foreground">{tour.rating}</span>
                        <span className="text-muted-foreground ml-1">({tour.reviews})</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {tour.highlights.map((highlight, index) => (
                        <span key={index} className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                <div className="text-left">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-primary">${tour.price}</span>
                      {tour.originalPrice > tour.price && (
                        <span className="text-lg text-muted-foreground line-through">${tour.originalPrice}</span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">per person</span>
                  </div>
                  <Button variant="gradient" asChild>
                    <Link href={`/tours/${tour.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
                      View Details
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link href="/tours">
                View All Tours
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Popular Destinations</h2>
            <p className="text-xl text-muted-foreground">
              Explore the world&apos;s most sought-after travel destinations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((destination, index) => {
              const IconComponent = destination.icon;
              return (
                <div key={index} className="group cursor-pointer">
                  <div className="bg-card rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 card border border-border">
                    <div className="flex items-center space-x-4">
                      <div className={`${destination.color} p-3 rounded-full shadow-md`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {destination.name}
                        </h3>
                        <p className="text-muted-foreground">{destination.tours} tours available</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-section-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose TravelWeb?</h2>
            <p className="text-xl text-muted-foreground">
              We make your travel dreams come true with our exceptional services.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-primary to-primary-hover w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Expert Local Guides</h3>
              <p className="text-muted-foreground">
                Our experienced local guides provide authentic insights and unforgettable experiences at every destination.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-primary to-primary-hover w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Exceptional Quality</h3>
              <p className="text-muted-foreground">
                We maintain the highest standards of service quality, ensuring every moment of your journey is perfect.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-primary to-primary-hover w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Memorable Experiences</h3>
              <p className="text-muted-foreground">
                Create lasting memories with our carefully curated experiences and personalized attention to detail.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
