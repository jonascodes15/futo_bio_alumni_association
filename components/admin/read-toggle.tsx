"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Circle } from "lucide-react";

export function ReadToggle({ id, isRead }: { id: string; isRead: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState(false);

  async function toggle() {
    setError(false);
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead: !isRead }),
    });
    if (!res.ok) return setError(true);
    start(() => router.refresh());
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-60 ${
        isRead
          ? "border-[#cfdcd3] text-slate-600 hover:bg-forest-50"
          : "border-forest-700 bg-forest-700 text-white hover:bg-forest-600"
      }`}
    >
      {isRead ? <Circle className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
      {error ? "Failed, retry" : isRead ? "Mark unread" : "Mark as read"}
    </button>
  );
}
