import React from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'

export const metadata = {
  title: 'Tours - Admin',
}

export default function AdminToursList() {
  return (
    <AdminLayout title="Tours">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Tours</h2>
        <Link className="text-primary underline" href="/admin/tours/new">Add Tour</Link>
      </div>
      <p className="text-muted-foreground">Implement tours table + filters here, wired to /api/admin/tours.</p>
    </AdminLayout>
  )
}

