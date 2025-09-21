export default function robots() {
  const site = 'https://travelweb.com'
  return {
    rules: [
      { userAgent: '*', allow: '/' },
    ],
    sitemap: `${site}/sitemap.xml`,
    host: site,
  }
}

