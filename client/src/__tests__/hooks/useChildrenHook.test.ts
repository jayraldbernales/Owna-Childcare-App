import { renderHook, act, waitFor } from "@testing-library/react";
import { useUserChildren } from "../../hooks/useUserChildren";
import api from "../../lib/axios";
import { toast } from "sonner";

jest.mock("../../lib/axios");
jest.mock("sonner");

const mockApi = api as jest.Mocked<typeof api>;

describe("useUserChildren hook", () => {
  const mockChildren = [
    {
      id: 1,
      firstname: "John",
      lastname: "Doe",
      gender: "Male",
      dateOfBirth: "2015-01-01",
      age: 9,
    },
    {
      id: 2,
      firstname: "Jane",
      lastname: "Doe",
      gender: "Female",
      dateOfBirth: "2017-05-15",
      age: 7,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Date, "now").mockReturnValue(new Date("2024-01-01").getTime());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should fetch children on mount", async () => {
    mockApi.get.mockResolvedValue({ data: mockChildren });

    const { result } = renderHook(() => useUserChildren());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockApi.get).toHaveBeenCalledWith("/api/children");
    expect(result.current.children).toEqual(mockChildren);
  });

  it("should handle fetch children error", async () => {
    mockApi.get.mockRejectedValue(new Error("Fetch failed"));

    const { result } = renderHook(() => useUserChildren());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(toast.error).toHaveBeenCalledWith("Failed to fetch children");
    expect(result.current.children).toEqual([]);
  });

  it("should handle create child successfully", async () => {
    mockApi.get.mockResolvedValue({ data: [] });
    mockApi.post.mockResolvedValue({});
    mockApi.get
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({ data: mockChildren });

    const { result } = renderHook(() => useUserChildren());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setCreateForm({
        firstname: "Test",
        lastname: "Child",
        gender: "Male",
        dateOfBirth: "2020-01-01",
      });
    });

    await act(async () => {
      await result.current.handleCreate();
    });

    expect(mockApi.post).toHaveBeenCalledWith("/api/children", {
      firstname: "Test",
      lastname: "Child",
      gender: "Male",
      dateOfBirth: "2020-01-01",
      age: 4,
    });
    expect(toast.success).toHaveBeenCalledWith("Child added");
    expect(result.current.createForm).toEqual({
      firstname: "",
      lastname: "",
      gender: "Male",
      dateOfBirth: "",
    });
  });

  it("should handle create child error", async () => {
    mockApi.get.mockResolvedValue({ data: [] });
    mockApi.post.mockRejectedValue(new Error("Create failed"));

    const { result } = renderHook(() => useUserChildren());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setCreateForm({
        firstname: "Test",
        lastname: "Child",
        gender: "Male",
        dateOfBirth: "2020-01-01",
      });
    });

    await act(async () => {
      await result.current.handleCreate();
    });

    expect(toast.error).toHaveBeenCalledWith("Failed to add child");
    expect(result.current.loadingAction).toBe(null);
  });

  it("should handle edit child", async () => {
    mockApi.get.mockResolvedValue({ data: mockChildren });

    const { result } = renderHook(() => useUserChildren());

    await waitFor(() => {
      expect(result.current.children).toEqual(mockChildren);
    });

    act(() => {
      result.current.handleEdit(1);
    });

    expect(result.current.editingId).toBe(1);
    expect(result.current.editForm).toEqual(mockChildren[0]);
  });

  it("should handle save child successfully", async () => {
    mockApi.get.mockResolvedValue({ data: mockChildren });
    mockApi.put.mockResolvedValue({});
    mockApi.get
      .mockResolvedValueOnce({ data: mockChildren })
      .mockResolvedValueOnce({ data: mockChildren });

    const { result } = renderHook(() => useUserChildren());

    await waitFor(() => {
      expect(result.current.children).toEqual(mockChildren);
    });

    act(() => {
      result.current.handleEdit(1);
      result.current.setEditForm({
        ...mockChildren[0],
        firstname: "Updated",
      });
    });

    await act(async () => {
      await result.current.handleSave(1);
    });

    expect(mockApi.put).toHaveBeenCalledWith("/api/children/1", {
      ...mockChildren[0],
      firstname: "Updated",
      age: 9,
    });
    expect(toast.success).toHaveBeenCalledWith("Child updated");
    expect(result.current.editingId).toBe(null);
  });

  it("should handle save child error", async () => {
    mockApi.get.mockResolvedValue({ data: mockChildren });
    mockApi.put.mockRejectedValue(new Error("Save failed"));

    const { result } = renderHook(() => useUserChildren());

    await waitFor(() => {
      expect(result.current.children).toEqual(mockChildren);
    });

    act(() => {
      result.current.handleEdit(1);
      result.current.setEditForm({
        ...mockChildren[0],
        firstname: "Updated",
      });
    });

    await act(async () => {
      await result.current.handleSave(1);
    });

    expect(toast.error).toHaveBeenCalledWith("Failed to update child");
    expect(result.current.loadingAction).toBe(null);
  });

  it("should handle delete child successfully", async () => {
    mockApi.get.mockResolvedValue({ data: mockChildren });
    mockApi.delete.mockResolvedValue({});

    const { result } = renderHook(() => useUserChildren());

    await waitFor(() => {
      expect(result.current.children).toEqual(mockChildren);
    });

    await act(async () => {
      await result.current.handleDelete(1);
    });

    expect(mockApi.delete).toHaveBeenCalledWith("/api/children/1");
    expect(toast.success).toHaveBeenCalledWith("Child deleted");
    expect(result.current.children).toEqual([mockChildren[1]]);
  });

  it("should handle delete child error", async () => {
    mockApi.get.mockResolvedValue({ data: mockChildren });
    mockApi.delete.mockRejectedValue(new Error("Delete failed"));

    const { result } = renderHook(() => useUserChildren());

    await waitFor(() => {
      expect(result.current.children).toEqual(mockChildren);
    });

    await act(async () => {
      await result.current.handleDelete(1);
    });

    expect(toast.error).toHaveBeenCalledWith("Failed to delete child");
    expect(result.current.loadingAction).toBe(null);
    expect(result.current.children).toEqual(mockChildren);
  });

  it("should set loading actions correctly", async () => {
    mockApi.get.mockResolvedValue({ data: [] });

    let resolvePost: () => void;
    const postPromise = new Promise<void>((resolve) => {
      resolvePost = resolve;
    });
    mockApi.post.mockImplementation(() => postPromise);

    const { result } = renderHook(() => useUserChildren());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setCreateForm({
        firstname: "Test",
        lastname: "Child",
        gender: "Male",
        dateOfBirth: "2020-01-01",
      });
    });

    act(() => {
      result.current.handleCreate();
    });

    expect(result.current.loadingAction).toBe("add");

    act(() => {
      resolvePost();
    });

    await waitFor(() => {
      expect(result.current.loadingAction).toBe(null);
    });
  });

  it("should calculate age correctly", async () => {
    mockApi.get.mockResolvedValue({ data: [] });
    mockApi.post.mockResolvedValue({});
    mockApi.get
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({ data: [] });

    const { result } = renderHook(() => useUserChildren());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setCreateForm({
        firstname: "Test",
        lastname: "Child",
        gender: "Male",
        dateOfBirth: "2020-06-15",
      });
    });

    await act(async () => {
      await result.current.handleCreate();
    });

    expect(mockApi.post).toHaveBeenCalledWith("/api/children", {
      firstname: "Test",
      lastname: "Child",
      gender: "Male",
      dateOfBirth: "2020-06-15",
      age: 3,
    });
  });

  it("should handle editing non-existent child", async () => {
    mockApi.get.mockResolvedValue({ data: mockChildren });

    const { result } = renderHook(() => useUserChildren());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.handleEdit(999);
    });

    expect(result.current.editingId).toBe(999);
    expect(result.current.editForm).toEqual({});
  });

  it("should handle save with empty dateOfBirth", async () => {
    mockApi.get.mockResolvedValue({ data: mockChildren });
    mockApi.put.mockResolvedValue({});

    mockApi.get
      .mockResolvedValueOnce({ data: mockChildren })
      .mockResolvedValueOnce({ data: mockChildren });

    const { result } = renderHook(() => useUserChildren());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.handleEdit(1);
      result.current.setEditForm({
        ...mockChildren[0],
        dateOfBirth: "",
      });
    });

    await act(async () => {
      await result.current.handleSave(1);
    });

    expect(mockApi.put).toHaveBeenCalledWith("/api/children/1", {
      ...mockChildren[0],
      dateOfBirth: "",
      age: NaN,
    });
  });
});
