'use client'

import React, { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const categories = ['ADVENTURE', 'CULTURAL', 'LUXURY', 'BUDGET', 'FAMILY', 'ROMANTIC', 'BUSINESS', 'RELIGIOUS'];

export default function NewVendorTourPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [destinations, setDestinations] = useState([]);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    destinationId: '',
    category: 'ADVENTURE',
    duration: 7,
    basePrice: 999,
    images: ['https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop'],
  });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/vendor/destinations');
      const data = await res.json();
      setDestinations(data.destinations || []);
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

  const save = async () => {
    if (!form.title || !form.description || !form.destinationId || !form.category) return;
    setSaving(true);
    try {
      const res = await fetch('/api/vendor/tours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push('/vendor/tours');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading || status === 'loading') return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <section className="py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>New Tour</CardTitle>
              <CardDescription>Create a tour</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <Label>Description</Label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div>
                <Label>Destination</Label>
                <select className="w-full border rounded-md h-10 px-2" value={form.destinationId} onChange={(e) => setForm({ ...form, destinationId: e.target.value })}>
                  <option value="">Select destination</option>
                  {destinations.map(d => <option key={d.id} value={d.id}>{d.name} ({d.country})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label>Category</Label>
                  <select className="w-full border rounded-md h-10 px-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Duration (days)</Label>
                  <Input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} />
                </div>
                <div>
                  <Label>Base Price ($)</Label>
                  <Input type="number" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: Number(e.target.value) })} />
                </div>
              </div>
              <div>
                <Label>Lead Image URL</Label>
                <Input value={form.images[0] || ''} onChange={(e) => setForm({ ...form, images: [e.target.value] })} />
              </div>
              <div className="pt-2">
                <Button onClick={save} disabled={saving}>Create</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
