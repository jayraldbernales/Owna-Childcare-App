import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "../../components/ui/navbar";
import * as useNavbarHook from "../../hooks/useNavbar";
import "@testing-library/jest-dom";

jest.mock("../../hooks/useNavbar");

jest.mock("../../utils/userHelper", () => ({
  getUserDisplayInfo: () => ({
    name: "Jay",
    role: "Admin",
    initial: "J",
  }),
}));

describe("Navbar Component", () => {
  const mockSetDropdownOpen = jest.fn();
  const mockSetShowLogoutConfirm = jest.fn();
  const mockSetShowNotifDropdown = jest.fn();
  const mockHandleLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useNavbarHook.useNavbarLogic as jest.Mock).mockReturnValue({
      user: { id: 1, name: "User", role: "Admin" },
      dropdownRef: { current: null },
      notifDropdownRef: { current: null },
      dropdownOpen: false,
      setDropdownOpen: mockSetDropdownOpen,
      showLogoutConfirm: false,
      setShowLogoutConfirm: mockSetShowLogoutConfirm,
      notifications: [],
      unreadCount: 2,
      showNotifDropdown: false,
      setShowNotifDropdown: mockSetShowNotifDropdown,
      handleLogout: mockHandleLogout,
    });
  });

  it("renders with title and user info", () => {
    render(<Navbar onMenuClick={jest.fn()} title="My Dashboard" />);
    expect(screen.getByText("My Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("calls onMenuClick when menu icon is clicked", () => {
    const mockMenuClick = jest.fn();
    render(<Navbar onMenuClick={mockMenuClick} />);
    const menuBtn = screen.getAllByRole("button")[0];
    fireEvent.click(menuBtn);
    expect(mockMenuClick).toHaveBeenCalled();
  });

  it("toggles notification dropdown when bell is clicked", () => {
    render(<Navbar onMenuClick={jest.fn()} />);
    const buttons = screen.getAllByRole("button");
    const bellBtn = buttons[1];
    fireEvent.click(bellBtn);
    expect(mockSetShowNotifDropdown).toHaveBeenCalled();
  });

  it("shows logout modal when logout is triggered", () => {
    (useNavbarHook.useNavbarLogic as jest.Mock).mockReturnValue({
      ...useNavbarHook.useNavbarLogic(),
      showLogoutConfirm: true,
    });

    render(<Navbar onMenuClick={jest.fn()} />);
    expect(screen.getByText("Confirm Logout")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to log out?")
    ).toBeInTheDocument();
  });
});
