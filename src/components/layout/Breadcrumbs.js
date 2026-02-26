// components/layout/Breadcrumbs.jsx
"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs({ items = [], className = "" }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center gap-2 text-sm">
        <li>
          <Link
            href="/dashboard"
            className="transition-colors hover:opacity-80"
            style={{ color: "rgba(29, 61, 100, 0.6)" }}
          >
            <Home className="w-4 h-4" />
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-2">
            <ChevronRight
              className="w-4 h-4"
              style={{ color: "rgba(29, 61, 100, 0.3)" }}
            />

            {index === items.length - 1 ? (
              <span
                className="font-medium"
                style={{ color: "#1D3D64" }}
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href || "#"}
                className="transition-colors hover:opacity-80"
                style={{ color: "rgba(29, 61, 100, 0.6)" }}
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHeader({
  title,
  description,
  breadcrumbs = [],
  actions,
  className = "",
}) {
  return (
    <div className={className}>
      {breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} className="mb-4" />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#1D3D64" }}>
            {title}
          </h1>
          {description && (
            <p className="mt-1" style={{ color: "rgba(29, 61, 100, 0.6)" }}>
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-3 shrink-0">{actions}</div>
        )}
      </div>
    </div>
  );
}
