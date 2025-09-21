'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  Package,
  Users,
  Calendar,
  BarChart3,
  Settings,
  CheckSquare,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  User,
  ChevronDown,
  Globe,
  CreditCard,
  MessageSquare,
  FileText,
  Briefcase,
  Shield
} from 'lucide-react';

const AdminLayout = ({ children, title = 'Dashboard' }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: Home,
      current: pathname === '/admin'
    },
    {
      name: 'Tours',
      href: '/admin/tours',
      icon: Package,
      current: pathname.startsWith('/admin/tours'),
      badge: 12
    },
    {
      name: 'Bookings',
      href: '/admin/bookings',
      icon: Calendar,
      current: pathname.startsWith('/admin/bookings'),
      badge: 5,
      badgeColor: 'bg-orange-100 text-orange-800'
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users,
      current: pathname.startsWith('/admin/users')
    },
    {
      name: 'Payments',
      href: '/admin/payments',
      icon: CreditCard,
      current: pathname.startsWith('/admin/payments')
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      current: pathname.startsWith('/admin/analytics')
    },
    {
      name: 'Messages',
      href: '/admin/messages',
      icon: MessageSquare,
      current: pathname.startsWith('/admin/messages'),
      badge: 3,
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      name: 'Tasks',
      href: '/admin/tasks',
      icon: CheckSquare,
      current: pathname.startsWith('/admin/tasks')
    },
    {
      name: 'Reports',
      href: '/admin/reports',
      icon: FileText,
      current: pathname.startsWith('/admin/reports')
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      current: pathname.startsWith('/admin/settings')
    }
  ];

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link href="/admin" className="flex items-center space-x-2">
            <Globe className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-gray-900">TravelAdmin</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      item.current
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <Badge 
                        variant="secondary" 
                        className={`ml-auto ${item.badgeColor || 'bg-gray-100 text-gray-800'} text-xs`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="w-full justify-start text-gray-700 hover:bg-gray-100"
          >
            <Globe className="h-4 w-4 mr-3" />
            View Website
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-red-500 text-white rounded-full">
                  3
                </Badge>
              </Button>

              {/* User menu */}
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="hidden md:block text-sm font-medium">
                    {session?.user?.firstName || 'Admin'}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {session?.user?.firstName} {session?.user?.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{session?.user?.email}</p>
                        <Badge variant="secondary" className="mt-1">
                          <Shield className="h-3 w-3 mr-1" />
                          {session?.user?.role}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() => router.push('/admin/profile')}
                        className="w-full justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User className="h-4 w-4 mr-3" />
                        Profile Settings
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => router.push('/admin/settings')}
                        className="w-full justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Admin Settings
                      </Button>
                      <div className="border-t border-gray-100">
                        <Button
                          variant="ghost"
                          onClick={handleSignOut}
                          className="w-full justify-start px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
