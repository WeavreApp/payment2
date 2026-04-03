"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import StudentTable from "@/components/admin/StudentTable";
import {
  createStudent,
  getStudents,
  updateStudent,
  deleteStudent,
  getStudentPaymentInfo,
  getDistinctClasses,
} from "@/app/actions/students";
import { Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Database } from "@/types/database";

type Student = Database["public"]["Tables"]["students"]["Row"];

interface StudentWithPayment extends Student {
  totalPaid: number;
  balance: number;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentWithPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithPayment | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    class: "",
    total_fees: "",
  });
  const [classes, setClasses] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [studentsRes, classesRes] = await Promise.all([
      getStudents(),
      getDistinctClasses(),
    ]);

    if (studentsRes.data) {
      const enriched = await Promise.all(
        studentsRes.data.map(async (student: Student) => {
          const paymentInfo = await getStudentPaymentInfo(student.id);
          return {
            ...student,
            totalPaid: paymentInfo.data?.totalPaid || 0,
            balance: paymentInfo.data?.balance || student.total_fees,
          };
        })
      );
      setStudents(enriched);
    }

    if (classesRes.data) {
      setClasses(classesRes.data);
    }

    setLoading(false);
  };

  const handleOpenDialog = (student?: StudentWithPayment) => {
    if (student) {
      setSelectedStudent(student);
      setFormData({
        full_name: student.full_name,
        class: student.class,
        total_fees: student.total_fees.toString(),
      });
    } else {
      setSelectedStudent(null);
      setFormData({ full_name: "", class: "", total_fees: "" });
    }
    setShowDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.full_name || !formData.class || !formData.total_fees) {
      alert("Please fill in all fields");
      return;
    }

    try {
      if (selectedStudent) {
        await updateStudent(selectedStudent.id, {
          full_name: formData.full_name,
          class: formData.class,
          total_fees: parseFloat(formData.total_fees),
        });
      } else {
        await createStudent({
          full_name: formData.full_name,
          class: formData.class,
          total_fees: parseFloat(formData.total_fees),
        });
      }

      setShowDialog(false);
      loadData();
    } catch (error) {
      alert("Error saving student");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteStudent(id);
        loadData();
      } catch (error) {
        alert("Error deleting student");
      }
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Students</h1>
            <p className="text-gray-600 mt-2">
              Manage student records and fee information
            </p>
          </div>
          <Button
            onClick={() => handleOpenDialog()}
            className="gap-2 bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus size={20} />
            Add Student
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading students...</div>
      ) : (
        <StudentTable
          students={students}
          onEdit={handleOpenDialog}
          onDelete={handleDelete}
          onRefresh={loadData}
        />
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedStudent ? "Edit Student" : "Add New Student"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <Input
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                placeholder="Enter student full name"
                className="h-10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class
              </label>
              <select
                value={formData.class}
                onChange={(e) =>
                  setFormData({ ...formData, class: e.target.value })
                }
                className="w-full h-10 px-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select or type class</option>
                {classes.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total School Fees
              </label>
              <Input
                type="number"
                value={formData.total_fees}
                onChange={(e) =>
                  setFormData({ ...formData, total_fees: e.target.value })
                }
                placeholder="Enter amount in Naira"
                className="h-10"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              >
                {selectedStudent ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
