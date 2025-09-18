'use client'

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import BookingForm from '@/components/booking/BookingForm';
import { Card, CardContent } from '@/components/ui/card';

// Loading component
const BookingFormSkeleton = () => (
  <div className="max-w-2xl mx-auto p-6">
    <div className="animate-pulse">
      {/* Progress bar skeleton */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-8 h-8 bg-gray-200 rounded-full"></div>
          ))}
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full"></div>
      </div>
      
      {/* Form skeleton */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="h-8 bg-gray-200 rounded mx-auto w-64"></div>
              <div className="h-4 bg-gray-200 rounded mx-auto w-96"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

// Component to handle search params and render booking form
const BookingPageContent = () => {
  const searchParams = useSearchParams();
  
  // Get booking data from search params (passed from tour page)
  const tourData = searchParams.get('tour');
  const startDate = searchParams.get('startDate');
  const guests = searchParams.get('guests');

  // Parse tour data
  let tour = null;
  try {
    tour = tourData ? JSON.parse(decodeURIComponent(tourData)) : null;
  } catch (error) {
    console.error('Error parsing tour data:', error);
  }

  // If no tour data, show fallback
  if (!tour || !startDate || !guests) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Invalid Booking Request</h2>
            <p className="text-muted-foreground mb-4">
              We couldn&apos;t find the tour information for your booking. Please go back and try again.
            </p>
            <Link 
              href="/tours" 
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Browse Tours
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const initialBookingData = {
    startDate,
    guests: parseInt(guests, 10)
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Complete Your Booking
          </h1>
          <p className="text-muted-foreground">
            Just a few more steps to secure your amazing travel experience
          </p>
        </div>
        
        <BookingForm tour={tour} initialBookingData={initialBookingData} />
      </div>
    </div>
  );
};

// Main booking page component
export default function BookingPage() {
  return (
    <Suspense fallback={<BookingFormSkeleton />}>
      <BookingPageContent />
    </Suspense>
  );
}
