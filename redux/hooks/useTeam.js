"use client";

import { apiget, apipost, apiput, apidelete } from "../api";

const useTeam = () => {
  const listTeamMembers = async (filters = {}) => {
    try {
      const res = await apipost(`api/v1/admin/team`, filters);
      return res?.data || null;
    } catch (error) {
      console.error("API Error - listTeamMembers:", error);
      return null;
    }
  };

  const addTeamMember = async (memberData) => {
    try {
      const res = await apipost(`api/v1/admin/team/add`, memberData);
      return res?.data || null;
    } catch (error) {
      console.error("API Error - addTeamMember:", error);
      return null;
    }
  };

  const getTeamMemberDetails = async (adminId) => {
    try {
      const res = await apiget(`api/v1/admin/team/${adminId}`);
      return res?.data || null;
    } catch (error) {
      console.error("API Error - getTeamMemberDetails:", error);
      return null;
    }
  };

  const updateTeamMember = async (adminId, updateData) => {
    try {
      const res = await apiput(`api/v1/admin/team/${adminId}`, updateData);
      return res?.data || null;
    } catch (error) {
      console.error("API Error - updateTeamMember:", error);
      return null;
    }
  };

  const deactivateTeamMember = async (adminId) => {
    try {
      const res = await apidelete(`api/v1/admin/team/${adminId}`);
      return res?.data || null;
    } catch (error) {
      console.error("API Error - deactivateTeamMember:", error);
      return null;
    }
  };

  return {
    listTeamMembers,
    addTeamMember,
    getTeamMemberDetails,
    updateTeamMember,
    deactivateTeamMember,
  };
};

export default useTeam;
