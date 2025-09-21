'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Clock, AlertTriangle, ListChecks, Plus, RefreshCw } from 'lucide-react';

const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const statuses = ['OPEN', 'IN_PROGRESS', 'BLOCKED', 'DONE'];

export default function AdminTasksPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'MEDIUM', dueDate: '' });

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus) params.set('status', filterStatus);
      const res = await fetch(`/api/tasks?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load tasks');
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (e) {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    // Optional: Only admins may access tasks
    // if (session?.user?.role !== 'ADMIN') { router.push('/unauthorized'); return; }
    fetchTasks();
  }, [status, router, fetchTasks]);

  const createTask = async () => {
    if (!form.title.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectSlug: 'default',
          title: form.title.trim(),
          description: form.description || null,
          priority: form.priority,
          status: 'OPEN',
          dueDate: form.dueDate || null,
        }),
      });
      if (res.ok) {
        setForm({ title: '', description: '', priority: 'MEDIUM', dueDate: '' });
        await fetchTasks();
      }
    } finally {
      setCreating(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) await fetchTasks();
    } catch {}
  };

  const tasksByStatus = useMemo(() => ({
    OPEN: tasks.filter(t => t.status === 'OPEN'),
    IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS'),
    BLOCKED: tasks.filter(t => t.status === 'BLOCKED'),
    DONE: tasks.filter(t => t.status === 'DONE'),
  }), [tasks]);

  if (status === 'loading' || loading) {
    return (
      <AdminLayout title="Tasks">
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Tasks">
      <div className="space-y-6">
        {/* Create Task */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" /> New Task
            </CardTitle>
            <CardDescription>Create a task to track project work</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Short task title"
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  className="w-full border rounded-md h-10 px-2"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                >
                  {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="due">Due Date</Label>
                <Input
                  id="due"
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                />
              </div>
              <div className="md:col-span-4">
                <Label htmlFor="desc">Description</Label>
                <Input
                  id="desc"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Optional description"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={createTask} disabled={creating || !form.title.trim()}>Create</Button>
              <Button onClick={fetchTasks} variant="outline"><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>
            </div>
          </CardContent>
        </Card>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Label>Status:</Label>
          <select
            className="border rounded-md h-10 px-2"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <Button onClick={fetchTasks} variant="outline">Apply</Button>
        </div>

        {/* Task Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['OPEN', 'IN_PROGRESS', 'BLOCKED', 'DONE'].map((col) => (
            <Card key={col}>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  {col === 'OPEN' && <Clock className="h-4 w-4" />}
                  {col === 'IN_PROGRESS' && <ListChecks className="h-4 w-4" />}
                  {col === 'BLOCKED' && <AlertTriangle className="h-4 w-4" />}
                  {col === 'DONE' && <CheckCircle2 className="h-4 w-4" />}
                  {col}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(tasksByStatus[col] || []).map((t) => (
                    <div key={t.id} className="border rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{t.title}</div>
                        <Badge>{t.priority}</Badge>
                      </div>
                      {t.description && (
                        <div className="text-sm text-muted-foreground mt-1">{t.description}</div>
                      )}
                      <div className="flex gap-2 mt-2">
                        {statuses.filter(s => s !== t.status).map(s => (
                          <Button key={s} size="sm" variant="outline" onClick={() => updateStatus(t.id, s)}>
                            {s}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
