import React from 'react'

export const metadata = {
  title: 'Help & FAQ - TravelWeb',
  description: 'Frequently asked questions about bookings, payments, and travel policies.'
}

export default function HelpPage() {
  const faqs = [
    {
      q: 'How do I change or cancel my booking?',
      a: 'Go to My Bookings and select the booking you wish to change or cancel. Cancellation fees may apply as per the policy.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept major credit/debit cards and process payments securely via Stripe.'
    },
    {
      q: 'Do I need travel insurance?',
      a: 'We strongly recommend purchasing travel insurance for unexpected events. See the Insurance page for more info.'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8">Help & FAQ</h1>
          <div className="space-y-6">
            {faqs.map((f, idx) => (
              <div key={idx} className="border border-border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">{f.q}</h3>
                <p className="text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

