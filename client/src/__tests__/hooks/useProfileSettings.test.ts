import { renderHook, act, waitFor } from "@testing-library/react";
import { useProfileSettings } from "../../hooks/useProfileSettings";
import * as api from "../../lib/api";
import { toast } from "sonner";

jest.mock("../../lib/api");
jest.mock("sonner");

describe("useProfileSettings hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch profile data on mount", async () => {
    const mockData = {
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@example.com",
      role: "user",
    };
    (api.getMyProfile as jest.Mock).mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useProfileSettings());

    await waitFor(() => {
      expect(result.current.profile.firstname).toBe("John");
    });

    expect(api.getMyProfile).toHaveBeenCalled();
    expect(result.current.profile.lastname).toBe("Doe");
    expect(result.current.profile.email).toBe("john.doe@example.com");
  });

  it("should handle input changes", async () => {
    (api.getMyProfile as jest.Mock).mockResolvedValue({ data: {} });

    const { result } = renderHook(() => useProfileSettings());

    await waitFor(() => {
      expect(result.current.profile).toBeDefined();
    });

    act(() => {
      result.current.handleChange({
        target: { name: "firstname", value: "Jane" },
      } as any);
    });

    expect(result.current.profile.firstname).toBe("Jane");
  });

  it("should toggle editable fields", async () => {
    (api.getMyProfile as jest.Mock).mockResolvedValue({ data: {} });

    const { result } = renderHook(() => useProfileSettings());

    await waitFor(() => {
      expect(result.current.profile).toBeDefined();
    });

    act(() => {
      result.current.toggleEdit("firstname");
    });
    expect(result.current.editableFields.firstname).toBe(true);

    act(() => {
      result.current.toggleEdit("firstname");
    });
    expect(result.current.editableFields.firstname).toBe(false);
  });

  it("should submit profile update and show success toast", async () => {
    (api.getMyProfile as jest.Mock).mockResolvedValue({ data: {} });
    (api.updateProfile as jest.Mock).mockResolvedValue({});
    (api.updatePassword as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() => useProfileSettings());

    await waitFor(() => {
      expect(result.current.profile).toBeDefined();
    });

    act(() => {
      result.current.toggleEdit("firstname");
      result.current.handleChange({
        target: { name: "firstname", value: "Jane" },
      } as any);
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as any);
    });

    expect(api.updateProfile).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Profile updated successfully.");
  });

  it("should handle password mismatch error", async () => {
    (api.getMyProfile as jest.Mock).mockResolvedValue({ data: {} });

    const { result } = renderHook(() => useProfileSettings());

    await waitFor(() => {
      expect(result.current.profile).toBeDefined();
    });

    act(() => {
      result.current.handleChange({
        target: { name: "currentPassword", value: "oldpass" },
      } as any);
      result.current.handleChange({
        target: { name: "newPassword", value: "newpass" },
      } as any);
      result.current.handleChange({
        target: { name: "confirmPassword", value: "wrongpass" },
      } as any);
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as any);
    });

    expect(result.current.errors.confirmPassword).toBe(
      "Passwords do not match"
    );
    expect(api.updatePassword).not.toHaveBeenCalled();
  });

  it("should submit password update and show success toast", async () => {
    (api.getMyProfile as jest.Mock).mockResolvedValue({ data: {} });
    (api.updatePassword as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() => useProfileSettings());

    await waitFor(() => {
      expect(result.current.profile).toBeDefined();
    });

    act(() => {
      result.current.handleChange({
        target: { name: "currentPassword", value: "oldpass" },
      } as any);
      result.current.handleChange({
        target: { name: "newPassword", value: "newpass" },
      } as any);
      result.current.handleChange({
        target: { name: "confirmPassword", value: "newpass" },
      } as any);
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as any);
    });

    expect(api.updatePassword).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith(
      "Password changed successfully."
    );
  });

  it("should handle API errors and show error toast", async () => {
    (api.getMyProfile as jest.Mock).mockResolvedValue({ data: {} });
    (api.updateProfile as jest.Mock).mockRejectedValue({
      response: { data: { error: "Error" } },
    });

    const { result } = renderHook(() => useProfileSettings());

    await waitFor(() => {
      expect(result.current.profile).toBeDefined();
    });

    act(() => {
      result.current.toggleEdit("firstname");
      result.current.handleChange({
        target: { name: "firstname", value: "Jane" },
      } as any);
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as any);
    });

    expect(toast.error).toHaveBeenCalledWith("Error");
  });

  it("should handle failed profile fetch", async () => {
    (api.getMyProfile as jest.Mock).mockRejectedValue(
      new Error("Fetch failed")
    );

    renderHook(() => useProfileSettings());

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to load profile data.");
    });

    expect(api.getMyProfile).toHaveBeenCalled();
  });
});
