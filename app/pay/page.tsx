"use client";

import { useState } from "react";
import { GraduationCap, Check, Copy } from "lucide-react";
import StepIndicator from "@/components/parent/StepIndicator";
import StudentIdentification from "@/components/parent/StudentIdentification";
import BankDetails from "@/components/parent/BankDetails";
import ProofUpload from "@/components/parent/ProofUpload";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Step = 1 | 2 | 3 | 4;

interface StudentData {
  studentName: string;
  studentClass: string;
  parentName: string;
  parentPhone: string;
}

export default function PaymentPortalPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [transactionId, setTransactionId] = useState<string>("");

  const handleStudentNext = (data: StudentData) => {
    setStudentData(data);
    setCurrentStep(2);
  };

  const handleBankNext = () => {
    setCurrentStep(3);
  };

  const handlePaymentSuccess = (txnId: string) => {
    setTransactionId(txnId);
    setCurrentStep(4);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setStudentData(null);
    setTransactionId("");
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(transactionId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-blue-500 rounded-lg flex items-center justify-center">
              <GraduationCap className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-semibold text-gray-900">
            School Payment Portal
          </h1>
          <p className="text-gray-600 mt-2">
            Secure payment system for school fees
          </p>
        </div>

        {currentStep !== 4 && (
          <div className="mb-8">
            <StepIndicator currentStep={currentStep} totalSteps={4} />
          </div>
        )}

        {currentStep === 1 && (
          <StudentIdentification onNext={handleStudentNext} />
        )}

        {currentStep === 2 && studentData && (
          <BankDetails
            onNext={handleBankNext}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && studentData && (
          <ProofUpload
            studentName={studentData.studentName}
            studentClass={studentData.studentClass}
            parentName={studentData.parentName}
            parentPhone={studentData.parentPhone}
            onSuccess={handlePaymentSuccess}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 4 && (
          <Card className="border-0 shadow-sm p-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="text-green-600" size={32} />
                </div>
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Payment Submitted Successfully!
              </h2>
              <p className="text-gray-600 mb-8">
                Your payment has been submitted for verification. Please save
                your transaction ID for your records.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <p className="text-sm text-gray-700 mb-2">Transaction ID</p>
                <div className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
                  <p className="font-mono font-bold text-lg text-gray-900">
                    {transactionId}
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopyId}
                    className="text-blue-600 hover:bg-blue-50"
                  >
                    <Copy size={18} />
                  </Button>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 text-left">
                <h3 className="font-semibold text-green-900 mb-3">
                  What happens next?
                </h3>
                <ol className="text-sm text-green-800 space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="font-bold">1.</span>
                    <span>
                      The school admin will review your payment submission
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-bold">2.</span>
                    <span>
                      We will verify the uploaded proof of payment
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-bold">3.</span>
                    <span>
                      You will receive confirmation via email/phone
                    </span>
                  </li>
                </ol>
              </div>

              <Button
                onClick={handleReset}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white h-11"
              >
                Make Another Payment
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
