import { db } from "@/lib/db";

export async function getDashboardKpis(organizerId: string) {
  const [revenueResult, events, ticketTiers, orders] = await Promise.all([
    db.order.aggregate({
      where: {
        event: { organizerId },
        status: "CONFIRMED",
      },
      _sum: { total: true },
    }),
    db.event.findMany({
      where: { organizerId },
      select: { status: true },
    }),
    db.ticketTier.aggregate({
      where: { event: { organizerId } },
      _sum: { soldCount: true },
    }),
    db.order.count({
      where: { event: { organizerId } },
    }),
  ]);

  const totalRevenue = revenueResult._sum.total ?? 0;
  const totalAttendance = ticketTiers._sum.soldCount ?? 0;
  const activeEvents = events.filter(
    (e) => e.status === "ON_SALE" || e.status === "SCHEDULED"
  ).length;

  return {
    totalRevenue,
    totalAttendance,
    activeEvents,
    totalOrders: orders,
  };
}

export async function getUpcomingEvents(organizerId: string) {
  return db.event.findMany({
    where: {
      organizerId,
      startDate: { gte: new Date() },
    },
    include: {
      venue: { select: { name: true } },
      ticketTiers: {
        select: { soldCount: true, totalQuantity: true },
      },
    },
    orderBy: { startDate: "asc" },
    take: 5,
  });
}

type ChartPeriod = "daily" | "weekly" | "monthly";

export async function getSalesChartData(organizerId: string, period: ChartPeriod) {
  const now = new Date();
  let from: Date;

  switch (period) {
    case "daily":
      from = new Date(now);
      from.setDate(from.getDate() - 7);
      break;
    case "weekly":
      from = new Date(now);
      from.setDate(from.getDate() - 28);
      break;
    case "monthly":
      from = new Date(now);
      from.setMonth(from.getMonth() - 6);
      break;
  }

  const orders = await db.order.findMany({
    where: {
      event: { organizerId },
      status: "CONFIRMED",
      createdAt: { gte: from, lte: now },
    },
    select: { createdAt: true, total: true },
    orderBy: { createdAt: "asc" },
  });

  // Group by day
  const salesMap = new Map<string, number>();
  for (const order of orders) {
    const day = order.createdAt.toISOString().slice(0, 10);
    salesMap.set(day, (salesMap.get(day) ?? 0) + order.total);
  }

  // Fill in missing days
  const labels: string[] = [];
  const values: number[] = [];
  const current = new Date(from);
  while (current <= now) {
    const day = current.toISOString().slice(0, 10);
    labels.push(day);
    values.push(salesMap.get(day) ?? 0);
    current.setDate(current.getDate() + 1);
  }

  // Aggregate based on period
  if (period === "weekly") {
    const weekLabels: string[] = [];
    const weekValues: number[] = [];
    for (let i = 0; i < values.length; i += 7) {
      const chunk = values.slice(i, i + 7);
      weekValues.push(chunk.reduce((s, v) => s + v, 0));
      weekLabels.push(`W${weekLabels.length + 1}`);
    }
    return { labels: weekLabels, values: weekValues };
  }

  if (period === "monthly") {
    const monthMap = new Map<string, number>();
    for (let i = 0; i < labels.length; i++) {
      const month = labels[i].slice(0, 7);
      monthMap.set(month, (monthMap.get(month) ?? 0) + values[i]);
    }
    const monthLabels = Array.from(monthMap.keys()).map((m) => {
      const d = new Date(m + "-01");
      return d.toLocaleDateString("en-US", { month: "short" });
    });
    return { labels: monthLabels, values: Array.from(monthMap.values()) };
  }

  // Daily: format labels as day names
  const dayLabels = labels.map((l) => {
    const d = new Date(l);
    return d.toLocaleDateString("en-US", { weekday: "short" });
  });
  return { labels: dayLabels, values };
}
