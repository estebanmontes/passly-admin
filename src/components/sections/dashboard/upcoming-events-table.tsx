"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/shared/icon";
import { MOCK_EVENTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  onSale: "bg-emerald-50 text-emerald-700",
  soldOut: "bg-red-50 text-red-700",
  draft: "bg-slate-100 text-slate-600",
  scheduled: "bg-blue-50 text-blue-700",
};

export function UpcomingEventsTable() {
  const t = useTranslations("dashboard.upcomingEvents");
  const statusT = useTranslations("dashboard.status");

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
            {MOCK_EVENTS.map((event) => (
              <tr
                key={event.id}
                className="group border-t border-border transition-colors hover:bg-slate-50/50"
              >
                {/* Event Detail */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                      <Icon
                        name="confirmation_number"
                        size={20}
                        className="text-muted-foreground"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {event.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{event.id}</p>
                    </div>
                  </div>
                </td>

                {/* Date & Time */}
                <td className="px-6 py-4">
                  <p className="text-sm text-foreground">{event.date}</p>
                  <p className="text-xs text-muted-foreground">{event.time}</p>
                </td>

                {/* Venue */}
                <td className="px-6 py-4">
                  <p className="text-sm text-foreground">{event.venue}</p>
                </td>

                {/* Sales Velocity */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          event.salesVelocity >= 80
                            ? "bg-emerald-500"
                            : event.salesVelocity >= 50
                              ? "bg-blue-500"
                              : event.salesVelocity >= 25
                                ? "bg-amber-500"
                                : "bg-slate-300"
                        )}
                        style={{ width: `${event.salesVelocity}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {event.salesVelocity}%
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      statusStyles[event.status]
                    )}
                  >
                    {statusT(event.status)}
                  </span>
                </td>

                {/* Settings */}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
