import React from 'react';
import { MapPin } from 'lucide-react';

export function PageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-section-background flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-4">
          <MapPin className="h-12 w-12 text-primary mx-auto animate-pulse" />
          <div className="absolute inset-0 h-12 w-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Loading TravelWeb</h2>
        <p className="text-muted-foreground">Preparing your adventure...</p>
      </div>
    </div>
  );
}

export function ComponentLoading() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

export function CardLoading() {
  return (
    <div className="animate-pulse">
      <div className="bg-muted rounded-lg h-48 w-full mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
        <div className="h-4 bg-muted rounded w-1/4"></div>
      </div>
    </div>
  );
}
