import { render, screen, fireEvent } from "@testing-library/react";
import PasswordField from "../../components/ui/passwordField";
import "@testing-library/jest-dom";

describe("PasswordField", () => {
  const mockOnChange = jest.fn();

  const baseProps = {
    label: "Test Password",
    name: "testPassword",
    value: "",
    onChange: mockOnChange,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders with password type by default", () => {
    render(<PasswordField {...baseProps} />);
    const input = screen.getByLabelText(/test password/i);
    expect(input).toHaveAttribute("type", "password");
  });

  it("toggles password visibility", () => {
    render(<PasswordField {...baseProps} />);
    const toggleButton = screen.getByRole("button", {
      name: /show password/i,
    });

    const input = screen.getByLabelText(/test password/i);
    expect(input).toHaveAttribute("type", "password");
    expect(toggleButton).toHaveAttribute("aria-label", "Show password");

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute("type", "text");
    expect(toggleButton).toHaveAttribute("aria-label", "Hide password");

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute("type", "password");
    expect(toggleButton).toHaveAttribute("aria-label", "Show password");
  });

  it("handles input changes", () => {
    render(<PasswordField {...baseProps} />);
    const input = screen.getByLabelText(/test password/i);
    fireEvent.change(input, { target: { value: "newPass123" } });
    expect(mockOnChange).toHaveBeenCalled();
  });

  it("displays error state", () => {
    render(<PasswordField {...baseProps} error="Password too weak" />);
    expect(screen.getByText(/password too weak/i)).toBeInTheDocument();
    const input = screen.getByLabelText(/test password/i);
    expect(input).toHaveClass("border-red-500");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("maintains proper accessibility", () => {
    render(<PasswordField {...baseProps} />);
    const input = screen.getByLabelText(/test password/i);
    expect(input).toHaveAttribute("name", "testPassword");
    expect(input).toHaveAttribute("id", "testPassword");
    expect(input).not.toHaveAttribute("aria-invalid");
  });
});
