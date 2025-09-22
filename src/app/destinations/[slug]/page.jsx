import React from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import T from '@/components/common/T.jsx'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Star, ArrowRight } from 'lucide-react'
import MapEmbed from '@/components/maps/MapEmbed.jsx'

export const revalidate = 60

export async function generateMetadata({ params }) {
  const { slug } = params
  const destination = await prisma.destination.findUnique({ where: { slug } })
  if (!destination) return { title: 'Destination not found' }
  return {
    title: `${destination.name} - TravelWeb`,
    description: destination.description?.slice(0, 160) || `Explore ${destination.name} with TravelWeb.`,
  }
}

export default async function DestinationDetailPage({ params }) {
  const { slug } = params
  let destination = null
  try {
    destination = await prisma.destination.findUnique({
      where: { slug },
      include: {
        tours: {
          where: { isActive: true },
          orderBy: { rating: 'desc' },
          take: 12,
        },
      },
    })
  } catch (e) {
    console.error('Failed to load destination from DB, slug:', slug, e?.message || e)
  }

  if (!destination || destination.isActive === false) {
    // Graceful fallback (no DB / not found)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-bold">Destination Unavailable</h1>
          <p className="text-muted-foreground">We couldn&apos;t load this destination right now. Please try again later.</p>
          <Link href="/destinations" className="text-primary underline">Back to destinations</Link>
        </div>
      </div>
    )
  }

  const images = destination.images ? JSON.parse(destination.images) : []

  return (
    <div className="min-h-screen">
      <section className="relative h-[50vh] bg-gray-100">
        {images[0] && (
          <Image
            src={images[0]}
            alt={destination.name}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold">{destination.name}</h1>
            {destination.country && (
              <p className="mt-2 text-blue-100 flex items-center justify-center">
                <MapPin className="h-4 w-4 mr-2" />
                {destination.country}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {destination.description && (
            <div className="prose prose-slate dark:prose-invert max-w-none mb-8">
              <p>{destination.description}</p>
            </div>
          )}

          {(destination.latitude && destination.longitude) && (
            <div className="mb-8">
              <MapEmbed lat={destination.latitude} lng={destination.longitude} />
            </div>
          )}

          <h2 className="text-2xl font-semibold mb-4"><T k="destinations.topToursIn" f="Top Tours in" /> {destination.name}</h2>
          {destination.tours.length === 0 ? (
            <p className="text-muted-foreground"><T k="destinations.none" f="No tours available yet for this destination." /></p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destination.tours.map((tour) => {
                const tourImages = tour.images ? JSON.parse(tour.images) : []
                return (
                  <Card key={tour.id} className="overflow-hidden">
                    {tourImages[0] && (
                      <div className="relative h-48 w-full">
                        <Image src={tourImages[0]} alt={tour.title} fill className="object-cover" />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-lg">
                        <Link href={`/tours/${tour.slug}`}>{tour.title}</Link>
                      </CardTitle>
                      <CardDescription className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {destination.city || destination.country}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="font-medium">{tour.rating?.toFixed(1) || '0.0'}</span>
                        </div>
                        <Button variant="gradient" asChild>
                          <Link href={`/tours/${tour.slug}`}>
                            <T k="actions.viewDetails" f="View Details" />
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

