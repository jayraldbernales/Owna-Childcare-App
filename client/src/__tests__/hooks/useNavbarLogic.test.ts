import { renderHook, act, waitFor } from "@testing-library/react";
import { useNavbarLogic } from "../../hooks/useNavbar";
import * as api from "../../lib/api";
import * as authStorage from "../../utils/authStorage";
import { useAuth } from "../../lib/context";
import { useNavigate } from "react-router-dom";
import socket from "../../lib/socket";

jest.mock("../../lib/api");
jest.mock("../../utils/authStorage");
jest.mock("../../lib/context");
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));
jest.mock("../../lib/socket", () => ({
  emit: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
}));

describe("useNavbarLogic", () => {
  const mockUser = { id: 1, name: "Test User" };
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (api.logout as jest.Mock).mockResolvedValue(undefined);
    (authStorage.AuthStorage.clear as jest.Mock).mockImplementation(() => {});
    (socket.emit as jest.Mock).mockClear();
    (socket.on as jest.Mock).mockClear();
    (socket.off as jest.Mock).mockClear();
    mockNavigate.mockClear();
  });

  it("initializes state and sets up socket and fetch", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            notifications: [
              {
                id: 1,
                userId: 1,
                message: "Test",
                read: false,
                createdAt: "2023-01-01",
              },
            ],
          }),
      })
    ) as jest.Mock;

    const { result } = renderHook(() => useNavbarLogic());

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.dropdownOpen).toBe(false);
    expect(result.current.showLogoutConfirm).toBe(false);
    expect(result.current.notifications).toEqual([]);
    expect(result.current.unreadCount).toBe(0);
    expect(result.current.showNotifDropdown).toBe(false);

    // Wait for fetch effect to update notifications
    await waitFor(() => {
      expect(result.current.notifications.length).toBe(1);
      expect(result.current.unreadCount).toBe(1);
    });

    expect(socket.emit).toHaveBeenCalledWith("joinRoom", `user_${mockUser.id}`);
    expect(socket.on).toHaveBeenCalledWith(
      "newNotification",
      expect.any(Function)
    );
  });

  it("handleLogout calls logout, clears storage and navigates", async () => {
    const { result } = renderHook(() => useNavbarLogic());

    await act(async () => {
      await result.current.handleLogout();
    });

    expect(api.logout).toHaveBeenCalled();
    expect(authStorage.AuthStorage.clear).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
