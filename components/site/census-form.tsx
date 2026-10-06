"use client";

import { useState } from "react";
import { Loader2, MessageCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { INDUSTRIES, gradYears } from "@/lib/utils";

export function CensusForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_LINK || "#";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      fullName: fd.get("fullName"),
      gradYear: fd.get("gradYear"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      currentCity: fd.get("currentCity"),
      currentCountry: fd.get("currentCountry"),
      industrySector: fd.get("industrySector"),
      currentRole: fd.get("currentRole"),
      company: fd.get("company"),
      interestedInMentorship: fd.get("interestedInMentorship") === "on",
    };
    try {
      const res = await fetch("/api/census", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      form.reset();
      setOpen(true);
      window.dispatchEvent(new Event("census:registered"));
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form
        onSubmit={onSubmit}
        className="grid gap-5 rounded-2xl bg-white p-6 shadow-xl shadow-forest-900/10 ring-1 ring-forest-700/10 sm:grid-cols-2 sm:p-9"
      >
        <Field label="Full Name *" className="sm:col-span-2">
          <input name="fullName" required className="field" placeholder="e.g. Chioma Okeke" autoComplete="name" />
        </Field>
        <Field label="Graduation Year *">
          <select name="gradYear" required defaultValue="" className="field">
            <option value="" disabled>Select year</option>
            {gradYears().map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </Field>
        <Field label="Industry Sector *">
          <select name="industrySector" required defaultValue="" className="field">
            <option value="" disabled>Select industry</option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </Field>
        <Field label="Email *">
          <input name="email" type="email" required className="field" placeholder="you@example.com" autoComplete="email" />
        </Field>
        <Field label="Phone / WhatsApp *">
          <input name="phone" type="tel" required className="field" placeholder="+234 800 000 0000" autoComplete="tel" />
        </Field>
        <Field label="Current City *">
          <input name="currentCity" required className="field" placeholder="e.g. Lagos" />
        </Field>
        <Field label="Current Country *">
          <input name="currentCountry" required className="field" placeholder="e.g. Nigeria" autoComplete="country-name" />
        </Field>
        <Field label="Current Role">
          <input name="currentRole" className="field" placeholder="e.g. Research Scientist" />
        </Field>
        <Field label="Company / Institution">
          <input name="company" className="field" placeholder="e.g. NAFDAC" />
        </Field>
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-forest-100 bg-forest-50 p-4 sm:col-span-2">
          <input type="checkbox" name="interestedInMentorship" className="mt-1 h-4 w-4 accent-forest-700" />
          <span className="text-sm">
            <span className="font-semibold text-forest-900">I&apos;m interested in mentoring final-year students</span>
            <br />
            <span className="text-slate-600">Support undergraduate research projects through our mentorship programme.</span>
          </span>
        </label>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700 sm:col-span-2">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" disabled={loading} className="sm:col-span-2">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Submitting..." : "Submit My Registration"}
        </Button>
      </form>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <CheckCircle2 className="mx-auto h-14 w-14 text-forest-600" />
          <DialogTitle className="mt-4 font-display text-2xl font-bold text-forest-900">
            You&apos;re in! Welcome, Bioscientist.
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm text-slate-600">
            Your registration is saved and a welcome email is on its way. Connect with fellow alumni in our official community.
          </DialogDescription>
          <Button asChild variant="whatsapp" size="lg" className="mt-6 w-full">
            <a href={wa} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" /> Join FUTO Bio Alumni Official WhatsApp Group
            </a>
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Field({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
