import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { getOrganizerByUserId } from "@/lib/queries/events";
import { getDashboardKpis, getUpcomingEvents } from "@/lib/queries/dashboard";
import { KpiCards } from "@/components/sections/dashboard/kpi-cards";
import { SalesChart } from "@/components/sections/dashboard/sales-chart";
import { UpcomingEventsTable } from "@/components/sections/dashboard/upcoming-events-table";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");
  const session = await auth.api.getSession({ headers: await headers() });
  const organizer = session
    ? await getOrganizerByUserId(session.user.id)
    : null;

  const [kpis, upcomingEvents] = organizer
    ? await Promise.all([
        getDashboardKpis(organizer.id),
        getUpcomingEvents(organizer.id),
      ])
    : [
        { totalRevenue: 0, totalAttendance: 0, activeEvents: 0, totalOrders: 0 },
        [],
      ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {t("welcome")}{session?.user.name ? `, ${session.user.name}` : ""}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("overview")}
        </p>
      </div>

      {/* KPI Cards */}
      <KpiCards data={kpis} />

      {/* Sales Chart */}
      <SalesChart />

      {/* Upcoming Events Table */}
      <UpcomingEventsTable events={upcomingEvents} />
    </div>
  );
}
