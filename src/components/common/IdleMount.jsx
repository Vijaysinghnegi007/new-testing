'use client'

import React from 'react'

export default function IdleMount({ children, timeout = 300 }) {
  const [ready, setReady] = React.useState(false)
  React.useEffect(() => {
    const cb = () => setReady(true)
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const id = window.requestIdleCallback(cb, { timeout })
      return () => window.cancelIdleCallback && window.cancelIdleCallback(id)
    }
    const t = setTimeout(cb, timeout)
    return () => clearTimeout(t)
  }, [timeout])
  if (!ready) return null
  return children
}

