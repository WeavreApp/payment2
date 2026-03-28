"use client";

import { useState } from "react";
import PaymentForm from "@/components/admin/PaymentForm";

export default function PaymentsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Record Payment</h1>
        <p className="text-gray-600 mt-2">
          Manually record a student payment
        </p>
      </div>

      <div className="max-w-2xl">
        <PaymentForm onSuccess={() => setRefreshKey(k => k + 1)} />
      </div>
    </div>
  );
}
