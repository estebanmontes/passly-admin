import { vi } from "vitest";

// Mock useTranslations: returns a function that echoes the key
vi.mock("next-intl", () => ({
  useTranslations: (namespace: string) => {
    return (key: string) => `${namespace}.${key}`;
  },
}));
