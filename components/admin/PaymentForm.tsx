"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { generateTransactionId } from "@/lib/utils/transaction-id";
import { createPayment } from "@/app/actions/payments";
import { getStudents } from "@/app/actions/students";
import { Upload, Check } from "lucide-react";

interface PaymentFormProps {
  onSuccess: () => void;
}

export default function PaymentForm({ onSuccess }: PaymentFormProps) {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    student_id: "",
    amount: "",
    payment_method: "Transfer",
    payment_date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const res = await getStudents();
    if (res.data) {
      setStudents(res.data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    try {
      let receiptUrl = null;

      if (file) {
        const supabase = createClient();
        const fileName = `${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("payment-receipts")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("payment-receipts").getPublicUrl(fileName);

        receiptUrl = publicUrl;
      }

      const result = await createPayment({
        transaction_id: generateTransactionId(),
        student_id: formData.student_id,
        amount: parseFloat(formData.amount),
        payment_method: formData.payment_method as "Cash" | "Transfer" | "POS",
        payment_date: formData.payment_date,
        notes: formData.notes || null,
        receipt_url: receiptUrl,
        submitted_by: "Admin",
        status: "Verified",
      });

      if (result.error) {
        alert(`Error: ${result.error}`);
      } else {
        setSuccessMsg(`Payment recorded successfully! TXN: ${result.data?.transaction_id}`);
        setFormData({
          student_id: "",
          amount: "",
          payment_method: "Transfer",
          payment_date: new Date().toISOString().split("T")[0],
          notes: "",
        });
        setFile(null);
        onSuccess();

        setTimeout(() => setSuccessMsg(""), 5000);
      }
    } catch (error) {
      alert("Error recording payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-sm p-6">
      {successMsg && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <Check className="text-green-600" size={20} />
          <div>
            <p className="font-medium text-green-900">{successMsg}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Student
            </label>
            <select
              value={formData.student_id}
              onChange={(e) =>
                setFormData({ ...formData, student_id: e.target.value })
              }
              required
              className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.full_name} - {s.class}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (₦)
            </label>
            <Input
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              placeholder="0.00"
              required
              className="h-10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <select
              value={formData.payment_method}
              onChange={(e) =>
                setFormData({ ...formData, payment_method: e.target.value })
              }
              className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Cash">Cash</option>
              <option value="Transfer">Bank Transfer</option>
              <option value="POS">POS</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Date
            </label>
            <Input
              type="date"
              value={formData.payment_date}
              onChange={(e) =>
                setFormData({ ...formData, payment_date: e.target.value })
              }
              required
              className="h-10"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            placeholder="Add any notes about this payment..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Receipt Upload (Optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
               onDragOver={(e) => e.preventDefault()}
               onDrop={(e) => {
                 e.preventDefault();
                 if (e.dataTransfer.files[0]) {
                   setFile(e.dataTransfer.files[0]);
                 }
               }}>
            <label className="cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <Upload className="text-gray-400" size={24} />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Drag and drop or{" "}
                    <span className="text-blue-600">click to upload</span>
                  </p>
                  <p className="text-xs text-gray-600">
                    PDF, Image, or Screenshot
                  </p>
                </div>
              </div>
              <input
                type="file"
                hidden
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFile(e.target.files[0]);
                  }
                }}
                accept=".pdf,.png,.jpg,.jpeg,.gif"
              />
            </label>
          </div>
          {file && (
            <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
              <Check size={16} />
              {file.name}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading || !formData.student_id || !formData.amount}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white h-10 font-medium rounded-lg transition-colors"
        >
          {loading ? "Recording Payment..." : "Record Payment"}
        </Button>
      </form>
    </Card>
  );
}
