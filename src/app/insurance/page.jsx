import React from 'react'

export const metadata = {
  title: 'Travel Insurance - TravelWeb',
  description: 'Why travel insurance matters and how to get it.'
}

export default function InsurancePage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-6">Travel Insurance</h1>
          <div className="prose prose-slate dark:prose-invert">
            <p>We recommend all travelers secure appropriate travel insurance for peace of mind.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

