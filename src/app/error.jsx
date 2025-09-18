'use client'

import React from 'react'

export default function GlobalError({ error, reset }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground">{error?.message || 'An unexpected error occurred.'}</p>
        <button className="text-primary underline" onClick={() => reset()}>Try again</button>
      </div>
    </div>
  )
}

