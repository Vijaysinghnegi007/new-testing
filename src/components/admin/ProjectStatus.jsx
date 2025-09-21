'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProjectStatus() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [state, setState] = useState({ project: null, checkpoint: null, pendingTasks: [] });
  const [saving, setSaving] = useState(false);

  const fetchState = async () => {
    try {
      const res = await fetch('/api/project-state', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setState(data);
      }
    } catch {}
  };

  useEffect(() => {
    fetchState();
  }, []);

  const saveCheckpoint = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await fetch('/api/checkpoints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectSlug: state.project?.slug || 'default',
          summary: `Saved from ${pathname}`,
          snapshot: { route: pathname },
          lastRoute: pathname,
          createdBy: session?.user?.id || null,
        }),
      });
      await fetchState();
    } catch {} finally {
      setSaving(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Project Status</CardTitle>
        <CardDescription>
          Project: {state.project?.name || 'Travel Website'} ({state.project?.slug || 'default'})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Latest checkpoint</div>
            <div className="text-foreground">
              {state.checkpoint ? (state.checkpoint.summary || state.checkpoint.name || `#${state.checkpoint.id.slice(0,6)}`) : 'None'}
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-2">Pending tasks</div>
            {state.pendingTasks && state.pendingTasks.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {state.pendingTasks.slice(0,5).map(t => (
                  <li key={t.id} className="text-sm">
                    <span className="font-medium">[{t.priority}]</span> {t.title}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-muted-foreground">No pending tasks</div>
            )}
          </div>

          <div>
            <Button onClick={saveCheckpoint} disabled={saving}>
              {saving ? 'Saving...' : 'Save checkpoint'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
