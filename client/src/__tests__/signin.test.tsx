import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import SignIn from "../pages/SignIn";
import { signIn } from "../lib/api";
import { toast } from "sonner";
import { AuthProvider } from "../lib/context";

// Mock dependencies
jest.mock("../lib/api");
jest.mock("sonner");

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("SignIn", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithAuth = (component: React.ReactNode) => {
    return render(
      <AuthProvider>
        <MemoryRouter>{component}</MemoryRouter>
      </AuthProvider>
    );
  };

  it("renders the login form", () => {
    renderWithAuth(<SignIn />);

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  it("submits the form with valid data and navigates", async () => {
    const mockUser = { role: "admin" };
    const mockToken = "test-token";

    (signIn as jest.Mock).mockResolvedValue({
      data: { user: mockUser, token: mockToken },
    });

    renderWithAuth(<SignIn />);

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Email"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "password123" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Login" }));
    });

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      expect(toast.success).toHaveBeenCalledWith("Login successful!");
      expect(mockNavigate).toHaveBeenCalledWith("/admin");
    });
  });

  it("shows error on failed login", async () => {
    (signIn as jest.Mock).mockRejectedValue({
      response: { data: { error: "Invalid credentials" } },
    });

    renderWithAuth(<SignIn />);

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Email"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "wrongpass" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Login" }));
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid credentials");
    });
  });

  it("disables button during submission", async () => {
    // Create a promise we can resolve later
    let resolvePromise: (value: unknown) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    (signIn as jest.Mock).mockImplementation(() => promise);

    renderWithAuth(<SignIn />);

    const loginButton = screen.getByRole("button", { name: "Login" });

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Email"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "password123" },
      });
      fireEvent.click(loginButton);
    });

    // Button should be disabled during submission
    expect(loginButton).toBeDisabled();

    // Resolve the promise to complete the test
    await act(async () => {
      resolvePromise({
        data: { user: { role: "user" }, token: "test-token" },
      });
    });

    // Button should be enabled again
    expect(loginButton).toBeEnabled();
  });
});
