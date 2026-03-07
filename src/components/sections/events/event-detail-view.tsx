"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/shared/icon";
import {
  updateEvent,
  deleteEvent,
  type TicketTierInput,
} from "@/lib/actions/events";

interface TicketTier {
  id: string;
  name: string;
  description: string | null;
  price: number;
  totalQuantity: number;
  soldCount: number;
  maxPerOrder: number;
}

interface EventData {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string | null;
  coverUrl: string | null;
  status: string;
  startDate: Date;
  endDate: Date | null;
  doorsOpen: Date | null;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  venue: { id: string; name: string } | null;
  ticketTiers: TicketTier[];
  organizer: { id: string; name: string };
}

type Tab = "general" | "dateVenue" | "tickets" | "danger";

const CATEGORIES = [
  "MUSIC",
  "CONFERENCE",
  "SPORTS",
  "THEATER",
  "FESTIVAL",
  "COMEDY",
  "WORKSHOP",
  "NETWORKING",
  "OTHER",
] as const;

const CURRENCIES = ["USD", "EUR", "GBP", "MXN", "COP"] as const;

const STATUSES = [
  "DRAFT",
  "SCHEDULED",
  "ON_SALE",
  "SOLD_OUT",
  "CANCELLED",
  "COMPLETED",
] as const;

const statusStyles: Record<string, string> = {
  ON_SALE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  DRAFT: "bg-slate-100 text-slate-600 border-slate-200",
  SCHEDULED: "bg-blue-50 text-blue-700 border-blue-200",
  SOLD_OUT: "bg-red-50 text-red-700 border-red-200",
  CANCELLED: "bg-slate-100 text-slate-500 border-slate-200",
  COMPLETED: "bg-slate-50 text-slate-500 border-slate-200",
};

function toLocalDatetime(date: Date | null): string {
  if (!date) return "";
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export function EventDetailView({
  event,
  venues,
}: {
  event: EventData;
  venues: { id: string; name: string }[];
}) {
  const t = useTranslations("events.detail");
  const statusT = useTranslations("events.status");
  const catT = useTranslations("wizard.categories");
  const curT = useTranslations("wizard.currencies");
  const ticketT = useTranslations("wizard.tickets");
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("general");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form state
  const [title, setTitle] = useState(event.title);
  const [slug, setSlug] = useState(event.slug);
  const [category, setCategory] = useState(event.category);
  const [description, setDescription] = useState(event.description ?? "");
  const [coverUrl, setCoverUrl] = useState(event.coverUrl ?? "");
  const [status, setStatus] = useState(event.status);
  const [startDate, setStartDate] = useState(toLocalDatetime(event.startDate));
  const [endDate, setEndDate] = useState(toLocalDatetime(event.endDate));
  const [doorsOpen, setDoorsOpen] = useState(toLocalDatetime(event.doorsOpen));
  const [venueId, setVenueId] = useState(event.venue?.id ?? "");
  const [currency, setCurrency] = useState(event.currency);
  const [ticketTiers, setTicketTiers] = useState<
    (TicketTierInput & { id?: string })[]
  >(
    event.ticketTiers.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description ?? "",
      price: t.price,
      totalQuantity: t.totalQuantity,
      maxPerOrder: t.maxPerOrder,
    }))
  );

  // Computed stats
  const totalCapacity = event.ticketTiers.reduce(
    (s, t) => s + t.totalQuantity,
    0
  );
  const totalSold = event.ticketTiers.reduce((s, t) => s + t.soldCount, 0);
  const totalRevenue = event.ticketTiers.reduce(
    (s, t) => s + t.soldCount * t.price,
    0
  );

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    const result = await updateEvent({
      eventId: event.id,
      title,
      slug,
      category,
      description,
      coverUrl,
      startDate,
      endDate,
      doorsOpen,
      venueId,
      currency,
      status,
      ticketTiers,
    });

    setSaving(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccessMsg(t("saved"));
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    const result = await deleteEvent(event.id);
    setSaving(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.push("/events");
    }
  };

  const addTier = () => {
    setTicketTiers([
      ...ticketTiers,
      {
        name: "",
        description: "",
        price: 0,
        totalQuantity: 100,
        maxPerOrder: 10,
      },
    ]);
  };

  const updateTier = (index: number, updates: Partial<TicketTierInput>) => {
    const tiers = [...ticketTiers];
    tiers[index] = { ...tiers[index], ...updates };
    setTicketTiers(tiers);
  };

  const removeTier = (index: number) => {
    setTicketTiers(ticketTiers.filter((_, i) => i !== index));
  };

  const tabs: { key: Tab; icon: string }[] = [
    { key: "general", icon: "info" },
    { key: "dateVenue", icon: "calendar_today" },
    { key: "tickets", icon: "confirmation_number" },
    { key: "danger", icon: "warning" },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/events"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-slate-100"
          >
            <Icon name="arrow_back" size={20} />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-foreground sm:text-xl">
              {event.title}
            </h1>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="hidden sm:inline">
                {t("eventId")}: {event.id.slice(0, 12)}...
              </span>
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium",
                  statusStyles[event.status]
                )}
              >
                {statusT(event.status)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const url = `${window.location.origin}/events/${event.slug}`;
              navigator.clipboard.writeText(url);
              setSuccessMsg(t("linkCopied"));
              setTimeout(() => setSuccessMsg(null), 3000);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-slate-50 hover:text-foreground"
            title={t("shareEvent")}
          >
            <Icon name="share" size={18} />
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-xl bg-charcoal px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-charcoal/90 disabled:opacity-50 sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm"
          >
            <Icon name="save" size={16} className="hidden sm:block" />
            <span className="hidden sm:inline">
              {saving ? t("saving") : t("save")}
            </span>
            <span className="sm:hidden">{saving ? "..." : t("save")}</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          {successMsg}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Stats row */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[
          {
            label: t("capacity"),
            value: totalCapacity.toLocaleString(),
            icon: "groups",
          },
          {
            label: t("ticketsSold"),
            value: totalSold.toLocaleString(),
            icon: "sell",
          },
          {
            label: t("revenue"),
            value: `$${totalRevenue.toLocaleString()}`,
            icon: "payments",
          },
          { label: t("status"), value: statusT(event.status), icon: "flag" },
        ].map((stat) => (
          <div key={stat.label} className="organic-card p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon name={stat.icon} size={14} />
              {stat.label}
            </div>
            <p className="mt-1 text-lg font-bold text-foreground">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1">
        {tabs.map(({ key, icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              tab === key
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon name={icon} size={16} />
            {t(key)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="organic-card p-6">
        {/* General Tab */}
        {tab === "general" && (
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                {catT("MUSIC") && "Event Name"}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                {t("slug")}
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {catT(cat)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  {t("status")}
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {statusT(s)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/20 resize-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Cover Image URL
              </label>
              <input
                type="url"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
              />
              {coverUrl && (
                <div className="mt-2 h-32 w-full overflow-hidden rounded-lg bg-slate-100">
                  <img
                    src={coverUrl}
                    alt="Cover"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Date & Venue Tab */}
        {tab === "dateVenue" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Doors Open
              </label>
              <input
                type="datetime-local"
                value={doorsOpen}
                onChange={(e) => setDoorsOpen(e.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Venue
                </label>
                <select
                  value={venueId}
                  onChange={(e) => setVenueId(e.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
                >
                  <option value="">No venue (online)</option>
                  {venues.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
                >
                  {CURRENCIES.map((cur) => (
                    <option key={cur} value={cur}>
                      {curT(cur)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="rounded-lg bg-slate-50 p-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Icon name="info" size={14} />
                <span>
                  {t("created")}: {new Date(event.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <Icon name="update" size={14} />
                <span>
                  {t("updated")}: {new Date(event.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tickets Tab */}
        {tab === "tickets" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                {ticketT("title")}
              </h3>
              <button
                onClick={addTier}
                className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-slate-200"
              >
                <Icon name="add" size={16} />
                {ticketT("addTier")}
              </button>
            </div>

            {ticketTiers.map((tier, i) => {
              const originalTier = event.ticketTiers[i];
              const sold = originalTier?.soldCount ?? 0;
              const salesPercent =
                tier.totalQuantity > 0
                  ? Math.round((sold / tier.totalQuantity) * 100)
                  : 0;

              return (
                <div
                  key={i}
                  className="rounded-xl border border-border p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Tier {i + 1}
                      {sold > 0 && (
                        <span className="ml-2 normal-case font-normal">
                          — {sold} sold ({salesPercent}%)
                        </span>
                      )}
                    </span>
                    <button
                      onClick={() => removeTier(i)}
                      className="text-xs font-medium text-red-500 hover:text-red-600"
                    >
                      {ticketT("removeTier")}
                    </button>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-foreground">
                      {ticketT("tierName")}
                    </label>
                    <input
                      type="text"
                      value={tier.name}
                      onChange={(e) => updateTier(i, { name: e.target.value })}
                      className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-foreground">
                        {ticketT("price")}
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={tier.price}
                        onChange={(e) =>
                          updateTier(i, {
                            price: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-foreground">
                        {ticketT("quantity")}
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={tier.totalQuantity}
                        onChange={(e) =>
                          updateTier(i, {
                            totalQuantity: parseInt(e.target.value) || 1,
                          })
                        }
                        className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-foreground">
                        {ticketT("maxPerOrder")}
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={tier.maxPerOrder}
                        onChange={(e) =>
                          updateTier(i, {
                            maxPerOrder: parseInt(e.target.value) || 1,
                          })
                        }
                        className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-foreground">
                      {ticketT("description")}
                    </label>
                    <input
                      type="text"
                      value={tier.description}
                      onChange={(e) =>
                        updateTier(i, { description: e.target.value })
                      }
                      placeholder={ticketT("descriptionPlaceholder")}
                      className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/20"
                    />
                  </div>
                  {/* Sales bar */}
                  {sold > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            salesPercent >= 90
                              ? "bg-emerald-500"
                              : salesPercent >= 50
                              ? "bg-blue-500"
                              : "bg-amber-400"
                          )}
                          style={{ width: `${salesPercent}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {salesPercent}%
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Danger Zone Tab */}
        {tab === "danger" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-red-200 bg-red-50/50 p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-red-700">
                <Icon name="delete" size={18} />
                {t("deleteEvent")}
              </h3>
              <p className="mt-2 text-sm text-red-600/80">
                {t("deleteConfirm")}
              </p>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="mt-4 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  {t("deleteEvent")}
                </button>
              ) : (
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={handleDelete}
                    disabled={saving}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                  >
                    {t("delete")}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-slate-50"
                  >
                    {t("cancel")}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
