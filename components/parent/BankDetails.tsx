import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

interface BankDetailsProps {
  onNext: () => void;
  onBack: () => void;
}

export default function BankDetails({ onNext, onBack }: BankDetailsProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const bankDetails = {
    bankName: "First Bank of Nigeria",
    accountName: "XYZ School Account",
    accountNumber: "1234567890",
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Card className="border-0 shadow-sm p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Make Your Payment
      </h2>
      <p className="text-gray-600 mb-8">
        Use the bank details below to transfer the school fees
      </p>

      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-700 mb-1">Bank Name</p>
            <div className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
              <p className="font-medium text-gray-900">
                {bankDetails.bankName}
              </p>
              <button
                onClick={() =>
                  handleCopy(bankDetails.bankName, "bankName")
                }
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                {copied === "bankName" ? (
                  <Check size={18} />
                ) : (
                  <Copy size={18} />
                )}
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-700 mb-1">Account Name</p>
            <div className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
              <p className="font-medium text-gray-900">
                {bankDetails.accountName}
              </p>
              <button
                onClick={() =>
                  handleCopy(bankDetails.accountName, "accountName")
                }
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                {copied === "accountName" ? (
                  <Check size={18} />
                ) : (
                  <Copy size={18} />
                )}
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-700 mb-1">Account Number</p>
            <div className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
              <p className="font-mono font-semibold text-gray-900 text-lg">
                {bankDetails.accountNumber}
              </p>
              <button
                onClick={() =>
                  handleCopy(bankDetails.accountNumber, "accountNumber")
                }
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                {copied === "accountNumber" ? (
                  <Check size={18} />
                ) : (
                  <Copy size={18} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
        <p className="text-sm text-amber-800">
          <span className="font-semibold">Important:</span> After making the
          transfer, keep the transaction reference number and receipt ready for
          the next step.
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 border-gray-200"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white gap-2"
        >
          I've Made the Transfer <ArrowRight size={18} />
        </Button>
      </div>
    </Card>
  );
}
