"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "@/i18n/navigation";
import { Icon } from "@/components/shared/icon";

interface SearchInputProps {
  placeholder?: string;
}

export function SearchInput({ placeholder = "Search..." }: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") ?? "");
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    setValue(searchParams.get("search") ?? "");
  }, [searchParams]);

  function handleChange(newValue: string) {
    setValue(newValue);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (newValue) {
        params.set("search", newValue);
      } else {
        params.delete("search");
      }
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    }, 300);
  }

  return (
    <div className="relative">
      <Icon
        name="search"
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-border bg-white pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-charcoal focus:outline-none focus:ring-1 focus:ring-charcoal/20"
      />
    </div>
  );
}
