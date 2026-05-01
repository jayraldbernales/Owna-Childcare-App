import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChildModal from "../components/owna/User/children/ChildModal";
import { toast } from "sonner";
import * as api from "../lib/api";

jest.mock("sonner");
jest.mock("../lib/api");

describe("ChildModal", () => {
  const mockOnClose = jest.fn();
  const mockHandleCreateInputChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders Add tab by default and switches tabs", () => {
    render(
      <ChildModal
        onClose={mockOnClose}
        handleCreate={() => {}}
        loadingAction={null}
        createForm={{
          firstname: "",
          lastname: "",
          gender: "",
          dateOfBirth: "",
        }}
        handleCreateInputChange={mockHandleCreateInputChange}
      />
    );

    expect(screen.getByText("Add New Child")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Link"));
    expect(screen.getByText("Link Existing Child")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Add"));
    expect(screen.getByText("Add New Child")).toBeInTheDocument();
  });

  it("calls handleCreate on Add form submit", () => {
    const mockHandleCreateLocal = jest.fn();

    // Use valid form data since all fields are required
    render(
      <ChildModal
        onClose={mockOnClose}
        handleCreate={mockHandleCreateLocal}
        loadingAction={null}
        createForm={{
          firstname: "John",
          lastname: "Doe",
          gender: "Male",
          dateOfBirth: "2020-01-01",
        }}
        handleCreateInputChange={mockHandleCreateInputChange}
      />
    );

    fireEvent.click(screen.getByText("Add Child"));

    expect(mockHandleCreateLocal).toHaveBeenCalled();
  });

  it("handles linking child successfully", async () => {
    (api.linkChild as jest.Mock).mockResolvedValue({});

    render(
      <ChildModal
        onClose={mockOnClose}
        handleCreate={() => {}}
        loadingAction={null}
        createForm={{
          firstname: "",
          lastname: "",
          gender: "",
          dateOfBirth: "",
        }}
        handleCreateInputChange={mockHandleCreateInputChange}
      />
    );

    fireEvent.click(screen.getByText("Link"));

    const input = screen.getByPlaceholderText("Enter Link Code");
    fireEvent.change(input, { target: { value: "ABC123" } });

    fireEvent.click(screen.getByText("Link Child"));

    await waitFor(() => {
      expect(api.linkChild).toHaveBeenCalledWith("ABC123");
      expect(toast.success).toHaveBeenCalledWith(
        "Successfully linked to child"
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("handles linking child failure", async () => {
    (api.linkChild as jest.Mock).mockRejectedValue({
      response: { data: { error: "Error" } },
    });

    render(
      <ChildModal
        onClose={mockOnClose}
        handleCreate={() => {}}
        loadingAction={null}
        createForm={{
          firstname: "",
          lastname: "",
          gender: "",
          dateOfBirth: "",
        }}
        handleCreateInputChange={mockHandleCreateInputChange}
      />
    );

    fireEvent.click(screen.getByText("Link"));

    const input = screen.getByPlaceholderText("Enter Link Code");
    fireEvent.change(input, { target: { value: "ABC123" } });

    fireEvent.click(screen.getByText("Link Child"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error");
    });
  });
});
