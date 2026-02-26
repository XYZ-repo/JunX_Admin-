import React, { useState, useRef, useEffect } from "react";

export default function Select({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  error,
  helperText,
  disabled = false,
  required = false,
  className = "",
  id,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef(null);
  const listboxRef = useRef(null);
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && listboxRef.current) {
      const highlighted = listboxRef.current.children[highlightedIndex];
      if (highlighted) {
        highlighted.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleKeyDown = (event) => {
    if (disabled) return;

    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        if (isOpen) {
          onChange?.(options[highlightedIndex]?.value);
          setIsOpen(false);
        } else {
          setIsOpen(true);
        }
        break;
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) =>
            prev < options.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : options.length - 1
          );
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
      case "Tab":
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const handleOptionClick = (optionValue) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`w-full ${className}`} ref={containerRef}>
      {label && (
        <label
          id={`${selectId}-label`}
          className="block text-sm font-medium mb-1.5"
          style={{ color: "#1D3D64" }}
        >
          {label}
          {required && (
            <span
              style={{ color: "#f8851a" }}
              className="ml-1"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          id={selectId}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-labelledby={label ? `${selectId}-label` : undefined}
          aria-controls={`${selectId}-listbox`}
          aria-invalid={error ? "true" : "false"}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className={`w-full text-left flex items-center justify-between ${
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
          style={{
            padding: "0.625rem 0.875rem",
            backgroundColor: "white",
            border: error
              ? "2px solid #f8851a"
              : "1px solid rgba(29, 61, 100, 0.2)",
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
          }}
        >
          <span
            style={{
              color: selectedOption ? "#1D3D64" : "rgba(29, 61, 100, 0.5)",
            }}
          >
            {selectedOption?.label || placeholder}
          </span>
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            style={{ color: "rgba(29, 61, 100, 0.5)" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <ul
            ref={listboxRef}
            id={`${selectId}-listbox`}
            role="listbox"
            aria-labelledby={label ? `${selectId}-label` : undefined}
            className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-auto"
            style={{ border: "1px solid rgba(29, 61, 100, 0.2)" }}
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                onClick={() => handleOptionClick(option.value)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className="px-4 py-2.5 cursor-pointer transition-colors"
                style={{
                  backgroundColor:
                    option.value === value
                      ? "rgba(248, 133, 26, 0.1)"
                      : highlightedIndex === index
                      ? "rgba(29, 61, 100, 0.1)"
                      : "transparent",
                  color: option.value === value ? "#f8851a" : "#1D3D64",
                  fontWeight: option.value === value ? "500" : "normal",
                  opacity: option.disabled ? 0.5 : 1,
                }}
              >
                <div className="flex items-center justify-between">
                  <span>{option.label}</span>
                  {option.value === value && (
                    <svg
                      className="w-5 h-5"
                      style={{ color: "#f8851a" }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                {option.description && (
                  <p
                    className="text-sm mt-0.5"
                    style={{ color: "rgba(29, 61, 100, 0.6)" }}
                  >
                    {option.description}
                  </p>
                )}
              </li>
            ))}
            {options.length === 0 && (
              <li
                className="px-4 py-3 text-center"
                style={{ color: "rgba(29, 61, 100, 0.5)" }}
              >
                No options available
              </li>
            )}
          </ul>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-sm" style={{ color: "#f8851a" }} role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p
          className="mt-1.5 text-sm"
          style={{ color: "rgba(29, 61, 100, 0.6)" }}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}

export function MultiSelect({
  label,
  options = [],
  value = [],
  onChange,
  placeholder = "Select options",
  error,
  disabled = false,
  required = false,
  className = "",
  id,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const selectId =
    id || `multiselect-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange?.(newValue);
  };

  const selectedLabels = options
    .filter((opt) => value.includes(opt.value))
    .map((opt) => opt.label);

  return (
    <div className={`w-full ${className}`} ref={containerRef}>
      {label && (
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: "#1D3D64" }}
        >
          {label}
          {required && (
            <span style={{ color: "#f8851a" }} className="ml-1">
              *
            </span>
          )}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className="w-full text-left flex items-center justify-between min-h-[44px]"
          style={{
            padding: "0.625rem 0.875rem",
            backgroundColor: "white",
            border: error
              ? "2px solid #f8851a"
              : "1px solid rgba(29, 61, 100, 0.2)",
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
          }}
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {selectedLabels.length > 0 ? (
              selectedLabels.map((label, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: "rgba(248, 133, 26, 0.15)",
                    color: "#f8851a",
                  }}
                >
                  {label}
                </span>
              ))
            ) : (
              <span style={{ color: "rgba(29, 61, 100, 0.5)" }}>
                {placeholder}
              </span>
            )}
          </div>
          <svg
            className={`w-5 h-5 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            style={{ color: "rgba(29, 61, 100, 0.5)" }}
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
        </button>

        {isOpen && (
          <ul
            className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-auto"
            style={{ border: "1px solid rgba(29, 61, 100, 0.2)" }}
          >
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => toggleOption(option.value)}
                className="px-4 py-2.5 cursor-pointer flex items-center gap-3"
                style={{ color: "#1D3D64" }}
              >
                <div
                  className="w-5 h-5 rounded flex items-center justify-center transition-colors"
                  style={{
                    backgroundColor: value.includes(option.value)
                      ? "#f8851a"
                      : "transparent",
                    border: value.includes(option.value)
                      ? "2px solid #f8851a"
                      : "2px solid rgba(29, 61, 100, 0.3)",
                  }}
                >
                  {value.includes(option.value) && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span>{option.label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-sm" style={{ color: "#f8851a" }} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
