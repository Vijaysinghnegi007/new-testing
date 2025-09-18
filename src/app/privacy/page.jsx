import React from 'react'

export const metadata = {
  title: 'Privacy Policy - TravelWeb',
  description: 'How we collect, use, and protect your personal information.'
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
          <div className="prose prose-slate dark:prose-invert">
            <p>We respect your privacy. Replace this with your actual privacy policy content.</p>
            <h3>Data Collection</h3>
            <p>We collect information you provide and usage data to improve our services.</p>
            <h3>Security</h3>
            <p>We use industry-standard practices to protect your data.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

