"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Upload, Check, Loader as Loader2 } from "lucide-react";
import { createParentPayment } from "@/app/actions/payments";
import { generateFileHash } from "@/lib/utils/file-hash";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight } from "lucide-react";

interface ProofUploadProps {
  studentName: string;
  studentClass: string;
  parentName: string;
  parentPhone: string;
  onSuccess: (transactionId: string) => void;
  onBack: () => void;
}

export default function ProofUpload({
  studentName,
  studentClass,
  parentName,
  parentPhone,
  onSuccess,
  onBack,
}: ProofUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [amount, setAmount] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!file) {
        setError("Please upload proof of payment");
        setLoading(false);
        return;
      }

      const receiptHash = await generateFileHash(file);
      const supabase = createClient();
      const fileName = `${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("payment-receipts")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("payment-receipts").getPublicUrl(fileName);

      const result = await createParentPayment(
        studentName,
        studentClass,
        parentName,
        parentPhone,
        parseFloat(amount),
        referenceNumber,
        receiptHash,
        publicUrl
      );

      if (result.error) {
        setError(result.error);
      } else {
        onSuccess(result.data?.transaction_id || "");
      }
    } catch {
      setError("Error processing payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-sm p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Upload Payment Proof
      </h2>
      <p className="text-gray-600 mb-8">
        Submit your bank transfer receipt and payment details for verification
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount Paid (₦)
          </label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
            className="h-11 border-gray-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bank Payment Reference Number
          </label>
          <Input
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            placeholder="e.g., REF123456789"
            required
            className="h-11 border-gray-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Upload Proof of Payment
          </label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files[0]) {
                setFile(e.dataTransfer.files[0]);
              }
            }}
          >
            <label className="cursor-pointer">
              <div className="flex flex-col items-center gap-3">
                <Upload className="text-gray-400" size={32} />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Drag and drop or{" "}
                    <span className="text-blue-600">click to upload</span>
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Screenshot, Image, or PDF
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

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button
            type="button"
            onClick={onBack}
            variant="outline"
            className="flex-1 border-gray-200"
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={loading || !file || !amount || !referenceNumber}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Submit Payment <ArrowRight size={18} />
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
