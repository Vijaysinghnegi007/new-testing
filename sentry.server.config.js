import * as Sentry from '@sentry/nextjs'

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || 0.1),
    integrations: [
      Sentry.httpIntegration(),
    ],
    beforeBreadcrumb(breadcrumb) {
      return breadcrumb
    },
  })
}

