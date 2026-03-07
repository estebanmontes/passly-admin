"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/shared/icon";

interface KpiData {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  totalTicketsSold: number;
}

export function AnalyticsKpiCards({ kpis }: { kpis: KpiData }) {
  const t = useTranslations("analytics");

  const cards = [
    {
      label: t("totalRevenue"),
      value: `$${kpis.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: "payments",
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: t("totalOrders"),
      value: kpis.totalOrders.toLocaleString(),
      icon: "receipt_long",
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: t("avgOrderValue"),
      value: `$${kpis.avgOrderValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: "trending_up",
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      label: t("totalTicketsSold"),
      value: kpis.totalTicketsSold.toLocaleString(),
      icon: "confirmation_number",
      color: "text-amber-600 bg-amber-50",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="organic-card p-5">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.color}`}
            >
              <Icon name={card.icon} size={20} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{card.label}</p>
              <p className="text-lg font-bold text-foreground">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
