import React, { useState } from "react";
import { signInSchema, type SignInForm } from "../lib/formschema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../assets/img/logo-login.png";
import { useForm } from "react-hook-form";
import { useAuth } from "../lib/context";
import { signIn } from "../lib/api";
import { toast } from "sonner";

const SignIn: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInForm) => {
    setLoading(true);
    try {
      const res = await signIn(data);

      const { user, token } = res.data;

      login(user, token);

      toast.success("Login successful!");
      setLoading(false);

      if (user.role === "admin") navigate("/admin");
      else if (user.role === "moderator") navigate("/moderator");
      else navigate("/user");
    } catch (err: any) {
      setLoading(false);
      toast.error(
        err.response?.data?.error || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="w-full max-w-sm space-y-6 p-6 rounded text-center">
        <img
          src={logo}
          alt="OWNA Logo"
          className="mx-auto w-50"
          loading="lazy"
        />

        <div>
          <h2 className="text-2xl text-gray-600 mt-4">Welcome to OWNA</h2>
          <p className="text-gray-600 text-lg">Login below</p>
        </div>

        <form
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-2 focus:border-[var(--primary)]"
            autoComplete="email"
            disabled={loading}
          />
          {errors.email && (
            <p className="text-red-500 text-xs text-left mt-1">
              {errors.email.message}
            </p>
          )}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-2 focus:border-[var(--primary)] pr-10 text-gray-600"
              autoComplete="current-password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs text-left mt-1">
              {errors.password.message}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-[var(--primary)] text-white py-2 rounded hover:opacity-90 transition-opacity"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-sm text-blue-500 mt-3">
          <Link to="/" className="hover:underline">
            OWNA Homepage
          </Link>
          <span> | </span>
          <Link to="/forgot-password" className="hover:underline">
            Forgot your Password?
          </Link>
        </div>

        <div className="text-sm text-gray-500 mt-4">
          <p>© 2025 OWNA Corp Pty Ltd - ACN 613387474</p>
          <p>Version 1.22.202409051221</p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
