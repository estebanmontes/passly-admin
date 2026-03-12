import { db } from "@/lib/db";
import type { PaginationParams } from "@/lib/types/pagination";
import type { UserFilters } from "@/lib/types/filters";
import { buildPaginatedResult } from "@/lib/types/pagination";

export async function getUsers(
  params: PaginationParams,
  filters: UserFilters
) {
  const where: Record<string, unknown> = {};

  if (filters.role) {
    where.role = filters.role;
  }

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { email: { contains: params.search, mode: "insensitive" } },
    ];
  }

  const [data, total] = await Promise.all([
    db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            passes: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
    }),
    db.user.count({ where }),
  ]);

  return buildPaginatedResult(data, total, params);
}

export async function getUserById(userId: string) {
  return db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
      organizer: { select: { id: true, name: true, slug: true } },
      _count: {
        select: {
          orders: true,
          passes: true,
        },
      },
    },
  });
}
