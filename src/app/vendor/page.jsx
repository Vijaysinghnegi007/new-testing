'use client'

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Plus, List } from 'lucide-react';

export default function VendorDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!session?.user) {
    router.push('/auth/signin');
    return null;
  }

  if (session.user.role !== 'VENDOR' && session.user.role !== 'ADMIN') {
    router.push('/unauthorized');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h1 className="text-3xl font-bold">Vendor Portal</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" /> Manage Tours</CardTitle>
                <CardDescription>Create and manage your tours</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button asChild>
                  <Link href="/vendor/tours"><List className="h-4 w-4 mr-2" />View Tours</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/vendor/tours/new"><Plus className="h-4 w-4 mr-2" />New Tour</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
