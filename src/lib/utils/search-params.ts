import type { PaginationParams } from "@/lib/types/pagination";

export function parsePaginationParams(
  searchParams: Record<string, string | string[] | undefined>
): PaginationParams {
  const page = Math.max(1, parseInt(String(searchParams.page ?? "1"), 10) || 1);
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(String(searchParams.pageSize ?? "10"), 10) || 10)
  );
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined;
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : undefined;
  const sortDir =
    searchParams.sortDir === "asc" || searchParams.sortDir === "desc"
      ? searchParams.sortDir
      : "desc";

  return { page, pageSize, search, sort, sortDir };
}
