import React, { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      type = "text",
      className = "",
      inputClassName = "",
      required = false,
      disabled = false,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className={`block text-sm font-medium mb-1.5 ${
              error ? "text-red-600" : "text-[#1D3D64]"
            }`}
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <span
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                error ? "text-red-500" : "text-[#1D3D64]/50"
              }`}
              aria-hidden="true"
            >
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            disabled={disabled}
            required={required}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            className={`
              w-full px-3.5 py-2.5 bg-white rounded-lg border text-sm
              ${error ? "text-red-600" : "text-[#1D3D64]"}
              ${leftIcon ? "pl-10" : ""}
              ${rightIcon || isPassword ? "pr-10" : ""}
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
              ${
                error
                  ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/40"
                  : "border-[#1D3D64]/20 focus:border-[#f8851a] focus:ring-2 focus:ring-[#f8851a]/50"
              }
              focus:outline-none transition-colors
              ${inputClassName}
            `}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors p-1 ${
                error
                  ? "text-red-500 hover:text-red-600"
                  : "text-[#1D3D64]/50 hover:text-[#1D3D64]"
              }`}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}

          {rightIcon && !isPassword && (
            <span
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                error ? "text-red-500" : "text-[#1D3D64]/50"
              }`}
              aria-hidden="true"
            >
              {rightIcon}
            </span>
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="mt-1.5 text-sm text-[#1D3D64]/60"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;

export const Textarea = forwardRef(
  (
    {
      label,
      error,
      helperText,
      className = "",
      rows = 4,
      required = false,
      disabled = false,
      id,
      ...props
    },
    ref
  ) => {
    const textareaId =
      id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label
            htmlFor={textareaId}
            className={`block text-sm font-medium mb-1.5 ${
              error ? "text-red-600" : "text-[#1D3D64]"
            }`}
          >
            {label}
            {required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          required={required}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error
              ? `${textareaId}-error`
              : helperText
              ? `${textareaId}-helper`
              : undefined
          }
          className={`
            w-full px-3.5 py-2.5 bg-white rounded-lg border text-sm
            min-h-[100px] resize-y
            ${error ? "text-red-600" : "text-[#1D3D64]"}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/40"
                : "border-[#1D3D64]/20 focus:border-[#f8851a] focus:ring-2 focus:ring-[#f8851a]/50"
            }
            focus:outline-none transition-colors
          `}
          {...props}
        />

        {error && (
          <p
            id={`${textareaId}-error`}
            className="mt-1.5 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p
            id={`${textareaId}-helper`}
            className="mt-1.5 text-sm text-[#1D3D64]/60"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
