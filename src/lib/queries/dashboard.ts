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
