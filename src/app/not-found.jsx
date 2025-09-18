import React from 'react'

export const metadata = {
  title: 'Page Not Found - TravelWeb',
  description: 'The page you are looking for does not exist.'
}

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
        <p className="text-muted-foreground">The page you are looking for does not exist or has been moved.</p>
        <a href="/" className="text-primary underline">Go back home</a>
      </div>
    </div>
  )
}

