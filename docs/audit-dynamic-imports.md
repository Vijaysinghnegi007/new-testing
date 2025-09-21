# Audit: next/dynamic and dynamic import usages

This document lists where `next/dynamic` is used and verifies it’s only inside client components.

Findings

- src/components/admin/ResumeBanner.client.jsx
  - Uses next/dynamic with ssr: false
  - File is a client wrapper ("use client"). OK

- src/components/chat/LiveChat.client.jsx
  - Uses next/dynamic with ssr: false
  - Client wrapper. OK

- src/components/notifications/NotificationPanel.client.jsx
  - Uses next/dynamic with ssr: false
  - Client wrapper. OK

- src/components/common/Toaster.client.jsx
  - Uses next/dynamic to load ToastContainer
  - Client wrapper. OK

No usages of next/dynamic found in Server Components or non-client files.

Enforcement

- ESLint rule added to disallow importing `next/dynamic` in non-client files. Client wrappers (*.client.*) are exempt.

