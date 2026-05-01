import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChildrenTable from "../components/owna/User/children/childrenTable";

const childrenMock = [
  {
    id: 1,
    firstname: "John",
    lastname: "Doe",
    gender: "Male",
    dateOfBirth: "2010-01-01T00:00:00.000Z",
    age: 13,
    linkCode: "ABC123",
  },
  {
    id: 2,
    firstname: "Jane",
    lastname: "Smith",
    gender: "Female",
    dateOfBirth: "2012-05-15T00:00:00.000Z",
    age: 11,
  },
];

describe("ChildrenTable", () => {
  const mockHandleInputChange = jest.fn();
  const mockHandleEdit = jest.fn();
  const mockHandleSave = jest.fn();
  const mockSetEditingId = jest.fn();
  const mockSetConfirmDeleteId = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders children data", () => {
    render(
      <ChildrenTable
        children={childrenMock}
        editForm={{}}
        editingId={null}
        loadingAction={null}
        handleInputChange={mockHandleInputChange}
        handleEdit={mockHandleEdit}
        handleSave={mockHandleSave}
        setEditingId={mockSetEditingId}
        setConfirmDeleteId={mockSetConfirmDeleteId}
      />
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("shows 'No children found' when children list is empty", () => {
    render(
      <ChildrenTable
        children={[]}
        editForm={{}}
        editingId={null}
        loadingAction={null}
        handleInputChange={mockHandleInputChange}
        handleEdit={mockHandleEdit}
        handleSave={mockHandleSave}
        setEditingId={mockSetEditingId}
        setConfirmDeleteId={mockSetConfirmDeleteId}
      />
    );

    expect(screen.getByText("No children found")).toBeInTheDocument();
  });

  it("calls handleEdit when edit button is clicked", () => {
    render(
      <ChildrenTable
        children={childrenMock}
        editForm={{}}
        editingId={null}
        loadingAction={null}
        handleInputChange={mockHandleInputChange}
        handleEdit={mockHandleEdit}
        handleSave={mockHandleSave}
        setEditingId={mockSetEditingId}
        setConfirmDeleteId={mockSetConfirmDeleteId}
      />
    );

    fireEvent.click(screen.getAllByTitle("Edit")[0]);
    expect(mockHandleEdit).toHaveBeenCalledWith(1);
  });

  it("calls setConfirmDeleteId when delete button is clicked", () => {
    render(
      <ChildrenTable
        children={childrenMock}
        editForm={{}}
        editingId={null}
        loadingAction={null}
        handleInputChange={mockHandleInputChange}
        handleEdit={mockHandleEdit}
        handleSave={mockHandleSave}
        setEditingId={mockSetEditingId}
        setConfirmDeleteId={mockSetConfirmDeleteId}
      />
    );

    fireEvent.click(screen.getAllByTitle("Delete")[0]);
    expect(mockSetConfirmDeleteId).toHaveBeenCalledWith(1);
  });

  it("calls handleSave when save button is clicked", () => {
    render(
      <ChildrenTable
        children={childrenMock}
        editForm={{
          firstname: "John",
          lastname: "Doe",
          gender: "Male",
          dateOfBirth: "2010-01-01",
        }}
        editingId={1}
        loadingAction={null}
        handleInputChange={mockHandleInputChange}
        handleEdit={mockHandleEdit}
        handleSave={mockHandleSave}
        setEditingId={mockSetEditingId}
        setConfirmDeleteId={mockSetConfirmDeleteId}
      />
    );

    fireEvent.click(screen.getByText("Save"));
    expect(mockHandleSave).toHaveBeenCalledWith(1);
  });

  it("calls setEditingId to cancel editing", () => {
    render(
      <ChildrenTable
        children={childrenMock}
        editForm={{
          firstname: "John",
          lastname: "Doe",
          gender: "Male",
          dateOfBirth: "2010-01-01",
        }}
        editingId={1}
        loadingAction={null}
        handleInputChange={mockHandleInputChange}
        handleEdit={mockHandleEdit}
        handleSave={mockHandleSave}
        setEditingId={mockSetEditingId}
        setConfirmDeleteId={mockSetConfirmDeleteId}
      />
    );

    fireEvent.click(screen.getByText("Cancel"));
    expect(mockSetEditingId).toHaveBeenCalledWith(null);
  });
});
