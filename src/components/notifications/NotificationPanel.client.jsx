'use client'

import dynamic from 'next/dynamic'
import React, { Suspense } from 'react'
import ClientOnly from '@/components/common/ClientOnly'
import IdleMount from '@/components/common/IdleMount'

const PanelInner = dynamic(() => import('./NotificationPanel'), {
  ssr: false,
  loading: () => null,
})

export default function NotificationPanelClient(props) {
  return (
    <ClientOnly>
      <IdleMount>
        <Suspense fallback={null}>
          <PanelInner {...props} />
        </Suspense>
      </IdleMount>
    </ClientOnly>
  )
}

