import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "../lib/axios";

export interface Child {
  id: number;
  firstname: string;
  lastname: string;
  gender: string;
  dateOfBirth: string;
  age?: number;
}

export const useUserChildren = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState<
    null | "delete" | "save" | "add"
  >(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Child>>({});
  const [createForm, setCreateForm] = useState<Omit<Child, "id" | "age">>({
    firstname: "",
    lastname: "",
    gender: "Male",
    dateOfBirth: "",
  });

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/api/children");
      setChildren(res.data);
    } catch {
      toast.error("Failed to fetch children");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    setLoadingAction("add");
    try {
      const age = calculateAge(createForm.dateOfBirth);
      await api.post("/api/children", {
        ...createForm,
        age,
      });
      await fetchChildren();
      resetCreateForm();
      toast.success("Child added");
    } catch {
      toast.error("Failed to add child");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
    const child = children.find((c) => c.id === id);
    setEditForm(child || {});
  };

  const handleSave = async (id: number) => {
    setLoadingAction("save");
    try {
      const age = calculateAge(editForm.dateOfBirth || "");
      await api.put(`/api/children/${id}`, {
        ...editForm,
        age,
      });
      await fetchChildren();
      setEditingId(null);
      toast.success("Child updated");
    } catch {
      toast.error("Failed to update child");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDelete = async (id: number) => {
    setLoadingAction("delete");
    try {
      await api.delete(`/api/children/${id}`);
      setChildren((prev) => prev.filter((c) => c.id !== id));
      toast.success("Child deleted");
    } catch {
      toast.error("Failed to delete child");
    } finally {
      setLoadingAction(null);
    }
  };

  const resetCreateForm = () => {
    setCreateForm({
      firstname: "",
      lastname: "",
      gender: "Male",
      dateOfBirth: "",
    });
  };

  const calculateAge = (dateOfBirth: string): number => {
    const dob = new Date(dateOfBirth);
    const ageDifMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return {
    children,
    isLoading,
    loadingAction,
    editingId,
    editForm,
    createForm,
    setCreateForm,
    setEditForm,
    setEditingId,
    fetchChildren,
    handleCreate,
    handleEdit,
    handleSave,
    handleDelete,
  };
};
