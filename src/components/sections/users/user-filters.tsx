"use client";

import { useTranslations } from "next-intl";
import { SearchInput } from "@/components/shared/search-input";
import { FilterSelect } from "@/components/shared/filter-select";

export function UserFilters() {
  const t = useTranslations("users");

  const roleOptions = [
    { label: t("roleLabels.CUSTOMER"), value: "CUSTOMER" },
    { label: t("roleLabels.ORGANIZER"), value: "ORGANIZER" },
    { label: t("roleLabels.ADMIN"), value: "ADMIN" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="w-full sm:w-80">
        <SearchInput placeholder={t("search")} />
      </div>
      <FilterSelect
        paramKey="role"
        options={roleOptions}
        placeholder={t("filterByRole")}
      />
    </div>
  );
}
