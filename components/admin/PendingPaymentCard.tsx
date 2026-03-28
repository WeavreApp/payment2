"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";
import { Download, Check, X, CircleAlert as AlertCircle } from "lucide-react";
import { updatePaymentStatus, getFraudFlags } from "@/app/actions/payments";
import type { Database } from "@/types/database";

type Payment = Database["public"]["Tables"]["payments"]["Row"];

interface PendingPaymentCardProps {
  payment: Payment & { studentName?: string };
  onAction: () => void;
}

export default function PendingPaymentCard({
  payment,
  onAction,
}: PendingPaymentCardProps) {
  const [loading, setLoading] = useState(false);
  const [fraudFlags, setFraudFlags] = useState<any[]>([]);
  const [showFlags, setShowFlags] = useState(false);

  const handleLoadFlags = async () => {
    const res = await getFraudFlags(payment.id);
    if (res.data) {
      setFraudFlags(res.data);
    }
    setShowFlags(!showFlags);
  };

  const handleVerify = async () => {
    setLoading(true);
    const result = await updatePaymentStatus(payment.id, "Verified");
    setLoading(false);
    if (!result.error) {
      onAction();
    }
  };

  const handleReject = async () => {
    setLoading(true);
    const reason = prompt("Enter rejection reason (optional):");
    const result = await updatePaymentStatus(
      payment.id,
      "Rejected",
      reason || undefined
    );
    setLoading(false);
    if (!result.error) {
      onAction();
    }
  };

  const handleFlag = async () => {
    setLoading(true);
    const reason = prompt("Enter flag reason:");
    if (reason) {
      const result = await updatePaymentStatus(
        payment.id,
        "Flagged",
        reason
      );
      setLoading(false);
      if (!result.error) {
        onAction();
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-gray-600">Transaction ID</p>
            <p className="font-mono text-lg font-semibold text-gray-900">
              {payment.transaction_id}
            </p>
          </div>
          <StatusBadge status={payment.status as any} />
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
          <div>
            <p className="text-sm text-gray-600">Student</p>
            <p className="font-medium text-gray-900">
              {payment.studentName || "Unknown"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Amount</p>
            <p className="font-medium text-gray-900">
              ₦{payment.amount.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Parent Name</p>
            <p className="font-medium text-gray-900">
              {payment.parent_name || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Parent Phone</p>
            <p className="font-medium text-gray-900">
              {payment.parent_phone || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Reference Number</p>
            <p className="font-medium text-gray-900 font-mono">
              {payment.reference_number || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Payment Date</p>
            <p className="font-medium text-gray-900">
              {new Date(payment.payment_date).toLocaleDateString()}
            </p>
          </div>
        </div>

        {payment.notes && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Notes</p>
            <p className="text-gray-700">{payment.notes}</p>
          </div>
        )}

        {payment.status === "Flagged" && payment.flagged_reason && (
          <div className="mb-6 pb-6 border-b border-gray-200 bg-red-50 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <div>
                <p className="font-medium text-red-900">Flags Detected</p>
                <p className="text-sm text-red-700 mt-1">
                  {payment.flagged_reason}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <p className="text-sm font-medium text-gray-700">Uploaded Proof</p>
            {payment.receipt_url && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleLoadFlags}
                className="text-sm text-blue-600 hover:bg-blue-50"
              >
                <AlertCircle size={16} className="mr-1" />
                View Checks
              </Button>
            )}
          </div>

          {showFlags && fraudFlags.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <p className="font-medium text-amber-900 mb-3">Fraud Detection Results</p>
              <div className="space-y-2">
                {fraudFlags.map((flag) => (
                  <div key={flag.id} className="text-sm text-amber-700">
                    <span className="font-medium">{flag.flag_type}:</span> {JSON.stringify(flag.details)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {payment.receipt_url && (
            <a
              href={payment.receipt_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
            >
              <Download size={16} />
              Download Receipt
            </a>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleVerify}
            disabled={loading}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white gap-2"
          >
            <Check size={18} />
            Verify Payment
          </Button>
          <Button
            onClick={handleFlag}
            disabled={loading}
            variant="outline"
            className="gap-2 border-amber-200 text-amber-600 hover:bg-amber-50"
          >
            <AlertCircle size={18} />
            Flag for Review
          </Button>
          <Button
            onClick={handleReject}
            disabled={loading}
            variant="outline"
            className="gap-2 border-red-200 text-red-600 hover:bg-red-50"
          >
            <X size={18} />
            Reject
          </Button>
        </div>
      </div>
    </Card>
  );
}
