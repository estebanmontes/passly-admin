import { db } from "@/lib/db";
import type { PaginationParams } from "@/lib/types/pagination";
import { buildPaginatedResult } from "@/lib/types/pagination";

export async function getVenuesByOrganizer(
  organizerId: string,
  params: PaginationParams
) {
  const where: Record<string, unknown> = { organizerId };

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { city: { contains: params.search, mode: "insensitive" } },
      { country: { contains: params.search, mode: "insensitive" } },
    ];
  }

  const [data, total] = await Promise.all([
    db.venue.findMany({
      where,
      include: {
        _count: { select: { events: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
    }),
    db.venue.count({ where }),
  ]);

  return buildPaginatedResult(data, total, params);
}

export async function getVenueById(venueId: string) {
  return db.venue.findUnique({
    where: { id: venueId },
    include: {
      events: {
        select: {
          id: true,
          title: true,
          status: true,
          startDate: true,
        },
        orderBy: { startDate: "desc" },
      },
      organizer: { select: { id: true, userId: true } },
    },
  });
}
