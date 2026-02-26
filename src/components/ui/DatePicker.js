import React, { useState, useRef, useEffect } from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function DatePicker({
  label,
  value,
  onChange,
  placeholder = "Select date",
  error,
  disabled = false,
  minDate,
  maxDate,
  className = "",
  id,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(
    value ? new Date(value) : new Date()
  );
  const containerRef = useRef(null);
  const pickerId =
    id || `datepicker-${Math.random().toString(36).substr(2, 9)}`;

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

  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isDateDisabled = (date) => {
    if (minDate && date < new Date(minDate)) return true;
    if (maxDate && date > new Date(maxDate)) return true;
    return false;
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      viewDate.getMonth() === today.getMonth() &&
      viewDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day) => {
    if (!value) return false;
    const selected = new Date(value);
    return (
      day === selected.getDate() &&
      viewDate.getMonth() === selected.getMonth() &&
      viewDate.getFullYear() === selected.getFullYear()
    );
  };

  const handleDateSelect = (day) => {
    const selectedDate = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth(),
      day
    );
    if (!isDateDisabled(selectedDate)) {
      onChange?.(selectedDate.toISOString().split("T")[0]);
      setIsOpen(false);
    }
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(
      viewDate.getFullYear(),
      viewDate.getMonth()
    );
    const firstDay = getFirstDayOfMonth(
      viewDate.getFullYear(),
      viewDate.getMonth()
    );
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-9" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
      const disabled = isDateDisabled(date);

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateSelect(day)}
          disabled={disabled}
          className="h-9 w-9 rounded-full text-sm font-medium transition-colors"
          style={{
            color: disabled
              ? "rgba(29, 61, 100, 0.3)"
              : isSelected(day)
              ? "white"
              : "#1D3D64",
            backgroundColor: isSelected(day) ? "#f8851a" : "transparent",
            border:
              isToday(day) && !isSelected(day) ? "2px solid #f8851a" : "none",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className={`w-full ${className}`} ref={containerRef}>
      {label && (
        <label
          htmlFor={pickerId}
          className="block text-sm font-medium mb-1.5"
          style={{ color: "#1D3D64" }}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          id={pickerId}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className="w-full text-left flex items-center justify-between"
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
          <span style={{ color: value ? "#1D3D64" : "rgba(29, 61, 100, 0.5)" }}>
            {value ? formatDate(value) : placeholder}
          </span>
          <svg
            className="w-5 h-5"
            style={{ color: "rgba(29, 61, 100, 0.5)" }}
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
        </button>

        {isOpen && (
          <div
            className="absolute z-50 mt-1 bg-white rounded-lg shadow-lg p-4"
            style={{ border: "1px solid rgba(29, 61, 100, 0.2)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 rounded-lg transition-colors"
                aria-label="Previous month"
              >
                <svg
                  className="w-5 h-5"
                  style={{ color: "#1D3D64" }}
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
              <span className="font-semibold" style={{ color: "#1D3D64" }}>
                {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 rounded-lg transition-colors"
                aria-label="Next month"
              >
                <svg
                  className="w-5 h-5"
                  style={{ color: "#1D3D64" }}
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
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="h-9 flex items-center justify-center text-xs font-medium"
                  style={{ color: "rgba(29, 61, 100, 0.6)" }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>

            {/* Today button */}
            <div
              className="mt-4 pt-4"
              style={{ borderTop: "1px solid rgba(29, 61, 100, 0.1)" }}
            >
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  onChange?.(today.toISOString().split("T")[0]);
                  setViewDate(today);
                  setIsOpen(false);
                }}
                className="w-full text-center text-sm hover:underline"
                style={{ color: "#f8851a" }}
              >
                Today
              </button>
            </div>
          </div>
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

export function TimePicker({
  label,
  value,
  onChange,
  placeholder = "Select time",
  error,
  disabled = false,
  className = "",
  id,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const pickerId =
    id || `timepicker-${Math.random().toString(36).substr(2, 9)}`;

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

  const times = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour = h.toString().padStart(2, "0");
      const minute = m.toString().padStart(2, "0");
      times.push(`${hour}:${minute}`);
    }
  }

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className={`w-full ${className}`} ref={containerRef}>
      {label && (
        <label
          htmlFor={pickerId}
          className="block text-sm font-medium mb-1.5"
          style={{ color: "#1D3D64" }}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          id={pickerId}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className="w-full text-left flex items-center justify-between"
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
          <span style={{ color: value ? "#1D3D64" : "rgba(29, 61, 100, 0.5)" }}>
            {value ? formatTime(value) : placeholder}
          </span>
          <svg
            className="w-5 h-5"
            style={{ color: "rgba(29, 61, 100, 0.5)" }}
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
        </button>

        {isOpen && (
          <div
            className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-auto"
            style={{ border: "1px solid rgba(29, 61, 100, 0.2)" }}
          >
            {times.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => {
                  onChange?.(time);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm transition-colors"
                style={{
                  backgroundColor:
                    value === time ? "rgba(248, 133, 26, 0.1)" : "transparent",
                  color: value === time ? "#f8851a" : "#1D3D64",
                  fontWeight: value === time ? "500" : "normal",
                }}
              >
                {formatTime(time)}
              </button>
            ))}
          </div>
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
