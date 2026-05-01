import React, { useState } from "react";
import { signUpSchema, type SignUpForm } from "../lib/formschema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../assets/img/logo-login.png";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { signUp } from "../lib/api";
import { toast } from "sonner";
import axios from "axios";

const SignUp: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpForm) => {
    setLoading(true);
    try {
      await signUp(data);
      toast.success("Account created! You can now log in.");
      reset();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.error || "Signup failed.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="w-full max-w-sm space-y-6 p-6 rounded text-center">
        <img
          src={logo}
          alt="OWNA Logo"
          className="mx-auto w-45"
          loading="lazy"
        />

        <div>
          <h2 className="text-2xl text-gray-600 mt-4">Create an Account</h2>
          <p className="text-gray-600 text-lg">Sign up below</p>
        </div>

        <form
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="flex gap-2">
            <div className="w-1/2">
              <input
                type="text"
                placeholder="First Name"
                {...register("firstname")}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-2 focus:border-[var(--primary)] text-gray-600"
                autoComplete="given-name"
                disabled={loading}
              />
              {errors.firstname && (
                <p className="text-red-500 text-xs text-left mt-1">
                  {errors.firstname.message}
                </p>
              )}
            </div>
            <div className="w-1/2">
              <input
                type="text"
                placeholder="Last Name"
                {...register("lastname")}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-2 focus:border-[var(--primary)] text-gray-600"
                autoComplete="family-name"
                disabled={loading}
              />
              {errors.lastname && (
                <p className="text-red-500 text-xs text-left mt-1">
                  {errors.lastname.message}
                </p>
              )}
            </div>
          </div>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-2 focus:border-[var(--primary)] text-gray-600"
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
              autoComplete="new-password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
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

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              {...register("confirmPassword")}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-2 focus:border-[var(--primary)] pr-10 text-gray-600"
              autoComplete="new-password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs text-left mt-1">
              {errors.confirmPassword.message}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-[var(--primary)] text-white py-2 rounded hover:opacity-90 transition-opacity"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>

        <div className="text-sm text-blue-500 mt-3">
          <Link to="/" className="hover:underline">
            OWNA Homepage
          </Link>
          <span> | </span>
          <Link to="/signin" className="hover:underline">
            Log In
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

export default SignUp;
