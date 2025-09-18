import React from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

export const metadata = {
  title: 'Edit Destination - Admin',
}

export default function AdminDestinationEdit({ params }) {
  return (
    <AdminLayout title="Edit Destination">
      <p className="text-muted-foreground">Implement destination edit form for ID: {params.id} (GET/PATCH /api/admin/destinations/{id}).</p>
    </AdminLayout>
  )
}

