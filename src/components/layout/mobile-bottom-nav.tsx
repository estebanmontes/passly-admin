"use client";

import { useTranslations } from "next-intl";
import { usePathname, Link } from "@/i18n/navigation";
import { Icon } from "@/components/shared/icon";
import { cn } from "@/lib/utils";

const MOBILE_NAV = [
  { key: "dashboard", icon: "dashboard", href: "/" },
  { key: "events", icon: "confirmation_number", href: "/events" },
  { key: "analytics", icon: "analytics", href: "/analytics" },
  { key: "settings", icon: "settings", href: "/settings" },
] as const;

export function MobileBottomNav() {
  const t = useTranslations("sidebar");
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-white lg:hidden">
      <div className="flex items-center justify-around">
        {MOBILE_NAV.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
                isActive
                  ? "text-indigo-600"
                  : "text-muted-foreground"
              )}
            >
              <Icon
                name={item.icon}
                size={22}
                filled={isActive}
                className={isActive ? "text-indigo-600" : ""}
              />
              <span>{t(item.key)}</span>
            </Link>
          );
        })}
      </div>
      {/* Safe area for devices with home indicator */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
