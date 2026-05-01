import React from "react";
import FormField from "../../ui/formField";
import PasswordField from "../../ui/passwordField";
import { FiSave, FiLock } from "react-icons/fi";
import { useProfileSettings } from "../../../hooks/useProfileSettings";

const profileFields = [
  { name: "firstname", label: "First Name" },
  { name: "lastname", label: "Last Name" },
  { name: "email", label: "Email" },
] as const;

const UserSettingsForm: React.FC = () => {
  const {
    profile,
    editableFields,
    errors,
    handleChange,
    toggleEdit,
    handleSubmit,
  } = useProfileSettings();

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Profile Settings
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          {profileFields.map((field) => (
            <FormField
              key={field.name}
              label={field.label}
              name={field.name}
              value={profile[field.name]}
              editable={editableFields[field.name]}
              onChange={handleChange}
              error={errors[field.name]}
              toggleEdit={() => toggleEdit(field.name)}
            />
          ))}
        </div>

        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
            <FiLock className="mr-2" /> Change Password
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <PasswordField
              label="Current Password"
              name="currentPassword"
              value={profile.currentPassword}
              onChange={handleChange}
            />
            <PasswordField
              label="New Password"
              name="newPassword"
              value={profile.newPassword}
              onChange={handleChange}
            />
            <PasswordField
              label="Confirm Password"
              name="confirmPassword"
              value={profile.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            type="submit"
            className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-md flex items-center"
          >
            <FiSave className="mr-2" /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserSettingsForm;
