import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(`/${locale}/signin`);
  }

  const role = (session.user as { role?: string }).role;

  if (role !== "ORGANIZER" && role !== "ADMIN") {
    redirect(`/${locale}/signin?error=unauthorized`);
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:ml-[264px]">
        <DashboardHeader user={session.user} />
        <main className="p-4 pb-20 sm:p-6 lg:p-8 lg:pb-8">{children}</main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
