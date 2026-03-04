"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/shared/icon";

export function DashboardHeader() {
  const t = useTranslations("dashboard");
  const headerT = useTranslations("header");

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-white/80 px-8 backdrop-blur-sm">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium text-foreground">{t("title")}</span>
        <span className="text-muted-foreground">/</span>
        <span className="text-muted-foreground">{t("overview")}</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Icon
            name="search"
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder={headerT("search")}
            className="h-9 w-64 rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/20"
          />
        </div>

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-slate-50">
          <Icon name="notifications" size={20} className="text-muted-foreground" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
            AM
          </div>
          <span className="text-sm font-medium">Alex Morgan</span>
        </div>
      </div>
    </header>
  );
}
