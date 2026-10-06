import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ReadToggle } from "@/components/admin/read-toggle";

const typeLabel = {
  SUGGESTION: "Suggestion",
  NEWSLETTER_SUBSCRIBE: "Newsletter",
  INQUIRY: "Inquiry",
} as const;

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const { filter } = await searchParams;
  const messages = await prisma.feedbackMessage.findMany({
    where: filter === "unread" ? { isRead: false } : undefined,
    orderBy: { createdAt: "desc" },
    take: 300,
  });

  const tab = (href: string, label: string, active: boolean) => (
    <Link
      href={href}
      className={`rounded-md px-4 py-1.5 text-sm font-semibold ${active ? "bg-forest-700 text-white" : "text-forest-800 hover:bg-forest-100"}`}
    >
      {label}
    </Link>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold text-forest-900">Messages &amp; Suggestions</h1>
        <div className="flex gap-1 rounded-lg bg-white p-1 ring-1 ring-forest-700/10">
          {tab("/admin/messages", "All", filter !== "unread")}
          {tab("/admin/messages?filter=unread", "Unread", filter === "unread")}
        </div>
      </div>

      {messages.length === 0 ? (
        <p className="rounded-xl bg-white p-10 text-center text-slate-500 ring-1 ring-forest-700/10">No messages yet.</p>
      ) : (
        <ul className="space-y-3">
          {messages.map((m) => (
            <li
              key={m.id}
              className={`rounded-xl bg-white p-5 shadow-sm ring-1 ${m.isRead ? "ring-forest-700/10" : "ring-gold-500 border-l-4 border-gold-500"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-forest-900">{m.fullName}</span>
                    <span className="rounded-full bg-forest-100 px-2.5 py-0.5 text-xs font-semibold text-forest-800">
                      {typeLabel[m.type]}
                    </span>
                    {!m.isRead && <span className="rounded-full bg-gold-500 px-2 py-0.5 text-xs font-bold text-forest-950">NEW</span>}
                  </div>
                  <a href={`mailto:${m.email}`} className="text-sm text-forest-700 hover:underline">{m.email}</a>
                </div>
                <div className="flex items-center gap-3">
                  <time className="text-xs text-slate-400">{m.createdAt.toLocaleString("en-GB")}</time>
                  <ReadToggle id={m.id} isRead={m.isRead} />
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{m.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
