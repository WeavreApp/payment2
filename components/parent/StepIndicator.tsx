import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepIndicator({
  currentStep,
  totalSteps,
}: StepIndicatorProps) {
  const steps = [
    "Student Info",
    "Bank Details",
    "Upload Proof",
    "Confirm",
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={index} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isActive
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {isCompleted ? (
                  <Check size={20} />
                ) : (
                  stepNumber
                )}
              </div>
              <div className="ml-3">
                <p
                  className={`text-sm font-medium ${
                    isActive ? "text-gray-900" : "text-gray-600"
                  }`}
                >
                  {step}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-3 ${
                    isCompleted ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
