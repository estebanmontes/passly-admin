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
  Link: ({ href, children, ...props }: { href: string; children: React.ReactNode; className?: string }) => {
    const React = require("react");
    return React.createElement("a", { href, ...props }, children);
  },
  usePathname: () => "/orders",
}));

import { OrdersTable } from "../orders-table";
import { createMockOrders } from "@/test/factories";

describe("OrdersTable", () => {
  it("renders empty state when no orders", () => {
    render(
      <OrdersTable
        result={{ data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 }}
      />
    );
    expect(screen.getByText("noOrders")).toBeInTheDocument();
  });

  it("renders order rows with correct data", () => {
    const orders = createMockOrders(3);
    render(
      <OrdersTable
        result={{ data: orders, total: 3, page: 1, pageSize: 10, totalPages: 1 }}
      />
    );
    expect(screen.getByText("ORD-00001")).toBeInTheDocument();
    expect(screen.getByText("ORD-00002")).toBeInTheDocument();
    expect(screen.getByText("ORD-00003")).toBeInTheDocument();
  });

  it("renders customer info", () => {
    const orders = createMockOrders(1);
    render(
      <OrdersTable
        result={{ data: orders, total: 1, page: 1, pageSize: 10, totalPages: 1 }}
      />
    );
    expect(screen.getByText("Customer 1")).toBeInTheDocument();
    expect(screen.getByText("customer1@example.com")).toBeInTheDocument();
  });

  it("renders status badges", () => {
    const orders = createMockOrders(5);
    render(
      <OrdersTable
        result={{ data: orders, total: 5, page: 1, pageSize: 10, totalPages: 1 }}
      />
    );
    // Status labels are mocked as keys, so check for statusLabels.STATUS_NAME
    expect(screen.getByText("statusLabels.PENDING")).toBeInTheDocument();
    expect(screen.getByText("statusLabels.CONFIRMED")).toBeInTheDocument();
  });

  it("renders with 100+ items without error", () => {
    const orders = createMockOrders(100);
    render(
      <OrdersTable
        result={{ data: orders, total: 100, page: 1, pageSize: 100, totalPages: 1 }}
      />
    );
    expect(screen.getByText("ORD-00001")).toBeInTheDocument();
    expect(screen.getByText("ORD-00100")).toBeInTheDocument();
  });

  it("shows table headers", () => {
    const orders = createMockOrders(1);
    render(
      <OrdersTable
        result={{ data: orders, total: 1, page: 1, pageSize: 10, totalPages: 1 }}
      />
    );
    expect(screen.getByText("orderNumber")).toBeInTheDocument();
    expect(screen.getByText("customer")).toBeInTheDocument();
    expect(screen.getByText("total")).toBeInTheDocument();
    expect(screen.getByText("status")).toBeInTheDocument();
  });
});
