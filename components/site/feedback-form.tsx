"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EASE_PREMIUM } from "@/components/motion/reveal";

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

  return (
    <AnimatePresence mode="wait" initial={false}>
      {done ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -8 }}
          transition={{ duration: 0.6, ease: EASE_PREMIUM }}
          className="rounded-2xl bg-white p-10 text-center shadow-xl ring-1 ring-forest-700/10"
        >
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
          >
            <CheckCircle2 className="mx-auto h-12 w-12 text-forest-600" />
          </motion.div>
          <h3 className="mt-4 font-display text-2xl font-bold text-forest-900">Thank you!</h3>
          <p className="mt-2 text-slate-600">We&apos;ve received your message and the council will review it.</p>
          <Button variant="subtle" className="mt-6" onClick={() => setDone(false)}>
            Send another
          </Button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          initial={{ opacity: 0, scale: 0.98, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -8 }}
          transition={{ duration: 0.5, ease: EASE_PREMIUM }}
          className="space-y-5 rounded-2xl bg-white p-6 shadow-xl shadow-forest-900/10 ring-1 ring-forest-700/10 sm:p-9"
        >
          <div className="flex gap-2 rounded-lg bg-forest-50 p-1" role="tablist">
            {tabs.map((t) => {
              const active = type === t.v;
              return (
                <button
                  key={t.v}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setType(t.v)}
                  className={`relative flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-500 ease-premium ${
                    active ? "text-white" : "text-forest-800 hover:bg-forest-100"
                  }`}
                >
                  {/* One shared pill that glides to whichever tab is selected. */}
                  {active && (
                    <motion.span
                      layoutId="feedback-tab-pill"
                      className="absolute inset-0 rounded-md bg-forest-700 shadow"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{t.label}</span>
                </button>
              );
            })}
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
          {/* Message box and newsletter note morph into each other instead of snapping. */}
          <div>
            <AnimatePresence initial={false}>
              {type !== "NEWSLETTER_SUBSCRIBE" ? (
                <motion.div key="message" {...collapse}>
                  <label className="label">{type === "SUGGESTION" ? "Your suggestion *" : "Your question *"}</label>
                  <textarea name="message" required rows={5} className="field resize-y" placeholder="Tell us what's on your mind..." />
                </motion.div>
              ) : (
                <motion.div key="newsletter" {...collapse}>
                  <p className="rounded-lg bg-forest-50 px-4 py-3 text-sm text-forest-900">
                    Subscribe to receive updates on events, mentorship and the association&apos;s progress.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence initial={false}>
            {error && (
              <motion.p
                role="alert"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE_PREMIUM }}
                className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
          <Button type="submit" size="lg" disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {type === "NEWSLETTER_SUBSCRIBE" ? "Subscribe" : "Send Message"}
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

// Height-collapse transition. Overflow is only clipped while animating,
// so the field's focus ring isn't cut off once it has settled.
const collapse = {
  initial: { opacity: 0, height: 0, overflow: "hidden" },
  animate: { opacity: 1, height: "auto", transitionEnd: { overflow: "visible" } },
  exit: { opacity: 0, height: 0, overflow: "hidden" },
  transition: { duration: 0.5, ease: EASE_PREMIUM },
} as const;
