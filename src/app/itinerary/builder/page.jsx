"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function loadDraft() {
  try {
    const raw = localStorage.getItem("tripDraft");
    return raw ? JSON.parse(raw) : { title: "My Trip", days: 1, items: [] };
  } catch {
    return { title: "My Trip", days: 1, items: [] };
  }
}

export default function TripBuilderPage() {
  const [draft, setDraft] = useState({ title: "My Trip", days: 1, items: [] });
  const [saving, setSaving] = useState(false);
  const [shareId, setShareId] = useState("");

  useEffect(() => {
    setDraft(loadDraft());
  }, []);

  useEffect(() => {
    try { localStorage.setItem("tripDraft", JSON.stringify(draft)); } catch {}
  }, [draft]);

  const addCustom = () => {
    setDraft((d) => ({
      ...d,
      items: [...d.items, { day: 1, orderIndex: d.items.length, title: "New activity", notes: "" }],
    }));
  };

  const move = (idx, dir) => {
    setDraft((d) => {
      const items = [...d.items];
      const j = idx + dir;
      if (j < 0 || j >= items.length) return d;
      [items[idx], items[j]] = [items[j], items[idx]];
      return { ...d, items };
    });
  };

  const setDay = (idx, val) => {
    setDraft((d) => {
      const items = [...d.items];
      items[idx] = { ...items[idx], day: Math.max(1, Number(val) || 1) };
      return { ...d, items };
    });
  };

  const saveToAccount = async () => {
    try {
      setSaving(true);
      const payload = {
        title: draft.title,
        days: draft.days,
        items: draft.items.map((it, i) => ({
          day: it.day || 1,
          orderIndex: i,
          tourId: it.tourId || null,
          destinationId: it.destinationId || null,
          title: it.title || null,
          notes: it.notes || null,
        })),
        isPublic: true,
      };
      const res = await fetch("/api/itineraries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setShareId(data.itinerary.shareId);
    } catch (e) {
      alert(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div>
            <input
              className="w-full border rounded px-3 py-2"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Days:</span>
              <input
                type="number"
                className="w-24 border rounded px-2 py-1"
                value={draft.days}
                onChange={(e) => setDraft({ ...draft, days: Math.max(1, Number(e.target.value) || 1) })}
              />
              <Button variant="outline" onClick={addCustom}>Add custom activity</Button>
            </div>
          </div>

          <div className="space-y-2">
            {draft.items.map((it, idx) => (
              <div key={idx} className="border rounded p-3 flex items-center gap-3">
                <div className="text-sm text-muted-foreground">Day</div>
                <input
                  type="number"
                  className="w-20 border rounded px-2 py-1"
                  value={it.day || 1}
                  onChange={(e) => setDay(idx, e.target.value)}
                />
                <input
                  className="flex-1 border rounded px-2 py-1"
                  value={it.title || ""}
                  onChange={(e) => setDraft((d) => {
                    const items = [...d.items];
                    items[idx] = { ...items[idx], title: e.target.value };
                    return { ...d, items };
                  })}
                />
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" onClick={() => move(idx, -1)}>Up</Button>
                  <Button variant="outline" size="sm" onClick={() => move(idx, 1)}>Down</Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={saveToAccount} disabled={saving}>{saving ? "Saving..." : "Save to account (public)"}</Button>
            {shareId && (
              <Link href={`/itinerary/${shareId}`} className="text-primary underline">View public link</Link>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
Tip: On a tour page, use &quot;Add to Itinerary&quot; to add that tour to your current draft.
          </div>
        </div>
      </section>
    </div>
  );
}

