import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mocks
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock("@/i18n/navigation", () => ({
  usePathname: () => "/test",
}));

import { DataTablePagination } from "../data-table-pagination";

describe("DataTablePagination", () => {
  it("renders nothing when totalPages is 1", () => {
    const { container } = render(
      <DataTablePagination page={1} totalPages={1} total={5} pageSize={10} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders page numbers when totalPages > 1", () => {
    render(
      <DataTablePagination page={1} totalPages={5} total={50} pageSize={10} />
    );
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("shows item range info", () => {
    render(
      <DataTablePagination page={2} totalPages={5} total={50} pageSize={10} />
    );
    expect(screen.getByText(/11–20 of 50/)).toBeInTheDocument();
  });

  it("disables previous button on first page", () => {
    render(
      <DataTablePagination page={1} totalPages={5} total={50} pageSize={10} />
    );
    const buttons = screen.getAllByRole("button");
    const prevButton = buttons[0];
    expect(prevButton).toBeDisabled();
  });

  it("disables next button on last page", () => {
    render(
      <DataTablePagination page={5} totalPages={5} total={50} pageSize={10} />
    );
    const buttons = screen.getAllByRole("button");
    const nextButton = buttons[buttons.length - 1];
    expect(nextButton).toBeDisabled();
  });
});
