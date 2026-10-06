"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeedbackForm() {
  const [type, setType] = useState<"SUGGESTION" | "NEWSLETTER_SUBSCRIBE" | "INQUIRY">("SUGGESTION");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fd.get("fullName"),
          email: fd.get("email"),
          type,
          message: fd.get("message") ?? "",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      form.reset();
      setDone(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const tabs = [
    { v: "SUGGESTION", label: "Suggestion" },
    { v: "NEWSLETTER_SUBSCRIBE", label: "Newsletter" },
    { v: "INQUIRY", label: "Inquiry" },
  ] as const;

  if (done) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow-xl ring-1 ring-forest-700/10">
        <h3 className="font-display text-2xl font-bold text-forest-900">Thank you!</h3>
        <p className="mt-2 text-slate-600">We&apos;ve received your message and the council will review it.</p>
        <Button variant="subtle" className="mt-6" onClick={() => setDone(false)}>
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-2xl bg-white p-6 shadow-xl shadow-forest-900/10 ring-1 ring-forest-700/10 sm:p-9">
      <div className="flex gap-2 rounded-lg bg-forest-50 p-1" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.v}
            type="button"
            role="tab"
            aria-selected={type === t.v}
            onClick={() => setType(t.v)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition ${
              type === t.v ? "bg-forest-700 text-white shadow" : "text-forest-800 hover:bg-forest-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label">Full Name *</label>
          <input name="fullName" required className="field" autoComplete="name" />
        </div>
        <div>
          <label className="label">Email *</label>
          <input name="email" type="email" required className="field" autoComplete="email" />
        </div>
      </div>
      {type !== "NEWSLETTER_SUBSCRIBE" ? (
        <div>
          <label className="label">{type === "SUGGESTION" ? "Your suggestion *" : "Your question *"}</label>
          <textarea name="message" required rows={5} className="field resize-y" placeholder="Tell us what's on your mind..." />
        </div>
      ) : (
        <p className="rounded-lg bg-forest-50 px-4 py-3 text-sm text-forest-900">
          Subscribe to receive updates on events, mentorship and the association&apos;s progress.
        </p>
      )}
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
      <Button type="submit" size="lg" disabled={loading} className="w-full">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {type === "NEWSLETTER_SUBSCRIBE" ? "Subscribe" : "Send Message"}
      </Button>
    </form>
  );
}
