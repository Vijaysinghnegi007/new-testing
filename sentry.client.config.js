import * as Sentry from '@sentry/nextjs'

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || 0.1),
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true }),
    ],
    replaysSessionSampleRate: 0.0,
    replaysOnErrorSampleRate: 1.0,
    beforeBreadcrumb(breadcrumb) {
      // Drop excessively noisy console breadcrumbs
      if (breadcrumb.category === 'console' && breadcrumb.level === 'log') return null
      return breadcrumb
    },
  })
}

