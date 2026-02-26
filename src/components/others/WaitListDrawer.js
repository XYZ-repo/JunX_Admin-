"use client";

import React, { useState } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  CloudUpload,
  Calendar,
  Hash,
} from "lucide-react";
import PhoneInput from "../ui/PhoneInput";
import { useForm } from "react-hook-form";

export default function WaitListDrawer({
  isOpen,
  onClose,
  customer,
  onApprovePro,
  onApproveGeneral,
  onReject,
  onRequestResubmit,
  onRequestReverify,
}) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showResubmitModal, setShowResubmitModal] = useState(false);
  const [showReverifyModal, setShowReverifyModal] = useState(false);
  const [reason, setReason] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  if (!isOpen) return null;

  const getInitials = () => {
    if (!customer) return "??";
    if (customer.firstName && customer.lastName) {
      return (
        customer.firstName.charAt(0) + customer.lastName.charAt(0)
      ).toUpperCase();
    }
    return customer.name
      ? customer.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "??";
  };

  const handleRejectConfirm = () => {
    if (customer && customer.authId && reason.trim()) {
      onReject(customer.authId, reason);
      setShowRejectModal(false);
      setReason("");
    }
  };

  const handleResubmitConfirm = () => {
    if (customer && customer.authId && reason.trim()) {
      onRequestResubmit(customer.authId, reason);
      setShowResubmitModal(false);
      setReason("");
    }
  };

  const handleReverifyConfirm = () => {
    if (customer && customer.authId && reason.trim()) {
      onRequestReverify(customer.authId, reason);
      setShowReverifyModal(false);
      setReason("");
    }
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

          <button
            onClick={onClose}
            className="absolute top-2 right-3 w-9 h-9 rounded-full bg-[#02061752] flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-0 left-6 translate-y-1/4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
              {customer?.avatar ? (
                <img
                  src={customer.avatar}
                  alt={customer.name}
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

        {/* Name row */}
        <div className="px-6 pt-5 pb-3 flex flex-col lg:flex-row items-start justify-between gap-4 font-jakarta">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-[30px] font-bold text-[#1E293B] whitespace-nowrap">
                {customer?.name || "Name Here"}
              </h2>
              <span
                className={`px-3 py-0.5 border text-[14px] font-semibold rounded-full ${
                  customer?.status === "pending"
                    ? "bg-yellow-100 border-yellow-300 text-yellow-700"
                    : customer?.status === "resubmitted"
                      ? "bg-blue-100 border-blue-300 text-blue-700"
                      : customer?.status === "rejected"
                        ? "bg-red-100 border-red-300 text-red-700"
                        : "bg-gray-100 border-gray-300 text-gray-600"
                }`}
              >
                {customer?.status || "Pending"}
              </span>
            </div>
            <p className="text-[15px] text-[#475569] font-medium whitespace-nowrap">
              {customer?.email || "emailaddress@domain.com"}
            </p>
            {customer?.userName && (
              <p className="text-[13px] text-[#64748B]">@{customer.userName}</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap md:flex-none items-center gap-2 mt-1 font-jakarta">
            <button
              onClick={() => setShowRejectModal(true)}
              className="px-4 py-2 border border-[#222222] text-black text-[14px] font-bold rounded-full transition-colors whitespace-nowrap hover:bg-gray-100"
            >
              Reject
            </button>
            <button
              onClick={() => setShowResubmitModal(true)}
              className="px-4 py-2 border border-[#222222] text-black text-[14px] font-bold rounded-full transition-colors whitespace-nowrap hover:bg-gray-100"
            >
              Resubmit profile image
            </button>
            <button
              onClick={() => setShowReverifyModal(true)}
              className="px-4 py-2 border border-[#222222] text-black text-[14px] font-bold rounded-full transition-colors whitespace-nowrap hover:bg-gray-100"
            >
              Resubmit Verification
            </button>
            <button
              onClick={() => onApproveGeneral(customer?.authId)}
              className="px-4 py-2 bg-[#FF4B00BF] text-white text-[14px] font-bold rounded-full transition-colors whitespace-nowrap hover:bg-[#FF4B00]"
            >
              Approve General
            </button>
            <button
              onClick={() => onApprovePro(customer?.authId)}
              className="px-4 py-2 bg-[#34C759] text-white text-[14px] font-bold rounded-full transition-colors whitespace-nowrap hover:bg-[#2DB14D]"
            >
              Approve Pro
            </button>
          </div>
        </div>

        <div className="px-6 pb-3 flex flex-col sm:flex-row items-start justify-between gap-4 border-b font-jakarta border-gray-100">
          <div>
            <h3 className="text-[18px] font-bold text-[#1E293B]">
              Profile Details
            </h3>
            <p className="text-[14px] font-[400] text-[#475569]">
              Review user information before approval
            </p>
          </div>

          <div className="flex flex-wrap justify-start items-center gap-x-2">
            {customer?.verificationMethod && (
              <button className="flex items-center gap-2 px-4 py-2 border text-[#475569] border-[#CBD5E1] rounded-full font-bold text-[14px] transition-colors hover:bg-gray-50 whitespace-nowrap">
                Verification method - {customer.verificationMethod}
              </button>
            )}
          </div>
        </div>

        <div className="px-6 py-5 space-y-7">
          {/* Personal Info */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-52 shrink-0">
              <p className="text-[16px] font-bold text-[#1E293B]">
                Personal Info
              </p>
              <p className="text-[12px] text-[#475569] mt-1 font-[400] leading-5">
                User's personal information
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
                      defaultValue={customer?.userName || "Not provided"}
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
                      defaultValue={customer?.linkedin || "Not provided"}
                      className="text-[13px] text-[#475569] outline-none w-full bg-transparent"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[14px] font-bold text-[#1E293B] block mb-1">
                    Phone Number
                  </label>
                  <div className="flex items-center gap-2 border border-[#CBD5E1] rounded-full px-3 py-2">
                    <Phone className="w-3.5 h-3.5 text-[#475569] shrink-0" />
                    <input
                      type="text"
                      defaultValue={customer?.phoneNumber || "Not provided"}
                      className="text-[13px] text-[#475569] outline-none w-full bg-transparent"
                      readOnly
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[14px] font-bold text-[#1E293B] block mb-1">
                    Location
                  </label>
                  <div className="flex items-center gap-2 border border-[#CBD5E1] rounded-full px-3 py-2">
                    <MapPin className="w-3.5 h-3.5 text-[#475569] shrink-0" />
                    <input
                      type="text"
                      defaultValue={customer?.location || "Not provided"}
                      className="text-[13px] text-[#475569] outline-none w-full bg-transparent"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {(customer?.dateOfBirth || customer?.height) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  {customer?.dateOfBirth && (
                    <div>
                      <label className="text-[14px] font-bold text-[#1E293B] block mb-1">
                        Date of Birth
                      </label>
                      <div className="flex items-center gap-2 border border-[#CBD5E1] rounded-full px-3 py-2">
                        <Calendar className="w-3.5 h-3.5 text-[#475569] shrink-0" />
                        <input
                          type="text"
                          defaultValue={new Date(
                            customer.dateOfBirth,
                          ).toLocaleDateString()}
                          className="text-[13px] text-[#475569] outline-none w-full bg-transparent"
                          readOnly
                        />
                      </div>
                    </div>
                  )}
                  {customer?.height && (
                    <div>
                      <label className="text-[14px] font-bold text-[#1E293B] block mb-1">
                        Height
                      </label>
                      <div className="flex items-center gap-2 border border-[#CBD5E1] rounded-full px-3 py-2">
                        <Hash className="w-3.5 h-3.5 text-[#475569] shrink-0" />
                        <input
                          type="text"
                          defaultValue={`${customer.height} cm`}
                          className="text-[13px] text-[#475569] outline-none w-full bg-transparent"
                          readOnly
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Identification Info */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-52 shrink-0">
              <p className="text-[16px] font-bold text-[#1E293B]">
                Identification Info
              </p>
              <p className="text-[12px] text-[#475569] mt-1 font-[400] leading-5">
                User's identification details
              </p>
            </div>

            <div className="flex-1 space-y-3 bg-white border border-[#E2E8F0] rounded-3xl p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[14px] font-bold text-[#1E293B] block mb-1">
                    Gender
                  </label>
                  <div className="flex items-center gap-2 border border-[#CBD5E1] rounded-full px-3 py-2">
                    <User className="w-3.5 h-3.5 text-[#475569] shrink-0" />
                    <input
                      type="text"
                      defaultValue={customer?.gender || "Not specified"}
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
                      defaultValue={
                        customer?.sexualOrientation || "Not specified"
                      }
                      className="text-[13px] text-[#475569] outline-none w-full bg-transparent"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[14px] font-bold text-[#1E293B] block mb-1">
                    Ethnicity
                  </label>
                  <div className="flex items-center gap-2 border border-[#CBD5E1] rounded-full px-3 py-2">
                    <User className="w-3.5 h-3.5 text-[#475569] shrink-0" />
                    <input
                      type="text"
                      defaultValue={customer?.ethnicity || "Not specified"}
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
                      defaultValue={customer?.pronouns || "Not specified"}
                      className="text-[13px] text-[#475569] outline-none w-full bg-transparent"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Selfie Verification */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-52 shrink-0">
              <p className="text-[16px] font-bold text-[#1E293B]">
                Selfie Verification
              </p>
              <p className="text-[12px] text-[#475569] mt-1 font-[400] leading-5">
                User's verification selfie
              </p>
            </div>

            <div className="flex-1 flex flex-wrap items-center gap-4">
              <div className="w-28 h-28 overflow-hidden bg-gray-200 border border-gray-100 shrink-0">
                {customer?.avatar ? (
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

              <div className="flex justify-start lg:ml-32 items-center gap-x-3">
                <button className="px-4 py-2 border border-[#0EB523] text-[#0EB523] text-[14px] font-bold rounded-full transition-colors whitespace-nowrap hover:bg-green-50">
                  Approve Selfie
                </button>
                <button
                  onClick={() => setShowResubmitModal(true)}
                  className="px-4 py-2 border border-[#FF8D28] text-[#FF8D28] text-[14px] font-bold rounded-full transition-colors whitespace-nowrap hover:bg-orange-50"
                >
                  Resubmit
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="px-4 py-2 border border-[#DB303F] text-[#DB303F] text-[14px] font-bold rounded-full transition-colors whitespace-nowrap hover:bg-red-50"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>

          {/* About Me section if available */}
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

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-[#1E293B] mb-4">
              Reject User
            </h3>
            <p className="text-sm text-[#475569] mb-4">
              Please provide a reason for rejecting this user:
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-[#CBD5E1] rounded-lg p-3 text-sm mb-4"
              rows="4"
              placeholder="Enter reason for rejection..."
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setReason("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={!reason.trim()}
                className={`px-4 py-2 rounded-full text-sm font-medium text-white ${
                  reason.trim()
                    ? "bg-[#DB303F]"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resubmit Modal */}
      {showResubmitModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-[#1E293B] mb-4">
              Request Profile Resubmission
            </h3>
            <p className="text-sm text-[#475569] mb-4">
              Please provide a reason for requesting resubmission:
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-[#CBD5E1] rounded-lg p-3 text-sm mb-4"
              rows="4"
              placeholder="Enter reason for resubmission..."
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowResubmitModal(false);
                  setReason("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleResubmitConfirm}
                disabled={!reason.trim()}
                className={`px-4 py-2 rounded-full text-sm font-medium text-white ${
                  reason.trim()
                    ? "bg-[#FF8D28]"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Confirm Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reverify Modal */}
      {showReverifyModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-[#1E293B] mb-4">
              Request Re-verification
            </h3>
            <p className="text-sm text-[#475569] mb-4">
              Please provide a reason for requesting re-verification:
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-[#CBD5E1] rounded-lg p-3 text-sm mb-4"
              rows="4"
              placeholder="Enter reason for re-verification..."
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowReverifyModal(false);
                  setReason("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleReverifyConfirm}
                disabled={!reason.trim()}
                className={`px-4 py-2 rounded-full text-sm font-medium text-white ${
                  reason.trim()
                    ? "bg-[#FF4B00BF]"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Confirm Request
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
