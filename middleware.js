import { NextResponse } from 'next/server'
import { withAuth } from 'next-auth/middleware'

const locales = ['en','es']

const adminAuth = withAuth({
  pages: { signIn: '/auth/signin' },
  callbacks: {
    authorized: ({ token }) => token?.role === 'ADMIN'
  }
})

export default function middleware(req) {
  const { pathname } = req.nextUrl

  const setCookieIfNeeded = (res) => {
    try {
      const cookie = req.cookies.get('LOCALE')?.value
      if (!cookie || !locales.includes(cookie)) {
        const accept = req.headers.get('accept-language') || ''
        const best = accept.toLowerCase().includes('es') ? 'es' : 'en'
        res.cookies.set('LOCALE', best, {
          path: '/',
          httpOnly: false,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 365,
        })
      }
    } catch {}
    return res
  }

  // Skip for Next internals and static files
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.match(/\.[^/]+$/)) {
    if (pathname.startsWith('/admin')) {
      const r = adminAuth(req)
      return setCookieIfNeeded(r)
    }
    return setCookieIfNeeded(NextResponse.next())
  }

  // Locale prefix handling: /en/..., /es/...
  const m = pathname.match(/^\/(en|es)(\/|$)/)
  if (m) {
    const locale = m[1]
    const url = req.nextUrl.clone()
    url.pathname = pathname.replace(/^\/(en|es)/, '') || '/'
    const res = NextResponse.rewrite(url)
    res.cookies.set('LOCALE', locale, { path: '/' })
    return res
  }

  // Admin auth
  if (pathname.startsWith('/admin')) {
    const r = adminAuth(req)
    return setCookieIfNeeded(r)
  }

  return setCookieIfNeeded(NextResponse.next())
}

export const config = {
  matcher: ['/((?!_next|static|.*\..*).*)'],
}
