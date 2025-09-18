import React from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'

export const metadata = {
  title: 'Destinations - Admin',
}

export default function AdminDestinationsList() {
  return (
    <AdminLayout title="Destinations">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Destinations</h2>
        <Link className="text-primary underline" href="/admin/destinations/new">Add Destination</Link>
      </div>
      <p className="text-muted-foreground">Implement table + filters here, wired to /api/admin/destinations.</p>
    </AdminLayout>
  )
}

