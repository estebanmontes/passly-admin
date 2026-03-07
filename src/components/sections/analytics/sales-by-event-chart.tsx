"use client";

import { useTranslations } from "next-intl";

interface SalesByEventItem {
  eventName: string;
  revenue: number;
  orders: number;
}

export function SalesByEventChart({ data }: { data: SalesByEventItem[] }) {
  const t = useTranslations("analytics");
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div className="organic-card p-6">
      <h3 className="mb-4 text-base font-semibold text-foreground">
        {t("salesByEvent")}
      </h3>

      {data.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {t("noData")}
        </p>
      ) : (
        <div className="space-y-3">
          {data.map((item) => (
            <div key={item.eventName}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="truncate font-medium text-foreground">
                  {item.eventName}
                </span>
                <span className="flex-shrink-0 text-muted-foreground">
                  ${item.revenue.toLocaleString()}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all"
                  style={{
                    width: `${(item.revenue / maxRevenue) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
