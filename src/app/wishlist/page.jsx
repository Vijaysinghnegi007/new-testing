import React from 'react'
import T from '@/components/common/T.jsx'

export const metadata = {
  title: 'Wishlist - TravelWeb',
  description: 'Your saved tours and destinations.'
}

import WishlistClient from '@/components/wishlist/WishlistClient.jsx'

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-6"><T k="wishlist.title" f="My Wishlist" /></h1>
          <WishlistClient />
        </div>
      </section>
    </div>
  )
}

