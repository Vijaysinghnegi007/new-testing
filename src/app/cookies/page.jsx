import React from 'react'

export const metadata = {
  title: 'Cookie Policy - TravelWeb',
  description: 'Information about cookies used on TravelWeb.'
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-6">Cookie Policy</h1>
          <div className="prose prose-slate dark:prose-invert">
            <p>We use cookies to improve your experience. You can control cookies through your browser settings.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

