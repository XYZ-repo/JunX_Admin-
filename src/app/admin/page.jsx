"use client";

import React, { useState, useEffect } from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import useDashboard from "../../../redux/hooks/useDashboard";
import Link from "next/link";
import CustomersTabel from "../../components/others/CustomersTabel";

function SemicircleGauge({ value, max = 500 }) {
  const data = [{ value }];

  return (
    <div className="relative flex items-center justify-center">
      <RadialBarChart
        width={220}
        height={120}
        cx={110}
        cy={110}
        innerRadius={80} // Thicker
        outerRadius={105} // Thicker
        startAngle={180}
        endAngle={0}
        data={data}
        barSize={18}
      >
        <PolarAngleAxis type="number" domain={[0, max]} tick={false} />

        <RadialBar
          background={{ fill: "#6B97B1BF" }} // Keep original track
          dataKey="value"
          fill="#BEC8CF"
          cornerRadius={20}
        />
      </RadialBarChart>

      <span className="absolute bottom-6 text-[36px] font-bold text-gray-900 leading-none">
        {value}
      </span>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalWaitlistUsers: 0,
    generalWaitlistUsers: 0,
    proWaitlistUsers: 0,
    totalSignups: 0,
    totalActiveUsers: 0,
    totalBannedUsers: 0,
    totalCustomers: 0,
    todaySignups: 0,
  });

  const { DashboardStats } = useDashboard();
  const fetchDashboardStats = async () => {
    try {
      const response = await DashboardStats();
      if (response && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const proWaitlistPercentage =
    stats.totalWaitlistUsers > 0
      ? Math.round((stats.proWaitlistUsers / stats.totalWaitlistUsers) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] max-w-7xl mx-auto ">
      <img
        src="./topbg-gradient.png"
        alt=""
        className="h-auto w-full object-contain"
      />

      <div className="px-2 ">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3 font-inter">
          <div className="bg-white rounded-2xl p-5">
            <p className="text-[20px] font-semibold text-[#131313] leading-tight mb-4">
              General Wait-list
            </p>
            <p className="text-[48px] font-[500] text-[#131313] leading-tight">
              {stats.generalWaitlistUsers}
            </p>
            <div className="pt-14">
              <Link
                href="/waitlist?filter=general"
                className="text-[14px] font-[400] text-[#131313] leading-tight"
              >
                All General Membership →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5">
            <p className="text-[20px] font-semibold text-[#131313] leading-tight mb-4">
              Professional Wait-list
            </p>
            <p className="text-[48px] font-[500] text-[#131313] leading-tight">
              {proWaitlistPercentage}%
            </p>
            <p className="text-[14px] text-[#454545] mt-1">
              {stats.proWaitlistUsers} out of {stats.totalWaitlistUsers} total
              waitlist
            </p>
            <div className="mt-4 pt-3">
              <Link
                href="/waitlist?filter=pro"
                className="text-[14px] font-[400] text-[#131313] leading-tight"
              >
                All Professional Membership →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5">
            <p className="text-[20px] font-semibold text-[#131313] leading-tight mb-4 text-center">
              Total Sign Ups
            </p>
            <div className="flex justify-center">
              <SemicircleGauge value={stats.totalSignups} max={5000} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden  py-4">
          <h2 className="text-[24px] font-semibold text-[#1B2128] font-inter pt-5 pb-3 px-8">
            Customers
          </h2>
          <CustomersTabel hideHeader={false} hidePagination={false} />
          <div className="px-8 py-3  ">
            <Link
              href="/customers"
              className="text-[14px] font-[400] text-black"
            >
              All customers →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
