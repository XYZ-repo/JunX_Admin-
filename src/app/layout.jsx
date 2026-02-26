"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Sidebar from "../components/layout/Sidebar";
import ReduxProvider from "../../redux/Provider";
import PrivateRoute from "../components/PrivateRoute";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);

    const saved = localStorage.getItem("JunXyz_sidebarCollapsed");
    if (saved !== null) {
      setSidebarCollapsed(JSON.parse(saved));
    }
    setIsLoading(false);
  }, []);

  const toggleCollapse = () => {
    const value = !sidebarCollapsed;
    setSidebarCollapsed(value);
    if (isClient) {
      localStorage.setItem("JunXyz_sidebarCollapsed", JSON.stringify(value));
    }
  };

  const user = {
    name: "John Doe",
    email: "john@example.com",
    initials: "JD",
    role: "Owner",
    business: "My Business",
    plan: "Silver",
  };

  const dashboardRoutes = [
    "/admin",
    "/customers",
    "/wait-list",
    "/all-providers",
    "/all-bookings",
    "/all-clients",
  ];

  const useDashboardLayout = dashboardRoutes.some((route) =>
    pathname?.startsWith(route),
  );

  if (isLoading) {
    return (
      <html lang="en" suppressHydrationWarning>
        <head>
          <title>JunXyz Admin</title>
          <link rel="icon" href="/favicon.ico" />
        </head>
        <body
          className="min-h-screen flex items-center justify-center bg-gray-50"
          suppressHydrationWarning
        >
          <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-dashed border-primary" />
        </body>
      </html>
    );
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>JunXyz | Admin Dashboard</title>
        <meta
          name="description"
          content="Admin dashboard for JunXyz platform."
        />
        <meta name="keywords" content="admin dashboard, JunXyz, platform" />
        <link rel="icon" href="/favicon.ico" />
      </head>

      <body className="min-h-screen bg-gray-50" suppressHydrationWarning>
        <ReduxProvider>
          <PrivateRoute>
            <Toaster position="top-center" />

            {useDashboardLayout ? (
              <div className="min-h-screen">
                <Sidebar
                  isOpen={sidebarOpen}
                  onClose={() => setSidebarOpen(false)}
                  isCollapsed={sidebarCollapsed}
                  onToggleCollapse={toggleCollapse}
                  user={user}
                />

                <main
                  className={`  min-h-screen transition-all duration-300 ${
                    sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-72"
                  }`}
                >
                  <div className=" ">{children}</div>
                </main>
              </div>
            ) : (
              <div className="min-h-screen">{children}</div>
            )}
          </PrivateRoute>
        </ReduxProvider>
      </body>
    </html>
  );
}
