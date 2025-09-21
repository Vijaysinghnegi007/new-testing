'use client'

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  MapPin,
  Users,
  CreditCard,
  Download,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Loader2
} from 'lucide-react';

export default function MyBookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'loading') return; // Still loading
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    fetchBookings();
  }, [status, router]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bookings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (err) {
      setError('Failed to load bookings. Please try again.');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-foreground">My Bookings</h1>
            <p className="text-muted-foreground mt-1">
              View and manage your travel bookings
            </p>
          </div>
          
          <Button asChild>
            <Link href="/tours">
              Browse More Tours
            </Link>
          </Button>
        </div>

        {error && (
          <Card className="border-destructive mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 text-destructive">
                <XCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
              <Button onClick={fetchBookings} variant="outline" size="sm" className="mt-3">
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No bookings yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven&apos;t made any bookings yet. Start exploring our amazing tours!
              </p>
              <Button asChild>
                <Link href="/tours">
                  Browse Tours
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{booking.tourTitle}</CardTitle>
                      <CardDescription className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        {booking.tourDestination}
                      </CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(booking.status)} flex items-center gap-1`}>
                      {getStatusIcon(booking.status)}
                      <span className="capitalize">{booking.status}</span>
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Booking Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Travel Date</p>
                        <p className="font-medium">
                          {new Date(booking.startDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Guests</p>
                        <p className="font-medium">{booking.numberOfGuests} {booking.numberOfGuests === 1 ? 'person' : 'people'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Total Paid</p>
                        <p className="font-medium text-primary">${booking.totalPrice}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Guest Information */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Lead Traveler</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Name</p>
                        <p className="font-medium">{booking.guestFirstName} {booking.guestLastName}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Email</p>
                        <p className="font-medium">{booking.guestEmail}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Phone</p>
                        <p className="font-medium">{booking.guestPhone}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Booking Reference</p>
                        <p className="font-medium font-mono">{booking.bookingId}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Booked on {new Date(booking.createdAt).toLocaleDateString()}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download Receipt
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
