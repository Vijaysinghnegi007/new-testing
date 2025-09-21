'use client'

import React, { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const statuses = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];

export default function EditVendorTourPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', status: 'DRAFT', basePrice: 0, discountPrice: '', duration: 1 });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/vendor/tours/${params.id}`);
      const data = await res.json();
      const t = data.tour;
      setForm({ title: t.title, description: t.description, status: t.status, basePrice: t.basePrice, discountPrice: t.discountPrice || '', duration: t.duration });
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user) { router.push('/auth/signin'); return; }
    if (session.user.role !== 'VENDOR' && session.user.role !== 'ADMIN') { router.push('/unauthorized'); return; }
    load();
  }, [status, session?.user, router, load]);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/vendor/tours/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, basePrice: Number(form.basePrice), discountPrice: form.discountPrice ? Number(form.discountPrice) : null, duration: Number(form.duration) }),
      });
      if (res.ok) router.push('/vendor/tours');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
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
              <CardTitle>Edit Tour</CardTitle>
              <CardDescription>Update your tour details</CardDescription>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label>Status</Label>
                  <select className="w-full border rounded-md h-10 px-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Base Price ($)</Label>
                  <Input type="number" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: e.target.value })} />
                </div>
                <div>
                  <Label>Discount Price ($)</Label>
                  <Input type="number" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Duration (days)</Label>
                <Input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
              </div>
              <div className="pt-2">
                <Button onClick={save} disabled={saving}>Save</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
