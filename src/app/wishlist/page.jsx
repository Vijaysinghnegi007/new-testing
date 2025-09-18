import React from 'react'

export const metadata = {
  title: 'Wishlist - TravelWeb',
  description: 'Your saved tours and destinations.'
}

export default async function WishlistPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-6">My Wishlist</h1>
          <p className="text-muted-foreground">This page lists your saved tours. Add/remove items from tour pages.</p>
        </div>
      </section>
    </div>
  )
}

