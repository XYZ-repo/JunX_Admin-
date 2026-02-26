"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Trash2,
  CircleAlert,
  Search,
  SlidersHorizontal,
  MoreVertical,
  CloudDownload,
} from "lucide-react";
import { statusConfig } from "../../components/Utils";
import WaitListDrawer from "../../components/others/WaitListDrawer";
import useWaitlist from "../../../redux/hooks/useWaitlist";

export default function Waitlist() {
  const [rows, setRows] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  });

  const searchTimeoutRef = useRef(null);

  const {
    listWaitlistUsers,
    getWaitlistUserDetails,
    approveAsPro,
    approveAsGeneral,
    rejectUser,
    requestProfileResubmit,
    requestReverification,
    getVerificationMethod,
  } = useWaitlist();

  useEffect(() => {
    if (debouncedSearch === "" || debouncedSearch.length >= 3) {
      fetchWaitlistUsers();
    }
  }, [currentPage, debouncedSearch, selectedStatus]);

  const fetchWaitlistUsers = async () => {
    setLoading(true);
    try {
      const searchValue = debouncedSearch.length >= 3 ? debouncedSearch : "";

      const filters = {
        page: currentPage,
        limit: 20,
        search: searchValue,
        verificationStatus: selectedStatus || "pending",
      };

      const response = await listWaitlistUsers(filters);

      if (response && response.data && response.data.waitlistUsers) {
        const formattedUsers = response.data.waitlistUsers.map((user) => ({
          id: user.authId,
          authId: user.authId,
          name:
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            "No Name",
          initials: getInitials(user.firstName, user.lastName),
          handle: `@${user.userName || "username"}`,
          email: user.email || "",
          membership: user.membershipLevel || "pending",
          joinDate: formatDate(user.createdAt),
          status: user.verificationStatus || "pending",
          avatar: user.profileImageUrl,
          checked: false,
          phoneNumber: user.phoneNumber,
          location: user.location,
          gender: user.gender,
          sexualOrientation: user.sexualOrientation,
          pronouns: user.pronouns,
          linkedin: user.linkedin,
        }));

        setRows(formattedUsers);
        setPagination({
          total: response.data.total || 0,
          page: response.data.page || 1,
          limit: response.data.limit || 20,
          totalPages: response.data.totalPages || 1,
        });
        setAllChecked(false);
      }
    } catch (error) {
      console.error("Error fetching waitlist users:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return "??";
    const first = firstName ? firstName.charAt(0) : "";
    const last = lastName ? lastName.charAt(0) : "";
    return (first + last).toUpperCase() || "?";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const openDrawer = async (row) => {
    setLoading(true);
    try {
      const response = await getWaitlistUserDetails(row.authId);

      const verificationResponse = await getVerificationMethod(row.authId);

      if (response && response.data) {
        const userData = response.data;
        const enhancedUser = {
          ...row,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phoneNumber: userData.phoneNumber,
          location: userData.location,
          gender: userData.gender,
          sexualOrientation: userData.sexualOrientation,
          pronouns: userData.pronouns,
          linkedin: userData.linkedin,
          height: userData.height,
          dateOfBirth: userData.dateOfBirth,
          zodiac: userData.zodiac,
          ethnicity: userData.ethnicity,
          children: userData.children,
          aboutMe: userData.aboutMe,
          verificationMethod: verificationResponse?.data?.method || null,
          verificationDate:
            verificationResponse?.data?.verificationDate || null,
        };
        setSelectedCustomer(enhancedUser);
      } else {
        setSelectedCustomer(row);
      }
      setDrawerOpen(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setSelectedCustomer(row);
      setDrawerOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedCustomer(null);
    fetchWaitlistUsers();
  };

  const toggleRow = (id) =>
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, checked: !r.checked } : r)),
    );

  const toggleAll = () => {
    const newChecked = !allChecked;
    setAllChecked(newChecked);
    setRows((prev) => prev.map((r) => ({ ...r, checked: newChecked })));
  };

  const handleApprovePro = async (authId) => {
    try {
      await approveAsPro(authId);
      fetchWaitlistUsers();
      closeDrawer();
    } catch (error) {
      console.error("Error approving as pro:", error);
    }
  };

  const handleApproveGeneral = async (authId) => {
    try {
      await approveAsGeneral(authId);
      fetchWaitlistUsers();
      closeDrawer();
    } catch (error) {
      console.error("Error approving as general:", error);
    }
  };

  const handleRejectUser = async (authId, reason) => {
    try {
      await rejectUser(authId, reason);
      fetchWaitlistUsers();
      closeDrawer();
    } catch (error) {
      console.error("Error rejecting user:", error);
    }
  };

  const handleRequestResubmit = async (authId, reason) => {
    try {
      await requestProfileResubmit(authId, reason);
      fetchWaitlistUsers();
      closeDrawer();
    } catch (error) {
      console.error("Error requesting resubmit:", error);
    }
  };

  const handleRequestReverify = async (authId, reason) => {
    try {
      await requestReverification(authId, reason);
      fetchWaitlistUsers();
      closeDrawer();
    } catch (error) {
      console.error("Error requesting reverification:", error);
    }
  };

  const renderPagination = () => {
    const pages = [];
    const totalPages = pagination.totalPages;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, null, totalPages - 2, totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 2, 3, null, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          null,
          currentPage - 1,
          currentPage,
          currentPage + 1,
          null,
          totalPages,
        );
      }
    }

    return pages.map((p, i) => {
      if (p === null) {
        return (
          <span
            key={`ellipsis-${i}`}
            className="px-2 text-[13px] text-[#1B2128] select-none"
          >
            ...
          </span>
        );
      }
      const active = currentPage === p;
      return (
        <button
          key={p}
          onClick={() => setCurrentPage(p)}
          className={`w-10 h-10 flex items-center justify-center rounded-lg text-[13px] font-medium text-[#1B2128] transition-colors
            ${active ? "border border-[#E4E4E4]" : ""}`}
        >
          {String(p).padStart(2, "0")}
        </button>
      );
    });
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (value === "" || value.length >= 3) {
        setDebouncedSearch(value);
      } else {
        setDebouncedSearch("");
      }
    }, 500);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const filterByStatus = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
    setShowFilters(false);
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const SkeletonRow = () => (
    <tr className="border-b border-gray-50">
      <td className="px-4 py-3 border-b">
        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
      </td>
      <td className="px-3 py-3 border-b">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse"></div>
          <div>
            <div className="w-32 h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
            <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </td>
      <td className="px-3 py-3 border-b">
        <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
      </td>
      <td className="px-3 py-3 border-b">
        <div className="w-40 h-4 bg-gray-200 rounded animate-pulse"></div>
      </td>
      <td className="px-3 py-3 border-b">
        <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
      </td>
      <td className="px-3 py-3 border-b">
        <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
      </td>
      <td className="px-3 py-3 border-b">
        <div className="flex items-center gap-x-5">
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </td>
    </tr>
  );

  return (
    <>
      <div className="min-h-screen bg-white max-w-7xl mx-auto">
        <div className="px-2">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden px-6 py-4">
            {/* Row 1: Title + Download */}
            <div className="flex items-center justify-between py-3">
              <h2 className="text-[24px] font-semibold text-[#1B2128] font-inter">
                Wait-List Users
                {pagination.total > 0 && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({pagination.total} total)
                  </span>
                )}
              </h2>
              <button className="flex items-center gap-2 px-4 py-2.5 border text-black border-black rounded-[10px] text-[14px] font-medium transition-colors hover:bg-gray-50">
                Download
                <CloudDownload className="w-5 h-5 text-black" />
              </button>
            </div>

            {/* Row 2: Search + Filter + More */}
            <div className="flex items-center justify-end gap-2 pb-4 relative">
              <div className="flex items-center gap-2 border border-[#E4E4E4] rounded-lg px-3 py-2 bg-white w-48 relative">
                <Search className="w-3.5 h-3.5 text-[#959595] shrink-0" />
                <input
                  type="text"
                  placeholder="Search (min. 3 chars)"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="bg-transparent text-[13px] text-gray-700 placeholder-[#959595] outline-none w-full"
                />
                {searchQuery.length > 0 && searchQuery.length < 3 && (
                  <span className="absolute -bottom-5 left-0 text-[10px] text-orange-500 whitespace-nowrap">
                    Type at least 3 characters
                  </span>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={toggleFilters}
                  className="flex items-center gap-1.5 border border-[#AEAEB2] rounded-lg px-3 py-2 text-[14px] text-[#AEAEB2] hover:bg-gray-50 transition-colors"
                >
                  Filter by: {selectedStatus}
                  <SlidersHorizontal className="w-4 h-4 text-[#AEAEB2]" />
                </button>

                {showFilters && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="py-1">
                      <button
                        onClick={() => filterByStatus("pending")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Pending
                      </button>
                      <button
                        onClick={() => filterByStatus("resubmitted")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Resubmitted
                      </button>
                      <button
                        onClick={() => filterByStatus("rejected")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Rejected
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#E4E4E4] text-gray-500 hover:bg-gray-50 transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto font-inter border rounded-2xl border-[#E4E4E4]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="w-10 px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={allChecked}
                        onChange={toggleAll}
                        className="w-4 h-4 rounded-full border-gray-300 accent-[#6B97B1]"
                      />
                    </th>
                    <th className="px-3 py-3 text-left text-[14px] font-semibold text-[#534D59]">
                      Users
                      <span className="ml-1 text-gray-300 text-[11px]">⇅</span>
                    </th>
                    <th className="px-3 py-3 text-left text-[14px] font-semibold text-[#534D59]">
                      Status
                    </th>
                    <th className="px-3 py-3 text-left text-[14px] font-semibold text-[#534D59]">
                      E-mail
                    </th>
                    <th className="px-3 py-3 text-left text-[14px] font-semibold text-[#534D59]">
                      Membership
                    </th>
                    <th className="px-3 py-3 text-left text-[14px] font-semibold text-[#534D59]">
                      Join Date
                    </th>
                    <th className="px-3 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <>
                      <SkeletonRow />
                      <SkeletonRow />
                      <SkeletonRow />
                      <SkeletonRow />
                      <SkeletonRow />
                    </>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center py-8 text-gray-500"
                      >
                        {debouncedSearch.length >= 3
                          ? "No users found matching your search"
                          : "No waitlist users found"}
                      </td>
                    </tr>
                  ) : (
                    rows.map((row) => {
                      const s =
                        statusConfig[row.status] || statusConfig.pending;
                      return (
                        <tr
                          key={row.id}
                          className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 border-b">
                            <input
                              type="checkbox"
                              checked={row.checked}
                              onChange={() => toggleRow(row.id)}
                              className="w-4 h-4 rounded border-gray-300 accent-[#6B97B1]"
                            />
                          </td>

                          <td className="px-3 py-3 border-b">
                            <div className="flex items-center gap-2.5">
                              <div
                                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[12px] font-[400] shrink-0 overflow-hidden"
                                style={{
                                  backgroundColor: row.avatar
                                    ? "transparent"
                                    : "#6B97B1",
                                }}
                              >
                                {row.avatar ? (
                                  <img
                                    src={row.avatar}
                                    alt={row.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  row.initials
                                )}
                              </div>
                              <div
                                onClick={() => openDrawer(row)}
                                className="cursor-pointer"
                              >
                                <p className="text-[14px] text-[#1B2128] font-semibold leading-tight">
                                  {row.name}
                                </p>
                                <p className="text-[12px] text-[#959595]">
                                  {row.handle}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-3 py-3 border-b">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${s.bg} ${s.text}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${s.dot}`}
                              />
                              {s.label}
                            </span>
                          </td>

                          <td className="px-3 py-3 border-b text-[14px] font-[400] text-[#1B2128]">
                            {row.email}
                          </td>

                          <td className="px-3 py-3 border-b text-[14px] font-[400] text-[#1B2128]">
                            <span className="capitalize">{row.membership}</span>
                          </td>

                          <td className="px-3 py-3 border-b text-[14px] font-[400] text-[#1B2128]">
                            {row.joinDate}
                          </td>

                          <td className="px-3 py-3 border-b">
                            <div className="flex items-center gap-x-5">
                              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                <CircleAlert className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => openDrawer(row)}
                                className="text-gray-400 hover:text-blue-500 transition-colors"
                              >
                                View
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!loading && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 pt-5 pb-2">
                {renderPagination()}
              </div>
            )}
          </div>
        </div>
      </div>

      <WaitListDrawer
        isOpen={drawerOpen}
        onClose={closeDrawer}
        customer={selectedCustomer}
        onApprovePro={handleApprovePro}
        onApproveGeneral={handleApproveGeneral}
        onReject={handleRejectUser}
        onRequestResubmit={handleRequestResubmit}
        onRequestReverify={handleRequestReverify}
      />
    </>
  );
}
