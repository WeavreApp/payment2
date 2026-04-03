import { Users, DollarSign, CircleAlert as AlertCircle, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

interface DashboardStatsProps {
  totalStudents: number;
  totalCollected: number;
  totalOutstanding: number;
  pendingReviewCount: number;
}

export default function DashboardStats({
  totalStudents,
  totalCollected,
  totalOutstanding,
  pendingReviewCount,
}: DashboardStatsProps) {
  const stats = [
    {
      label: "Total Students",
      value: totalStudents.toString(),
      icon: Users,
      color: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Total Collected",
      value: `₦${totalCollected.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      label: "Outstanding Balance",
      value: `₦${totalOutstanding.toLocaleString()}`,
      icon: AlertCircle,
      color: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      label: "Pending Review",
      value: pendingReviewCount.toString(),
      icon: Clock,
      color: "bg-amber-50",
      textColor: "text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border-0 shadow-sm">
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
                  <p className="text-xl sm:text-2xl font-semibold text-gray-900 mt-2 truncate">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-2 sm:p-3 rounded-lg flex-shrink-0 ml-2`}>
                  <Icon className={`${stat.textColor} w-5 h-5 sm:w-6 sm:h-6`} />
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
