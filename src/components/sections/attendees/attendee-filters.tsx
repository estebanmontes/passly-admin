"use client";

import { useTranslations } from "next-intl";
import { SearchInput } from "@/components/shared/search-input";
import { FilterSelect } from "@/components/shared/filter-select";

interface AttendeeFiltersProps {
  eventOptions: { id: string; title: string }[];
}

export function AttendeeFilters({ eventOptions }: AttendeeFiltersProps) {
  const t = useTranslations("attendees");

  const statusOptions = [
    { label: t("statusLabels.VALID"), value: "VALID" },
    { label: t("statusLabels.USED"), value: "USED" },
    { label: t("statusLabels.EXPIRED"), value: "EXPIRED" },
    { label: t("statusLabels.CANCELLED"), value: "CANCELLED" },
    { label: t("statusLabels.TRANSFERRED"), value: "TRANSFERRED" },
  ];

  const eventOpts = eventOptions.map((e) => ({
    label: e.title,
    value: e.id,
  }));

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="w-80">
        <SearchInput placeholder={t("search")} />
      </div>
      <FilterSelect
        paramKey="eventId"
        options={eventOpts}
        placeholder={t("filterByEvent")}
      />
      <FilterSelect
        paramKey="status"
        options={statusOptions}
        placeholder={t("filterByStatus")}
      />
    </div>
  );
}
