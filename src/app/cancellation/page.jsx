import React from 'react'

export const metadata = {
  title: 'Cancellation Policy - TravelWeb',
  description: 'Our cancellation terms and conditions.'
}

export default function CancellationPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-6">Cancellation Policy</h1>
          <div className="prose prose-slate dark:prose-invert">
            <p>Free cancellation within 24 hours of booking. After that, fees may apply depending on the tour provider.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

