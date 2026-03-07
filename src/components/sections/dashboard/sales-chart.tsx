"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type Period = "daily" | "weekly" | "monthly";

interface ChartDataSet {
  labels: string[];
  values: number[];
}

interface SalesChartProps {
  data: Record<Period, ChartDataSet>;
}

function buildPath(values: number[], width: number, height: number): string {
  if (values.length === 0) return "";
  const max = Math.max(...values) * 1.1 || 1;
  const stepX = values.length > 1 ? width / (values.length - 1) : 0;
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
  if (!linePath) return "";
  return `${linePath} L${width},${height} L0,${height} Z`;
}

export function SalesChart({ data }: SalesChartProps) {
  const t = useTranslations("dashboard.salesChart");
  const [period, setPeriod] = useState<Period>("daily");

  const chartData = data[period];
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

      {/* SVG Chart */}
      {chartData.values.length === 0 ? (
        <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
          No sales data yet
        </div>
      ) : (
        <>
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="h-[200px] w-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>

            <path
              d={buildAreaPath(chartData.values, svgWidth, svgHeight)}
              fill="url(#salesGrad)"
            />
            <path
              d={buildPath(chartData.values, svgWidth, svgHeight)}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* X-axis labels */}
          <div className="mt-2 flex justify-between px-0">
            {chartData.labels.map((label, i) => (
              <span key={`${label}-${i}`} className="text-xs text-muted-foreground">
                {label}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
