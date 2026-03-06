"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/shared/icon";
import type { EventFormData } from "./create-event-wizard";

export function LivePreview({ form }: { form: EventFormData }) {
  const t = useTranslations("wizard");
  const catT = useTranslations("wizard.categories");

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const minPrice = form.ticketTiers.length > 0
    ? Math.min(...form.ticketTiers.map((t) => t.price))
    : null;

  return (
    <div className="sticky top-24">
      <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
        {t("livePreview")}
      </h3>

      {/* Phone frame */}
      <div className="overflow-hidden rounded-3xl border-2 border-slate-200 bg-white shadow-lg">
        {/* Status bar */}
        <div className="flex items-center justify-between bg-slate-900 px-4 py-1.5">
          <span className="text-[10px] text-white/70">9:41</span>
          <div className="flex gap-1">
            <span className="text-[10px] text-white/70">5G</span>
            <Icon name="battery_full" size={12} className="text-white/70" />
          </div>
        </div>

        {/* Cover */}
        <div className="relative h-36 bg-gradient-to-br from-indigo-100 to-purple-100">
          {form.coverUrl ? (
            <img
              src={form.coverUrl}
              alt="Cover"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Icon name="image" size={32} className="text-indigo-300" />
            </div>
          )}
          {/* Back button */}
          <div className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/80">
            <Icon name="arrow_back" size={14} className="text-slate-700" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3 p-4">
          {/* Title */}
          <h4 className="text-sm font-bold text-foreground leading-tight">
            {form.title || "Event Name"}
          </h4>

          {/* Category badge */}
          {form.category && (
            <span className="inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-600">
              {catT(form.category)}
            </span>
          )}

          {/* Date */}
          {form.startDate && (
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Icon name="calendar_today" size={12} />
              {formatDate(form.startDate)}
            </div>
          )}

          {/* Description */}
          <p className="text-[11px] leading-relaxed text-muted-foreground line-clamp-3">
            {form.description || "Event description will appear here..."}
          </p>

          {/* Ticket tiers preview */}
          {form.ticketTiers.length > 0 && (
            <div className="space-y-1.5">
              {form.ticketTiers.slice(0, 2).map((tier, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-1.5"
                >
                  <span className="text-[10px] font-medium">{tier.name || "Tier"}</span>
                  <span className="text-[10px] font-semibold text-indigo-600">
                    ${tier.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <button className="w-full rounded-xl bg-charcoal py-2 text-[11px] font-semibold text-white">
            {minPrice !== null ? `Get Tickets from $${minPrice.toFixed(2)}` : "Get Tickets"}
          </button>
        </div>
      </div>
    </div>
  );
}
