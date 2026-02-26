import React from "react";

export default function Skeleton({
  width,
  height,
  circle = false,
  className = "",
}) {
  return (
    <div
      className={`skeleton ${circle ? "rounded-full" : ""} ${className}`}
      style={{
        width: width || (circle ? height : "100%"),
        height: height || "1rem",
      }}
      aria-hidden="true"
    />
  );
}

export function SkeletonText({ lines = 3, className = "" }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="0.875rem"
          className={i === lines - 1 ? "w-3/4" : "w-full"}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = "" }) {
  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex items-start gap-4">
        <Skeleton width="48px" height="48px" className="rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton height="1rem" className="w-1/3" />
          <Skeleton height="0.875rem" className="w-2/3" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton height="0.75rem" />
        <Skeleton height="0.75rem" />
        <Skeleton height="0.75rem" className="w-4/5" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, columns = 4, className = "" }) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-brand-secondary/10 ${className}`}
    >
      <div className="bg-brand-secondary/5 p-4">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} height="0.75rem" className="flex-1" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-brand-secondary/10">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="flex gap-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton key={colIndex} height="1rem" className="flex-1" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonAvatar({ size = "md", className = "" }) {
  const sizes = {
    sm: "32px",
    md: "40px",
    lg: "48px",
    xl: "64px",
  };

  return (
    <Skeleton
      width={sizes[size]}
      height={sizes[size]}
      circle
      className={className}
    />
  );
}

export function SkeletonBookingCard({ className = "" }) {
  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <Skeleton height="1.25rem" className="w-24 rounded-full" />
          <Skeleton height="1.125rem" className="w-2/3" />
          <Skeleton height="0.875rem" className="w-1/2" />
          <div className="flex gap-4 pt-2">
            <Skeleton height="0.875rem" className="w-20" />
            <Skeleton height="0.875rem" className="w-16" />
          </div>
        </div>
        <div className="text-right space-y-2">
          <Skeleton height="1rem" className="w-16" />
          <Skeleton height="0.875rem" className="w-20" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonStatCard({ className = "" }) {
  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton height="0.875rem" className="w-24" />
          <Skeleton height="1.75rem" className="w-20" />
          <Skeleton height="0.75rem" className="w-16 mt-2" />
        </div>
        <Skeleton width="48px" height="48px" className="rounded-xl" />
      </div>
    </div>
  );
}
