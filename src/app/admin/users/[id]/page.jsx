import React from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

export const metadata = {
  title: 'User Detail - Admin',
}

export default function AdminUserDetail({ params }) {
  return (
    <AdminLayout title="User Detail">
      <p className="text-muted-foreground">Implement user detail page for ID: {params.id} (GET/PATCH /api/admin/users/{id}).</p>
    </AdminLayout>
  )
}

