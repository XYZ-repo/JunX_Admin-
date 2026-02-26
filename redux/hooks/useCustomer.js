"use client";

import { apiget, apipost } from "../api";

const useCustomer = () => {
  const listCustomers = async (filters = {}) => {
    try {
      const payload = {
        page: filters.page || 1,
        limit: filters.limit || 20,
        search: filters.search || "",
        membershipLevel: filters?.membershipLevel || "",
        isBanned: filters?.isBanned,
        verificationStatus: filters.verificationStatus,
        ...filters,
      };

      const res = await apipost(`api/v1/admin/customers`, payload);
      return res?.data || null;
    } catch (error) {
      console.error("API Error - listCustomers:", error);
      return null;
    }
  };

  const getCustomerDetails = async (authId) => {
    try {
      const res = await apiget(`api/v1/admin/customers/${authId}`);
      return res?.data || null;
    } catch (error) {
      console.error("API Error - getCustomerDetails:", error);
      return null;
    }
  };

  const temporaryBanCustomer = async (authId, reason) => {
    try {
      const res = await apipost(
        `api/v1/admin/customers/${authId}/ban/temporary`,
        { reason },
      );
      return res?.data || null;
    } catch (error) {
      console.error("API Error - temporaryBanCustomer:", error);
      return null;
    }
  };

  const permanentBanCustomer = async (authId, reason) => {
    try {
      const res = await apipost(
        `api/v1/admin/customers/${authId}/ban/permanent`,
        { reason },
      );
      return res?.data || null;
    } catch (error) {
      console.error("API Error - permanentBanCustomer:", error);
      return null;
    }
  };

  const unbanCustomer = async (authId) => {
    try {
      const res = await apipost(`api/v1/admin/customers/${authId}/unban`, {});
      return res?.data || null;
    } catch (error) {
      console.error("API Error - unbanCustomer:", error);
      return null;
    }
  };

  return {
    listCustomers,
    getCustomerDetails,
    temporaryBanCustomer,
    permanentBanCustomer,
    unbanCustomer,
  };
};

export default useCustomer;
