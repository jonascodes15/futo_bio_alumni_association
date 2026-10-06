"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fd.get("email"), password: fd.get("password") }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Login failed");
        return;
      }
      router.replace("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="dna-bg flex min-h-screen items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:bg-white/10 focus-visible:text-white focus-visible:outline-none"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        <form onSubmit={onSubmit} className="w-full space-y-5 rounded-2xl bg-white p-8 shadow-2xl">
          <div className="text-center">
            <Image src="/logo.png" alt="FUTO crest" width={72} height={72} className="mx-auto h-16 w-16 object-contain" />
            <h1 className="mt-3 font-display text-2xl font-bold text-forest-900">Admin Sign In</h1>
            <p className="text-sm text-slate-500">FUTO Biology Alumni Association</p>
          </div>
          <div>
            <label className="label">Email</label>
            <input name="email" type="email" required autoComplete="username" className="field" />
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                className="field"
                style={{ paddingRight: "2.75rem" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-slate-500 hover:text-forest-700 focus-visible:text-forest-700 focus-visible:outline-none"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              {error}
            </p>
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Sign In
          </Button>
        </form>
      </div>
    </main>
  );
}
