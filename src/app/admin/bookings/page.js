'use client'

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Users,
  MapPin,
  DollarSign,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw
} from 'lucide-react';

// Mock bookings data - in production, fetch from API
const mockBookings = [
  {
    id: 1,
    bookingId: 'TW17095012345',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah@example.com',
    customerPhone: '+1 (555) 123-4567',
    tourTitle: 'Bali Cultural Adventure',
    tourDestination: 'Bali, Indonesia',
    startDate: '2024-03-15',
    numberOfGuests: 2,
    totalPrice: 2598,
    status: 'confirmed',
    paymentStatus: 'completed',
    createdAt: '2024-02-15T10:30:00Z',
    updatedAt: '2024-02-15T10:30:00Z'
  },
  {
    id: 2,
    bookingId: 'TW17095012346',
    customerName: 'Mike Chen',
    customerEmail: 'mike.chen@example.com',
    customerPhone: '+1 (555) 234-5678',
    tourTitle: 'Swiss Alps Hiking Experience',
    tourDestination: 'Swiss Alps, Switzerland',
    startDate: '2024-03-20',
    numberOfGuests: 4,
    totalPrice: 9996,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: '2024-02-16T14:15:00Z',
    updatedAt: '2024-02-16T14:15:00Z'
  },
  {
    id: 3,
    bookingId: 'TW17095012347',
    customerName: 'Emma Williams',
    customerEmail: 'emma.williams@example.com',
    customerPhone: '+1 (555) 345-6789',
    tourTitle: 'Maldives Luxury Retreat',
    tourDestination: 'Maldives',
    startDate: '2024-03-25',
    numberOfGuests: 2,
    totalPrice: 7998,
    status: 'confirmed',
    paymentStatus: 'completed',
    createdAt: '2024-02-17T09:45:00Z',
    updatedAt: '2024-02-17T09:45:00Z'
  },
  {
    id: 4,
    bookingId: 'TW17095012348',
    customerName: 'David Brown',
    customerEmail: 'david.brown@example.com',
    customerPhone: '+1 (555) 456-7890',
    tourTitle: 'Japan Cherry Blossom Tour',
    tourDestination: 'Tokyo & Kyoto, Japan',
    startDate: '2024-04-10',
    numberOfGuests: 3,
    status: 'cancelled',
    paymentStatus: 'refunded',
    totalPrice: 6597,
    createdAt: '2024-02-18T16:20:00Z',
    updatedAt: '2024-02-20T11:30:00Z'
  },
  {
    id: 5,
    bookingId: 'TW17095012349',
    customerName: 'Lisa Anderson',
    customerEmail: 'lisa.anderson@example.com',
    customerPhone: '+1 (555) 567-8901',
    tourTitle: 'African Safari Adventure',
    tourDestination: 'Kenya & Tanzania',
    startDate: '2024-05-15',
    numberOfGuests: 2,
    totalPrice: 6598,
    status: 'confirmed',
    paymentStatus: 'completed',
    createdAt: '2024-02-19T12:10:00Z',
    updatedAt: '2024-02-19T12:10:00Z'
  }
];

export default function AdminBookings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState(mockBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/admin/bookings');
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
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.tourTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  const handleStatusChange = async (bookingId, newStatus) => {
    // In production, make API call to update booking status
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: newStatus, updatedAt: new Date().toISOString() }
        : booking
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AdminLayout title="Bookings Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">All Bookings</h2>
            <p className="text-gray-600">Manage and track customer bookings</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
            <CardDescription>Find and filter bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search bookings..."
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
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>

              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Bookings ({filteredBookings.length})
            </CardTitle>
            <CardDescription>
              {statusFilter === 'all' ? 'All bookings' : `${statusFilter} bookings`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Booking ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Tour</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Guests</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Payment</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-mono text-sm">{booking.bookingId}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      
                      <td className="py-4 px-4">
                        <div className="font-medium">{booking.customerName}</div>
                        <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                        <div className="text-xs text-gray-500">{booking.customerPhone}</div>
                      </td>
                      
                      <td className="py-4 px-4">
                        <div className="font-medium">{booking.tourTitle}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {booking.tourDestination}
                        </div>
                      </td>
                      
                      <td className="py-4 px-4">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {new Date(booking.startDate).toLocaleDateString()}
                        </div>
                      </td>
                      
                      <td className="py-4 px-4">
                        <div className="flex items-center text-sm">
                          <Users className="h-4 w-4 mr-2 text-gray-400" />
                          {booking.numberOfGuests}
                        </div>
                      </td>
                      
                      <td className="py-4 px-4">
                        <div className="flex items-center font-medium">
                          <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                          ${booking.totalPrice.toLocaleString()}
                        </div>
                      </td>
                      
                      <td className="py-4 px-4">
                        <Badge className={`${getStatusColor(booking.status)} flex items-center gap-1 w-fit`}>
                          {getStatusIcon(booking.status)}
                          <span className="capitalize">{booking.status}</span>
                        </Badge>
                      </td>
                      
                      <td className="py-4 px-4">
                        <Badge className={`${getPaymentStatusColor(booking.paymentStatus)} text-xs`}>
                          {booking.paymentStatus}
                        </Badge>
                      </td>
                      
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredBookings.length)} of {filteredBookings.length} bookings
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
