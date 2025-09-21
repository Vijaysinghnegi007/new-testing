import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import T from '@/components/common/T.jsx';
import {
  Search,
  MapPin,
  Star,
  ArrowRight,
  Filter,
  Globe,
  Mountain,
  Waves,
  TreePine,
  Building,
  Sun,
  Snowflake
} from 'lucide-react';

export default function DestinationsPage() {
  const destinations = [
    {
      id: 1,
      name: "Paris, France",
      country: "France",
      continent: "Europe",
      type: "City",
      image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=600&h=400&fit=crop",
      description: "The City of Light offers romantic ambiance, world-class museums, and iconic landmarks.",
      tours: 45,
      rating: 4.8,
      climate: "Temperate",
      bestTime: "Apr-Oct",
      highlights: ["Eiffel Tower", "Louvre Museum", "Seine River", "Notre-Dame"],
      price: "from $899"
    },
    {
      id: 2,
      name: "Tokyo, Japan",
      country: "Japan",
      continent: "Asia",
      type: "City",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop",
      description: "A fascinating blend of ancient traditions and cutting-edge technology.",
      tours: 32,
      rating: 4.9,
      climate: "Humid Subtropical",
      bestTime: "Mar-May, Sep-Nov",
      highlights: ["Shibuya Crossing", "Mount Fuji Views", "Traditional Temples", "Modern Districts"],
      price: "from $1,299"
    },
    {
      id: 3,
      name: "Bali, Indonesia",
      country: "Indonesia",
      continent: "Asia",
      type: "Island",
      image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=600&h=400&fit=crop",
      description: "Tropical paradise with stunning beaches, rich culture, and spiritual experiences.",
      tours: 51,
      rating: 4.7,
      climate: "Tropical",
      bestTime: "Apr-Sep",
      highlights: ["Rice Terraces", "Hindu Temples", "Beautiful Beaches", "Volcano Tours"],
      price: "from $699"
    },
    {
      id: 4,
      name: "Swiss Alps, Switzerland",
      country: "Switzerland",
      continent: "Europe",
      type: "Mountains",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      description: "Breathtaking mountain scenery, pristine lakes, and charming alpine villages.",
      tours: 19,
      rating: 4.9,
      climate: "Alpine",
      bestTime: "Jun-Sep, Dec-Mar",
      highlights: ["Jungfraujoch", "Matterhorn", "Alpine Lakes", "Scenic Railways"],
      price: "from $1,899"
    },
    {
      id: 5,
      name: "Maldives",
      country: "Maldives",
      continent: "Asia",
      type: "Islands",
      image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&h=400&fit=crop",
      description: "Luxury overwater villas, crystal-clear waters, and world-class diving.",
      tours: 23,
      rating: 5.0,
      climate: "Tropical",
      bestTime: "Nov-Apr",
      highlights: ["Overwater Villas", "Coral Reefs", "Water Sports", "Spa Treatments"],
      price: "from $2,999"
    },
    {
      id: 6,
      name: "New York, USA",
      country: "United States",
      continent: "North America",
      type: "City",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop",
      description: "The city that never sleeps, offering Broadway shows, world-class dining, and iconic sights.",
      tours: 28,
      rating: 4.6,
      climate: "Humid Continental",
      bestTime: "Apr-Jun, Sep-Nov",
      highlights: ["Statue of Liberty", "Times Square", "Central Park", "Brooklyn Bridge"],
      price: "from $799"
    },
    {
      id: 7,
      name: "Santorini, Greece",
      country: "Greece",
      continent: "Europe",
      type: "Island",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&h=400&fit=crop",
      description: "Iconic white-washed buildings, stunning sunsets, and ancient volcanic landscapes.",
      tours: 34,
      rating: 4.8,
      climate: "Mediterranean",
      bestTime: "Apr-Oct",
      highlights: ["Sunset Views", "White Villages", "Wine Tasting", "Ancient Ruins"],
      price: "from $1,199"
    },
    {
      id: 8,
      name: "Dubai, UAE",
      country: "United Arab Emirates",
      continent: "Asia",
      type: "City",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop",
      description: "Ultra-modern city with luxury shopping, stunning architecture, and desert adventures.",
      tours: 41,
      rating: 4.7,
      climate: "Desert",
      bestTime: "Nov-Mar",
      highlights: ["Burj Khalifa", "Palm Jumeirah", "Desert Safari", "Luxury Shopping"],
      price: "from $999"
    },
    {
      id: 9,
      name: "Costa Rica",
      country: "Costa Rica",
      continent: "Central America",
      type: "Nature",
      image: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=600&h=400&fit=crop",
      description: "Biodiversity hotspot with rainforests, beaches, and incredible wildlife.",
      tours: 26,
      rating: 4.8,
      climate: "Tropical",
      bestTime: "Dec-Apr",
      highlights: ["Rainforest Tours", "Wildlife Viewing", "Zip-lining", "Volcano Tours"],
      price: "from $899"
    }
  ];

  const continents = ["All", "Europe", "Asia", "North America", "Central America"];
  const types = ["All", "City", "Island", "Mountains", "Nature", "Islands"];

  const getTypeIcon = (type) => {
    switch (type) {
      case "City": return Building;
      case "Island":
      case "Islands": return Waves;
      case "Mountains": return Mountain;
      case "Nature": return TreePine;
      default: return Globe;
    }
  };

  const getClimateIcon = (climate) => {
    if (climate.includes("Tropical") || climate.includes("Desert")) return Sun;
    if (climate.includes("Alpine")) return Snowflake;
    return Globe;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-[60vh] bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&h=1080&fit=crop')"
        }}
      >
        <div className="text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <T k="destinations.title" f="Explore Destinations" />
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8">
            <T k="destinations.subtitle" f="Discover amazing places around the world and plan your next adventure" />
          </p>
          
          {/* Search Bar */}
          <form className="bg-white rounded-lg p-4 shadow-2xl max-w-2xl mx-auto" action={async (formData) => (await import('./search-actions')).searchDestinationsAction(formData)}>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 flex-1">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="q"
                  placeholder="Search destinations..."
                  defaultValue={typeof window === 'undefined' ? '' : new URLSearchParams(window.location.search).get('q') || ''}
                  className="flex-1 outline-none text-gray-900 text-lg"
                  aria-label="Search destinations"
                />
              </div>
              <Button variant="gradient" size="lg" type="submit" aria-label="Submit search">
                Search
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-section-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <span className="text-foreground font-medium"><T k="destinations.filterBy" f="Filter by:" /></span>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground"><T k="destinations.continent" f="Continent:" /></span>
                <select className="bg-card border border-border rounded-md px-3 py-1 text-sm">
                  {continents.map(continent => (
                    <option key={continent} value={continent}>{continent}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground"><T k="destinations.type" f="Type:" /></span>
                <select className="bg-card border border-border rounded-md px-3 py-1 text-sm">
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {destinations.length} <T k="destinations.found" f="destinations found" />
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination) => {
              const TypeIcon = getTypeIcon(destination.type);
              const ClimateIcon = getClimateIcon(destination.climate);
              
              return (
                <Card key={destination.id} className="overflow-hidden card transition-all duration-300 hover:shadow-xl border-border">
                  <div className="relative">
                    <Image 
                      src={destination.image} 
                      alt={destination.name}
                      width={600}
                      height={400}
                      className="w-full h-48 object-cover"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bvvW6i6X9HvvKpBHHvaxww"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm font-medium shadow-md flex items-center space-x-1">
                        <TypeIcon className="h-3 w-3" />
                        <span>{destination.type}</span>
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm">
                        <Star className="h-3 w-3 text-yellow-400 mr-1" />
                        <span className="font-medium">{destination.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{destination.name}</CardTitle>
                        <CardDescription className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1" />
                          {destination.country}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">{destination.price}</div>
                        <div className="text-xs text-muted-foreground">{destination.tours} tours</div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm">{destination.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <ClimateIcon className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium text-foreground">{destination.climate}</div>
                          <div className="text-muted-foreground"><T k="destinations.climate" f="Climate" /></div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Sun className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium text-foreground">{destination.bestTime}</div>
                          <div className="text-muted-foreground"><T k="destinations.bestTime" f="Best time" /></div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-foreground mb-2"><T k="destinations.highlights" f="Highlights:" /></div>
                      <div className="flex flex-wrap gap-1">
                        {destination.highlights.slice(0, 3).map((highlight, index) => (
                          <span key={index} className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">
                            {highlight}
                          </span>
                        ))}
                        {destination.highlights.length > 3 && (
                          <span className="text-xs text-muted-foreground px-2 py-1">
                            +{destination.highlights.length - 3} <T k="destinations.more" f="more" />
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <Button variant="gradient" className="w-full" asChild>
                        <Link href={`/destinations/${destination.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`}>
                          Explore Tours
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Destinations
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-hover">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">Can&apos;t Find Your Dream Destination?</h2>
          <p className="text-xl text-white/90 mb-8">
            Let us help you plan a custom trip to anywhere in the world
          </p>
          <Button variant="secondary" size="xl">
            Request Custom Trip
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
