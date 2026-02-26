"use client";

import React, { useState, useEffect } from "react";
import { X, User, Mail, MapPin, CloudUpload, Loader2 } from "lucide-react";
import PhoneInput from "../ui/PhoneInput";
import { useForm } from "react-hook-form";

export default function CustomerDrawer({
  isOpen,
  onClose,
  customer,
  onBan,
  onUnban,
}) {
  const [banReason, setBanReason] = useState("");
  const [showBanModal, setShowBanModal] = useState(false);
  const [banType, setBanType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    formState: { errors },
    setValue,
  } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    if (!isOpen) {
      setShowBanModal(false);
      setBanReason("");
      setBanType(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (customer?.phoneNumber) {
      setValue("phone", customer.phoneNumber);
    }
  }, [customer, setValue]);

  if (!isOpen) return null;

  const handleBanClick = (type) => {
    setBanType(type);
    setShowBanModal(true);
    setBanReason("");
  };

  const confirmBan = async () => {
    if (!customer?.authId || !banReason.trim()) return;

    setIsLoading(true);
    try {
      await onBan(customer.authId, banType, banReason);

      setShowBanModal(false);
      setBanReason("");
      setBanType(null);
      onClose();
    } catch (error) {
      console.error("Ban error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnban = async () => {
    if (!customer?.authId) return;

    setIsLoading(true);
    try {
      await onUnban(customer.authId);

      onClose();
    } catch (error) {
      console.error("Unban error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = () => {
    if (!customer) return "??";
    if (customer.firstName && customer.lastName) {
      return (
        customer.firstName.charAt(0) + customer.lastName.charAt(0)
      ).toUpperCase();
    }
    if (customer.firstName) {
      return customer.firstName.charAt(0).toUpperCase();
    }
    if (customer.userName) {
      return customer.userName.charAt(0).toUpperCase();
    }
    return "??";
  };

  const getFullName = () => {
    if (!customer) return "Name Here";
    if (customer.firstName && customer.lastName) {
      return `${customer.firstName} ${customer.lastName}`;
    }
    if (customer.firstName) {
      return customer.firstName;
    }

    return "Name Here";
  };

  const handleModalClose = () => {
    setShowBanModal(false);
    setBanReason("");
    setBanType(null);
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-screen w-full max-w-5xl bg-[#F8FAFC] z-50 shadow-2xl overflow-y-auto font-jakarta">
        <div className="relative">
          <img
            src="./topbg-gradient.png"
            alt=""
            className="h-auto w-full object-contain"
          />

          {/* Close button */}
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-2 right-3 w-9 h-9 rounded-full bg-[#02061752] flex items-center justify-center text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-0 left-6 translate-y-1/4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
              {customer?.profileImageUrl ? (
                <img
                  src={customer.profileImageUrl}
                  alt={getFullName()}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = "none";
                  }}
                />
              ) : customer?.avatar ? (
                <img
                  src={customer.avatar}
                  alt={getFullName()}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-full bg-[#6B97B1] flex items-center justify-center text-white text-xl font-bold">
                  {getInitials()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Name row ── */}
        <div className="px-6 pt-5 pb-3 flex flex-col lg:flex-row items-start justify-between gap-4 font-jakarta">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-[30px] font-bold text-[#1E293B] whitespace-nowrap">
                {getFullName()}
              </h2>
              <span className="px-3 py-0.5 bg-blue-100 border first-letter:uppercase border-[#A5B4FC] text-[#4F46E5] text-[14px] font-semibold rounded-full">
                {customer?.membershipLevel}
              </span>
              {customer?.isBanned && (
                <span className="px-3 py-0.5 bg-red-100 border border-red-300 text-red-600 text-[14px] font-semibold rounded-full">
                  Banned
                </span>
              )}
            </div>
            <p className="text-[15px] text-[#475569] font-medium whitespace-nowrap">
              {customer?.email || "emailaddress@domain.com"}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 mt-1 font-jakarta">
            <button
              disabled={isLoading}
              className="px-4 py-2 bg-[#1E293B] text-white text-[14px] font-bold rounded-full transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              # Reports
            </button>
            {!customer?.isBanned ? (
              <>
                <button
                  onClick={() => handleBanClick("temporary")}
                  disabled={isLoading}
                  className="px-4 py-2 bg-[#FF4B00BF] text-white text-[14px] font-bold rounded-full transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Temp Ban
                </button>
                <button
                  onClick={() => handleBanClick("permanent")}
                  disabled={isLoading}
                  className="px-4 py-2 bg-[#FF383C] text-white text-[14px] font-bold rounded-full transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Ban User
                </button>
              </>
            ) : (
              <button
                onClick={handleUnban}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white text-[14px] font-bold rounded-full transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Unbanning...
                  </>
                ) : (
                  "Unban User"
                )}
              </button>
            )}
          </div>
        </div>

        {/* ── Profile Details header ── */}
        <div className="px-6 pb-3 flex flex-col sm:flex-row items-start justify-between gap-4 border-b font-jakarta border-gray-100">
          <div>
            <h3 className="text-[18px] font-bold text-[#1E293B]">
              Profile Details
            </h3>
            <p className="text-[14px] font-[400] text-[#475569]">
              You can change your profile details here easily
            </p>
          </div>
          <button
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 border text-[#475569] border-[#CBD5E1] rounded-full font-bold text-[14px] transition-colors hover:bg-gray-50 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CloudUpload className="w-5 h-5 text-[#475569]" />
            Export Data
          </button>
        </div>

        <div className="px-6 py-5 space-y-7">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-52 shrink-0">
              <p className="text-[16px] font-bold text-[#1E293B]">
                Personal Info
              </p>
              <p className="text-[12px] text-[#475569] mt-1 font-[400] leading-5">
                You can change your personal information settings here.
              </p>
            </div>

            <div className="flex-1 space-y-3 bg-white border border-[#E2E8F0] rounded-3xl p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                <div>
                  <label className="text-[14px] font-bold text-[#1E293B] block mb-1">
                    Username
                  </label>
                  <div className="flex items-center gap-2 border border-[#CBD5E1] rounded-full px-3 py-2">
                    <User className="w-3.5 h-3.5 text-[#475569] shrink-0" />
                    <input
                      type="text"
                      value={customer?.userName || "username"}
                      className="text-[13px] text-[#475569] outline-none w-full bg-transparent"
                      readOnly
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[14px] font-bold text-[#1E293B] block mb-1">
                    Linked-in
                  </label>
                  <div className="flex items-center gap-2 border border-[#CBD5E1] rounded-full px-3 py-2">
                    <Mail className="w-3.5 h-3.5 text-[#475569] shrink-0" />
                    <input
                      type="text"
                      value={customer?.email || "Not provided"}
                      className="text-[13px] text-[#475569] outline-none w-full bg-transparent"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <PhoneInput
                  label="Phone Number"
                  name="phone"
                  required
                  value={customer?.phoneNumber || ""}
                  onChange={(e) => console.log(e.target.value)}
                  // error={errors.phone?.message}
                  helperText=" "
                />
                <div>
                  <label className="text-[14px] font-bold text-[#1E293B] block mb-1">
                    Location
                  </label>
                  <div className="flex items-center gap-2 border border-[#CBD5E1] rounded-full px-3 py-2">
                    <MapPin className="w-3.5 h-3.5 text-[#475569] shrink-0" />
                    <input
                      type="text"
                      value={customer?.location || "Not provided"}
                      className="text-[13px] text-[#475569] outline-none w-full bg-transparent"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* ── Identification Info ── */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-52 shrink-0">
              <p className="text-[16px] font-bold text-[#1E293B]">
                Identification Info
              </p>
              <p className="text-[12px] text-[#475569] mt-1 font-[400] leading-5">
                You can change your personal information settings here.
              </p>
            </div>

            <div className="flex-1 space-y-3 bg-white border border-[#E2E8F0] rounded-3xl p-4 md:p-6">
              {/* Gender + Sexual Orientation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[14px] font-bold text-[#1E293B] block mb-1">
                    Gender
                  </label>
                  <div className="flex items-center gap-2 border border-[#CBD5E1] rounded-full px-3 py-2">
                    <User className="w-3.5 h-3.5 text-[#475569] shrink-0" />
                    <input
                      type="text"
                      value={customer?.gender || "Not specified"}
                      className="text-[13px] text-[#475569] outline-none w-full bg-transparent"
                      readOnly
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[14px] font-bold text-[#1E293B] block mb-1">
                    Sexual Orientation
                  </label>
                  <div className="flex items-center gap-2 border border-[#CBD5E1] rounded-full px-3 py-2">
                    <User className="w-3.5 h-3.5 text-[#475569] shrink-0" />
                    <input
                      type="text"
                      value={customer?.sexualOrientation || "Not specified"}
                      className="text-[13px] text-[#475569] outline-none w-full bg-transparent"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Identification + Pronouns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[14px] font-bold text-[#1E293B] block mb-1">
                    Ethnicity
                  </label>
                  <div className="flex items-center gap-2 border border-[#CBD5E1] rounded-full px-3 py-2">
                    <User className="w-3.5 h-3.5 text-[#475569] shrink-0" />
                    <input
                      type="text"
                      value={customer?.ethnicity || "Not specified"}
                      className="text-[13px] text-[#475569] outline-none w-full bg-transparent"
                      readOnly
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[14px] font-bold text-[#1E293B] block mb-1">
                    Pronouns
                  </label>
                  <div className="flex items-center gap-2 border border-[#CBD5E1] rounded-full px-3 py-2">
                    <User className="w-3.5 h-3.5 text-[#475569] shrink-0" />
                    <input
                      type="text"
                      value={customer?.pronouns || "Not specified"}
                      className="text-[13px] text-[#475569] outline-none w-full bg-transparent"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-52 shrink-0">
              <p className="text-[16px] font-bold text-[#1E293B]">
                Selfie Verification
              </p>
              <p className="text-[12px] text-[#475569] mt-1 font-[400] leading-5">
                This is where people will see your actual face
              </p>
            </div>

            <div className="flex-1 flex flex-wrap items-center gap-4">
              <div className="w-28 h-28 overflow-hidden bg-gray-200 border border-gray-100 shrink-0">
                {customer?.profileImageUrl ? (
                  <img
                    src={customer.profileImageUrl}
                    alt="selfie"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = "none";
                    }}
                  />
                ) : customer?.avatar ? (
                  <img
                    src={customer.avatar}
                    alt="selfie"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <User className="w-7 h-7 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Resubmit button */}
              <button
                disabled={isLoading}
                className="px-4 py-2 ml-3 lg:ml-36 border border-[#FF8D28] text-[#FF8D28] text-[14px] font-bold rounded-full transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Resubmit
              </button>
            </div>
          </div>

          {customer?.aboutMe && (
            <>
              <div className="border-t border-gray-100" />
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-52 shrink-0">
                  <p className="text-[16px] font-bold text-[#1E293B]">
                    About Me
                  </p>
                </div>
                <div className="flex-1 bg-white border border-[#E2E8F0] rounded-3xl p-4">
                  <p className="text-[14px] text-[#475569] leading-relaxed">
                    {customer.aboutMe}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Ban Reason Modal */}
      {showBanModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-[#1E293B] mb-4">
              {banType === "temporary"
                ? "Temporary Ban (3 days)"
                : "Permanent Ban"}
            </h3>
            <p className="text-sm text-[#475569] mb-4">
              Please provide a reason for banning this user:
            </p>
            <textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              className="w-full border border-[#CBD5E1] rounded-lg p-3 text-sm mb-4"
              rows="4"
              placeholder="Enter reason for ban..."
              disabled={isLoading}
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleModalClose}
                disabled={isLoading}
                className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={confirmBan}
                disabled={!banReason.trim() || isLoading}
                className={`px-4 py-2 rounded-full text-sm font-medium text-white flex items-center gap-2 ${
                  banReason.trim() && !isLoading
                    ? banType === "temporary"
                      ? "bg-[#FF4B00BF]"
                      : "bg-[#FF383C]"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Banning...
                  </>
                ) : (
                  "Confirm Ban"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
