import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin | FUTO Biology Alumni" };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const unread = await prisma.feedbackMessage.count({ where: { isRead: false } }).catch(() => 0);

  return (
    <div className="flex min-h-screen flex-col bg-[#f1f6f3] md:flex-row">
      <AdminSidebar unread={unread} email={session.email} />
      <main className="min-w-0 flex-1 p-5 md:p-8">{children}</main>
    </div>
  );
}
