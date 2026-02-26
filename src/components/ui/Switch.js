import React from "react";

export default function Switch({
  label,
  checked = false,
  onChange,
  disabled = false,
  size = "md",
  className = "",
  id,
  ...props
}) {
  const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

  const sizes = {
    sm: { track: "w-8 h-4", thumb: "w-3 h-3", translate: "translate-x-4" },
    md: { track: "w-11 h-6", thumb: "w-5 h-5", translate: "translate-x-5" },
    lg: { track: "w-14 h-7", thumb: "w-6 h-6", translate: "translate-x-7" },
  };

  const sizeConfig = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        type="button"
        role="switch"
        id={switchId}
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange?.(!checked)}
        className={`relative inline-flex shrink-0 rounded-full transition-colors duration-200 focus:outline-none ${sizeConfig.track}`}
        style={{
          backgroundColor: checked ? "#f8851a" : "rgba(29, 61, 100, 0.2)",
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
        {...props}
      >
        <span
          className={`pointer-events-none inline-block rounded-full bg-white shadow-sm transform transition-transform duration-200
            ${sizeConfig.thumb}
            ${checked ? sizeConfig.translate : "translate-x-0.5"}
            ${size === "sm" ? "mt-0.5" : "mt-0.5"}`}
        />
      </button>
      {label && (
        <label
          htmlFor={switchId}
          className={`text-sm cursor-pointer select-none ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          style={{ color: "#1D3D64" }}
        >
          {label}
        </label>
      )}
    </div>
  );
}
