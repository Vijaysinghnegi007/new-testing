import { prisma } from '@/lib/prisma'

export default async function ItineraryPublicPage({ params }) {
  const shareId = params.shareId
  const data = await prisma.itinerary.findFirst({
    where: { shareId, isPublic: true },
    include: {
      items: {
        orderBy: [{ day: 'asc' }, { orderIndex: 'asc' }],
        include: { tour: { select: { id: true, title: true, slug: true, destinationId: true } } }
      },
      user: { select: { firstName: true, lastName: true } }
    }
  })

  if (!data) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Itinerary not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">{data.title}</h1>
          <p className="text-muted-foreground mb-6">{data.days} day(s){data.user ? ` • by ${data.user.firstName || ''} ${data.user.lastName || ''}` : ''}</p>
          <div className="space-y-4">
            {data.items.map((it) => (
              <div key={it.id} className="border rounded p-4">
                <div className="text-sm text-muted-foreground mb-1">Day {it.day}</div>
                <div className="font-medium">{it.title || it.tour?.title || 'Custom activity'}</div>
                {it.notes && <div className="text-sm mt-1">{it.notes}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

