"use client";
import React, { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { countries } from "../Utils";

const PhoneInput = ({
  label,
  name,
  error,
  helperText,
  required = false,
  disabled = false,
  className = "",
  inputClassName = "",
  onChange,
  value = "",
  ...props
}) => {
  const [country, setCountry] = useState(countries[0]);
  const [number, setNumber] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Parse initial value (if it has a country code)
  React.useEffect(() => {
    if (!value) return;

    const found = countries.find((c) => value.startsWith(c.dial_code));
    if (found) {
      setCountry(found);
      setNumber(value.replace(found.dial_code, ""));
    } else {
      setNumber(value.replace(/\D/g, ""));
    }
  }, [value]);

  // Handle outside click to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // When input changes
  const handleInputChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "");
    setNumber(digits);
    onChange &&
      onChange({ target: { name, value: country.dial_code + digits } });
  };

  // When country changes
  const handleCountryChange = (c) => {
    setCountry(c);
    setDropdownOpen(false);
    onChange && onChange({ target: { name, value: c.dial_code + number } });
  };

  return (
    <div className={`w-full ${className}`} ref={dropdownRef}>
      {label && (
        <label className="text-[14px] font-bold text-[#1E293B] block mb-1">
          {label}
        </label>
      )}

      <div className="flex relative">
        {/* Country selector */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`flex items-center gap-2 px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] border-r-0 rounded-l-full ${
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          <img
            src={`https://flagcdn.com/24x18/${country.code.toLowerCase()}.png`}
            alt={country.name}
            className="w-4 h-3"
          />
          <span className="text-xs">{country.dial_code}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Number input */}
        <input
          type="tel"
          value={number}
          onChange={handleInputChange}
          disabled={disabled}
          placeholder="1234567890"
          className={`flex-1 px-3.5 text-[13px]  outline-none border rounded-r-full ${
            error ? "border-red-500 text-red-600" : "border-[#CBD5E1]"
          } ${inputClassName}`}
          inputMode="numeric"
          pattern="[0-9]*"
          {...props}
        />
      </div>

      {/* Country dropdown */}
      {dropdownOpen && (
        <ul className="absolute z-50 mt-1 w-full max-w-[280px] rounded-lg shadow-md bg-white max-h-60 overflow-y-auto border border-gray-200">
          {countries.map((c) => (
            <li
              key={c.code}
              className={`p-2 flex items-center gap-2 cursor-pointer hover:bg-gray-50 ${
                c.code === country.code ? "bg-blue-50" : ""
              }`}
              onClick={() => handleCountryChange(c)}
            >
              <img
                src={`https://flagcdn.com/24x18/${c.code.toLowerCase()}.png`}
                alt={c.name}
                className="w-4 h-3 "
              />
              <span className="text-sm flex-1 truncate">{c.name}</span>
              <span className="text-xs text-gray-500">{c.dial_code}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Error / helper text */}
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default PhoneInput;
