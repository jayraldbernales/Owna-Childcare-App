import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  className = "",
  ...props
}) => {
  const baseClass =
    variant === "primary"
      ? "bg-[var(--primary)] border-2 border-[var(--primary)] text-white px-8 py-3 rounded-full text-lg font-bold transition-colors hover:bg-[var(--background)] hover:text-[var(--primary)]"
      : "border-2 border-[var(--primary)] text-[var(--primary)] px-8 py-3 rounded-full text-lg font-bold transition-colors hover:bg-[var(--primary-hover)]";

  return (
    <button className={`${baseClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
