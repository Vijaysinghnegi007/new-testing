import React from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

export const metadata = {
  title: 'New Tour - Admin',
}

export default function AdminTourNew() {
  return (
    <AdminLayout title="New Tour">
      <p className="text-muted-foreground">Implement tour form here posting to /api/admin/tours.</p>
    </AdminLayout>
  )
}

