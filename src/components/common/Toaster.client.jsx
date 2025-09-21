'use client'

import dynamic from 'next/dynamic'
import React, { Suspense } from 'react'
import ClientOnly from '@/components/common/ClientOnly'
import IdleMount from '@/components/common/IdleMount'
import 'react-toastify/dist/ReactToastify.css'

const ToastContainerInner = dynamic(() => import('react-toastify').then(m => m.ToastContainer), {
  ssr: false,
  loading: () => null,
})

export default function ToasterClient(props) {
  return (
    <ClientOnly>
      <IdleMount>
        <Suspense fallback={null}>
          <ToastContainerInner {...props} />
        </Suspense>
      </IdleMount>
    </ClientOnly>
  )
}

