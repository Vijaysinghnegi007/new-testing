'use client'

import dynamic from 'next/dynamic'
import React, { Suspense } from 'react'
import ClientOnly from '@/components/common/ClientOnly'
import IdleMount from '@/components/common/IdleMount'

const LiveChatInner = dynamic(() => import('./LiveChat'), {
  ssr: false,
  loading: () => null,
})

export default function LiveChatClient(props) {
  return (
    <ClientOnly>
      <IdleMount>
        <Suspense fallback={null}>
          <LiveChatInner {...props} />
        </Suspense>
      </IdleMount>
    </ClientOnly>
  )
}

