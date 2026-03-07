"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { updateOrganizerProfile } from "@/lib/actions/settings";
import { Icon } from "@/components/shared/icon";
import { cn } from "@/lib/utils";

type Tab = "profile" | "account" | "notifications";

interface SettingsViewProps {
  organizer: {
    name: string;
    slug: string;
    description: string;
    logoUrl: string;
    website: string;
  } | null;
  user: {
    name: string;
    email: string;
    role: string;
    createdAt: string;
  } | null;
}

export function SettingsView({ organizer, user }: SettingsViewProps) {
  const t = useTranslations("settings");
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("profile");

  const [form, setForm] = useState({
    name: organizer?.name ?? "",
    slug: organizer?.slug ?? "",
    description: organizer?.description ?? "",
    logoUrl: organizer?.logoUrl ?? "",
    website: organizer?.website ?? "",
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSaveProfile() {
    setSaving(true);
    setError("");
    const res = await updateOrganizerProfile(form);
    setSaving(false);
    if (res.error) {
      setError(res.error);
    } else {
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2000);
    }
  }

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "profile", label: t("tabs.profile"), icon: "business" },
    { key: "account", label: t("tabs.account"), icon: "person" },
    { key: "notifications", label: t("tabs.notifications"), icon: "notifications" },
  ];

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Tabs - horizontal on mobile, vertical sidebar on desktop */}
      <div className="flex gap-1 overflow-x-auto lg:w-56 lg:flex-col lg:gap-0 lg:space-y-1">
        {tabs.map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors lg:w-full lg:gap-3",
              tab === item.key
                ? "bg-slate-50 text-indigo-600"
                : "text-muted-foreground hover:bg-slate-50 hover:text-foreground"
            )}
          >
            <Icon
              name={item.icon}
              size={20}
              filled={tab === item.key}
              className={tab === item.key ? "text-indigo-600" : ""}
            />
            {item.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {saved && (
          <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {t("profile.saved")}
          </div>
        )}

        {tab === "profile" && organizer && (
          <div className="organic-card p-6">
            <h2 className="mb-4 text-base font-semibold text-foreground">
              {t("tabs.profile")}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  {t("profile.name")}
                </label>
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder={t("profile.namePlaceholder")}
                  className="h-10 w-full rounded-xl border border-border bg-white px-4 text-sm focus:border-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  {t("profile.slug")}
                </label>
                <input
                  value={form.slug}
                  onChange={(e) => update("slug", e.target.value)}
                  placeholder={t("profile.slugPlaceholder")}
                  className="h-10 w-full rounded-xl border border-border bg-white px-4 text-sm focus:border-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  {t("profile.description")}
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder={t("profile.descriptionPlaceholder")}
                  rows={3}
                  className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm focus:border-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  {t("profile.logoUrl")}
                </label>
                <input
                  value={form.logoUrl}
                  onChange={(e) => update("logoUrl", e.target.value)}
                  placeholder={t("profile.logoUrlPlaceholder")}
                  className="h-10 w-full rounded-xl border border-border bg-white px-4 text-sm focus:border-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  {t("profile.website")}
                </label>
                <input
                  value={form.website}
                  onChange={(e) => update("website", e.target.value)}
                  placeholder={t("profile.websitePlaceholder")}
                  className="h-10 w-full rounded-xl border border-border bg-white px-4 text-sm focus:border-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal/20"
                />
              </div>
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-2xl bg-charcoal px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-charcoal/90 disabled:opacity-60"
                >
                  {saving ? t("profile.saving") : t("profile.save")}
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === "account" && user && (
          <div className="organic-card p-6">
            <h2 className="mb-4 text-base font-semibold text-foreground">
              {t("tabs.account")}
            </h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-muted-foreground">
                  {t("account.name")}
                </dt>
                <dd className="mt-1 text-sm font-medium text-foreground">
                  {user.name || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">
                  {t("account.email")}
                </dt>
                <dd className="mt-1 text-sm font-medium text-foreground">
                  {user.email}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">
                  {t("account.role")}
                </dt>
                <dd className="mt-1">
                  <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                    {user.role}
                  </span>
                </dd>
              </div>
              {user.createdAt && (
                <div>
                  <dt className="text-sm text-muted-foreground">
                    {t("account.joined")}
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-foreground">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {tab === "notifications" && (
          <div className="organic-card p-6">
            <h2 className="mb-2 text-base font-semibold text-foreground">
              {t("notifications.title")}
            </h2>
            <div className="mb-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
              <span className="font-medium">{t("notifications.comingSoon")}</span>
              {" — "}
              {t("notifications.comingSoonDescription")}
            </div>
            <div className="space-y-4 opacity-50 pointer-events-none">
              <label className="flex items-start gap-3">
                <input type="checkbox" disabled className="mt-0.5 rounded" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {t("notifications.orderConfirmation")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("notifications.orderConfirmationDescription")}
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-3">
                <input type="checkbox" disabled className="mt-0.5 rounded" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {t("notifications.dailyDigest")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("notifications.dailyDigestDescription")}
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
