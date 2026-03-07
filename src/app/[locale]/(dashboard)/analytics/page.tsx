import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { getOrganizerByUserId } from "@/lib/queries/events";
import { getAnalyticsData } from "@/lib/queries/analytics";
import { AnalyticsDashboard } from "@/components/sections/analytics/analytics-dashboard";

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const t = await getTranslations("analytics");
  const session = await auth.api.getSession({ headers: await headers() });
  const organizer = session
    ? await getOrganizerByUserId(session.user.id)
    : null;

  const sp = await searchParams;
  const preset = typeof sp.preset === "string" ? sp.preset : "30d";
  const now = new Date();
  let from: Date;
  const to = new Date(now);

  switch (preset) {
    case "7d":
      from = new Date(now);
      from.setDate(from.getDate() - 7);
      break;
    case "90d":
      from = new Date(now);
      from.setDate(from.getDate() - 90);
      break;
    case "year":
      from = new Date(now.getFullYear(), 0, 1);
      break;
    case "custom":
      from = sp.from ? new Date(String(sp.from)) : new Date(now.setDate(now.getDate() - 30));
      if (sp.to) to.setTime(new Date(String(sp.to)).getTime());
      break;
    default: // 30d
      from = new Date(now);
      from.setDate(from.getDate() - 30);
      break;
  }

  const data = organizer
    ? await getAnalyticsData(organizer.id, { from, to })
    : {
        kpis: { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0, totalTicketsSold: 0 },
        dailyRevenue: [],
        salesByEvent: [],
        salesByTier: [],
        topEvents: [],
      };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
      <AnalyticsDashboard data={data} />
    </div>
  );
}
