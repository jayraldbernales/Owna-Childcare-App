import { render, screen, fireEvent } from "@testing-library/react";
import FormField from "../../components/ui/formField";
import "@testing-library/jest-dom";

describe("FormField", () => {
  const mockOnChange = jest.fn();
  const mockToggleEdit = jest.fn();

  const baseProps = {
    label: "Test Field",
    name: "testField",
    value: "initial value",
    onChange: mockOnChange,
    editable: true,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders with label and value", () => {
    render(<FormField {...baseProps} />);
    const input = screen.getByLabelText(/test field/i);
    expect(input).toHaveValue("initial value");
  });

  it("handles input changes when editable", () => {
    render(<FormField {...baseProps} />);
    const input = screen.getByLabelText(/test field/i);
    fireEvent.change(input, { target: { value: "new value" } });
    expect(mockOnChange).toHaveBeenCalled();
  });

  it("disables input when not editable", () => {
    render(<FormField {...baseProps} editable={false} />);
    const input = screen.getByLabelText(/test field/i);
    expect(input).toHaveAttribute("readOnly");
    expect(input).toHaveClass("bg-gray-50");
  });

  it("shows edit button when toggleEdit provided", () => {
    render(<FormField {...baseProps} toggleEdit={mockToggleEdit} />);
    const button = screen.getByRole("button", { name: /edit test field/i });
    fireEvent.click(button);
    expect(mockToggleEdit).toHaveBeenCalled();
  });

  it("displays error state", () => {
    render(<FormField {...baseProps} error="Invalid input" />);
    expect(screen.getByText(/invalid input/i)).toBeInTheDocument();
    const input = screen.getByLabelText(/test field/i);
    expect(input).toHaveClass("border-red-500");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });
});
