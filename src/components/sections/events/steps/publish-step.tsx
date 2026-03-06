"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/shared/icon";
import { cn } from "@/lib/utils";
import type { EventFormData } from "../create-event-wizard";

interface PublishStepProps {
  form: EventFormData;
  updateForm: (updates: Partial<EventFormData>) => void;
  venues: { id: string; name: string }[];
}

export function PublishStep({ form, updateForm, venues }: PublishStepProps) {
  const t = useTranslations("wizard.review");
  const catT = useTranslations("wizard.categories");
  const curT = useTranslations("wizard.currencies");

  const venueName = venues.find((v) => v.id === form.venueId)?.name ?? "Online";
  const totalCapacity = form.ticketTiers.reduce((s, t) => s + t.totalQuantity, 0);
  const prices = form.ticketTiers.map((t) => t.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-foreground">{t("title")}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Event Details */}
      <div className="rounded-xl border border-border p-4 space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("eventDetails")}
        </h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Name</span>
            <p className="font-medium text-foreground">{form.title}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Category</span>
            <p className="font-medium text-foreground">
              {form.category ? catT(form.category) : "—"}
            </p>
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground">Description</span>
            <p className="font-medium text-foreground line-clamp-2">
              {form.description || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Date & Venue */}
      <div className="rounded-xl border border-border p-4 space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("dateAndVenue")}
        </h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Start</span>
            <p className="font-medium text-foreground">{formatDate(form.startDate)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">End</span>
            <p className="font-medium text-foreground">{formatDate(form.endDate)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Venue</span>
            <p className="font-medium text-foreground">{venueName}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Currency</span>
            <p className="font-medium text-foreground">{curT(form.currency)}</p>
          </div>
        </div>
      </div>

      {/* Tickets */}
      <div className="rounded-xl border border-border p-4 space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("ticketTiers")}
        </h4>
        <div className="space-y-2">
          {form.ticketTiers.map((tier, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
              <div className="flex items-center gap-2">
                <Icon name="confirmation_number" size={16} className="text-muted-foreground" />
                <span className="font-medium">{tier.name}</span>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span>${tier.price.toFixed(2)}</span>
                <span>{tier.totalQuantity} qty</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-6 text-sm">
          <div>
            <span className="text-muted-foreground">{t("totalCapacity")}: </span>
            <span className="font-medium">{totalCapacity.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-muted-foreground">{t("priceRange")}: </span>
            <span className="font-medium">
              ${minPrice.toFixed(2)} – ${maxPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Publish Option */}
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("publishAs")}
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => updateForm({ status: "DRAFT" })}
            className={cn(
              "rounded-xl border p-4 text-left transition-colors",
              form.status === "DRAFT"
                ? "border-charcoal bg-slate-50"
                : "border-border hover:bg-slate-50"
            )}
          >
            <Icon name="edit_note" size={20} className="mb-1 text-muted-foreground" />
            <p className="text-sm font-medium">{t("draft")}</p>
          </button>
          <button
            onClick={() => updateForm({ status: "ON_SALE" })}
            className={cn(
              "rounded-xl border p-4 text-left transition-colors",
              form.status === "ON_SALE"
                ? "border-emerald-500 bg-emerald-50"
                : "border-border hover:bg-slate-50"
            )}
          >
            <Icon name="rocket_launch" size={20} className="mb-1 text-emerald-600" />
            <p className="text-sm font-medium">{t("live")}</p>
          </button>
        </div>
      </div>
    </div>
  );
}
