import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { getOrganizerByUserId } from "@/lib/queries/events";
import { getDashboardKpis, getUpcomingEvents, getSalesChartData } from "@/lib/queries/dashboard";
import { KpiCards } from "@/components/sections/dashboard/kpi-cards";
import { SalesChart } from "@/components/sections/dashboard/sales-chart";
import { UpcomingEventsTable } from "@/components/sections/dashboard/upcoming-events-table";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");
  const session = await auth.api.getSession({ headers: await headers() });
  const organizer = session
    ? await getOrganizerByUserId(session.user.id)
    : null;

  const [kpis, upcomingEvents, chartDaily, chartWeekly, chartMonthly] = organizer
    ? await Promise.all([
        getDashboardKpis(organizer.id),
        getUpcomingEvents(organizer.id),
        getSalesChartData(organizer.id, "daily"),
        getSalesChartData(organizer.id, "weekly"),
        getSalesChartData(organizer.id, "monthly"),
      ])
    : [
        { totalRevenue: 0, totalAttendance: 0, activeEvents: 0, totalOrders: 0 },
        [],
        { labels: [], values: [] },
        { labels: [], values: [] },
        { labels: [], values: [] },
      ];

  const chartData = {
    daily: chartDaily,
    weekly: chartWeekly,
    monthly: chartMonthly,
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">
          {t("welcome")}{session?.user.name ? `, ${session.user.name}` : ""}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("overview")}
        </p>
      </div>

      {/* KPI Cards */}
      <KpiCards data={kpis} />

      {/* Sales Chart */}
      <SalesChart data={chartData} />

      {/* Upcoming Events Table */}
      <UpcomingEventsTable events={upcomingEvents} />
    </div>
  );
}
