'use client'

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  Calendar,
  DollarSign,
  Globe,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  MapPin,
  CreditCard,
  Eye,
  Plus
} from 'lucide-react';
import Link from 'next/link';

// Mock data - in production, fetch from API
const mockStats = {
  totalRevenue: 125430,
  totalBookings: 347,
  totalTours: 23,
  totalUsers: 1250,
  revenueChange: 12.5,
  bookingsChange: -5.2,
  toursChange: 8.1,
  usersChange: 15.3
};

const mockRecentBookings = [
  {
    id: 'BK001',
    customerName: 'Sarah Johnson',
    tourName: 'Bali Cultural Adventure',
    date: '2024-03-15',
    amount: 1299,
    status: 'confirmed'
  },
  {
    id: 'BK002',
    customerName: 'Mike Chen',
    tourName: 'Swiss Alps Hiking',
    date: '2024-03-20',
    amount: 2499,
    status: 'pending'
  },
  {
    id: 'BK003',
    customerName: 'Emma Williams',
    tourName: 'Maldives Luxury Retreat',
    date: '2024-03-25',
    amount: 3999,
    status: 'confirmed'
  }
];

const mockPopularTours = [
  {
    id: 1,
    name: 'Bali Cultural Adventure',
    bookings: 45,
    revenue: 58455,
    rating: 4.8
  },
  {
    id: 2,
    name: 'Swiss Alps Hiking Experience',
    bookings: 32,
    revenue: 79968,
    rating: 4.9
  },
  {
    id: 3,
    name: 'Maldives Luxury Retreat',
    bookings: 28,
    revenue: 111972,
    rating: 5.0
  }
];

const StatCard = ({ title, value, change, icon: Icon, description, color = 'text-green-600' }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground flex items-center">
        {change > 0 ? (
          <ArrowUpRight className={`h-4 w-4 mr-1 ${color}`} />
        ) : (
          <ArrowDownRight className="h-4 w-4 mr-1 text-red-600" />
        )}
        <span className={change > 0 ? color : 'text-red-600'}>
          {Math.abs(change)}% from last month
        </span>
      </p>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </CardContent>
  </Card>
);

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    
    if (session?.user?.role !== 'ADMIN') {
      router.push('/unauthorized');
      return;
    }
    
    setLoading(false);
  }, [session, status, router]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Project Status */}
        <div>
          {/** Project status widget */}
          {typeof window !== 'undefined' && (
            require('@/components/admin/ProjectStatus.jsx').default ? (
              React.createElement(require('@/components/admin/ProjectStatus.jsx').default)
            ) : null
          )}
        </div>

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-primary-hover rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Welcome back, {session?.user?.firstName || 'Admin'}!
              </h2>
              <p className="text-blue-100">
                Here&apos;s what&apos;s happening with your travel business today.
              </p>
            </div>
            <div className="hidden md:block">
              <Globe className="h-16 w-16 text-blue-200" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={`$${mockStats.totalRevenue.toLocaleString()}`}
            change={mockStats.revenueChange}
            icon={DollarSign}
            description="Total earnings this month"
            color="text-green-600"
          />
          <StatCard
            title="Total Bookings"
            value={mockStats.totalBookings.toLocaleString()}
            change={mockStats.bookingsChange}
            icon={Calendar}
            description="Bookings this month"
            color={mockStats.bookingsChange > 0 ? "text-green-600" : "text-red-600"}
          />
          <StatCard
            title="Active Tours"
            value={mockStats.totalTours}
            change={mockStats.toursChange}
            icon={Package}
            description="Published tour packages"
            color="text-green-600"
          />
          <StatCard
            title="Total Users"
            value={mockStats.totalUsers.toLocaleString()}
            change={mockStats.usersChange}
            icon={Users}
            description="Registered customers"
            color="text-green-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest customer bookings</CardDescription>
              </div>
              <Button asChild size="sm">
                <Link href="/admin/bookings">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm">{booking.customerName}</p>
                        <Badge className={`text-xs ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{booking.tourName}</p>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(booking.date).toLocaleDateString()}
                        <DollarSign className="h-3 w-3 ml-3 mr-1" />
                        ${booking.amount}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Popular Tours */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Popular Tours</CardTitle>
                <CardDescription>Top performing tour packages</CardDescription>
              </div>
              <Button asChild size="sm">
                <Link href="/admin/tours">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPopularTours.map((tour) => (
                  <div key={tour.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm">{tour.name}</p>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 mr-1" />
                          <span className="text-xs font-medium">{tour.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{tour.bookings} bookings</span>
                        <span className="font-medium text-green-600">${tour.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common admin tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Button asChild className="flex flex-col h-20 space-y-2">
                <Link href="/admin/tours/new">
                  <Plus className="h-5 w-5" />
                  <span className="text-xs">Add Tour</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex flex-col h-20 space-y-2">
                <Link href="/admin/bookings">
                  <Calendar className="h-5 w-5" />
                  <span className="text-xs">Bookings</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex flex-col h-20 space-y-2">
                <Link href="/admin/users">
                  <Users className="h-5 w-5" />
                  <span className="text-xs">Users</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex flex-col h-20 space-y-2">
                <Link href="/admin/payments">
                  <CreditCard className="h-5 w-5" />
                  <span className="text-xs">Payments</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex flex-col h-20 space-y-2">
                <Link href="/admin/analytics">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-xs">Analytics</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex flex-col h-20 space-y-2">
                <Link href="/admin/settings">
                  <Clock className="h-5 w-5" />
                  <span className="text-xs">Settings</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
