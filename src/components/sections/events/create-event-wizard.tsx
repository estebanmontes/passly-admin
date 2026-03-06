"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/shared/icon";
import { createEvent, type CreateEventInput, type TicketTierInput } from "@/lib/actions/events";
import { BasicsStep } from "./steps/basics-step";
import { DateVenueStep } from "./steps/date-venue-step";
import { TicketsStep } from "./steps/tickets-step";
import { PublishStep } from "./steps/publish-step";
import { LivePreview } from "./live-preview";

export interface EventFormData {
  title: string;
  slug: string;
  category: string;
  description: string;
  coverUrl: string;
  startDate: string;
  endDate: string;
  doorsOpen: string;
  venueId: string;
  currency: string;
  ticketTiers: TicketTierInput[];
  status: "DRAFT" | "ON_SALE";
}

const INITIAL_FORM: EventFormData = {
  title: "",
  slug: "",
  category: "",
  description: "",
  coverUrl: "",
  startDate: "",
  endDate: "",
  doorsOpen: "",
  venueId: "",
  currency: "USD",
  ticketTiers: [],
  status: "DRAFT",
};

const STEPS = ["basics", "venue", "tickets", "publish"] as const;

interface Venue {
  id: string;
  name: string;
}

export function CreateEventWizard({ venues }: { venues: Venue[] }) {
  const t = useTranslations("wizard");
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<EventFormData>(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateForm = (updates: Partial<EventFormData>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 0:
        return form.title.trim() !== "" && form.category !== "" && form.slug.trim() !== "";
      case 1:
        return form.startDate !== "";
      case 2:
        return form.ticketTiers.length > 0 && form.ticketTiers.every((t) => t.name && t.price >= 0 && t.totalQuantity > 0);
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async (status: "DRAFT" | "ON_SALE") => {
    setSaving(true);
    setError(null);
    const input: CreateEventInput = { ...form, status };
    const result = await createEvent(input);
    setSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push("/events");
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">{t("title")}</h1>
        <button
          onClick={() => router.push("/events")}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-slate-100"
        >
          <Icon name="close" size={20} />
        </button>
      </div>

      {/* Step Indicator */}
      <div className="mb-8 flex items-center justify-center gap-0">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <button
              onClick={() => i < step && setStep(i)}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                i === step
                  ? "bg-charcoal text-white"
                  : i < step
                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    : "bg-slate-100 text-muted-foreground"
              )}
            >
              {i < step ? (
                <Icon name="check_circle" size={16} />
              ) : (
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-xs">
                  {i + 1}
                </span>
              )}
              {t(`steps.${s}`)}
            </button>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-1 h-px w-8",
                  i < step ? "bg-emerald-300" : "bg-slate-200"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex gap-6">
        {/* Form */}
        <div className="flex-1 organic-card p-6">
          {step === 0 && <BasicsStep form={form} updateForm={updateForm} />}
          {step === 1 && <DateVenueStep form={form} updateForm={updateForm} venues={venues} />}
          {step === 2 && <TicketsStep form={form} updateForm={updateForm} />}
          {step === 3 && <PublishStep form={form} updateForm={updateForm} venues={venues} />}

          {/* Error */}
          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex items-center justify-between border-t border-border pt-6">
            <div>
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-1 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-slate-50 hover:text-foreground"
                >
                  <Icon name="arrow_back" size={16} />
                  {t("prevStep")}
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              {step === 3 ? (
                <>
                  <button
                    onClick={() => handleSubmit("DRAFT")}
                    disabled={saving}
                    className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-slate-50 disabled:opacity-50"
                  >
                    {t("saveDraft")}
                  </button>
                  <button
                    onClick={() => handleSubmit("ON_SALE")}
                    disabled={saving}
                    className="rounded-xl bg-charcoal px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-charcoal/90 disabled:opacity-50"
                  >
                    {saving ? t("saving") : t("publish")}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleSubmit("DRAFT")}
                    disabled={saving}
                    className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-slate-50 disabled:opacity-50"
                  >
                    {t("saveDraft")}
                  </button>
                  <button
                    onClick={() => setStep(step + 1)}
                    disabled={!canProceed()}
                    className="rounded-xl bg-charcoal px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-charcoal/90 disabled:opacity-50"
                  >
                    {t("nextStep")}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="hidden w-72 flex-shrink-0 xl:block">
          <LivePreview form={form} />
        </div>
      </div>
    </div>
  );
}
