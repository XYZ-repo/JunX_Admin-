import React from "react";

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  className = "",
}) {
  const range = (start, end) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  const getPageNumbers = () => {
    const totalNumbers = siblingCount * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages <= totalBlocks) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, "dots", totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [1, "dots", ...rightRange];
    }

    const middleRange = range(leftSiblingIndex, rightSiblingIndex);
    return [1, "dots", ...middleRange, "dots", totalPages];
  };

  const pages = getPageNumbers();

  const getButtonStyle = (isActive, isDisabled) => ({
    backgroundColor: isActive ? "#f8851a" : "transparent",
    color: isActive ? "white" : "#1D3D64",
    opacity: isDisabled ? 0.5 : 1,
    cursor: isDisabled ? "not-allowed" : "pointer",
  });

  const buttonClasses =
    "flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-all focus:outline-none";

  return (
    <nav
      className={`flex items-center gap-1 ${className}`}
      aria-label="Pagination"
    >
      {showFirstLast && (
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={buttonClasses}
          style={getButtonStyle(false, currentPage === 1)}
          aria-label="Go to first page"
        >
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
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={buttonClasses}
        style={getButtonStyle(false, currentPage === 1)}
        aria-label="Go to previous page"
      >
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {pages.map((page, index) => {
        if (page === "dots") {
          return (
            <span
              key={`dots-${index}`}
              className="w-10 h-10 flex items-center justify-center"
              style={{ color: "rgba(29, 61, 100, 0.6)" }}
            >
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={buttonClasses}
            style={getButtonStyle(page === currentPage, false)}
            aria-label={`Go to page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={buttonClasses}
        style={getButtonStyle(false, currentPage === totalPages)}
        aria-label="Go to next page"
      >
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
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {showFirstLast && (
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={buttonClasses}
          style={getButtonStyle(false, currentPage === totalPages)}
          aria-label="Go to last page"
        >
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
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </button>
      )}
    </nav>
  );
}

export function PageInfo({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  className = "",
}) {
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <p
      className={`text-sm ${className}`}
      style={{ color: "rgba(29, 61, 100, 0.6)" }}
    >
      Showing{" "}
      <span className="font-medium" style={{ color: "#1D3D64" }}>
        {start}
      </span>{" "}
      to{" "}
      <span className="font-medium" style={{ color: "#1D3D64" }}>
        {end}
      </span>{" "}
      of{" "}
      <span className="font-medium" style={{ color: "#1D3D64" }}>
        {totalItems}
      </span>{" "}
      results
    </p>
  );
}
