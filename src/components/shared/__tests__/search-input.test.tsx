import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock("@/i18n/navigation", () => ({
  usePathname: () => "/test",
}));

import { SearchInput } from "../search-input";

describe("SearchInput", () => {
  it("renders with placeholder", () => {
    render(<SearchInput placeholder="Search events..." />);
    expect(screen.getByPlaceholderText("Search events...")).toBeInTheDocument();
  });

  it("renders with default placeholder", () => {
    render(<SearchInput />);
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("renders an input element", () => {
    render(<SearchInput placeholder="Search..." />);
    const input = screen.getByPlaceholderText("Search...");
    expect(input.tagName).toBe("INPUT");
  });
});
