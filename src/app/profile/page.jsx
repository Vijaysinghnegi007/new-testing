import React from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const metadata = {
  title: 'My Profile - TravelWeb',
  description: 'View your profile information and quick links.'
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">You need to sign in</h1>
          <a href="/auth/signin" className="text-primary underline">Go to sign in</a>
        </div>
      </div>
    )
  }

  const user = session.user

  return (
    <div className="min-h-screen bg-background">
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-6">My Profile</h1>
          <div className="space-y-2">
            <p><span className="text-muted-foreground">Name:</span> {user.firstName || ''} {user.lastName || ''}</p>
            <p><span className="text-muted-foreground">Email:</span> {user.email}</p>
            <p><span className="text-muted-foreground">Role:</span> {user.role}</p>
          </div>
          <div className="mt-6 space-x-4">
            <a className="text-primary underline" href="/settings">Account settings</a>
            <a className="text-primary underline" href="/my-bookings">My bookings</a>
          </div>
        </div>
      </section>
    </div>
  )
}

