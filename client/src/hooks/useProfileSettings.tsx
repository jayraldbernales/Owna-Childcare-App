import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getMyProfile, updatePassword, updateProfile } from "../lib/api";

export const useProfileSettings = () => {
  const [profile, setProfile] = useState({
    firstname: "",
    lastname: "",
    email: "",
    role: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [editableFields, setEditableFields] = useState({
    firstname: false,
    lastname: false,
    email: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getMyProfile();
        setProfile((prev) => ({ ...prev, ...data }));
      } catch {
        toast.error("Failed to load profile data.");
      }
    };
    fetch();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const toggleEdit = (field: keyof typeof editableFields) => {
    setEditableFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Update profile
      if (Object.values(editableFields).includes(true)) {
        await updateProfile({
          firstname: profile.firstname,
          lastname: profile.lastname,
          email: profile.email,
        });
        toast.success("Profile updated successfully.");
      }

      // Update password
      if (
        profile.currentPassword ||
        profile.newPassword ||
        profile.confirmPassword
      ) {
        if (profile.newPassword !== profile.confirmPassword) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: "Passwords do not match",
          }));
          return;
        }

        await updatePassword({
          currentPassword: profile.currentPassword,
          newPassword: profile.newPassword,
        });

        toast.success("Password changed successfully.");
      }

      setProfile((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setEditableFields({ firstname: false, lastname: false, email: false });
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Something went wrong.");
    }
  };

  return {
    profile,
    editableFields,
    errors,
    handleChange,
    toggleEdit,
    handleSubmit,
  };
};
