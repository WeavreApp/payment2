"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { getDistinctClasses } from "@/app/actions/students";
import { ArrowRight } from "lucide-react";

interface StudentIdentificationProps {
  onNext: (data: {
    studentName: string;
    studentClass: string;
    parentName: string;
    parentPhone: string;
  }) => void;
}

export default function StudentIdentification({
  onNext,
}: StudentIdentificationProps) {
  const [classes, setClasses] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    studentName: "",
    studentClass: "",
    parentName: "",
    parentPhone: "",
  });

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    const res = await getDistinctClasses();
    if (res.data) {
      setClasses(res.data);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.studentName &&
      formData.studentClass &&
      formData.parentName &&
      formData.parentPhone
    ) {
      onNext(formData);
    }
  };

  return (
    <Card className="border-0 shadow-sm p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Student Information
      </h2>
      <p className="text-gray-600 mb-8">
        Please provide the student and parent details
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Student's Full Name
          </label>
          <Input
            value={formData.studentName}
            onChange={(e) =>
              setFormData({ ...formData, studentName: e.target.value })
            }
            placeholder="Enter student's full name"
            required
            className="h-11 border-gray-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Student's Class
          </label>
          {classes.length > 0 ? (
            <select
              value={formData.studentClass}
              onChange={(e) =>
                setFormData({ ...formData, studentClass: e.target.value })
              }
              required
              className="w-full h-11 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select class</option>
              {classes.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          ) : (
            <Input
              value={formData.studentClass}
              onChange={(e) =>
                setFormData({ ...formData, studentClass: e.target.value })
              }
              placeholder="Enter class (e.g., JSS 1, SSS 3)"
              required
              className="h-11 border-gray-200"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Name (Parent/Guardian)
          </label>
          <Input
            value={formData.parentName}
            onChange={(e) =>
              setFormData({ ...formData, parentName: e.target.value })
            }
            placeholder="Enter your full name"
            required
            className="h-11 border-gray-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Phone Number
          </label>
          <Input
            value={formData.parentPhone}
            onChange={(e) =>
              setFormData({ ...formData, parentPhone: e.target.value })
            }
            placeholder="Enter your phone number"
            required
            className="h-11 border-gray-200"
          />
        </div>

        <Button
          type="submit"
          disabled={
            !formData.studentName ||
            !formData.studentClass ||
            !formData.parentName ||
            !formData.parentPhone
          }
          className="w-full h-11 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors gap-2"
        >
          Continue <ArrowRight size={18} />
        </Button>
      </form>
    </Card>
  );
}
