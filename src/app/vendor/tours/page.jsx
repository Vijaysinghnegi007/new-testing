'use client'

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, PencilLine, Trash2, Plus } from 'lucide-react';

export default function VendorToursPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState([]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/vendor/tours');
      const data = await res.json();
      setTours(data.tours || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user) { router.push('/auth/signin'); return; }
    if (session.user.role !== 'VENDOR' && session.user.role !== 'ADMIN') { router.push('/unauthorized'); return; }
    load();
  }, [status, session?.user, router, load]);

  const remove = async (id) => {
    if (!confirm('Delete this tour?')) return;
    await fetch(`/api/vendor/tours/${id}`, { method: 'DELETE' });
    await load();
  };

  if (loading || status === 'loading') {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">My Tours</h1>
            <Button asChild><Link href="/vendor/tours/new"><Plus className="h-4 w-4 mr-2" />New Tour</Link></Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tours.map((t) => (
              <Card key={t.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{t.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {t.destination?.name || '—'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Badge>{t.category}</Badge>
                  <Badge variant="secondary">{t.duration} days</Badge>
                </CardContent>
                <CardContent className="flex gap-2">
                  <Button size="sm" asChild><Link href={`/vendor/tours/${t.id}/edit`}><PencilLine className="h-4 w-4 mr-1" />Edit</Link></Button>
                  <Button size="sm" variant="outline" onClick={() => remove(t.id)}><Trash2 className="h-4 w-4 mr-1" />Delete</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
