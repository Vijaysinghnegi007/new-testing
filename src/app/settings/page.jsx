'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import NotificationSettings from '@/components/settings/NotificationSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Settings,
  Bell,
  User,
  Shield,
  CreditCard,
  Smartphone,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded-lg w-1/3"></div>
            <div className="h-96 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Authentication Required</CardTitle>
              <CardDescription className="text-center">
                Please sign in to access your settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
          
          <div className="flex items-center gap-3 mb-2">
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Account Settings
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Manage your account preferences and notification settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="default"
                  className="w-full justify-start"
                  size="sm"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                  disabled
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                  <span className="ml-auto text-xs text-gray-500">Soon</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                  disabled
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy
                  <span className="ml-auto text-xs text-gray-500">Soon</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                  disabled
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Billing
                  <span className="ml-auto text-xs text-gray-500">Soon</span>
                </Button>
              </CardContent>
            </Card>

            {/* User Info Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Account</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="h-12 w-12 rounded-full"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">
                      {session.user.name || 
                       `${session.user.firstName} ${session.user.lastName}` ||
                       'User'}
                    </p>
                    <p className="text-sm text-gray-600">{session.user.email}</p>
                    {session.user.role && (
                      <p className="text-xs text-gray-500 uppercase">
                        {session.user.role}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <NotificationSettings />
            
            {/* Quick Actions */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Test your notification settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      if ('Notification' in window) {
                        Notification.requestPermission().then(permission => {
                          if (permission === 'granted') {
                            new Notification('Test Notification', {
                              body: 'Your notification settings are working!',
                              icon: '/favicon.ico'
                            });
                          }
                        });
                      }
                    }}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Test Browser Notification
                  </Button>
                  
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/demo/realtime">
                      <Smartphone className="h-4 w-4 mr-2" />
                      Test Real-time Features
                    </Link>
                  </Button>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p className="mb-2">
                    <strong>Tip:</strong> Enable browser notifications for the best experience.
                  </p>
                  <ul className="space-y-1 text-xs">
                    <li>• Real-time notifications work instantly</li>
                    <li>• Email notifications may take a few minutes</li>
                    <li>• Quiet hours only apply to push notifications</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
