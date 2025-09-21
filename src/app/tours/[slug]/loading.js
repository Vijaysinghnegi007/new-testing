export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-6 w-40 mb-4 bg-muted animate-pulse rounded" />
        <div className="h-64 w-full mb-6 bg-muted animate-pulse rounded" />
        <div className="space-y-2">
          <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
          <div className="h-4 w-4/6 bg-muted animate-pulse rounded" />
          <div className="h-4 w-3/6 bg-muted animate-pulse rounded" />
        </div>
        <span className="sr-only">Loading tour…</span>
      </div>
    </div>
  );
}
