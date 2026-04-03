"use client";

import { useEffect, useState } from "react";
import PendingPaymentCard from "@/components/admin/PendingPaymentCard";
import {
  getPendingPayments,
  getPaymentById,
} from "@/app/actions/payments";
import { getStudentById } from "@/app/actions/students";
import { Card } from "@/components/ui/card";
import type { Database } from "@/types/database";

type Payment = Database["public"]["Tables"]["payments"]["Row"];

interface EnrichedPayment extends Payment {
  studentName?: string;
}

export default function PendingReviewPage() {
  const [payments, setPayments] = useState<EnrichedPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    const res = await getPendingPayments();

    if (res.data) {
      const enriched = await Promise.all(
        (res.data as any).map(async (payment: any) => {
          const studentRes = await getStudentById(payment.student_id);
          return {
            ...payment,
            studentName: (studentRes.data as any)?.full_name,
          };
        })
      );
      setPayments(enriched);
    }

    setLoading(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Pending Review</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Review and verify parent-submitted payments
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading pending payments...</div>
      ) : payments.length === 0 ? (
        <Card className="border-0 shadow-sm p-8 text-center">
          <p className="text-gray-600">No pending payments to review</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <PendingPaymentCard
              key={payment.id}
              payment={payment}
              onAction={loadPayments}
            />
          ))}
        </div>
      )}
    </div>
  );
}
