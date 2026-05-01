import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface PasswordFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  name,
  value,
  onChange,
  error,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label className="text-sm text-gray-600 font-medium block mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-2.5 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-md text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]`}
          aria-invalid={error ? "true" : undefined}
          aria-label={label}
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute inset-y-0 right-3 flex items-center"
          aria-label={visible ? "Hide password" : "Show password"}
          data-testid="toggle-password"
        >
          {visible ? (
            <FiEyeOff className="text-gray-400" data-testid="eye-off-icon" />
          ) : (
            <FiEye className="text-gray-400" data-testid="eye-icon" />
          )}
        </button>
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default PasswordField;
