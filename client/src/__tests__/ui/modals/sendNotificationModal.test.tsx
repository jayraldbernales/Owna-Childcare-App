import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SendNotificationModal from "../../../components/ui/modals/sendNotificationModal";
import API from "../../../lib/axios";
import { toast } from "sonner";

jest.mock("../../../lib/axios");
jest.mock("sonner");

describe("SendNotificationModal", () => {
  const mockOnClose = jest.fn();

  const parentsMock = [
    { id: 1, firstname: "John", lastname: "Doe" },
    { id: 2, firstname: "Jane", lastname: "Smith" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <SendNotificationModal isOpen={false} onClose={mockOnClose} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders and fetches parents when opened", async () => {
    (API.get as jest.Mock).mockResolvedValue({ data: parentsMock });

    render(<SendNotificationModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText("Send Notification")).toBeInTheDocument();

    await waitFor(() => {
      expect(API.get).toHaveBeenCalledWith("/api/v1/user?role=user");
    });

    fireEvent.click(screen.getByText("Select"));

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
  });

  it("filters parents based on search input", async () => {
    (API.get as jest.Mock).mockResolvedValue({ data: parentsMock });

    render(<SendNotificationModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText("Select"));

    const searchInput = screen.getByPlaceholderText("Search parents...");

    fireEvent.change(searchInput, { target: { value: "Jane" } });

    await waitFor(() => {
      expect(screen.queryByText("John Doe")).toBeNull();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
  });

  it("selects and unselects parents", async () => {
    (API.get as jest.Mock).mockResolvedValue({ data: parentsMock });

    render(<SendNotificationModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText("Select"));

    const parentCheckboxes = await screen.findAllByRole("checkbox");
    fireEvent.click(parentCheckboxes[0]);
    fireEvent.click(parentCheckboxes[1]);

    expect(parentCheckboxes[0]).toBeChecked();
    expect(parentCheckboxes[1]).toBeChecked();

    fireEvent.click(parentCheckboxes[0]);

    expect(parentCheckboxes[0]).not.toBeChecked();
    expect(parentCheckboxes[1]).toBeChecked();
  });

  it("shows error if message is empty when sending", async () => {
    (API.get as jest.Mock).mockResolvedValue({ data: parentsMock });

    render(<SendNotificationModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText("Select"));

    const parentCheckboxes = await screen.findAllByRole("checkbox");
    fireEvent.click(parentCheckboxes[0]);

    fireEvent.click(screen.getByRole("button", { name: "Send Notification" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Message cannot be empty");
    });
  });

  it("shows error if no parents selected when sending", async () => {
    (API.get as jest.Mock).mockResolvedValue({ data: parentsMock });

    render(<SendNotificationModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.change(
      screen.getByPlaceholderText("Type your notification message here..."),
      {
        target: { value: "Hello parents" },
      }
    );

    const sendButton = await waitFor(() =>
      screen.getByRole("button", { name: "Send Notification" })
    );

    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Please select at least one parent"
      );
    });
  });

  it("sends notification successfully", async () => {
    (API.get as jest.Mock).mockResolvedValue({ data: parentsMock });
    (API.post as jest.Mock).mockResolvedValue({});

    render(<SendNotificationModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText("Select"));

    const parentCheckboxes = await screen.findAllByRole("checkbox");
    fireEvent.click(parentCheckboxes[0]);

    fireEvent.change(
      screen.getByPlaceholderText("Type your notification message here..."),
      {
        target: { value: "Hello parents" },
      }
    );

    fireEvent.click(screen.getByRole("button", { name: "Send Notification" }));

    await waitFor(() => {
      expect(API.post).toHaveBeenCalledWith("/api/v1/notifications/send", {
        parentIds: [1],
        childId: null,
        message: "Hello parents",
      });
      expect(toast.success).toHaveBeenCalledWith(
        "Notification sent successfully"
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("shows error on send failure", async () => {
    (API.get as jest.Mock).mockResolvedValue({ data: parentsMock });
    (API.post as jest.Mock).mockRejectedValue(new Error("Failed"));

    render(<SendNotificationModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText("Select"));

    const parentCheckboxes = await screen.findAllByRole("checkbox");
    fireEvent.click(parentCheckboxes[0]);

    fireEvent.change(
      screen.getByPlaceholderText("Type your notification message here..."),
      {
        target: { value: "Hello parents" },
      }
    );

    fireEvent.click(screen.getByRole("button", { name: "Send Notification" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to send notification");
    });
  });
});
