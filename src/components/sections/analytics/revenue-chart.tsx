"use client";

import { useTranslations } from "next-intl";

interface RevenuePoint {
  date: string;
  revenue: number;
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

function buildAreaPath(values: number[], width: number, height: number): string {
  const linePath = buildPath(values, width, height);
  if (!linePath) return "";
  return `${linePath} L${width},${height} L0,${height} Z`;
}

export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  const t = useTranslations("analytics");
  const svgWidth = 800;
  const svgHeight = 200;

  const values = data.map((d) => d.revenue);
  const maxLabels = 10;
  const step = Math.max(1, Math.floor(data.length / maxLabels));
  const labels = data.filter((_, i) => i % step === 0).map((d) => {
    const date = new Date(d.date);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });

  return (
    <div className="organic-card p-6">
      <h3 className="mb-4 text-base font-semibold text-foreground">
        {t("revenueOverTime")}
      </h3>

      {data.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {t("noData")}
        </p>
      ) : (
        <>
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="h-[200px] w-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={buildAreaPath(values, svgWidth, svgHeight)}
              fill="url(#revenueGrad)"
            />
            <path
              d={buildPath(values, svgWidth, svgHeight)}
              fill="none"
              stroke="#6366f1"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="mt-2 flex justify-between px-0">
            {labels.map((label) => (
              <span key={label} className="text-xs text-muted-foreground">
                {label}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
