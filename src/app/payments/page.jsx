import React from 'react'

export const metadata = {
  title: 'Payments Information - TravelWeb',
  description: 'Learn about accepted payment methods and processing.'
}

export default function PaymentsInfoPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-6">Payments Information</h1>
          <div className="prose prose-slate dark:prose-invert">
            <p>We accept major cards and process payments securely with Stripe.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

