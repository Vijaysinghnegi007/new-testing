import React from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

export const metadata = {
  title: 'New Destination - Admin',
}

export default function AdminDestinationNew() {
  return (
    <AdminLayout title="New Destination">
      <p className="text-muted-foreground">Implement destination form here posting to /api/admin/destinations.</p>
    </AdminLayout>
  )
}

