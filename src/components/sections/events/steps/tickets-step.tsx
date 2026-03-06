"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/shared/icon";
import type { EventFormData } from "../create-event-wizard";
import type { TicketTierInput } from "@/lib/actions/events";

interface TicketsStepProps {
  form: EventFormData;
  updateForm: (updates: Partial<EventFormData>) => void;
}

const EMPTY_TIER: TicketTierInput = {
  name: "",
  description: "",
  price: 0,
  totalQuantity: 100,
  maxPerOrder: 10,
};

export function TicketsStep({ form, updateForm }: TicketsStepProps) {
  const t = useTranslations("wizard.tickets");

  const addTier = () => {
    updateForm({ ticketTiers: [...form.ticketTiers, { ...EMPTY_TIER }] });
  };

  const updateTier = (index: number, updates: Partial<TicketTierInput>) => {
    const tiers = [...form.ticketTiers];
    tiers[index] = { ...tiers[index], ...updates };
    updateForm({ ticketTiers: tiers });
  };

  const removeTier = (index: number) => {
    updateForm({ ticketTiers: form.ticketTiers.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{t("title")}</h3>
        <button
          onClick={addTier}
          className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-slate-200"
        >
          <Icon name="add" size={16} />
          {t("addTier")}
        </button>
      </div>

      {form.ticketTiers.length === 0 && (
        <div className="rounded-lg border border-dashed border-slate-300 py-10 text-center">
          <Icon name="confirmation_number" size={32} className="mx-auto mb-2 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">{t("noTiers")}</p>
          <button
            onClick={addTier}
            className="mt-3 rounded-lg bg-charcoal px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-charcoal/90"
          >
            {t("addTier")}
          </button>
        </div>
      )}

      {form.ticketTiers.map((tier, i) => (
        <div key={i} className="rounded-xl border border-border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Tier {i + 1}
            </span>
            <button
              onClick={() => removeTier(i)}
              className="text-xs font-medium text-red-500 hover:text-red-600"
            >
              {t("removeTier")}
            </button>
          </div>

          {/* Name */}
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">
              {t("tierName")}
            </label>
            <input
              type="text"
              value={tier.name}
              onChange={(e) => updateTier(i, { name: e.target.value })}
              placeholder={t("tierNamePlaceholder")}
              className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/20"
            />
          </div>

          {/* Price + Quantity + Max Per Order row */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">
                {t("price")}
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={tier.price}
                onChange={(e) => updateTier(i, { price: parseFloat(e.target.value) || 0 })}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">
                {t("quantity")}
              </label>
              <input
                type="number"
                min="1"
                value={tier.totalQuantity}
                onChange={(e) => updateTier(i, { totalQuantity: parseInt(e.target.value) || 1 })}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">
                {t("maxPerOrder")}
              </label>
              <input
                type="number"
                min="1"
                value={tier.maxPerOrder}
                onChange={(e) => updateTier(i, { maxPerOrder: parseInt(e.target.value) || 1 })}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">
              {t("description")}
            </label>
            <input
              type="text"
              value={tier.description}
              onChange={(e) => updateTier(i, { description: e.target.value })}
              placeholder={t("descriptionPlaceholder")}
              className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/20"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
