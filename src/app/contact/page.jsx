import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const metadata = {
  title: 'Contact Us - TravelWeb',
  description: 'Get in touch with the TravelWeb team for inquiries, support, and partnerships.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-foreground mb-2">Contact Us</h1>
            <p className="text-muted-foreground">Wed love to hear from you. Fill out the form and well get back soon.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Send a message</CardTitle>
              <CardDescription>Our team typically responds within 24 hours.</CardDescription>
            </CardHeader>
            <CardContent>
              <form method="post" action="/api/contact" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" placeholder="Your name" required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" name="subject" placeholder="How can we help?" required />
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <textarea id="message" name="message" required className="w-full border border-border rounded-md p-3 bg-card text-foreground h-36" />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" variant="gradient">Send message</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

