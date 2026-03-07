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
  usePathname: () => "/attendees",
}));
vi.mock("@/lib/actions/attendees", () => ({
  checkInPass: vi.fn(),
  cancelPass: vi.fn(),
}));

import { AttendeesTable } from "../attendees-table";
import { createMockPasses } from "@/test/factories";

describe("AttendeesTable", () => {
  it("renders empty state when no attendees", () => {
    render(
      <AttendeesTable
        result={{ data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 }}
      />
    );
    expect(screen.getByText("noAttendees")).toBeInTheDocument();
  });

  it("renders attendee names", () => {
    const passes = createMockPasses(3);
    render(
      <AttendeesTable
        result={{ data: passes, total: 3, page: 1, pageSize: 10, totalPages: 1 }}
      />
    );
    expect(screen.getByText("Attendee 1")).toBeInTheDocument();
    expect(screen.getByText("Attendee 2")).toBeInTheDocument();
    expect(screen.getByText("Attendee 3")).toBeInTheDocument();
  });

  it("renders attendee emails", () => {
    const passes = createMockPasses(2);
    render(
      <AttendeesTable
        result={{ data: passes, total: 2, page: 1, pageSize: 10, totalPages: 1 }}
      />
    );
    expect(screen.getByText("attendee1@example.com")).toBeInTheDocument();
    expect(screen.getByText("attendee2@example.com")).toBeInTheDocument();
  });

  it("renders event titles", () => {
    const passes = createMockPasses(2);
    render(
      <AttendeesTable
        result={{ data: passes, total: 2, page: 1, pageSize: 10, totalPages: 1 }}
      />
    );
    // Event titles from factory: "Event 0", "Event 1"
    expect(screen.getAllByText(/Event \d/).length).toBeGreaterThan(0);
  });

  it("shows check-in button for VALID passes", () => {
    // Pass index 1 has status VALID (index % 5 = 1), and index 6, 11...
    const passes = createMockPasses(5);
    render(
      <AttendeesTable
        result={{ data: passes, total: 5, page: 1, pageSize: 10, totalPages: 1 }}
      />
    );
    const checkInButtons = screen.getAllByText("checkIn");
    expect(checkInButtons.length).toBeGreaterThan(0);
  });

  it("renders with many items without error", () => {
    const passes = createMockPasses(50);
    const { container } = render(
      <AttendeesTable
        result={{ data: passes, total: 50, page: 1, pageSize: 50, totalPages: 1 }}
      />
    );
    const rows = container.querySelectorAll("tbody tr");
    expect(rows.length).toBe(50);
  });
});
