'use client'

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Star,
  Calendar,
  DollarSign,
  Users,
  Clock,
  MoreHorizontal,
  Globe,
  ChevronLeft,
  ChevronRight,
  Copy,
  Settings
} from 'lucide-react';

// Mock tours data - in production, fetch from API
const mockTours = [
  {
    id: 1,
    title: 'Bali Cultural Adventure',
    slug: 'bali-cultural-adventure',
    destination: 'Bali, Indonesia',
    description: 'Experience the rich cultural heritage of Bali with temples, villages, and authentic cuisine.',
    duration: 7,
    maxGroupSize: 12,
    price: 1299,
    originalPrice: 1599,
    rating: 4.8,
    reviews: 245,
    category: 'Cultural',
    status: 'published',
    featured: true,
    bookings: 45,
    revenue: 58455,
    image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-02-20T14:15:00Z'
  },
  {
    id: 2,
    title: 'Swiss Alps Hiking Experience',
    slug: 'swiss-alps-hiking-experience',
    destination: 'Swiss Alps, Switzerland',
    description: 'Breathtaking mountain hiking adventure through the pristine Swiss Alps.',
    duration: 10,
    maxGroupSize: 8,
    price: 2499,
    originalPrice: 2899,
    rating: 4.9,
    reviews: 189,
    category: 'Adventure',
    status: 'published',
    featured: true,
    bookings: 32,
    revenue: 79968,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-02-18T11:30:00Z'
  },
  {
    id: 3,
    title: 'Maldives Luxury Retreat',
    slug: 'maldives-luxury-retreat',
    destination: 'Maldives',
    description: 'Ultimate luxury getaway with overwater villas and pristine beaches.',
    duration: 5,
    maxGroupSize: 2,
    price: 3999,
    originalPrice: 4799,
    rating: 5.0,
    reviews: 156,
    category: 'Luxury',
    status: 'published',
    featured: false,
    bookings: 28,
    revenue: 111972,
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=300&fit=crop',
    createdAt: '2024-01-25T16:45:00Z',
    updatedAt: '2024-02-22T09:20:00Z'
  },
  {
    id: 4,
    title: 'Japan Cherry Blossom Tour',
    slug: 'japan-cherry-blossom-tour',
    destination: 'Tokyo & Kyoto, Japan',
    description: 'Witness the spectacular cherry blossom season in Japan&apos;s most beautiful cities.',
    duration: 8,
    maxGroupSize: 15,
    price: 2199,
    originalPrice: null,
    rating: 4.7,
    reviews: 332,
    category: 'Cultural',
    status: 'draft',
    featured: false,
    bookings: 0,
    revenue: 0,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop',
    createdAt: '2024-02-01T12:00:00Z',
    updatedAt: '2024-02-23T15:45:00Z'
  },
  {
    id: 5,
    title: 'African Safari Adventure',
    slug: 'african-safari-adventure',
    destination: 'Kenya & Tanzania',
    description: 'Epic wildlife safari adventure across East Africa&apos;s most famous national parks.',
    duration: 12,
    maxGroupSize: 10,
    price: 3299,
    originalPrice: 3899,
    rating: 4.9,
    reviews: 198,
    category: 'Adventure',
    status: 'published',
    featured: true,
    bookings: 23,
    revenue: 75877,
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&h=300&fit=crop',
    createdAt: '2024-02-05T14:20:00Z',
    updatedAt: '2024-02-24T10:10:00Z'
  }
];

export default function AdminTours() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState(mockTours);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/admin/tours');
      return;
    }
    
    if (session?.user?.role !== 'ADMIN') {
      router.push('/unauthorized');
      return;
    }
    
    setLoading(false);
  }, [session, status, router]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Adventure':
        return 'bg-orange-100 text-orange-800';
      case 'Cultural':
        return 'bg-purple-100 text-purple-800';
      case 'Luxury':
        return 'bg-blue-100 text-blue-800';
      case 'Family':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTours = tours.filter(tour => {
    const matchesSearch = 
      tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || tour.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || tour.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalPages = Math.ceil(filteredTours.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTours = filteredTours.slice(startIndex, startIndex + itemsPerPage);

  const handleStatusChange = async (tourId, newStatus) => {
    // In production, make API call to update tour status
    setTours(prev => prev.map(tour => 
      tour.id === tourId 
        ? { ...tour, status: newStatus, updatedAt: new Date().toISOString() }
        : tour
    ));
  };

  const handleFeaturedToggle = async (tourId) => {
    setTours(prev => prev.map(tour => 
      tour.id === tourId 
        ? { ...tour, featured: !tour.featured, updatedAt: new Date().toISOString() }
        : tour
    ));
  };

  const handleDuplicate = async (tourId) => {
    const tourToDuplicate = tours.find(t => t.id === tourId);
    if (tourToDuplicate) {
      const newTour = {
        ...tourToDuplicate,
        id: Math.max(...tours.map(t => t.id)) + 1,
        title: `${tourToDuplicate.title} (Copy)`,
        slug: `${tourToDuplicate.slug}-copy`,
        status: 'draft',
        featured: false,
        bookings: 0,
        revenue: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setTours(prev => [newTour, ...prev]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AdminLayout title="Tours Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">All Tours</h2>
            <p className="text-gray-600">Manage your tour packages and itineraries</p>
          </div>
          <Button asChild>
            <Link href="/admin/tours/new">
              <Plus className="h-4 w-4 mr-2" />
              Add New Tour
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Globe className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Tours</p>
                  <p className="text-2xl font-bold text-gray-900">{tours.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tours.filter(t => t.status === 'published').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tours.reduce((sum, tour) => sum + tour.bookings, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${tours.reduce((sum, tour) => sum + tour.revenue, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
            <CardDescription>Find and filter tour packages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tours..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 bg-background text-foreground"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 bg-background text-foreground"
              >
                <option value="all">All Categories</option>
                <option value="Adventure">Adventure</option>
                <option value="Cultural">Cultural</option>
                <option value="Luxury">Luxury</option>
                <option value="Family">Family</option>
              </select>

              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedTours.map((tour) => (
            <Card key={tour.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src={tour.image}
                  alt={tour.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className={getStatusColor(tour.status)}>
                    {tour.status}
                  </Badge>
                  <Badge className={getCategoryColor(tour.category)}>
                    {tour.category}
                  </Badge>
                </div>
                {tour.featured && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                )}
                <div className="absolute bottom-3 right-3 flex gap-1">
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-2">{tour.title}</CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  {tour.destination}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 line-clamp-2">{tour.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {tour.duration} days
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    Max {tour.maxGroupSize}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="font-medium">{tour.rating}</span>
                    <span className="text-gray-500 text-sm">({tour.reviews})</span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-primary">${tour.price}</span>
                      {tour.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ${tour.originalPrice}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">per person</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{tour.bookings}</span> bookings
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    ${tour.revenue.toLocaleString()} revenue
                  </div>
                </div>
              </CardContent>

              <div className="px-6 pb-4">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDuplicate(tour.id)}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Duplicate
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="h-3 w-3 mr-1" />
                    Settings
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTours.length)} of {filteredTours.length} tours
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
