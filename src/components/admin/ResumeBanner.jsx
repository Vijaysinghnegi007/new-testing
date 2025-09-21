

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function ResumeBanner() {
  const router = useRouter();
  const pathname = usePathname();
  const [resume, setResume] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/project-state', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        const lastRoute = data?.checkpoint ? JSON.parse(data.checkpoint.snapshot || '{}')?.route : null;
        if (lastRoute && lastRoute !== pathname) {
          setResume({ lastRoute });
        }
      } catch {}
    };
    load();
  }, [pathname]);

  if (!resume) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg border rounded-md p-4 z-50">
      <div className="text-sm mb-2">Resume where you left off?</div>
      <div className="flex gap-2">
        <Button onClick={() => router.push(resume.lastRoute)} size="sm">Resume</Button>
        <Button onClick={() => setResume(null)} size="sm" variant="outline">Dismiss</Button>
      </div>
    </div>
  );
}
