import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";

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
      <div className="ml-[264px]">
        <DashboardHeader user={session.user} />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
