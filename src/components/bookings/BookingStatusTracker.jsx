'use client';

import React, { useState, useEffect } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  ArrowRight,
  DollarSign
} from 'lucide-react';
import { toast } from 'react-toastify';

const BookingStatusTracker = ({ bookingId, onStatusUpdate }) => {
  const { socket } = useSocket();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [realTimeUpdates, setRealTimeUpdates] = useState([]);
  const [showSimulation, setShowSimulation] = useState(false);

  useEffect(() => {
    if (bookingId) {
      fetchBookingStatus();
    }
  }, [bookingId]);

  useEffect(() => {
    if (!socket) return;

    // Listen for real-time booking updates
    socket.on('user_booking_updated', (data) => {
      if (data.bookingId === bookingId) {
        console.log('Booking updated:', data);
        setRealTimeUpdates(prev => [data, ...prev.slice(0, 4)]); // Keep last 5 updates
        
        // Update booking status
        setBooking(prev => prev ? { ...prev, bookingStatus: data.status } : null);
        
        // Show toast notification
        toast.success(data.message);
        
        // Call parent callback if provided
        onStatusUpdate?.(data);
      }
    });

    socket.on('payment_processed', (data) => {
      if (data.bookingId === bookingId) {
        console.log('Payment processed:', data);
        setRealTimeUpdates(prev => [
          {
            bookingId: data.bookingId,
            status: data.status,
            message: data.message,
            timestamp: data.timestamp,
            type: 'payment'
          },
          ...prev.slice(0, 4)
        ]);
        
        toast.success(data.message);
      }
    });

    socket.on('booking_created', (data) => {
      if (data.booking?.id === bookingId) {
        console.log('Booking created:', data);
        fetchBookingStatus(); // Refresh booking data
      }
    });

    return () => {
      socket.off('user_booking_updated');
      socket.off('payment_processed');
      socket.off('booking_created');
    };
  }, [socket, bookingId, onStatusUpdate]);

  const fetchBookingStatus = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`);
      if (response.ok) {
        const data = await response.json();
        setBooking(data.booking);
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateFlow = async () => {
    if (!socket) return;
    
    setShowSimulation(true);
    socket.emit('simulate_booking_flow', { bookingId });
    
    toast.info('Simulating booking status changes...');
    
    // Hide simulation controls after starting
    setTimeout(() => {
      setShowSimulation(false);
    }, 10000);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'CANCELLED':
      case 'REFUNDED':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'COMPLETED':
        return <CheckCircle2 className="h-5 w-5 text-blue-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED':
      case 'REFUNDED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressPercentage = (status) => {
    switch (status) {
      case 'PENDING':
        return 25;
      case 'CONFIRMED':
        return 75;
      case 'COMPLETED':
        return 100;
      case 'CANCELLED':
      case 'REFUNDED':
        return 0;
      default:
        return 0;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading booking status...</span>
        </CardContent>
      </Card>
    );
  }

  if (!booking) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <AlertCircle className="h-8 w-8 text-gray-400" />
          <span className="ml-2">Booking not found</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Booking Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(booking.bookingStatus)}
                Booking #{booking.bookingNumber}
              </CardTitle>
              <CardDescription>
                Real-time booking status tracking
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(booking.bookingStatus)}>
                {booking.bookingStatus}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchBookingStatus}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{getProgressPercentage(booking.bookingStatus)}%</span>
            </div>
            <Progress value={getProgressPercentage(booking.bookingStatus)} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Pending</span>
              <span>Confirmed</span>
              <span>Completed</span>
            </div>
          </div>

          {/* Booking Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">{booking.tour?.title}</p>
                  <p className="text-sm text-gray-600">Tour</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">{formatDate(booking.travelDate)}</p>
                  <p className="text-sm text-gray-600">Travel Date</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">{booking.numberOfTravelers} travelers</p>
                  <p className="text-sm text-gray-600">Group Size</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">${booking.totalPrice}</p>
                  <p className="text-sm text-gray-600">Total Amount</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">{booking.paymentStatus}</p>
                  <p className="text-sm text-gray-600">Payment Status</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">{formatDate(booking.bookedAt)}</p>
                  <p className="text-sm text-gray-600">Booked On</p>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Simulation Button */}
          {process.env.NODE_ENV === 'development' && (
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Demo Mode</h4>
                  <p className="text-sm text-gray-600">
                    Simulate real-time booking status changes
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleSimulateFlow}
                  disabled={showSimulation}
                >
                  {showSimulation ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <ArrowRight className="h-4 w-4 mr-2" />
                  )}
                  Simulate Flow
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Real-time Updates */}
      {realTimeUpdates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Real-time Updates</CardTitle>
            <CardDescription>
              Live status changes and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {realTimeUpdates.map((update, index) => (
                <div
                  key={`${update.timestamp}-${index}`}
                  className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-900">{update.message}</p>
                    <p className="text-sm text-blue-700">
                      {formatTime(update.timestamp)}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {update.type || 'status'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BookingStatusTracker;
