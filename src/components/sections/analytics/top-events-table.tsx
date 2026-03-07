"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

interface TopEvent {
  id: string;
  title: string;
  ticketsSold: number;
  revenue: number;
  orders: number;
}

export function TopEventsTable({ events }: { events: TopEvent[] }) {
  const t = useTranslations("analytics");

  if (events.length === 0) return null;

  return (
    <div className="organic-card overflow-hidden">
      <div className="px-6 py-4">
        <h3 className="text-base font-semibold text-foreground">
          {t("topEvents")}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-t border-border">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("eventName")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("revenue")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("orders")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("ticketsSold")}
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, idx) => (
              <tr
                key={event.id}
                className="border-t border-border transition-colors hover:bg-slate-50/50"
              >
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-muted-foreground">
                      {idx + 1}
                    </span>
                    <Link
                      href={`/events/${event.id}`}
                      className="text-sm font-medium text-foreground hover:text-indigo-600"
                    >
                      {event.title}
                    </Link>
                  </div>
                </td>
                <td className="px-6 py-3 text-sm font-medium text-foreground">
                  ${event.revenue.toLocaleString()}
                </td>
                <td className="px-6 py-3 text-sm text-foreground">
                  {event.orders}
                </td>
                <td className="px-6 py-3 text-sm text-foreground">
                  {event.ticketsSold.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
