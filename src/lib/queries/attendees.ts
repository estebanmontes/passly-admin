import { db } from "@/lib/db";
import type { PaginationParams } from "@/lib/types/pagination";
import type { AttendeeFilters } from "@/lib/types/filters";
import { buildPaginatedResult } from "@/lib/types/pagination";

export async function getAttendeesByOrganizer(
  organizerId: string,
  params: PaginationParams,
  filters: AttendeeFilters
) {
  const where: Record<string, unknown> = {
    order: { event: { organizerId } },
  };

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.eventId) {
    where.order = { ...(where.order as object), eventId: filters.eventId };
  }

  if (params.search) {
    where.OR = [
      { user: { name: { contains: params.search, mode: "insensitive" } } },
      { user: { email: { contains: params.search, mode: "insensitive" } } },
      { qrCode: { contains: params.search, mode: "insensitive" } },
    ];
  }

  const [data, total] = await Promise.all([
    db.pass.findMany({
      where,
      include: {
        user: { select: { name: true, email: true, image: true } },
        order: {
          include: {
            event: { select: { id: true, title: true } },
            items: {
              include: {
                ticketTier: { select: { id: true, name: true } },
              },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
    }),
    db.pass.count({ where }),
  ]);

  return buildPaginatedResult(data, total, params);
}

export async function getTicketTierOptions(organizerId: string) {
  return db.ticketTier.findMany({
    where: { event: { organizerId } },
    select: { id: true, name: true },
    distinct: ["name"],
    orderBy: { name: "asc" },
  });
}
