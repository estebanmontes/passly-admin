"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/shared/icon";
import { MOCK_KPI } from "@/lib/constants";
import { cn } from "@/lib/utils";

const colorMap: Record<string, { bg: string; text: string }> = {
  green: { bg: "bg-emerald-50", text: "text-emerald-600" },
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-600" },
  amber: { bg: "bg-amber-50", text: "text-amber-600" },
};

export function KpiCards() {
  const t = useTranslations("dashboard.kpi");

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {MOCK_KPI.map((kpi) => {
        const colors = colorMap[kpi.color];
        return (
          <div key={kpi.key} className="organic-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t(kpi.key)}</p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {kpi.value}
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
            <div className="mt-3 flex items-center gap-1.5 text-xs">
              <span
                className={cn(
                  "font-medium",
                  kpi.trend === "up" ? "text-emerald-600" : "text-red-500"
                )}
              >
                {kpi.change}
              </span>
              <span className="text-muted-foreground">{t("vsLastMonth")}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
