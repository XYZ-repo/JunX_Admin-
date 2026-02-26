import React from "react";

export default function Radio({
  label,
  checked = false,
  onChange,
  disabled = false,
  name,
  value,
  className = "",
  id,
  ...props
}) {
  const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex items-center">
        <input
          type="radio"
          id={radioId}
          name={name}
          value={value}
          checked={checked}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className="sr-only peer"
          {...props}
        />
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${
              checked
                ? "border-brand-primary"
                : "border-brand-secondary/30 hover:border-brand-primary/50"
            }
            peer-focus-visible:ring-2 peer-focus-visible:ring-brand-primary peer-focus-visible:ring-offset-2`}
          onClick={() => !disabled && onChange?.(value)}
          role="presentation"
        >
          {checked && (
            <div className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
          )}
        </div>
      </div>
      {label && (
        <label
          htmlFor={radioId}
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

export function RadioGroup({
  label,
  options = [],
  value,
  onChange,
  name,
  error,
  orientation = "vertical",
  className = "",
}) {
  const groupName =
    name || `radio-group-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={className} role="radiogroup" aria-label={label}>
      {label && <p className="label mb-2">{label}</p>}
      <div
        className={`${
          orientation === "horizontal" ? "flex flex-wrap gap-4" : "space-y-2"
        }`}
      >
        {options.map((option) => (
          <Radio
            key={option.value}
            name={groupName}
            value={option.value}
            label={option.label}
            checked={value === option.value}
            onChange={onChange}
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
