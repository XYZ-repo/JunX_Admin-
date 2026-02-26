import React from "react";

// Sparkline Chart - Simple inline trend visualization
export function Sparkline({
  data = [],
  width = 100,
  height = 32,
  strokeColor = "var(--color-primary)",
  fillColor,
  strokeWidth = 2,
  className = "",
}) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(" L ")}`;
  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

  return (
    <svg width={width} height={height} className={className} aria-hidden="true">
      {fillColor && <path d={areaD} fill={fillColor} opacity="0.2" />}
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Donut Chart - Circular progress/distribution chart
export function DonutChart({
  data = [],
  size = 120,
  strokeWidth = 12,
  showLabels = true,
  className = "",
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let currentOffset = 0;

  const colors = [
    "var(--color-primary)",
    "var(--color-secondary)",
    "rgba(29, 61, 100, 0.3)",
    "rgba(248, 133, 26, 0.5)",
  ];

  return (
    <div className={`inline-flex flex-col items-center gap-4 ${className}`}>
      <svg width={size} height={size} aria-hidden="true">
        {data.map((item, index) => {
          const percentage = total > 0 ? item.value / total : 0;
          const strokeDasharray = circumference * percentage;
          const strokeDashoffset = -currentOffset;
          currentOffset += circumference * percentage;

          return (
            <circle
              key={item.label || index}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={item.color || colors[index % colors.length]}
              strokeWidth={strokeWidth}
              strokeDasharray={`${strokeDasharray} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${center} ${center})`}
              className="transition-all duration-500"
            />
          );
        })}
        <text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-2xl font-bold fill-brand-secondary"
        >
          {total}
        </text>
      </svg>

      {showLabels && (
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
          {data.map((item, index) => (
            <div
              key={item.label || index}
              className="flex items-center gap-2 text-sm"
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: item.color || colors[index % colors.length],
                }}
              />
              <span className="text-brand-secondary/70">{item.label}</span>
              <span className="font-medium text-brand-secondary">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Progress Bar
export function ProgressBar({
  value = 0,
  max = 100,
  showLabel = false,
  label,
  size = "md",
  variant = "primary",
  className = "",
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const variants = {
    primary: "bg-brand-primary",
    secondary: "bg-brand-secondary",
  };

  return (
    <div className={className}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-sm font-medium text-brand-secondary">
              {label}
            </span>
          )}
          {showLabel && (
            <span className="text-sm text-brand-secondary/60">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full bg-brand-secondary/10 rounded-full overflow-hidden ${sizes[size]}`}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${variants[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Bar Chart - Simple horizontal/vertical bars
export function BarChart({
  data = [],
  orientation = "vertical",
  height = 200,
  showValues = true,
  className = "",
}) {
  const maxValue = Math.max(...data.map((d) => d.value));

  if (orientation === "horizontal") {
    return (
      <div className={`space-y-3 ${className}`}>
        {data.map((item, index) => (
          <div key={item.label || index}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-brand-secondary">{item.label}</span>
              {showValues && (
                <span className="text-sm font-medium text-brand-secondary">
                  {item.value}
                </span>
              )}
            </div>
            <div className="w-full h-2 bg-brand-secondary/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color || "var(--color-primary)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`flex items-end justify-between gap-2 ${className}`}
      style={{ height }}
    >
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * 100;
        return (
          <div
            key={item.label || index}
            className="flex-1 flex flex-col items-center gap-2"
          >
            <div className="relative w-full flex-1 flex items-end">
              <div
                className="w-full rounded-t-lg transition-all duration-500"
                style={{
                  height: `${barHeight}%`,
                  backgroundColor: item.color || "var(--color-primary)",
                  minHeight: "4px",
                }}
              />
              {showValues && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-brand-secondary">
                  {item.value}
                </span>
              )}
            </div>
            <span className="text-xs text-brand-secondary/70 truncate max-w-full">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// Storage Quota Bar
export function StorageQuota({
  used = 0,
  total = 100,
  unit = "GB",
  className = "",
}) {
  const percentage = (used / total) * 100;
  const isWarning = percentage > 80;
  const isCritical = percentage > 95;

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-brand-secondary">
          Storage
        </span>
        <span className="text-sm text-brand-secondary/60">
          {used} / {total} {unit}
        </span>
      </div>
      <div className="w-full h-2 bg-brand-secondary/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isCritical
              ? "bg-brand-primary"
              : isWarning
              ? "bg-brand-primary/70"
              : "bg-brand-secondary"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {isCritical && (
        <p className="mt-2 text-xs text-brand-primary">
          Storage almost full. Consider upgrading your plan.
        </p>
      )}
    </div>
  );
}
