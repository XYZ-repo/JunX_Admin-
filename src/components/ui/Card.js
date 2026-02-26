import React from "react";

export default function Card({
  children,
  className = "",
  padding = "md",
  hover = true,
  ...props
}) {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`bg-white rounded-xl ${paddingClasses[padding]} ${
        hover ? "hover:shadow-md" : ""
      } transition-shadow ${className}`}
      style={{ border: "1px solid rgba(29, 61, 100, 0.1)" }}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return (
    <div
      className={`pb-4 ${className}`}
      style={{ borderBottom: "1px solid rgba(29, 61, 100, 0.1)" }}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }) {
  return (
    <h3
      className={`text-lg font-semibold ${className}`}
      style={{ color: "#1D3D64" }}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = "" }) {
  return (
    <p
      className={`text-sm mt-1 ${className}`}
      style={{ color: "rgba(29, 61, 100, 0.6)" }}
    >
      {children}
    </p>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`py-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
  return (
    <div
      className={`pt-4 ${className}`}
      style={{ borderTop: "1px solid rgba(29, 61, 100, 0.1)" }}
    >
      {children}
    </div>
  );
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  className = "",
}) {
  const changeColors = {
    positive: "#f8851a",
    negative: "#1D3D64",
    neutral: "rgba(29, 61, 100, 0.6)",
  };

  return (
    <Card className={className}>
      <div className="flex items-start justify-between">
        <div>
          <p
            className="text-sm font-medium"
            style={{ color: "rgba(29, 61, 100, 0.6)" }}
          >
            {title}
          </p>
          <p className="text-2xl font-bold mt-1" style={{ color: "#1D3D64" }}>
            {value}
          </p>
        </div>
        {icon && (
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: "rgba(248, 133, 26, 0.1)",
              color: "#f8851a",
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

export function BookingCard({
  clientName,
  serviceName,
  date,
  time,
  status = "upcoming",
  staffName,
  price,
  onClick,
  className = "",
}) {
  const statusConfig = {
    upcoming: {
      label: "Upcoming",
      bgColor: "rgba(248, 133, 26, 0.1)",
      color: "#f8851a",
    },
    completed: {
      label: "Completed",
      bgColor: "rgba(29, 61, 100, 0.1)",
      color: "#1D3D64",
    },
    cancelled: {
      label: "Cancelled",
      bgColor: "rgba(29, 61, 100, 0.2)",
      color: "rgba(29, 61, 100, 0.6)",
    },
    noshow: {
      label: "No Show",
      bgColor: "rgba(248, 133, 26, 0.2)",
      color: "#f8851a",
    },
  };

  const config = statusConfig[status] || statusConfig.upcoming;

  return (
    <Card onClick={onClick} className={`cursor-pointer ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: config.bgColor, color: config.color }}
            >
              {config.label}
            </span>
          </div>
          <h4 className="font-semibold truncate" style={{ color: "#1D3D64" }}>
            {clientName}
          </h4>
          <p
            className="text-sm mt-1"
            style={{ color: "rgba(29, 61, 100, 0.7)" }}
          >
            {serviceName}
          </p>
          <div
            className="flex items-center gap-4 mt-3 text-sm"
            style={{ color: "rgba(29, 61, 100, 0.6)" }}
          >
            <span className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {date}
            </span>
            <span className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {time}
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          {price && (
            <p className="font-semibold" style={{ color: "#1D3D64" }}>
              {price}
            </p>
          )}
          {staffName && (
            <p
              className="text-sm mt-1"
              style={{ color: "rgba(29, 61, 100, 0.6)" }}
            >
              {staffName}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

export function ListCard({
  title,
  subtitle,
  leftIcon,
  rightContent,
  onClick,
  className = "",
}) {
  return (
    <Card
      onClick={onClick}
      padding="none"
      className={`${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      <div className="flex items-center gap-4 p-4">
        {leftIcon && (
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{
              backgroundColor: "rgba(29, 61, 100, 0.05)",
              color: "#1D3D64",
            }}
          >
            {leftIcon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-medium truncate" style={{ color: "#1D3D64" }}>
            {title}
          </p>
          {subtitle && (
            <p
              className="text-sm truncate"
              style={{ color: "rgba(29, 61, 100, 0.6)" }}
            >
              {subtitle}
            </p>
          )}
        </div>
        {rightContent && <div className="shrink-0">{rightContent}</div>}
      </div>
    </Card>
  );
}
