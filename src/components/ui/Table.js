import React, { useState } from "react";

export default function Table({
  columns,
  data,
  sortable = false,
  onSort,
  onRowClick,
  emptyMessage = "No data available",
  className = "",
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (column) => {
    if (!sortable || !column.sortable) return;

    const direction =
      sortConfig.key === column.key && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    setSortConfig({ key: column.key, direction });
    onSort?.({ key: column.key, direction });
  };

  const getSortIcon = (column) => {
    if (sortConfig.key !== column.key) {
      return (
        <svg
          className="w-4 h-4"
          style={{ color: "rgba(29, 61, 100, 0.3)" }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }
    return sortConfig.direction === "asc" ? (
      <svg
        className="w-4 h-4"
        style={{ color: "#f8851a" }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    ) : (
      <svg
        className="w-4 h-4"
        style={{ color: "#f8851a" }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    );
  };

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table
        className="w-full min-w-full"
        style={{ borderCollapse: "separate", borderSpacing: 0 }}
      >
        <thead style={{ backgroundColor: "rgba(29, 61, 100, 0.05)" }}>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                onClick={() => handleSort(column)}
                className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider
                  ${
                    column.sortable && sortable
                      ? "cursor-pointer select-none"
                      : ""
                  }
                  ${column.className || ""}`}
                style={{
                  width: column.width,
                  color: "#1D3D64",
                  borderBottom: "1px solid rgba(29, 61, 100, 0.1)",
                }}
              >
                <div className="flex items-center gap-2">
                  <span>{column.label}</span>
                  {column.sortable && sortable && getSortIcon(column)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center"
                style={{ color: "rgba(29, 61, 100, 0.6)" }}
              >
                <div className="flex flex-col items-center gap-2">
                  <svg
                    className="w-12 h-12"
                    style={{ color: "rgba(29, 61, 100, 0.3)" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <p>{emptyMessage}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                onClick={() => onRowClick?.(row)}
                className={`${
                  onRowClick ? "cursor-pointer" : ""
                } transition-colors`}
                style={{ borderBottom: "1px solid rgba(29, 61, 100, 0.1)" }}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-4 py-4 whitespace-nowrap text-sm ${
                      column.cellClassName || ""
                    }`}
                    style={{ color: "#1D3D64" }}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export function TableFilter({
  filters = [],
  activeFilters = {},
  onFilterChange,
  className = "",
}) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {filters.map((filter) => (
        <div key={filter.key} className="relative">
          <select
            value={activeFilters[filter.key] || ""}
            onChange={(e) => onFilterChange(filter.key, e.target.value)}
            className="py-2 pr-8 text-sm min-w-[150px] rounded-lg"
            style={{
              padding: "0.5rem 2rem 0.5rem 0.75rem",
              border: "1px solid rgba(29, 61, 100, 0.2)",
              color: "#1D3D64",
              backgroundColor: "white",
            }}
          >
            <option value="">{filter.label}</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ))}
      {Object.values(activeFilters).some(Boolean) && (
        <button
          type="button"
          onClick={() => onFilterChange("clear", null)}
          className="text-sm hover:underline"
          style={{ color: "#f8851a" }}
        >
          Clear all
        </button>
      )}
    </div>
  );
}
