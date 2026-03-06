"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/shared/icon";
import { cn } from "@/lib/utils";

interface UpcomingEvent {
  id: string;
  title: string;
  status: string;
  startDate: Date;
  venue: { name: string } | null;
  ticketTiers: { soldCount: number; totalQuantity: number }[];
}

const statusStyles: Record<string, string> = {
  ON_SALE: "bg-emerald-50 text-emerald-700",
  SOLD_OUT: "bg-red-50 text-red-700",
  DRAFT: "bg-slate-100 text-slate-600",
  SCHEDULED: "bg-blue-50 text-blue-700",
};

export function UpcomingEventsTable({ events }: { events: UpcomingEvent[] }) {
  const t = useTranslations("dashboard.upcomingEvents");
  const statusT = useTranslations("events.status");

  return (
    <div className="organic-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <h3 className="text-base font-semibold text-foreground">{t("title")}</h3>
        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          {t("viewAll")}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-t border-border">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("eventDetail")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("dateTime")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("venue")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("salesVelocity")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("status")}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("settings")}
              </th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-muted-foreground">
                  No upcoming events
                </td>
              </tr>
            ) : (
              events.map((event) => {
                const totalSold = event.ticketTiers.reduce((s, t) => s + t.soldCount, 0);
                const totalCapacity = event.ticketTiers.reduce((s, t) => s + t.totalQuantity, 0);
                const salesPercent = totalCapacity > 0 ? Math.round((totalSold / totalCapacity) * 100) : 0;
                const date = new Date(event.startDate);

                return (
                  <tr
                    key={event.id}
                    className="group border-t border-border transition-colors hover:bg-slate-50/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                          <Icon name="confirmation_number" size={20} className="text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{event.title}</p>
                          <p className="text-xs text-muted-foreground">{event.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-foreground">
                        {date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-foreground">{event.venue?.name ?? "—"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              salesPercent >= 80 ? "bg-emerald-500"
                                : salesPercent >= 50 ? "bg-blue-500"
                                : salesPercent >= 25 ? "bg-amber-500"
                                : "bg-slate-300"
                            )}
                            style={{ width: `${salesPercent}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{salesPercent}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          statusStyles[event.status] ?? statusStyles.DRAFT
                        )}
                      >
                        {statusT(event.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-slate-100 hover:text-foreground">
                          <Icon name="edit" size={16} />
                        </button>
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-slate-100 hover:text-foreground">
                          <Icon name="more_vert" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
