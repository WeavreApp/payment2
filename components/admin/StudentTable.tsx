"use client";

import { useState } from "react";
import { Trash2, CreditCard as Edit2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatusBadge from "./StatusBadge";
import { exportStudentsToExcel } from "@/lib/utils/excel-export";
import type { Database } from "@/types/database";

type Student = Database["public"]["Tables"]["students"]["Row"] & {
  totalPaid: number;
  balance: number;
};

interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export default function StudentTable({
  students,
  onEdit,
  onDelete,
  onRefresh,
}: StudentTableProps) {
  const [search, setSearch] = useState("");

  const filtered = students.filter((s) =>
    s.full_name.toLowerCase().includes(search.toLowerCase())
  );

  const getPaymentStatus = (totalPaid: number, totalFees: number) => {
    if (totalPaid >= totalFees) return "Fully Paid";
    if (totalPaid > 0) return "Partial";
    return "Outstanding";
  };

  const handleExport = () => {
    exportStudentsToExcel(filtered, "students.xlsx");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <Input
            placeholder="Search by student name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs h-10 border-gray-200"
          />
        </div>
        <Button
          onClick={handleExport}
          variant="outline"
          className="gap-2 border-gray-200"
        >
          <Download size={18} />
          Export to Excel
        </Button>
      </div>

      <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Full Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Class
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                  Total Fees
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                  Total Paid
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                  Balance
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-600">
                    No students found
                  </td>
                </tr>
              ) : (
                filtered.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {student.full_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {student.class}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                      ₦{student.total_fees.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                      ₦{student.totalPaid.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                      ₦{student.balance.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge
                        status={getPaymentStatus(student.totalPaid, student.total_fees)}
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEdit(student)}
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDelete(student.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
