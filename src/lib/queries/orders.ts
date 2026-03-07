import { db } from "@/lib/db";
import type { PaginationParams } from "@/lib/types/pagination";
import type { OrderFilters } from "@/lib/types/filters";
import { buildPaginatedResult } from "@/lib/types/pagination";

export async function getOrdersByOrganizer(
  organizerId: string,
  params: PaginationParams,
  filters: OrderFilters
) {
  const where: Record<string, unknown> = {
    event: { organizerId },
  };

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.eventId) {
    where.eventId = filters.eventId;
  }

  if (filters.dateFrom || filters.dateTo) {
    const createdAt: Record<string, Date> = {};
    if (filters.dateFrom) createdAt.gte = new Date(filters.dateFrom);
    if (filters.dateTo) createdAt.lte = new Date(filters.dateTo + "T23:59:59Z");
    where.createdAt = createdAt;
  }

  if (params.search) {
    where.OR = [
      { orderNumber: { contains: params.search, mode: "insensitive" } },
      { user: { name: { contains: params.search, mode: "insensitive" } } },
      { user: { email: { contains: params.search, mode: "insensitive" } } },
    ];
  }

  const [data, total] = await Promise.all([
    db.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true, image: true } },
        event: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
    }),
    db.order.count({ where }),
  ]);

  return buildPaginatedResult(data, total, params);
}

export async function getOrderById(orderId: string) {
  return db.order.findUnique({
    where: { id: orderId },
    include: {
      user: { select: { name: true, email: true, image: true } },
      event: { select: { id: true, title: true } },
      items: {
        include: {
          ticketTier: { select: { name: true } },
        },
      },
      passes: {
        include: {
          user: { select: { name: true, email: true } },
        },
      },
    },
  });
}

export async function getOrganizerEventOptions(organizerId: string) {
  return db.event.findMany({
    where: { organizerId },
    select: { id: true, title: true },
    orderBy: { startDate: "desc" },
  });
}
