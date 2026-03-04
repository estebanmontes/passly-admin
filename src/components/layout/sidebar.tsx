"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/shared/icon";
import { SIDEBAR_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const t = useTranslations("sidebar");
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-[264px] flex-col border-r border-border bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-charcoal">
          <span className="text-sm font-bold text-white">P</span>
        </div>
        <span className="text-lg font-bold text-charcoal">Passly</span>
        <span className="text-xs font-medium text-muted-foreground">Admin</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {SIDEBAR_NAV.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-slate-50 text-indigo-600"
                  : "text-muted-foreground hover:bg-slate-50 hover:text-foreground"
              )}
            >
              <Icon
                name={item.icon}
                size={20}
                filled={isActive}
                className={isActive ? "text-indigo-600" : ""}
              />
              {t(item.key)}
            </Link>
          );
        })}
      </nav>

      {/* New Event Button */}
      <div className="p-4">
        <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-charcoal px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-charcoal/90">
          <Icon name="add" size={20} />
          {t("newEvent")}
        </button>
      </div>
    </aside>
  );
}
