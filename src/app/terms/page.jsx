import React from 'react'

export const metadata = {
  title: 'Terms of Service - TravelWeb',
  description: 'Terms governing your use of the TravelWeb platform.'
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
          <div className="prose prose-slate dark:prose-invert">
            <p>By using TravelWeb you agree to these terms. Content here can be replaced with your legal copy.</p>
            <h3>Use of Service</h3>
            <p>Do not misuse our services. Follow local laws and travel advisories.</p>
            <h3>Liability</h3>
            <p>We provide travel booking services on a best-effort basis. Some limitations of liability may apply.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

