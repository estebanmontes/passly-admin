"use client";

import { useTranslations } from "next-intl";
import type { EventFormData } from "../create-event-wizard";

const CURRENCIES = ["USD", "EUR", "GBP", "MXN", "COP"] as const;

interface DateVenueStepProps {
  form: EventFormData;
  updateForm: (updates: Partial<EventFormData>) => void;
  venues: { id: string; name: string }[];
}

export function DateVenueStep({ form, updateForm, venues }: DateVenueStepProps) {
  const t = useTranslations("wizard.dateVenue");
  const curT = useTranslations("wizard.currencies");

  return (
    <div className="space-y-5">
      {/* Start Date */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          {t("startDate")}
        </label>
        <input
          type="datetime-local"
          value={form.startDate}
          onChange={(e) => updateForm({ startDate: e.target.value })}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
        />
      </div>

      {/* End Date */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          {t("endDate")}
        </label>
        <input
          type="datetime-local"
          value={form.endDate}
          onChange={(e) => updateForm({ endDate: e.target.value })}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
        />
      </div>

      {/* Doors Open */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          {t("doorsOpen")}
        </label>
        <input
          type="datetime-local"
          value={form.doorsOpen}
          onChange={(e) => updateForm({ doorsOpen: e.target.value })}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
        />
      </div>

      {/* Venue */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          {t("selectVenue")}
        </label>
        <select
          value={form.venueId}
          onChange={(e) => updateForm({ venueId: e.target.value })}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
        >
          <option value="">{t("noVenue")}</option>
          {venues.map((venue) => (
            <option key={venue.id} value={venue.id}>
              {venue.name}
            </option>
          ))}
        </select>
      </div>

      {/* Currency */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          {t("currency")}
        </label>
        <select
          value={form.currency}
          onChange={(e) => updateForm({ currency: e.target.value })}
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
  );
}
