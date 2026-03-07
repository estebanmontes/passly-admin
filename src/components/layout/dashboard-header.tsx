"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/shared/icon";
import { signOut } from "@/lib/auth-client";
import { useSidebarStore } from "@/lib/stores/sidebar-store";
import { useRouter } from "next/navigation";

interface DashboardHeaderProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const t = useTranslations("dashboard");
  const headerT = useTranslations("header");
  const authT = useTranslations("auth");
  const router = useRouter();
  const toggle = useSidebarStore((s) => s.toggle);

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/signin");
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-white/80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Hamburger menu - mobile only */}
        <button
          onClick={toggle}
          className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-slate-50 lg:hidden"
        >
          <Icon name="menu" size={22} className="text-foreground" />
        </button>

        {/* Mobile logo */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-charcoal">
            <span className="text-xs font-bold text-white">P</span>
          </div>
          <span className="text-base font-bold text-charcoal">Passly</span>
        </div>

        {/* Breadcrumb - desktop only */}
        <div className="hidden items-center gap-2 text-sm lg:flex">
          <span className="font-medium text-foreground">{t("title")}</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">{t("overview")}</span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search - hidden on mobile */}
        <div className="relative hidden md:block">
          <Icon
            name="search"
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder={headerT("search")}
            className="h-9 w-48 rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/20 lg:w-64"
          />
        </div>

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-slate-50">
          <Icon name="notifications" size={20} className="text-muted-foreground" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
              {getInitials(user.name)}
            </div>
          )}
          <span className="hidden text-sm font-medium sm:inline">{user.name}</span>
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-slate-50"
          title={authT("signOut")}
        >
          <Icon name="logout" size={20} className="text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
