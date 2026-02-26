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
import CustomerDrawer from "../../components/others/CustomerDrawer";
import useCustomer from "../../../redux/hooks/useCustomer";

export default function CustomersTabel({
  hideHeader = true,
  hidePagination = true,
}) {
  const [rows, setRows] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  });

  const [selectedMembership, setSelectedMembership] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const searchTimeoutRef = useRef(null);

  const {
    listCustomers,
    getCustomerDetails,
    temporaryBanCustomer,
    permanentBanCustomer,
    unbanCustomer,
  } = useCustomer();

  useEffect(() => {
    if (debouncedSearch === "" || debouncedSearch.length >= 3) {
      fetchCustomers();
    }
  }, [currentPage, debouncedSearch, selectedMembership]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const searchValue = debouncedSearch.length >= 3 ? debouncedSearch : "";

      const filters = {
        page: currentPage,
        limit: 20,
        search: "Jone",
        membershipLevel: selectedMembership || undefined,
      };

      const response = await listCustomers(filters);

      if (response && response.data && response.data.customers) {
        const formattedCustomers = response.data.customers.map((customer) => ({
          id: customer.authId,
          authId: customer.authId,
          name:
            `${customer.firstName || ""} ${customer.lastName || ""}`.trim() ||
            "No Name",
          initials: getInitials(customer?.firstName, customer?.lastName),
          handle: `@${customer.userName || "username"}`,
          email: customer.email || "",
          membership: customer?.membershipLevel,
          joinDate: formatDate(customer.createdAt),
          status: customer?.isBanned,
          avatar: customer?.profileImageUrl,
          checked: false,
          phoneNumber: customer?.phoneNumber,
          location: customer?.location,
          gender: customer?.gender,
          sexualOrientation: customer?.sexualOrientation,
          pronouns: customer?.pronouns,
          linkedin: customer?.linkedin,
          isBanned: customer?.isBanned,
          banReason: customer?.banReason,
          banExpiry: customer?.banExpiry,
        }));

        setRows(formattedCustomers);
        setPagination({
          total: response.data.total || 0,
          page: response.data.page || 1,
          limit: response.data.limit || 20,
          totalPages: response.data.totalPages || 1,
        });
        setAllChecked(false);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
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
    setLoading(false);
    try {
      const response = await getCustomerDetails(row.authId);
      if (response && response.data) {
        const customerData = response.data;
        setSelectedCustomer(customerData);
      } else {
        setSelectedCustomer(row);
      }
      setDrawerOpen(true);
    } catch (error) {
      console.error("Error fetching customer details:", error);
      setSelectedCustomer(row);
      setDrawerOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedCustomer(null);
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

  const handleBanUser = async (authId, type, reason = "Violation of terms") => {
    try {
      if (type === "temporary") {
        await temporaryBanCustomer(authId, reason);
      } else {
        await permanentBanCustomer(authId, reason);
      }
      fetchCustomers();
    } catch (error) {
      console.error("Error banning user:", error);
    }
  };

  const handleUnbanUser = async (authId) => {
    try {
      await unbanCustomer(authId);
      fetchCustomers();
    } catch (error) {
      console.error("Error unbanning user:", error);
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

  const filterByMembership = (level) => {
    setSelectedMembership(level);
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
      <div className=" bg-white max-w-7xl mx-auto">
        <div className="px-2">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden px-6 py-4">
            {hideHeader && (
              <>
                <div className="flex items-center justify-between py-3">
                  <h2 className="text-[24px] font-semibold text-[#1B2128] font-inter">
                    Approved Customers
                  </h2>
                  <button className="flex items-center gap-2 px-4 py-2.5 border text-black border-black rounded-[10px] text-[14px] font-medium transition-colors hover:bg-gray-50">
                    Download
                    <CloudDownload className="w-5 h-5 text-black" />
                  </button>
                </div>

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
                  </div>

                  <div className="relative">
                    <button
                      onClick={toggleFilters}
                      className="flex items-center gap-1.5 border border-[#AEAEB2] rounded-lg px-3 py-2 text-[14px] text-[#AEAEB2] hover:bg-gray-50 transition-colors"
                    >
                      Filter
                      <SlidersHorizontal className="w-4 h-4 text-[#AEAEB2]" />
                    </button>

                    {showFilters && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <div className="py-1">
                          <button
                            onClick={() => filterByMembership("")}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            All Memberships
                          </button>
                          <button
                            onClick={() => filterByMembership("general")}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            General
                          </button>
                          <button
                            onClick={() => filterByMembership("pro")}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Pro
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#E4E4E4] text-gray-500 hover:bg-gray-50 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}

            {/* ── Table ── */}
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
                    <th className="px-3 py-3 text-left text-[14px] font-semibold text-[#534D59] whitespace-nowrap">
                      Users
                      <span className="ml-1 text-gray-300 text-[11px]">⇅</span>
                    </th>
                    <th className="px-3 py-3 text-left text-[14px] font-semibold text-[#534D59] whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-3 py-3 text-left text-[14px] font-semibold text-[#534D59] whitespace-nowrap">
                      E-mail
                    </th>
                    <th className="px-3 py-3 text-left text-[14px] font-semibold text-[#534D59] whitespace-nowrap">
                      Membership
                    </th>
                    <th className="px-3 py-3 text-left text-[14px] font-semibold text-[#534D59] whitespace-nowrap">
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
                          ? "No customers found matching your search"
                          : "No customers found"}
                      </td>
                    </tr>
                  ) : (
                    rows.map((row) => {
                      const s = statusConfig[row.status] || statusConfig.active;
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
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${s?.bg} ${s?.text}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${s?.dot}`}
                              />
                              {s?.label}
                            </span>
                          </td>

                          <td className="px-3 py-3 border-b text-[14px] font-[400] text-[#1B2128]">
                            {row.email}
                          </td>

                          <td className="px-3 py-3 border-b text-[14px] font-[400] text-[#1B2128]">
                            <span
                              className={`capitalize whitespace-nowrap ${
                                row.membership === "pro"
                                  ? "text-blue-600 font-semibold"
                                  : ""
                              }`}
                            >
                              {row.membership}
                            </span>
                          </td>

                          <td className="px-3 py-3 border-b text-[14px] font-[400] text-[#1B2128] whitespace-nowrap">
                            {row.joinDate}
                          </td>

                          <td className="px-3 py-3 border-b">
                            <div className="flex items-center gap-x-5">
                              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                <CircleAlert className="w-5 h-5" />
                              </button>
                              {row.isBanned ? (
                                <button
                                  onClick={() => handleUnbanUser(row.authId)}
                                  className="text-green-500 hover:text-green-600 transition-colors text-xs font-medium"
                                >
                                  Unban
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleBanUser(
                                      row.authId,
                                      "permanent",
                                      "Violation of terms",
                                    )
                                  }
                                  className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {hidePagination && (
              <>
                {!loading && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1 pt-5 pb-2">
                    {renderPagination()}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <CustomerDrawer
        isOpen={drawerOpen}
        onClose={closeDrawer}
        customer={selectedCustomer}
        onBan={handleBanUser}
        onUnban={handleUnbanUser}
      />
    </>
  );
}
