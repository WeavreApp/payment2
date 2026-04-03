"use client";

import { useEffect, useState } from "react";
import DashboardStats from "@/components/admin/DashboardStats";
import PaymentChart from "@/components/admin/PaymentChart";
import {
  getPaymentStats,
  getMonthlyCollections,
  getPaymentStatusDistribution,
} from "@/app/actions/payments";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCollected: 0,
    totalOutstanding: 0,
    pendingReviewCount: 0,
  });
  const [monthlyData, setMonthlyData] = useState<
    Array<{ month: string; amount: number }>
  >([]);
  const [statusDistribution, setStatusDistribution] = useState({
    fullyPaid: 0,
    partial: 0,
    outstanding: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    const [statsRes, monthlyRes, distributionRes] = await Promise.all([
      getPaymentStats(),
      getMonthlyCollections(),
      getPaymentStatusDistribution(),
    ]);

    if (statsRes.data) {
      setStats(statsRes.data);
    }
    if (monthlyRes.data) {
      setMonthlyData(monthlyRes.data);
    }
    if (distributionRes.data) {
      setStatusDistribution(distributionRes.data);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Overview of school payment management system
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading dashboard data...</div>
      ) : (
        <div className="space-y-8">
          <DashboardStats
            totalStudents={stats.totalStudents}
            totalCollected={stats.totalCollected}
            totalOutstanding={stats.totalOutstanding}
            pendingReviewCount={stats.pendingReviewCount}
          />

          <PaymentChart
            monthlyData={monthlyData}
            statusDistribution={statusDistribution}
          />
        </div>
      )}
    </div>
  );
}
