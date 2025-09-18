import React from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

export const metadata = {
  title: 'Edit Tour - Admin',
}

export default function AdminTourEdit({ params }) {
  return (
    <AdminLayout title="Edit Tour">
      <p className="text-muted-foreground">Implement tour edit form for ID: {params.id} (GET/PATCH /api/admin/tours/{id}).</p>
    </AdminLayout>
  )
}

