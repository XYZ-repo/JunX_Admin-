"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import useAuth from "../../../redux/hooks/useAuth";
import toast from "react-hot-toast";
import Link from "next/link";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const { getLogin } = useAuth();

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      await getLogin(
        data,
        (response) => {
          setLoading(false);
          const userData = response.data;

          // Redirect based on admin level
          if (
            userData.adminLevel === "admin" ||
            userData.adminLevel === "level_one"
          ) {
            router.push("/admin");
          } else if (userData.adminLevel === "level_two") {
            router.push("/admin");
          } else {
            toast.error("You don't have admin panel access");
          }
        },
        (error) => {
          setLoading(false);
          setError("root", {
            message:
              error?.response?.data?.message || "Invalid email or password",
          });
        },
      );
    } catch (error) {
      setLoading(false);
      setError("root", {
        message: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Left Side - Black with Logo */}
      <div className="w-[60%] bg-black flex items-center justify-center">
        <img
          src="/JunXyz_logo.jpg"
          alt="JunXyz Logo"
          className="w-48 h-auto object-contain"
        />
      </div>

      {/* Right Side - White Login Form */}
      <div className="w-[40%] bg-white flex items-center  justify-center">
        <div className="w-full   px-8">
          {/* Header */}
          <h1 className="text-[20px] leading-7 font-semibold text-center text-heading mb-2">
            Log in
          </h1>
          <p className="text-[14px] leading-5 text-subheading text-center mb-5">
            Welcome back! Securely access your account.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[14px] leading-5 text-[#444444] font-medium   mb-1.5">
                Email
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                  validate: (value) =>
                    value.endsWith("@junxyz.com") ||
                    "Must be a @junxyz.com email",
                })}
                placeholder="you@domain.com"
                className={`w-full px-3 py-2.5 border rounded-[8px] text-sm outline-none transition-all bg-white    text-[#BFBFBF]  text-[16px] leading-6 font-[400]  ${
                  errors.email ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[14px] leading-5 text-[#444444] font-medium   mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  placeholder="Enter your password"
                  className={`w-full px-3 py-2.5 border rounded-[8px] text-sm outline-none transition-all bg-white  text-[#BFBFBF]  text-[16px] leading-6 font-[400]    ${
                    errors.password ? "border-red-400" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-3 py-2.5 bg-[#EDEDED] rounded-[8px] font-medium text-[#BFBFBF] text-[16px] leading-6 
             disabled:opacity-60 disabled:cursor-not-allowed 
             hover:bg-[#000] hover:text-white transition-colors duration-200"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-4 w-4 mr-2 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-gray-500">
            Don't have an account?{" "}
            <a href="#" className="text-gray-700 font-medium hover:underline">
              Contact an administrator
            </a>
          </p>
          <p className="mt-6 text-center text-xs text-gray-500">
            <Link
              href="/admin"
              className="text-gray-700 font-medium hover:underline mr-2"
            >
              Home
            </Link>
            •
            <Link
              href="/verify-otp"
              className="text-gray-700 font-medium hover:underline mx-2"
            >
              OTP
            </Link>
            •
            <Link
              href="/new-password"
              className="text-gray-700 font-medium hover:underline mx-2"
            >
              New Password
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
