'use client'

import React from 'react'
import { Providers } from '@/components/providers'
import LiveChat from '@/components/chat/LiveChat.client'
import NotificationPanel from '@/components/notifications/NotificationPanel.client'
import ResumeBanner from '@/components/admin/ResumeBanner.client'
import ToasterClient from '@/components/common/Toaster.client'

export default function ClientLayoutWrapper({ children }) {
  return (
    <Providers>
      {children}
      {/* Lazy, client-only globals */}
      <LiveChat />
      <NotificationPanel />
      <ResumeBanner />
      <ToasterClient
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Providers>
  )
}
