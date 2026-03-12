"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const presets = ["7d", "30d", "90d", "year"] as const;

export function DateRangeSelector() {
  const t = useTranslations("analytics");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("preset") ?? "30d";

  function selectPreset(preset: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("preset", preset);
    params.delete("from");
    params.delete("to");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">
        {t("dateRange")}:
      </span>
      <div className="flex gap-1 overflow-x-auto rounded-lg bg-slate-100 p-1">
        {presets.map((preset) => (
          <button
            key={preset}
            onClick={() => selectPreset(preset)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              current === preset
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t(`presets.${preset}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
