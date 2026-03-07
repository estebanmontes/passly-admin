import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock("@/i18n/navigation", () => ({
  Link: (props: { href: string; children: React.ReactNode; className?: string }) => {
    const React = require("react");
    return React.createElement("a", { href: props.href, className: props.className }, props.children);
  },
  usePathname: () => "/analytics",
}));

import { AnalyticsDashboard } from "../analytics-dashboard";

const emptyData = {
  kpis: { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0, totalTicketsSold: 0 },
  dailyRevenue: [],
  salesByEvent: [],
  salesByTier: [],
  topEvents: [],
};

const populatedData = {
  kpis: { totalRevenue: 15000, totalOrders: 42, avgOrderValue: 357.14, totalTicketsSold: 120 },
  dailyRevenue: [
    { date: "2026-01-01", revenue: 500 },
    { date: "2026-01-02", revenue: 750 },
    { date: "2026-01-03", revenue: 300 },
  ],
  salesByEvent: [
    { eventName: "Music Fest", revenue: 10000, orders: 30 },
    { eventName: "Tech Conf", revenue: 5000, orders: 12 },
  ],
  salesByTier: [
    { tierName: "VIP", revenue: 8000, quantity: 40 },
    { tierName: "General", revenue: 7000, quantity: 80 },
  ],
  topEvents: [
    { id: "1", title: "Music Fest", ticketsSold: 80, revenue: 10000, orders: 30 },
    { id: "2", title: "Tech Conf", ticketsSold: 40, revenue: 5000, orders: 12 },
  ],
};

describe("AnalyticsDashboard", () => {
  it("renders KPI cards with zero values", () => {
    render(<AnalyticsDashboard data={emptyData} />);
    // Zero values are formatted as "$0.00" and "0"
    const zeroElements = screen.getAllByText("0");
    expect(zeroElements.length).toBeGreaterThan(0);
  });

  it("renders KPI cards with data", () => {
    render(<AnalyticsDashboard data={populatedData} />);
    expect(screen.getByText("$15,000.00")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("120")).toBeInTheDocument();
  });

  it("renders top events in table", () => {
    render(<AnalyticsDashboard data={populatedData} />);
    // Multiple "Music Fest" elements exist (chart + table) - use getAllByText
    const musicFestElements = screen.getAllByText("Music Fest");
    expect(musicFestElements.length).toBeGreaterThanOrEqual(2);
  });

  it("renders date range selector presets", () => {
    render(<AnalyticsDashboard data={emptyData} />);
    expect(screen.getByText("presets.7d")).toBeInTheDocument();
    expect(screen.getByText("presets.30d")).toBeInTheDocument();
    expect(screen.getByText("presets.90d")).toBeInTheDocument();
    expect(screen.getByText("presets.year")).toBeInTheDocument();
  });

  it("renders noData message for empty charts", () => {
    render(<AnalyticsDashboard data={emptyData} />);
    const noDataElements = screen.getAllByText("noData");
    expect(noDataElements.length).toBeGreaterThan(0);
  });
});
