import { db } from "@/lib/db";
import type { PaginationParams } from "@/lib/types/pagination";
import { buildPaginatedResult } from "@/lib/types/pagination";

export async function getEventsByOrganizer(organizerId: string) {
  return db.event.findMany({
    where: { organizerId },
    include: {
      venue: { select: { name: true } },
      ticketTiers: {
        select: { soldCount: true, totalQuantity: true },
      },
    },
    orderBy: { startDate: "desc" },
  });
}

export async function getEventsByOrganizerPaginated(
  organizerId: string,
  params: PaginationParams,
  statusFilter?: string
) {
  const where: Record<string, unknown> = { organizerId };

  if (statusFilter) {
    where.status = statusFilter;
  }

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { slug: { contains: params.search, mode: "insensitive" } },
    ];
  }

  const [data, total] = await Promise.all([
    db.event.findMany({
      where,
      include: {
        venue: { select: { name: true } },
        ticketTiers: {
          select: { soldCount: true, totalQuantity: true },
        },
      },
      orderBy: { startDate: "desc" },
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
    }),
    db.event.count({ where }),
  ]);

  return buildPaginatedResult(data, total, params);
}

export async function getEventById(eventId: string) {
  return db.event.findUnique({
    where: { id: eventId },
    include: {
      venue: { select: { id: true, name: true } },
      ticketTiers: true,
      badges: true,
      organizer: { select: { id: true, name: true, userId: true } },
    },
  });
}

export async function getOrganizerByUserId(userId: string) {
  return db.organizer.findUnique({
    where: { userId },
  });
}
