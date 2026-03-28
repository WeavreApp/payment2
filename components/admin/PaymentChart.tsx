"use client";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";

interface MonthlyData {
  month: string;
  amount: number;
}

interface StatusDistribution {
  fullyPaid: number;
  partial: number;
  outstanding: number;
}

interface PaymentChartProps {
  monthlyData: MonthlyData[];
  statusDistribution: StatusDistribution;
}

export default function PaymentChart({
  monthlyData,
  statusDistribution,
}: PaymentChartProps) {
  const statusData = [
    { name: "Fully Paid", value: statusDistribution.fullyPaid, color: "#10B981" },
    { name: "Partial", value: statusDistribution.partial, color: "#F59E0B" },
    { name: "Outstanding", value: statusDistribution.outstanding, color: "#EF4444" },
  ];

  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split("-");
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleString("default", { month: "short", year: "2-digit" });
  };

  const chartData = monthlyData.map((data) => ({
    month: formatMonth(data.month),
    amount: data.amount,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-0 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Payment Collections - Last 6 Months
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="amount" fill="#3B82F6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="border-0 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Payment Status Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
