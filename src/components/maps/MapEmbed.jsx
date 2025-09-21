'use client'

import React from 'react'

export default function MapEmbed({ lat, lng, zoom = 12, className = '' }) {
  const [visible, setVisible] = React.useState(false)
  const ref = React.useRef(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    let obs
    try {
      if ('IntersectionObserver' in window) {
        obs = new IntersectionObserver((entries) => {
          const [entry] = entries
          if (entry.isIntersecting) {
            setVisible(true)
            obs.disconnect()
          }
        }, { rootMargin: '300px' })
        obs.observe(el)
      } else {
        // Fallback
        setVisible(true)
      }
    } catch {
      setVisible(true)
    }
    return () => { try { obs && obs.disconnect() } catch {} }
  }, [])

  if (!lat || !lng) return null

  const src = `https://www.google.com/maps?q=${encodeURIComponent(lat)},${encodeURIComponent(lng)}&hl=auto&z=${zoom}&output=embed`
  return (
    <div ref={ref} className={`w-full h-64 rounded-lg overflow-hidden border border-border ${className}`}>
      <link rel="preconnect" href="https://www.google.com" />
      {visible ? (
        <iframe
          title="Map"
          src={src}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div aria-hidden="true" className="w-full h-full bg-muted animate-pulse" />
      )}
      <noscript>
        <a href={`https://www.google.com/maps?q=${encodeURIComponent(lat)},${encodeURIComponent(lng)}`} target="_blank" rel="noreferrer">View on Google Maps</a>
      </noscript>
    </div>
  )
}
