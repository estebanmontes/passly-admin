"use client";

import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterSelectProps {
  paramKey: string;
  options: FilterOption[];
  placeholder?: string;
}

export function FilterSelect({
  paramKey,
  options,
  placeholder = "All",
}: FilterSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get(paramKey) ?? "";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(paramKey, value);
    } else {
      params.delete(paramKey);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <select
      value={current}
      onChange={(e) => handleChange(e.target.value)}
      className="h-10 rounded-xl border border-border bg-white px-3 text-sm text-foreground focus:border-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal/20"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
