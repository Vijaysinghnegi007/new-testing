export default async function sitemap() {
  const site = 'https://travelweb.com'
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/tours',
    '/destinations',
    '/blog',
    '/privacy',
    '/terms',
  ]
  const now = new Date().toISOString()
  return staticRoutes.map((path) => ({
    url: `${site}${path}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: path === '' ? 1 : 0.7,
  }))
}

