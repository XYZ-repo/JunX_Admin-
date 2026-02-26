"use client";

import { apiget, apipost, apiput } from "../api";

const useWaitlist = () => {
  const listWaitlistUsers = async (filters = {}) => {
    try {
      const res = await apipost(`api/v1/admin/waitlist`, filters);
      return res?.data || null;
    } catch (error) {
      console.error("API Error - listWaitlistUsers:", error);
      return null;
    }
  };

  const getWaitlistUserDetails = async (authId) => {
    try {
      const res = await apiget(`api/v1/admin/waitlist/${authId}`);
      return res?.data || null;
    } catch (error) {
      console.error("API Error - getWaitlistUserDetails:", error);
      return null;
    }
  };

  const approveAsPro = async (authId) => {
    try {
      const res = await apipost(
        `api/v1/admin/waitlist/${authId}/approve/pro`,
        {},
      );
      return res?.data || null;
    } catch (error) {
      console.error("API Error - approveAsPro:", error);
      return null;
    }
  };

  const approveAsGeneral = async (authId) => {
    try {
      const res = await apipost(
        `api/v1/admin/waitlist/${authId}/approve/general`,
        {},
      );
      return res?.data || null;
    } catch (error) {
      console.error("API Error - approveAsGeneral:", error);
      return null;
    }
  };

  const rejectUser = async (authId, reason) => {
    try {
      const res = await apipost(`api/v1/admin/waitlist/${authId}/reject`, {
        reason,
      });
      return res?.data || null;
    } catch (error) {
      console.error("API Error - rejectUser:", error);
      return null;
    }
  };

  const requestProfileResubmit = async (authId, reason) => {
    try {
      const res = await apipost(
        `api/v1/admin/waitlist/${authId}/request-resubmit`,
        { reason },
      );
      return res?.data || null;
    } catch (error) {
      console.error("API Error - requestProfileResubmit:", error);
      return null;
    }
  };

  const requestReverification = async (authId, reason) => {
    try {
      const res = await apipost(
        `api/v1/admin/waitlist/${authId}/request-reverify`,
        {
          method: "selfie",
          reason,
        },
      );
      return res?.data || null;
    } catch (error) {
      console.error("API Error - requestReverification:", error);
      return null;
    }
  };

  const getVerificationMethod = async (authId) => {
    try {
      const res = await apiget(
        `api/v1/admin/waitlist/${authId}/verification-method`,
      );
      return res?.data || null;
    } catch (error) {
      console.error("API Error - getVerificationMethod:", error);
      return null;
    }
  };

  return {
    listWaitlistUsers,
    getWaitlistUserDetails,
    approveAsPro,
    approveAsGeneral,
    rejectUser,
    requestProfileResubmit,
    requestReverification,
    getVerificationMethod,
  };
};

export default useWaitlist;
