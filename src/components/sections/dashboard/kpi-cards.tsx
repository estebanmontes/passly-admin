"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/shared/icon";
import { cn } from "@/lib/utils";

export interface KpiData {
  totalRevenue: number;
  totalAttendance: number;
  activeEvents: number;
  totalOrders: number;
}

const kpiConfig = [
  { key: "totalRevenue" as const, icon: "payments", color: "green" },
  { key: "totalAttendance" as const, icon: "groups", color: "blue" },
  { key: "activeEvents" as const, icon: "event", color: "indigo" },
  { key: "totalOrders" as const, icon: "receipt_long", color: "amber" },
];

const colorMap: Record<string, { bg: string; text: string }> = {
  green: { bg: "bg-emerald-50", text: "text-emerald-600" },
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-600" },
  amber: { bg: "bg-amber-50", text: "text-amber-600" },
};

function formatValue(key: string, value: number): string {
  if (key === "totalRevenue") {
    return `$${value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  return value.toLocaleString();
}

export function KpiCards({ data }: { data: KpiData }) {
  const t = useTranslations("dashboard.kpi");

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {kpiConfig.map((kpi) => {
        const colors = colorMap[kpi.color];
        const value = data[kpi.key];
        return (
          <div key={kpi.key} className="organic-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t(kpi.key)}</p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {formatValue(kpi.key, value)}
                </p>
              </div>
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  colors.bg
                )}
              >
                <Icon name={kpi.icon} size={20} className={colors.text} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
