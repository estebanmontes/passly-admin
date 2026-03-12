"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/shared/icon";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { updateVenue, deleteVenue } from "@/lib/actions/venues";
import { cn } from "@/lib/utils";

interface VenueEvent {
  id: string;
  title: string;
  status: string;
  startDate: Date;
}

interface VenueData {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string | null;
  country: string;
  capacity: number | null;
  latitude: number | null;
  longitude: number | null;
  events: VenueEvent[];
}

const eventStatusStyles: Record<string, string> = {
  ON_SALE: "bg-emerald-50 text-emerald-700",
  DRAFT: "bg-slate-100 text-slate-600",
  SCHEDULED: "bg-blue-50 text-blue-700",
  SOLD_OUT: "bg-red-50 text-red-700",
  CANCELLED: "bg-slate-100 text-slate-500",
  COMPLETED: "bg-slate-50 text-slate-500",
};

export function VenueDetailView({ venue }: { venue: VenueData }) {
  const t = useTranslations("venues");
  const statusT = useTranslations("events.status");
  const router = useRouter();

  const [form, setForm] = useState({
    name: venue.name,
    address: venue.address,
    city: venue.city,
    state: venue.state ?? "",
    country: venue.country,
    capacity: venue.capacity?.toString() ?? "",
    latitude: venue.latitude?.toString() ?? "",
    longitude: venue.longitude?.toString() ?? "",
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setSaving(true);
    setError("");
    const res = await updateVenue(venue.id, {
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
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    const res = await deleteVenue(venue.id);
    setDeleting(false);
    if (res.error) {
      setError(res.error);
      setShowDelete(false);
    } else {
      router.push("/venues");
    }
  }

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/venues"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border transition-colors hover:bg-slate-50"
        >
          <Icon name="arrow_back" size={18} />
        </Link>
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">{venue.name}</h1>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {saved && (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {t("saved")}
        </div>
      )}

      {/* Venue Form */}
      <div className="organic-card p-6">
        <h2 className="mb-4 text-base font-semibold text-foreground">
          {t("detail.venueInfo")}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="col-span-2">
            <label className="mb-1 block text-sm font-medium text-foreground">
              {t("form.name")}
            </label>
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-white px-4 text-sm focus:border-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal/20"
            />
          </div>
          <div className="col-span-2">
            <label className="mb-1 block text-sm font-medium text-foreground">
              {t("form.address")}
            </label>
            <input
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-white px-4 text-sm focus:border-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              {t("form.city")}
            </label>
            <input
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-white px-4 text-sm focus:border-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              {t("form.state")}
            </label>
            <input
              value={form.state}
              onChange={(e) => update("state", e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-white px-4 text-sm focus:border-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              {t("form.country")}
            </label>
            <input
              value={form.country}
              onChange={(e) => update("country", e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-white px-4 text-sm focus:border-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal/20"
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
              className="h-10 w-full rounded-xl border border-border bg-white px-4 text-sm focus:border-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              {t("form.latitude")}
            </label>
            <input
              type="number"
              step="any"
              value={form.latitude}
              onChange={(e) => update("latitude", e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-white px-4 text-sm focus:border-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              {t("form.longitude")}
            </label>
            <input
              type="number"
              step="any"
              value={form.longitude}
              onChange={(e) => update("longitude", e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-white px-4 text-sm focus:border-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal/20"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-2xl bg-charcoal px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-charcoal/90 disabled:opacity-60"
          >
            {saving ? t("saving") : t("save")}
          </button>
        </div>
      </div>

      {/* Linked Events */}
      <div className="organic-card overflow-hidden">
        <div className="px-6 py-4">
          <h2 className="text-base font-semibold text-foreground">
            {t("detail.linkedEvents")}
          </h2>
        </div>
        {venue.events.length === 0 ? (
          <div className="px-6 pb-6 text-sm text-muted-foreground">
            {t("detail.noLinkedEvents")}
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full">
            <tbody>
              {venue.events.map((event) => (
                <tr
                  key={event.id}
                  className="border-t border-border transition-colors hover:bg-slate-50/50"
                >
                  <td className="px-6 py-3">
                    <Link
                      href={`/events/${event.id}`}
                      className="text-sm font-medium text-foreground hover:text-indigo-600"
                    >
                      {event.title}
                    </Link>
                  </td>
                  <td className="px-6 py-3">
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                        eventStatusStyles[event.status] ??
                          eventStatusStyles.DRAFT
                      )}
                    >
                      {statusT(event.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="organic-card border-red-200 p-6">
        <h2 className="text-base font-semibold text-red-700">
          {t("detail.dangerZone")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("deleteConfirm")}
        </p>
        <button
          onClick={() => setShowDelete(true)}
          className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
        >
          {t("deleteVenue")}
        </button>
      </div>

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title={t("deleteVenue")}
        description={t("deleteConfirm")}
        confirmLabel={t("delete")}
        cancelLabel={t("cancel")}
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
