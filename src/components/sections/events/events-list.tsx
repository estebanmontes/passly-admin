"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/shared/icon";
import { SearchInput } from "@/components/shared/search-input";
import { FilterSelect } from "@/components/shared/filter-select";
import { DataTablePagination } from "@/components/shared/data-table-pagination";
import { cn } from "@/lib/utils";
import type { PaginatedResult } from "@/lib/types/pagination";

interface EventTier {
  soldCount: number;
  totalQuantity: number;
}

interface EventItem {
  id: string;
  title: string;
  slug: string;
  coverUrl: string | null;
  status: string;
  startDate: Date;
  endDate: Date | null;
  venue: { name: string } | null;
  ticketTiers: EventTier[];
}

const statusStyles: Record<string, string> = {
  ON_SALE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  DRAFT: "bg-slate-100 text-slate-600 border-slate-200",
  SCHEDULED: "bg-blue-50 text-blue-700 border-blue-200",
  SOLD_OUT: "bg-red-50 text-red-700 border-red-200",
  CANCELLED: "bg-slate-100 text-slate-500 border-slate-200",
  COMPLETED: "bg-slate-50 text-slate-500 border-slate-200",
};

function formatDateRange(start: Date, end: Date | null): string {
  const s = new Date(start);
  const opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  if (!end) return s.toLocaleDateString("en-US", opts);

  const e = new Date(end);
  if (s.toDateString() === e.toDateString()) {
    return s.toLocaleDateString("en-US", opts);
  }
  return `${s.toLocaleDateString("en-US", { month: "short", day: "numeric" })}-${e.toLocaleDateString("en-US", opts)}`;
}

export function EventsList({ result }: { result: PaginatedResult<EventItem> }) {
  const t = useTranslations("events");
  const detailT = useTranslations("events.detail");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleShare(e: React.MouseEvent, slug: string, id: string) {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/events/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const statusOptions = [
    { label: t("status.ON_SALE"), value: "ON_SALE" },
    { label: t("status.DRAFT"), value: "DRAFT" },
    { label: t("status.SCHEDULED"), value: "SCHEDULED" },
    { label: t("status.SOLD_OUT"), value: "SOLD_OUT" },
    { label: t("status.CANCELLED"), value: "CANCELLED" },
    { label: t("status.COMPLETED"), value: "COMPLETED" },
  ];

  return (
    <>
      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-full sm:w-80">
          <SearchInput placeholder={t("search")} />
        </div>
        <FilterSelect
          paramKey="status"
          options={statusOptions}
          placeholder={t("filterByStatus")}
        />
      </div>

      {result.data.length === 0 ? (
        <div className="organic-card flex flex-col items-center justify-center py-16 text-center">
          <Icon
            name="confirmation_number"
            size={48}
            className="mb-4 text-muted-foreground/40"
          />
          <p className="text-sm text-muted-foreground">{t("noEvents")}</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {result.data.map((event) => {
              const totalSold = event.ticketTiers.reduce(
                (sum, tier) => sum + tier.soldCount,
                0
              );
              const totalCapacity = event.ticketTiers.reduce(
                (sum, tier) => sum + tier.totalQuantity,
                0
              );
              const salesPercent =
                totalCapacity > 0
                  ? Math.round((totalSold / totalCapacity) * 100)
                  : 0;

              return (
                <Link key={event.id} href={`/events/${event.id}`} className="block organic-card p-5 transition-shadow hover:shadow-md">
                  <div className="flex items-start gap-3 sm:gap-5">
                    {/* Thumbnail */}
                    <div className="hidden h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 sm:flex">
                      {event.coverUrl ? (
                        <img
                          src={event.coverUrl}
                          alt={event.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Icon
                          name="image"
                          size={28}
                          className="text-muted-foreground/40"
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-base font-semibold text-foreground">
                            {event.title}
                          </h3>
                          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Icon name="calendar_today" size={14} />
                              {formatDateRange(event.startDate, event.endDate)}
                            </span>
                            {event.venue && (
                              <span className="flex items-center gap-1">
                                <Icon name="location_on" size={14} />
                                {event.venue.name}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Status badge */}
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
                              statusStyles[event.status] ?? statusStyles.DRAFT
                            )}
                          >
                            {t(`status.${event.status}`)}
                          </span>
                          {/* Share */}
                          <button
                            onClick={(e) => handleShare(e, event.slug, event.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-slate-100"
                            title={detailT("shareEvent")}
                          >
                            <Icon name={copiedId === event.id ? "check" : "share"} size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-3 flex items-center gap-3">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              salesPercent >= 90
                                ? "bg-emerald-500"
                                : salesPercent >= 50
                                  ? "bg-blue-500"
                                  : salesPercent >= 25
                                    ? "bg-amber-400"
                                    : "bg-slate-300"
                            )}
                            style={{ width: `${salesPercent}%` }}
                          />
                        </div>
                        <span className="flex-shrink-0 text-xs text-muted-foreground">
                          {salesPercent}% {t("sold")} ({totalSold.toLocaleString()}/
                          {totalCapacity.toLocaleString()})
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <DataTablePagination
            page={result.page}
            totalPages={result.totalPages}
            total={result.total}
            pageSize={result.pageSize}
          />
        </>
      )}
    </>
  );
}
