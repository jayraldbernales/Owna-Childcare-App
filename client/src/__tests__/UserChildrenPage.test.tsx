import { render, screen, fireEvent } from "@testing-library/react";
import UserChildrenPage from "../components/owna/User/UserChildrenPage";
import * as useUserChildrenHook from "../hooks/useUserChildren";

jest.mock("../components/owna/User/children/ChildModal", () => () => (
  <div>ChildModal</div>
));
jest.mock("../components/owna/User/children/confirmDeleteModal", () => () => (
  <div>ConfirmDeleteModal</div>
));
jest.mock("../components/owna/User/children/childrenTable", () => () => (
  <div>ChildrenTable</div>
));

describe("UserChildrenPage", () => {
  const mockUseUserChildren = jest.spyOn(
    useUserChildrenHook,
    "useUserChildren"
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders and shows add child button", () => {
    mockUseUserChildren.mockReturnValue({
      children: [],
      isLoading: false,
      loadingAction: null,
      editingId: null,
      editForm: {},
      createForm: { firstname: "", lastname: "", gender: "", dateOfBirth: "" },
      setCreateForm: jest.fn(),
      setEditForm: jest.fn(),
      setEditingId: jest.fn(),
      handleCreate: jest.fn(),
      handleEdit: jest.fn(),
      handleSave: jest.fn(),
      handleDelete: jest.fn(),
      fetchChildren: jest.fn(),
    });

    render(<UserChildrenPage />);

    expect(screen.getByText("My Children")).toBeInTheDocument();
    expect(screen.getByText("Add Child")).toBeInTheDocument();
  });

  it("opens ChildModal when Add Child button is clicked", () => {
    mockUseUserChildren.mockReturnValue({
      children: [],
      isLoading: false,
      loadingAction: null,
      editingId: null,
      editForm: {},
      createForm: { firstname: "", lastname: "", gender: "", dateOfBirth: "" },
      setCreateForm: jest.fn(),
      setEditForm: jest.fn(),
      setEditingId: jest.fn(),
      handleCreate: jest.fn(),
      handleEdit: jest.fn(),
      handleSave: jest.fn(),
      handleDelete: jest.fn(),
      fetchChildren: jest.fn(),
    });

    render(<UserChildrenPage />);

    fireEvent.click(screen.getByText("Add Child"));

    expect(screen.getByText("ChildModal")).toBeInTheDocument();
  });
});
