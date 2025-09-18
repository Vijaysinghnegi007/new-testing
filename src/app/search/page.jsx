import React from 'react'

export const metadata = {
  title: 'Search - TravelWeb',
  description: 'Find tours and destinations.'
}

export default async function SearchPage({ searchParams }) {
  const q = searchParams?.q || ''
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/search`)
  if (q) url.searchParams.set('q', q)
  const res = await fetch(url, { cache: 'no-store' })
  const data = res.ok ? await res.json() : { tours: [], destinations: [] }

  return (
    <div className="min-h-screen bg-background">
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6">Search</h1>
          <form method="get" className="mb-6">
            <input name="q" defaultValue={q} placeholder="Search..." className="border border-border rounded px-3 py-2 w-full" />
          </form>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-3">Tours</h2>
              {data.tours.length === 0 ? (
                <p className="text-muted-foreground">No matching tours.</p>
              ) : (
                <ul className="space-y-2">
                  {data.tours.map(t => (
                    <li key={t.id}>
                      <a className="text-primary underline" href={`/tours/${t.slug}`}>{t.title}</a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">Destinations</h2>
              {data.destinations.length === 0 ? (
                <p className="text-muted-foreground">No matching destinations.</p>
              ) : (
                <ul className="space-y-2">
                  {data.destinations.map(d => (
                    <li key={d.id}>
                      <a className="text-primary underline" href={`/destinations/${d.slug}`}>{d.name}</a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

