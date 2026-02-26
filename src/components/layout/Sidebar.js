"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  List,
  Search,
  LogOut,
  X,
  AlertTriangle,
  CreditCard,
} from "lucide-react";
import { useSelector } from "react-redux";
import useAuth from "../../../redux/hooks/useAuth";

const navigation = [
  { name: "Home", href: "/admin", icon: Home, badge: 10 },
  { name: "Customers", href: "/customers", icon: Users, badge: 2 },
  {
    name: "User Reports",
    href: "/admin/",
    icon: Users,
    badge: 2,
  },
  { name: "Wait-list", href: "/wait-list", icon: List, badge: null },
  {
    name: "Deals + Promo",
    href: "/admin/",
    icon: CreditCard,
    badge: null,
  },
];

export default function Sidebar({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}) {
  const pathname = usePathname();
  const [promoDismissed, setPromoDismissed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useSelector((state) => state.auth);
  const { LogoutUser } = useAuth();

  const isActive = (href) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen bg-white flex py-4 font-jakarta flex-col transition-all duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-[68px]" : "w-[290px]"}
          lg:translate-x-0 border-r border-gray-100`}
      >
        {/* Logo */}

        <div className=" flex items-center px-4 shrink-0 ">
          <button
            className="flex items-center gap-3"
            onClick={onToggleCollapse}
          >
            {isCollapsed ? (
              <img
                src="/sidebaricon.png"
                alt="JunXyz Logo"
                className="w-10 h-10 object-contain"
              />
            ) : (
              <img
                src="/sidebarlogo.png"
                alt="JunXyz Logo"
                className="h-9 w-auto"
              />
            )}
          </button>
        </div>

        {/* Search */}
        {!isCollapsed && (
          <div className="px-3 py-5 shrink-0 ">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-2">
              <Search className="w-4 h-4 text-[#475569] shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className=" text-sm text-[#475569] font-medium outline-none w-full"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto  px-3">
          <div className="space-y-0.5">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  title={isCollapsed ? item.name : undefined}
                  className={`flex items-center gap-3 px-2 py-2 rounded-lg transition-all duration-200 group
                    ${isCollapsed ? "justify-center" : "justify-between"}
                    ${
                      active
                        ? "bg-[#EEF2FF] border border-[#A5B4FC]"
                        : "hover:bg-gray-50"
                    }
                  `}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <item.icon
                      className={`w-[18px] h-[18px] shrink-0 transition-colors duration-200 
                        ${
                          active
                            ? "text-[#4F46E5]"
                            : "text-[#94A3B8] group-hover:text-[#4F46E5]"
                        }
                      `}
                    />
                    {!isCollapsed && (
                      <span
                        className={`text-[16px] leading-6 font-semibold truncate transition-colors duration-200 
                          ${
                            active
                              ? "text-[#4F46E5]"
                              : "text-[#1E293B] group-hover:text-[#4F46E5]"
                          }
                        `}
                      >
                        {item.name}
                      </span>
                    )}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[14px] font-semibold rounded-full px-2 py-0.5 shrink-0
                        ${
                          active
                            ? "text-[#4F46E5] bg-[#EEF2FF] border border-[#A5B4FC]"
                            : "text-[#4F46E5] bg-[#EEF2FF] border border-[#A5B4FC]"
                        }
                      `}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Promo Card */}
        {!isCollapsed && !promoDismissed && (
          <div className="mx-3 mb-3 p-4 bg-[#F8FAFC]  rounded-xl relative shrink-0">
            <button
              onClick={() => setPromoDismissed(true)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="w-9 h-9 rounded-full bg-[#E2E8F0] flex items-center justify-center text-[#475569]  ">
              <AlertTriangle className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-[14px] text-gray-600 leading-4 my-4">
              Enjoy unlimited access to our app with only a small price monthly.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPromoDismissed(true)}
                className="text-[14px] text-[#475569]   font-medium"
              >
                Dismiss
              </button>
              <button className="text-[14px] text-[#4F46E5]   font-medium">
                Go Pro
              </button>
            </div>
          </div>
        )}

        {/* User Profile */}
        <div className="px-3 pb-3 shrink-0 border-t border-gray-100 pt-3">
          <div
            className={`flex items-center gap-2 ${
              isCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                {user?.profileImageUrl ? (
                  <img
                    src={user?.profileImageUrl}
                    alt={user?.firstName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-semibold text-gray-600">
                    {user?.firstName?.charAt(0)} {user?.lastName?.charAt(0)}
                  </span>
                )}
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <p className="text-[16px] font-bold text-[#1E293B] truncate leading-tight">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-[#475569] truncate leading-tight">
                    {user?.userName}
                  </p>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <button
                onClick={LogoutUser}
                className="text-[#475569] hover:text-gray-600 shrink-0"
              >
                <LogOut className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
