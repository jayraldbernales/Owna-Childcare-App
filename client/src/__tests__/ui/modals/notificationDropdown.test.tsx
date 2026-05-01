import { render, screen, fireEvent } from "@testing-library/react";
import NotificationDropdown from "../../../components/ui/modals/notificationDropdown";
import React from "react";
import "@testing-library/jest-dom";

describe("NotificationDropdown", () => {
  const mockNotifications = [
    {
      id: 1,
      userId: 1,
      message: "Test notification",
      read: false,
      createdAt: "2023-01-01",
    },
  ];
  const mockNotifDropdownRef = React.createRef<HTMLDivElement | null>();

  it("renders without crashing", () => {
    render(
      <NotificationDropdown
        notifications={mockNotifications}
        notifDropdownRef={mockNotifDropdownRef}
      />
    );
    expect(screen.getByText("Notifications")).toBeInTheDocument();
  });

  // Add more detailed tests here as needed, e.g., interaction tests
  it("toggles dropdown on click", () => {
    render(
      <NotificationDropdown
        notifications={mockNotifications}
        notifDropdownRef={mockNotifDropdownRef}
      />
    );
    const notificationToggle = screen.getByText("Notifications");
    fireEvent.click(notificationToggle);
    expect(screen.getByText("Test notification")).toBeVisible();
  });
});
