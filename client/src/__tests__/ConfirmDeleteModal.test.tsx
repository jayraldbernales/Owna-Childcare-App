import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ConfirmDeleteModal from "../components/owna/User/children/confirmDeleteModal";

describe("ConfirmDeleteModal", () => {
  const mockHandleDelete = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not render when confirmDeleteId is null", () => {
    const { container } = render(
      <ConfirmDeleteModal
        confirmDeleteId={null}
        handleDelete={mockHandleDelete}
        loadingAction={null}
        onCancel={mockOnCancel}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders and calls handleDelete and onCancel", () => {
    render(
      <ConfirmDeleteModal
        confirmDeleteId={1}
        handleDelete={mockHandleDelete}
        loadingAction={null}
        onCancel={mockOnCancel}
      />
    );

    expect(
      screen.getByText("Are you sure you want to delete this child?")
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Delete"));
    expect(mockHandleDelete).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("disables Delete button when loadingAction is 'delete'", () => {
    render(
      <ConfirmDeleteModal
        confirmDeleteId={1}
        handleDelete={mockHandleDelete}
        loadingAction="delete"
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText("Deleting...")).toBeDisabled();
  });
});
