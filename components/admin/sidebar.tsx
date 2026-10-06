"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Inbox, Mail, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/alumni", label: "Alumni", icon: Users },
  { href: "/admin/messages", label: "Messages", icon: Inbox },
  { href: "/admin/emails", label: "Broadcast", icon: Mail },
];

export function AdminSidebar({ unread, email }: { unread: number; email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex shrink-0 flex-col bg-forest-950 text-white md:sticky md:top-0 md:h-screen md:w-64">
      <div className="flex items-center gap-3 px-5 py-5">
        <Image src="/logo.png" alt="" width={40} height={40} className="h-10 w-10 object-contain" />
        <div className="text-sm font-semibold leading-tight">
          Alumni Admin
          <div className="text-xs font-normal text-white/50">FUTO Biology</div>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:overflow-visible">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition",
                active ? "bg-gold-500 text-forest-950" : "text-white/75 hover:bg-white/10",
              )}
            >
              <Icon className="h-4 w-4" /> {label}
              {href === "/admin/messages" && unread > 0 && (
                <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">{unread}</span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="hidden border-t border-white/10 p-4 md:block">
        <p className="truncate text-xs text-white/50">{email}</p>
        <button onClick={logout} className="mt-2 flex items-center gap-2 text-sm text-white/80 hover:text-gold-400">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </aside>
  );
}
