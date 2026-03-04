"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MOCK_CHART_DATA } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Period = "daily" | "weekly" | "monthly";

function buildPath(values: number[], width: number, height: number): string {
  const max = Math.max(...values) * 1.1;
  const stepX = width / (values.length - 1);
  return values
    .map((v, i) => {
      const x = i * stepX;
      const y = height - (v / max) * height;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
}

function buildAreaPath(
  values: number[],
  width: number,
  height: number
): string {
  const linePath = buildPath(values, width, height);
  return `${linePath} L${width},${height} L0,${height} Z`;
}

export function SalesChart() {
  const t = useTranslations("dashboard.salesChart");
  const [period, setPeriod] = useState<Period>("daily");

  const data = MOCK_CHART_DATA[period];
  const svgWidth = 600;
  const svgHeight = 200;

  const periods: Period[] = ["daily", "weekly", "monthly"];

  return (
    <div className="organic-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">
          {t("title")}
        </h3>
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                period === p
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t(p)}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mb-4 flex gap-6">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          <span className="text-xs text-muted-foreground">{t("organic")}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-xs text-muted-foreground">
            {t("marketing")}
          </span>
        </div>
      </div>

      {/* SVG Chart */}
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="h-[200px] w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="organicGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="marketingGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Organic area */}
        <path
          d={buildAreaPath(data.organic, svgWidth, svgHeight)}
          fill="url(#organicGrad)"
        />
        {/* Organic line */}
        <path
          d={buildPath(data.organic, svgWidth, svgHeight)}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Marketing area */}
        <path
          d={buildAreaPath(data.marketing, svgWidth, svgHeight)}
          fill="url(#marketingGrad)"
        />
        {/* Marketing line */}
        <path
          d={buildPath(data.marketing, svgWidth, svgHeight)}
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* X-axis labels */}
      <div className="mt-2 flex justify-between px-0">
        {data.labels.map((label) => (
          <span key={label} className="text-xs text-muted-foreground">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
