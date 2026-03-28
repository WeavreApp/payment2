import * as XLSX from "xlsx";
import type { Database } from "@/types/database";

type Student = Database["public"]["Tables"]["students"]["Row"];
type Payment = Database["public"]["Tables"]["payments"]["Row"];

export function exportStudentsToExcel(
  students: Array<
    Student & {
      totalPaid: number;
      balance: number;
    }
  >,
  filename = "students.xlsx"
) {
  const data = students.map((student) => ({
    "Full Name": student.full_name,
    Class: student.class,
    "Total Fees": student.total_fees,
    "Total Paid": student.totalPaid,
    Balance: student.balance,
    "Created At": new Date(student.created_at).toLocaleDateString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

  worksheet["!cols"] = [
    { wch: 20 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
  ];

  XLSX.writeFile(workbook, filename);
}

export function exportPaymentsToExcel(
  payments: Array<Payment & { studentName?: string }>,
  filename = "payments.xlsx"
) {
  const data = payments.map((payment) => ({
    "Transaction ID": payment.transaction_id,
    Student: payment.studentName || "N/A",
    Amount: payment.amount,
    "Payment Method": payment.payment_method,
    "Payment Date": payment.payment_date,
    "Reference Number": payment.reference_number || "N/A",
    Status: payment.status,
    "Submitted By": payment.submitted_by,
    "Parent Name": payment.parent_name || "N/A",
    "Parent Phone": payment.parent_phone || "N/A",
    Notes: payment.notes || "N/A",
    "Created At": new Date(payment.created_at).toLocaleDateString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");

  worksheet["!cols"] = [
    { wch: 15 },
    { wch: 20 },
    { wch: 12 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 12 },
    { wch: 12 },
    { wch: 15 },
    { wch: 15 },
    { wch: 20 },
    { wch: 15 },
  ];

  XLSX.writeFile(workbook, filename);
}

export function exportPaymentHistoryToExcel(
  payments: Payment[],
  studentName: string,
  filename = `${studentName}-payment-history.xlsx`
) {
  const data = payments.map((payment) => ({
    "Transaction ID": payment.transaction_id,
    Amount: payment.amount,
    "Payment Method": payment.payment_method,
    "Payment Date": payment.payment_date,
    Status: payment.status,
    "Reference Number": payment.reference_number || "N/A",
    Notes: payment.notes || "N/A",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Payment History");

  worksheet["!cols"] = [
    { wch: 15 },
    { wch: 12 },
    { wch: 15 },
    { wch: 15 },
    { wch: 12 },
    { wch: 15 },
    { wch: 20 },
  ];

  XLSX.writeFile(workbook, filename);
}
