"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/shared/icon";
import { createVenue } from "@/lib/actions/venues";

export function CreateVenueForm() {
  const t = useTranslations("venues");
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    capacity: "",
    latitude: "",
    longitude: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate() {
    setSaving(true);
    setError("");
    const res = await createVenue({
      name: form.name,
      address: form.address,
      city: form.city,
      state: form.state,
      country: form.country,
      capacity: form.capacity ? parseInt(form.capacity) : null,
      latitude: form.latitude ? parseFloat(form.latitude) : null,
      longitude: form.longitude ? parseFloat(form.longitude) : null,
    });
    setSaving(false);
    if (res.error) {
      setError(res.error);
    } else if (res.venueId) {
      router.push(`/venues/${res.venueId}`);
    }
  }

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const canSave = form.name && form.address && form.city && form.country;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/venues"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border transition-colors hover:bg-slate-50"
        >
          <Icon name="arrow_back" size={18} />
        </Link>
        <span className="text-sm text-muted-foreground">{t("backToVenues")}</span>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="organic-card p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="col-span-2">
            <label className="mb-1 block text-sm font-medium text-foreground">
              {t("form.name")}
            </label>
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder={t("form.namePlaceholder")}
              className="h-10 w-full rounded-xl border border-border bg-white px-4 text-sm placeholder:text-muted-foreground focus:border-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal/20"
            />
          </div>
          <div className="col-span-2">
            <label className="mb-1 block text-sm font-medium text-foreground">
              {t("form.address")}
            </label>
            <input
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              placeholder={t("form.addressPlaceholder")}
              className="h-10 w-full rounded-xl border border-border bg-white px-4 text-sm placeholder:text-muted-foreground focus:border-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              {t("form.city")}
            </label>
            <input
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              placeholder={t("form.cityPlaceholder")}
              className="h-10 w-full rounded-xl border border-border bg-white px-4 text-sm placeholder:text-muted-foreground focus:border-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              {t("form.state")}
            </label>
            <input
              value={form.state}
              onChange={(e) => update("state", e.target.value)}
              placeholder={t("form.statePlaceholder")}
              className="h-10 w-full rounded-xl border border-border bg-white px-4 text-sm placeholder:text-muted-foreground focus:border-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              {t("form.country")}
            </label>
            <input
              value={form.country}
              onChange={(e) => update("country", e.target.value)}
              placeholder={t("form.countryPlaceholder")}
              className="h-10 w-full rounded-xl border border-border bg-white px-4 text-sm placeholder:text-muted-foreground focus:border-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              {t("form.capacity")}
            </label>
            <input
              type="number"
              value={form.capacity}
              onChange={(e) => update("capacity", e.target.value)}
              placeholder={t("form.capacityPlaceholder")}
              className="h-10 w-full rounded-xl border border-border bg-white px-4 text-sm placeholder:text-muted-foreground focus:border-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal/20"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleCreate}
            disabled={saving || !canSave}
            className="flex items-center gap-2 rounded-2xl bg-charcoal px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-charcoal/90 disabled:opacity-60"
          >
            {saving ? t("creating") : t("create")}
          </button>
        </div>
      </div>
    </div>
  );
}
