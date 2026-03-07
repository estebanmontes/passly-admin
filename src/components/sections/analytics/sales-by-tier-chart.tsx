"use client";

import { useTranslations } from "next-intl";

interface SalesByTierItem {
  tierName: string;
  revenue: number;
  quantity: number;
}

const barColors = [
  "bg-indigo-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-cyan-500",
  "bg-orange-500",
];

export function SalesByTierChart({ data }: { data: SalesByTierItem[] }) {
  const t = useTranslations("analytics");
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div className="organic-card p-6">
      <h3 className="mb-4 text-base font-semibold text-foreground">
        {t("salesByTier")}
      </h3>

      {data.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {t("noData")}
        </p>
      ) : (
        <div className="space-y-3">
          {data.map((item, idx) => (
            <div key={item.tierName}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="truncate font-medium text-foreground">
                  {item.tierName}
                </span>
                <span className="flex-shrink-0 text-muted-foreground">
                  {item.quantity} tickets · ${item.revenue.toLocaleString()}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all ${barColors[idx % barColors.length]}`}
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
