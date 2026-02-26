"use client";

import { apiget, apipost, apiput } from "../api";

const useDashboard = () => {
  const DashboardStats = async () => {
    try {
      const res = await apiget(`api/v1/admin/dashboard/stats`);
      return res?.data || null;
    } catch (error) {
      console.error("API Error:", error);
      return null;
    }
  };

  return {
    DashboardStats,
  };
};

export default useDashboard;
