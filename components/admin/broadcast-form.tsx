"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { INDUSTRIES } from "@/lib/utils";

export function BroadcastForm({ counts, total }: { counts: Record<string, number>; total: number }) {
  const [industry, setIndustry] = useState("ALL");
  const [mentorsOnly, setMentorsOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  const audience = industry === "ALL" ? total : (counts[industry] ?? 0);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const label = industry === "ALL" ? "all registered alumni" : `alumni in "${industry}"`;
    if (!window.confirm(`Send this email to ${label}${mentorsOnly ? " (mentors only)" : ""}? This cannot be undone.`)) return;

    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: fd.get("subject"), body: fd.get("body"), industry, mentorsOnly }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setResult({ ok: false, text: data.error ?? "Failed to send" });
      else
        setResult({
          ok: data.failed === 0,
          text: `Sent to ${data.sent} of ${data.total} recipients${data.failed ? `; ${data.failed} failed` : ""}.`,
        });
    } catch {
      setResult({ ok: false, text: "Network error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-xl bg-white p-6 shadow-sm ring-1 ring-forest-700/10">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label">Audience</label>
          <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="field">
            <option value="ALL">All registered alumni ({total})</option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>{i} ({counts[i] ?? 0})</option>
            ))}
          </select>
        </div>
        <label className="flex items-end gap-2 pb-2.5 text-sm font-medium">
          <input type="checkbox" checked={mentorsOnly} onChange={(e) => setMentorsOnly(e.target.checked)} className="h-4 w-4 accent-forest-700" />
          Only alumni who opted into mentorship
        </label>
      </div>
      <div>
        <label className="label">Subject</label>
        <input name="subject" required minLength={3} className="field" placeholder="e.g. Update from the Interim Executive Council" />
      </div>
      <div>
        <label className="label">Message</label>
        <textarea name="body" required minLength={10} rows={12} className="field resize-y" placeholder={"Dear Alumni,\n\nWrite your update here. Leave a blank line between paragraphs. Use **bold** for emphasis; links are made clickable automatically."} />
      </div>
      <p className="text-sm text-slate-500">
        Estimated audience: <strong>{audience}</strong> (before the mentorship filter). Each recipient receives an individual email.
      </p>
      {result && (
        <p role="status" className={`rounded-lg px-4 py-3 text-sm font-medium ${result.ok ? "bg-forest-50 text-forest-800" : "bg-red-50 text-red-700"}`}>
          {result.text}
        </p>
      )}
      <Button type="submit" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send Broadcast
      </Button>
    </form>
  );
}
