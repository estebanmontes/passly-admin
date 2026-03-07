import { db } from "@/lib/db";

interface DateRange {
  from: Date;
  to: Date;
}

export async function getAnalyticsData(organizerId: string, range: DateRange) {
  const dateFilter = {
    createdAt: { gte: range.from, lte: range.to },
  };

  const [
    revenueAgg,
    orderCount,
    ticketsSold,
    revenueByDay,
    salesByEvent,
    salesByTier,
    topEvents,
  ] = await Promise.all([
    // Total revenue
    db.order.aggregate({
      where: {
        event: { organizerId },
        status: "CONFIRMED",
        ...dateFilter,
      },
      _sum: { total: true },
    }),

    // Total orders
    db.order.count({
      where: {
        event: { organizerId },
        ...dateFilter,
      },
    }),

    // Total tickets sold
    db.pass.count({
      where: {
        order: { event: { organizerId }, ...dateFilter },
      },
    }),

    // Revenue by day (grouped)
    db.order.findMany({
      where: {
        event: { organizerId },
        status: "CONFIRMED",
        ...dateFilter,
      },
      select: { createdAt: true, total: true },
      orderBy: { createdAt: "asc" },
    }),

    // Sales by event
    db.order.groupBy({
      by: ["eventId"],
      where: {
        event: { organizerId },
        status: "CONFIRMED",
        ...dateFilter,
      },
      _sum: { total: true },
      _count: true,
      orderBy: { _sum: { total: "desc" } },
      take: 10,
    }),

    // Sales by tier
    db.orderItem.groupBy({
      by: ["ticketTierId"],
      where: {
        order: {
          event: { organizerId },
          status: "CONFIRMED",
          ...dateFilter,
        },
      },
      _sum: { subtotal: true, quantity: true },
      orderBy: { _sum: { subtotal: "desc" } },
      take: 10,
    }),

    // Top events with details
    db.event.findMany({
      where: { organizerId },
      select: {
        id: true,
        title: true,
        ticketTiers: {
          select: { soldCount: true, totalQuantity: true },
        },
        orders: {
          where: { status: "CONFIRMED", ...dateFilter },
          select: { total: true },
        },
      },
      orderBy: { startDate: "desc" },
      take: 10,
    }),
  ]);

  // Group revenue by day
  const revenueByDayMap = new Map<string, number>();
  for (const order of revenueByDay) {
    const day = order.createdAt.toISOString().slice(0, 10);
    revenueByDayMap.set(day, (revenueByDayMap.get(day) ?? 0) + order.total);
  }

  // Fill in missing days
  const dailyRevenue: { date: string; revenue: number }[] = [];
  const current = new Date(range.from);
  while (current <= range.to) {
    const day = current.toISOString().slice(0, 10);
    dailyRevenue.push({ date: day, revenue: revenueByDayMap.get(day) ?? 0 });
    current.setDate(current.getDate() + 1);
  }

  // Resolve event names for salesByEvent
  const eventIds = salesByEvent.map((s) => s.eventId);
  const events = await db.event.findMany({
    where: { id: { in: eventIds } },
    select: { id: true, title: true },
  });
  const eventMap = new Map(events.map((e) => [e.id, e.title]));

  // Resolve tier names for salesByTier
  const tierIds = salesByTier.map((s) => s.ticketTierId);
  const tiers = await db.ticketTier.findMany({
    where: { id: { in: tierIds } },
    select: { id: true, name: true },
  });
  const tierMap = new Map(tiers.map((t) => [t.id, t.name]));

  const totalRevenue = revenueAgg._sum.total ?? 0;
  const avgOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;

  return {
    kpis: {
      totalRevenue,
      totalOrders: orderCount,
      avgOrderValue,
      totalTicketsSold: ticketsSold,
    },
    dailyRevenue,
    salesByEvent: salesByEvent.map((s) => ({
      eventName: eventMap.get(s.eventId) ?? "Unknown",
      revenue: s._sum.total ?? 0,
      orders: s._count,
    })),
    salesByTier: salesByTier.map((s) => ({
      tierName: tierMap.get(s.ticketTierId) ?? "Unknown",
      revenue: s._sum.subtotal ?? 0,
      quantity: s._sum.quantity ?? 0,
    })),
    topEvents: topEvents.map((e) => ({
      id: e.id,
      title: e.title,
      ticketsSold: e.ticketTiers.reduce((s, t) => s + t.soldCount, 0),
      revenue: e.orders.reduce((s, o) => s + o.total, 0),
      orders: e.orders.length,
    })),
  };
}
