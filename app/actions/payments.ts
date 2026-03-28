"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import { generateTransactionId } from "@/lib/utils/transaction-id";
import { performFraudChecks } from "@/lib/utils/fraud-detection";

type Payment = Database["public"]["Tables"]["payments"]["Row"];
type PaymentInsert = Database["public"]["Tables"]["payments"]["Insert"];
type PaymentUpdate = Database["public"]["Tables"]["payments"]["Update"];

export async function createPayment(data: PaymentInsert) {
  const supabase = await createClient();

  const { data: payment, error } = await supabase
    .from("payments")
    .insert([data] as any)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data: payment };
}

export async function createParentPayment(
  studentName: string,
  studentClass: string,
  parentName: string,
  parentPhone: string,
  amount: number,
  referenceNumber: string,
  receiptHash: string,
  receiptUrl: string
) {
  const supabase = await createClient();

  const { data: students, error: studentError } = await supabase
    .from("students")
    .select("*")
    .ilike("full_name", `%${studentName}%`)
    .eq("class", studentClass) as any;

  if (studentError || !students || students.length === 0) {
    return { error: "Student not found" };
  }

  const student = students[0] as Database["public"]["Tables"]["students"]["Row"];
  const transactionId = generateTransactionId();

  const fraudChecks = await performFraudChecks(
    amount,
    referenceNumber,
    receiptHash,
    student.total_fees,
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const status = fraudChecks.length > 0 ? "Flagged" : "Pending";
  const flaggedReason =
    fraudChecks.length > 0
      ? fraudChecks.map((f) => f.type).join(", ")
      : undefined;

  const { data: payment, error } = (await supabase
    .from("payments")
    .insert([{
      transaction_id: transactionId,
      student_id: student.id,
      amount,
      payment_method: "Transfer",
      payment_date: new Date().toISOString().split("T")[0],
      reference_number: referenceNumber,
      receipt_hash: receiptHash,
      receipt_url: receiptUrl,
      status,
      submitted_by: "Parent",
      parent_name: parentName,
      parent_phone: parentPhone,
      flagged_reason: flaggedReason,
    }] as any)
    .select()
    .single()) as any;

  if (error) {
    return { error: error.message };
  }

  if (fraudChecks.length > 0) {
    for (const check of fraudChecks) {
      await supabase.from("fraud_flags").insert([{
        payment_id: payment?.id,
        flag_type: check.type,
        details: check.details,
      }] as any);
    }
  }

  return { data: payment as Payment, fraudChecks };
}

export async function getPayments(filters?: {
  status?: string;
  studentId?: string;
  startDate?: string;
  endDate?: string;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  if (filters?.studentId) {
    query = query.eq("student_id", filters.studentId);
  }

  if (filters?.startDate) {
    query = query.gte("payment_date", filters.startDate);
  }

  if (filters?.endDate) {
    query = query.lte("payment_date", filters.endDate);
  }

  const { data, error } = await query;

  if (error) {
    return { error: error.message };
  }

  return { data };
}

export async function getPaymentById(id: string) {
  const supabase = await createClient();

  const { data: payment, error } = await supabase
    .from("payments")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data: payment };
}

export async function updatePaymentStatus(
  id: string,
  status: "Pending" | "Verified" | "Flagged" | "Rejected",
  flaggedReason?: string
) {
  const supabase = await createClient();

  const { data: payment, error: getError } = (await supabase
    .from("payments")
    .select("status")
    .eq("id", id)
    .single()) as any;

  if (getError) {
    return { error: getError.message };
  }

  try {
    const verifiedAt = status === "Verified" ? new Date().toISOString() : null;

    // @ts-ignore: Supabase types issue
    const response = await supabase
      .from("payments")
      // @ts-ignore: Supabase types issue
      .update({
        status,
        flagged_reason: flaggedReason || null,
        verified_at: verifiedAt,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    const { data: updated, error } = response as any;

    if (error) {
      return { error: error.message };
    }

    // @ts-ignore
    await supabase.from("payment_status_history").insert([{
      payment_id: id,
      old_status: payment?.status,
      new_status: status,
      changed_at: new Date().toISOString(),
    }]);

    return { data: updated };
  } catch (err: any) {
    return { error: err.message || "Failed to update payment status" };
  }
}

export async function getPendingPayments() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .in("status", ["Pending", "Flagged"])
    .order("created_at", { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { data };
}

export async function getFraudFlags(paymentId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fraud_flags")
    .select("*")
    .eq("payment_id", paymentId);

  if (error) {
    return { error: error.message };
  }

  return { data };
}

export async function getPaymentsByStudent(studentId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("student_id", studentId)
    .eq("status", "Verified")
    .order("payment_date", { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { data };
}

// @ts-ignore
export async function getPaymentStats() {
  const supabase = await createClient();

  // @ts-ignore
  const { data: allStudents, error: studentsError } = await supabase
    .from("students")
    .select("total_fees");

  // @ts-ignore
  const { data: verifiedPayments, error: paymentsError } = await supabase
    .from("payments")
    .select("amount")
    .eq("status", "Verified");

  if (studentsError || paymentsError) {
    return { error: "Error fetching stats" };
  }

  const totalStudents = (allStudents as any)?.length || 0;
  const totalCollected = ((verifiedPayments as any) || []).reduce(
    (sum: number, p: any) => sum + p.amount,
    0
  );
  const totalFees = ((allStudents as any) || []).reduce(
    (sum: number, s: any) => sum + s.total_fees,
    0
  );
  const totalOutstanding = totalFees - totalCollected;

  const { data: pendingPayments } = await getPendingPayments();
  const pendingReviewCount = pendingPayments?.length || 0;

  return {
    data: {
      totalStudents,
      totalCollected,
      totalOutstanding,
      pendingReviewCount,
    },
  };
}

// @ts-ignore
export async function getMonthlyCollections() {
  const supabase = await createClient();

  // @ts-ignore
  const { data, error } = await supabase
    .from("payments")
    .select("amount, payment_date")
    .eq("status", "Verified")
    .order("payment_date", { ascending: true });

  if (error) {
    return { error: error.message };
  }

  const monthlyData: Record<string, number> = {};

  ((data as any) || []).forEach((payment: any) => {
    const date = new Date(payment.payment_date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    monthlyData[monthKey] = (monthlyData[monthKey] || 0) + payment.amount;
  });

  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  });

  return {
    data: last6Months.map((month) => ({
      month,
      amount: monthlyData[month] || 0,
    })),
  };
}

// @ts-ignore
export async function getPaymentStatusDistribution() {
  const supabase = await createClient();

  // @ts-ignore
  const { data: allStudents, error: studentsError } = await supabase
    .from("students")
    .select("id, total_fees");

  // @ts-ignore
  const { data: verifiedPayments, error: paymentsError } = await supabase
    .from("payments")
    .select("student_id, amount")
    .eq("status", "Verified");

  if (studentsError || paymentsError) {
    return { error: "Error fetching distribution" };
  }

  let fullyPaid = 0;
  let partial = 0;
  let outstanding = 0;

  ((allStudents as any) || []).forEach((student: any) => {
    const totalPaid = ((verifiedPayments as any) || [])
      .filter((p: any) => p.student_id === student.id)
      .reduce((sum: number, p: any) => sum + p.amount, 0);

    if (totalPaid >= student.total_fees) {
      fullyPaid++;
    } else if (totalPaid > 0) {
      partial++;
    } else {
      outstanding++;
    }
  });

  return {
    data: {
      fullyPaid,
      partial,
      outstanding,
    },
  };
}
