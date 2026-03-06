"use client";

import { useTranslations } from "next-intl";
import type { EventFormData } from "../create-event-wizard";

const CATEGORIES = [
  "MUSIC", "CONFERENCE", "SPORTS", "THEATER", "FESTIVAL",
  "COMEDY", "WORKSHOP", "NETWORKING", "OTHER",
] as const;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

interface BasicsStepProps {
  form: EventFormData;
  updateForm: (updates: Partial<EventFormData>) => void;
}

export function BasicsStep({ form, updateForm }: BasicsStepProps) {
  const t = useTranslations("wizard.basics");
  const catT = useTranslations("wizard.categories");

  const handleTitleChange = (title: string) => {
    updateForm({
      title,
      slug: form.slug === slugify(form.title) || form.slug === ""
        ? slugify(title)
        : form.slug,
    });
  };

  return (
    <div className="space-y-5">
      {/* Event Name */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          {t("eventName")}
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder={t("eventNamePlaceholder")}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/20"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          {t("slug")}
        </label>
        <input
          type="text"
          value={form.slug}
          onChange={(e) => updateForm({ slug: slugify(e.target.value) })}
          placeholder={t("slugPlaceholder")}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 font-mono text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/20"
        />
      </div>

      {/* Category */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          {t("category")}
        </label>
        <select
          value={form.category}
          onChange={(e) => updateForm({ category: e.target.value })}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/20"
        >
          <option value="">{t("categoryPlaceholder")}</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {catT(cat)}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          {t("description")}
        </label>
        <textarea
          value={form.description}
          onChange={(e) => updateForm({ description: e.target.value })}
          placeholder={t("descriptionPlaceholder")}
          rows={4}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/20 resize-none"
        />
      </div>

      {/* Cover Image URL */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          {t("coverUrl")}
        </label>
        <input
          type="url"
          value={form.coverUrl}
          onChange={(e) => updateForm({ coverUrl: e.target.value })}
          placeholder={t("coverUrlPlaceholder")}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/20"
        />
      </div>
    </div>
  );
}
