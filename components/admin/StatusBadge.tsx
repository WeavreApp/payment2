import { CircleCheck as CheckCircle2, Clock, CircleAlert as AlertCircle, Circle as XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: "Fully Paid" | "Partial" | "Outstanding" | "Verified" | "Pending" | "Flagged" | "Rejected";
  variant?: "compact" | "full";
}

export default function StatusBadge({ status, variant = "full" }: StatusBadgeProps) {
  const statusConfig: Record<string, { bg: string; text: string; icon: any }> = {
    "Fully Paid": { bg: "bg-green-50", text: "text-green-700", icon: CheckCircle2 },
    Partial: { bg: "bg-amber-50", text: "text-amber-700", icon: Clock },
    Outstanding: { bg: "bg-red-50", text: "text-red-700", icon: AlertCircle },
    Verified: { bg: "bg-green-50", text: "text-green-700", icon: CheckCircle2 },
    Pending: { bg: "bg-blue-50", text: "text-blue-700", icon: Clock },
    Flagged: { bg: "bg-red-50", text: "text-red-700", icon: AlertCircle },
    Rejected: { bg: "bg-gray-50", text: "text-gray-700", icon: XCircle },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  if (variant === "compact") {
    return <Icon size={20} className={config.text} />;
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg}`}>
      <Icon size={16} className={config.text} />
      <span className={`text-sm font-medium ${config.text}`}>{status}</span>
    </div>
  );
}
