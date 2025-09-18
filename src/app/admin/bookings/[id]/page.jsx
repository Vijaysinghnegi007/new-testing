import React from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

export const metadata = {
  title: 'Booking Detail - Admin',
}

export default function AdminBookingDetail({ params }) {
  return (
    <AdminLayout title="Booking Detail">
      <p className="text-muted-foreground">Implement booking detail page for ID: {params.id} (GET/PATCH /api/admin/bookings/{id}).</p>
    </AdminLayout>
  )
}

