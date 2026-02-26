import React from "react";

export default function Checkbox({
  label,
  checked = false,
  onChange,
  disabled = false,
  error,
  className = "",
  id,
  ...props
}) {
  const checkboxId =
    id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="relative flex items-center">
        <input
          type="checkbox"
          id={checkboxId}
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
          aria-invalid={error ? "true" : "false"}
          {...props}
        />
        <div
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${
              checked
                ? "bg-brand-primary border-brand-primary"
                : "border-brand-secondary/30 hover:border-brand-primary/50"
            }
            ${error ? "border-brand-primary" : ""}
            peer-focus-visible:ring-2 peer-focus-visible:ring-brand-primary peer-focus-visible:ring-offset-2`}
          onClick={() => !disabled && onChange?.(!checked)}
          role="presentation"
        >
          {checked && (
            <svg
              className="w-3.5 h-3.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
      {label && (
        <label
          htmlFor={checkboxId}
          className={`text-sm text-brand-secondary cursor-pointer select-none ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {label}
        </label>
      )}
    </div>
  );
}

export function CheckboxGroup({
  label,
  options = [],
  value = [],
  onChange,
  error,
  className = "",
}) {
  const toggleOption = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange?.(newValue);
  };

  return (
    <div className={className}>
      {label && <p className="label mb-2">{label}</p>}
      <div className="space-y-2">
        {options.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            checked={value.includes(option.value)}
            onChange={() => toggleOption(option.value)}
            disabled={option.disabled}
          />
        ))}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-brand-primary" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
