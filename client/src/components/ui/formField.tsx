import React from "react";
import { FiEdit2 } from "react-icons/fi";

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editable: boolean;
  error?: string;
  toggleEdit?: () => void;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  editable,
  error,
  toggleEdit,
}) => {
  return (
    <div className="relative">
      <label className="text-sm text-gray-600 font-medium block mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          id={name}
          name={name}
          value={value}
          readOnly={!editable}
          onChange={onChange}
          className={`w-full px-4 py-2.5 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
            !editable
              ? "bg-gray-50 text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
              : ""
          }`}
          aria-invalid={error ? "true" : undefined}
          aria-label={label}
        />
        {toggleEdit && (
          <button
            type="button"
            onClick={toggleEdit}
            aria-label={`Edit ${label}`}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-[var(--primary)]"
          >
            <FiEdit2 />
          </button>
        )}
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default FormField;
