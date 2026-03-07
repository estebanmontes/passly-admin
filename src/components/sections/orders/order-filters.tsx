"use client";

import { useTranslations } from "next-intl";
import { SearchInput } from "@/components/shared/search-input";
import { FilterSelect } from "@/components/shared/filter-select";

interface OrderFiltersProps {
  eventOptions: { id: string; title: string }[];
}

export function OrderFilters({ eventOptions }: OrderFiltersProps) {
  const t = useTranslations("orders");

  const statusOptions = [
    { label: t("statusLabels.PENDING"), value: "PENDING" },
    { label: t("statusLabels.CONFIRMED"), value: "CONFIRMED" },
    { label: t("statusLabels.FAILED"), value: "FAILED" },
    { label: t("statusLabels.REFUNDED"), value: "REFUNDED" },
    { label: t("statusLabels.CANCELLED"), value: "CANCELLED" },
  ];

  const eventOpts = eventOptions.map((e) => ({
    label: e.title,
    value: e.id,
  }));

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="w-full sm:w-80">
        <SearchInput placeholder={t("search")} />
      </div>
      <FilterSelect
        paramKey="status"
        options={statusOptions}
        placeholder={t("filterByStatus")}
      />
      <FilterSelect
        paramKey="eventId"
        options={eventOpts}
        placeholder={t("filterByEvent")}
      />
    </div>
  );
}
