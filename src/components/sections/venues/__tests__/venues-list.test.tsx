import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock("@/i18n/navigation", () => ({
  Link: (props: { href: string; children: React.ReactNode; className?: string }) => {
    const React = require("react");
    return React.createElement("a", { href: props.href, className: props.className }, props.children);
  },
  usePathname: () => "/venues",
}));
vi.mock("@/lib/actions/venues", () => ({
  deleteVenue: vi.fn(),
}));

import { VenuesList } from "../venues-list";
import { createMockVenues } from "@/test/factories";

describe("VenuesList", () => {
  it("renders empty state when no venues", () => {
    render(
      <VenuesList
        result={{ data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 }}
      />
    );
    expect(screen.getByText("noVenues")).toBeInTheDocument();
  });

  it("renders venue names in table", () => {
    const venues = createMockVenues(3);
    render(
      <VenuesList
        result={{ data: venues, total: 3, page: 1, pageSize: 10, totalPages: 1 }}
      />
    );
    expect(screen.getByText("Venue 1")).toBeInTheDocument();
    expect(screen.getByText("Venue 2")).toBeInTheDocument();
    expect(screen.getByText("Venue 3")).toBeInTheDocument();
  });

  it("renders location info", () => {
    const venues = createMockVenues(1);
    render(
      <VenuesList
        result={{ data: venues, total: 1, page: 1, pageSize: 10, totalPages: 1 }}
      />
    );
    expect(screen.getByText("New York, NY, US")).toBeInTheDocument();
  });

  it("renders capacity values", () => {
    const venues = createMockVenues(2);
    render(
      <VenuesList
        result={{ data: venues, total: 2, page: 1, pageSize: 10, totalPages: 1 }}
      />
    );
    expect(screen.getByText("1,500")).toBeInTheDocument();
    expect(screen.getByText("2,000")).toBeInTheDocument();
  });

  it("renders with many items without error", () => {
    const venues = createMockVenues(50);
    const { container } = render(
      <VenuesList
        result={{ data: venues, total: 50, page: 1, pageSize: 50, totalPages: 1 }}
      />
    );
    const rows = container.querySelectorAll("tbody tr");
    expect(rows.length).toBe(50);
  });
});
