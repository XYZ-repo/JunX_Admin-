import React from "react";

const variantStyles = {
  primary: { backgroundColor: "rgba(248, 133, 26, 0.15)", color: "#f8851a" },
  secondary: { backgroundColor: "rgba(29, 61, 100, 0.15)", color: "#1D3D64" },
  outline: {
    backgroundColor: "transparent",
    color: "#1D3D64",
    border: "1px solid rgba(29, 61, 100, 0.2)",
  },
  outlinePrimary: {
    backgroundColor: "transparent",
    color: "#f8851a",
    border: "1px solid rgba(248, 133, 26, 0.3)",
  },
};

const sizes = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-0.5 text-xs",
  lg: "px-3 py-1 text-sm",
};

export default function Badge({
  children,
  variant = "primary",
  size = "md",
  dot = false,
  removable = false,
  onRemove,
  className = "",
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizes[size]} ${className}`}
      style={variantStyles[variant]}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{
            backgroundColor: variant === "primary" ? "#f8851a" : "#1D3D64",
          }}
          aria-hidden="true"
        />
      )}
      {children}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 -mr-1 p-0.5 rounded-full hover:bg-black/10 transition-colors"
          aria-label="Remove"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
}

export function Tag({ children, color, onRemove, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-brand-secondary/10 text-brand-secondary ${className}`}
      style={color ? { backgroundColor: `${color}20`, color } : undefined}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="p-0.5 rounded hover:bg-black/10 transition-colors"
          aria-label="Remove tag"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
}

export function StatusBadge({ status, className = "" }) {
  const statusConfig = {
    active: { label: "Active", variant: "primary", dot: true },
    inactive: { label: "Inactive", variant: "secondary", dot: true },
    pending: { label: "Pending", variant: "outline", dot: true },
    completed: { label: "Completed", variant: "secondary", dot: true },
    cancelled: { label: "Cancelled", variant: "outline", dot: true },
  };

  const config = statusConfig[status] || {
    label: status,
    variant: "outline",
    dot: false,
  };

  return (
    <Badge variant={config.variant} dot={config.dot} className={className}>
      {config.label}
    </Badge>
  );
}

export function CountBadge({ count, max = 99, className = "" }) {
  const displayCount = count > max ? `${max}+` : count;

  return (
    <span
      className={`inline-flex items-center justify-center  min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold bg-brand-primary text-red-400 ${className}`}
    >
      {displayCount}
    </span>
  );
}
