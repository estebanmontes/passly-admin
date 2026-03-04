import { getTranslations } from "next-intl/server";
import { KpiCards } from "@/components/sections/dashboard/kpi-cards";
import { SalesChart } from "@/components/sections/dashboard/sales-chart";
import { UpcomingEventsTable } from "@/components/sections/dashboard/upcoming-events-table";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("welcome")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("overview")}
        </p>
      </div>

      {/* KPI Cards */}
      <KpiCards />

      {/* Sales Chart */}
      <SalesChart />

      {/* Upcoming Events Table */}
      <UpcomingEventsTable />
    </div>
  );
}
