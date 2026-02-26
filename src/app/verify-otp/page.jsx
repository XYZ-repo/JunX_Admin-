"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifyOtp() {
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const router = useRouter();

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 5);
    const newOtp = ["", "", "", "", ""];
    pasted.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    const nextEmpty = pasted.length < 5 ? pasted.length : 4;
    inputRefs.current[nextEmpty]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 5) {
      setError("Please enter the complete 5-digit code.");
      return;
    }
    setLoading(true);
    try {
      // TODO: call your verify API here
      // await verifyOtp({ code });
      //   router.push("/admin");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Invalid code. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setOtp(["", "", "", "", ""]);
    setError("");
    setTimer(60);
    setCanResend(false);
    inputRefs.current[0]?.focus();
    // TODO: call your resend API here
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-2">
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg px-8 py-8">
        {/* Header */}
        <h1 className="text-[20px] leading-7 font-semibold text-center text-heading mb-2">
          Enter Code
        </h1>
        <p className="text-[13px] leading-5 text-subheading text-center mb-6">
          We sent a 5-digit code to A*** @junxyz.com
        </p>

        {/* OTP Inputs */}
        <div className="flex items-center justify-center gap-3 mb-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={`w-14 h-14 text-center text-[18px] font-semibold text-[#1a1a1a] border rounded-lg outline-none transition-all
                ${
                  error
                    ? "border-red-400 focus:border-red-500"
                    : digit
                      ? "border-[#1a1a1a] focus:border-[#1a1a1a]"
                      : "border-gray-300 focus:border-gray-500"
                }
              `}
            />
          ))}
        </div>

        {/* Timer */}
        <p className="text-center text-[12px] text-subheading mb-5">
          {canResend ? (
            <span className="text-[#1a1a1a] font-medium">Code expired</span>
          ) : (
            <>Resend in {formatTimer(timer)}</>
          )}
        </p>

        {/* Error */}
        {error && (
          <p className="text-center text-xs text-red-500 mb-3">{error}</p>
        )}

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full   bg-[#121212] text-white py-2.5 text-[16px] font-medium leading-6 rounded-lg
            hover:bg-black transition-colors duration-200
            disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-4 w-4 mr-2 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Verifying...
            </span>
          ) : (
            "Verify"
          )}
        </button>

        {/* Resend */}
        <p className="mt-4 text-center py-2.5 text-[16px] font-medium leading-6 border rounded-lg border-[#E0E0E0] text-[#444444]">
          <button
            onClick={handleResend}
            disabled={!canResend}
            className={`font-medium transition-colors ${
              canResend ? " cursor-pointer" : "  cursor-not-allowed"
            }`}
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
}
