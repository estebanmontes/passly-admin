import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));
vi.mock("@/lib/actions/settings", () => ({
  updateOrganizerProfile: vi.fn(),
}));

import { SettingsView } from "../settings-view";

const mockOrganizer = {
  name: "Test Org",
  slug: "test-org",
  description: "A test organization",
  logoUrl: "",
  website: "https://test.org",
};

const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  role: "ORGANIZER",
  createdAt: "2026-01-01T00:00:00Z",
};

describe("SettingsView", () => {
  it("renders profile tab by default with org name", () => {
    render(<SettingsView organizer={mockOrganizer} user={mockUser} />);
    expect(screen.getByDisplayValue("Test Org")).toBeInTheDocument();
  });

  it("renders tab labels", () => {
    render(<SettingsView organizer={mockOrganizer} user={mockUser} />);
    // Tab labels are buttons with text
    expect(screen.getByRole("button", { name: /tabs\.profile/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /tabs\.account/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /tabs\.notifications/ })).toBeInTheDocument();
  });

  it("switches to account tab and shows user info", () => {
    render(<SettingsView organizer={mockOrganizer} user={mockUser} />);
    fireEvent.click(screen.getByRole("button", { name: /tabs\.account/ }));
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("ORGANIZER")).toBeInTheDocument();
  });

  it("switches to notifications tab", () => {
    render(<SettingsView organizer={mockOrganizer} user={mockUser} />);
    fireEvent.click(screen.getByRole("button", { name: /tabs\.notifications/ }));
    expect(screen.getByText("notifications.comingSoon")).toBeInTheDocument();
  });

  it("shows organizer slug on profile tab", () => {
    render(<SettingsView organizer={mockOrganizer} user={mockUser} />);
    expect(screen.getByDisplayValue("test-org")).toBeInTheDocument();
  });

  it("shows save button on profile tab", () => {
    render(<SettingsView organizer={mockOrganizer} user={mockUser} />);
    expect(screen.getByText("profile.save")).toBeInTheDocument();
  });
});
