import React from "react";

const variantStyles = {
  primary: { backgroundColor: "#f8851a", color: "white", border: "none" },
  secondary: { backgroundColor: "#1D3D64", color: "white", border: "none" },
  ghost: { backgroundColor: "transparent", color: "#1D3D64", border: "none" },
  outline: {
    backgroundColor: "transparent",
    color: "#1D3D64",
    border: "2px solid rgba(29, 61, 100, 0.2)",
  },
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  iconOnly = false,
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  onClick,
  ...props
}) {
  const sizeClasses = iconOnly ? "p-2.5" : sizes[size];

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus:outline-none ${sizeClasses} ${
        disabled || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
      style={variantStyles[variant]}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function IconButton({
  icon,
  label,
  variant = "ghost",
  size = "md",
  ...props
}) {
  return (
    <Button
      variant={variant}
      iconOnly
      aria-label={label}
      title={label}
      {...props}
    >
      {icon}
    </Button>
  );
}

export function ButtonGroup({ children, className = "" }) {
  return (
    <div
      className={`inline-flex rounded-lg overflow-hidden ${className}`}
      role="group"
    >
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          className: `${
            child.props.className || ""
          } rounded-none first:rounded-l-lg last:rounded-r-lg border-r border-white/20 last:border-r-0`,
        })
      )}
    </div>
  );
}
