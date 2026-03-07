"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "@/i18n/navigation";
import { Icon } from "@/components/shared/icon";
import { cn } from "@/lib/utils";

interface DataTablePaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
}

export function DataTablePagination({
  page,
  totalPages,
  total,
  pageSize,
}: DataTablePaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function navigate(newPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  }

  function changePageSize(newSize: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageSize", String(newSize));
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  // Generate visible page numbers
  const pages: number[] = [];
  const maxVisible = 5;
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center gap-3 px-2 py-4 sm:flex-row sm:justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>
          {startItem}–{endItem} of {total}
        </span>
        <select
          value={pageSize}
          onChange={(e) => changePageSize(Number(e.target.value))}
          className="rounded-lg border border-border bg-white px-2 py-1 text-xs text-foreground"
        >
          {[10, 25, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => navigate(page - 1)}
          disabled={page <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none"
        >
          <Icon name="chevron_left" size={18} />
        </button>

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => navigate(p)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors",
              p === page
                ? "bg-charcoal text-white"
                : "text-muted-foreground hover:bg-slate-100"
            )}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => navigate(page + 1)}
          disabled={page >= totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none"
        >
          <Icon name="chevron_right" size={18} />
        </button>
      </div>
    </div>
  );
}
