import React from "react";
import { renderHook, act } from "@testing-library/react";
import { AuthProvider, useAuth, User } from "../lib/context";
import { AuthStorage } from "../utils/authStorage";

jest.mock("../utils/authStorage");

describe("AuthContext", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  const mockUser: User = {
    id: "1",
    firstname: "John",
    email: "john@example.com",
    role: "user",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes with user and token from AuthStorage", () => {
    (AuthStorage.get as jest.Mock).mockReturnValue({
      user: mockUser,
      token: "token123",
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe("token123");
  });

  it("login updates user and token and calls AuthStorage.set", () => {
    (AuthStorage.get as jest.Mock).mockReturnValue(null);

    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login(mockUser, "token123");
    });

    expect(AuthStorage.set).toHaveBeenCalledWith(mockUser, "token123");
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe("token123");
  });

  it("useAuth throws error if used outside AuthProvider", () => {
    let error;
    try {
      renderHook(() => useAuth());
    } catch (e) {
      error = e;
    }
    expect(error).toEqual(Error("useAuth must be used within AuthProvider"));
  });
});
