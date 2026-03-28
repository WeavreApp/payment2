import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GraduationCap, Lock, CreditCard, CircleCheck as CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
              <GraduationCap className="text-white" size={40} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            School Payment Management System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            A secure, modern solution for managing student fee payments and school
            finances
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/pay">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white h-12 px-8 text-lg">
                Pay School Fees
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 h-12 px-8 text-lg hover:bg-gray-50"
              >
                Admin Portal
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="border-0 shadow-sm p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Lock className="text-blue-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Secure Payments
            </h3>
            <p className="text-gray-600 text-sm">
              Bank-level encryption and fraud detection to protect all
              transactions
            </p>
          </Card>

          <Card className="border-0 shadow-sm p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle2 className="text-green-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Transparent Tracking
            </h3>
            <p className="text-gray-600 text-sm">
              Real-time payment status and balance updates for all stakeholders
            </p>
          </Card>

          <Card className="border-0 shadow-sm p-6">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <CreditCard className="text-amber-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Easy Payments
            </h3>
            <p className="text-gray-600 text-sm">
              Multiple payment methods and instant receipt generation for
              convenience
            </p>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-0 shadow-sm p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              For Parents
            </h3>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-green-500 flex-shrink-0 mt-1" size={20} />
                <span>Simple step-by-step payment process</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-green-500 flex-shrink-0 mt-1" size={20} />
                <span>Track payment status in real-time</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-green-500 flex-shrink-0 mt-1" size={20} />
                <span>Receive payment confirmations instantly</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-green-500 flex-shrink-0 mt-1" size={20} />
                <span>Secure transaction ID for tracking</span>
              </li>
            </ul>
            <Link href="/pay" className="block mt-8">
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white h-11">
                Make a Payment
              </Button>
            </Link>
          </Card>

          <Card className="border-0 shadow-sm p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              For Administrators
            </h3>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-green-500 flex-shrink-0 mt-1" size={20} />
                <span>Manage student records and fees</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-green-500 flex-shrink-0 mt-1" size={20} />
                <span>Record and verify payments</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-green-500 flex-shrink-0 mt-1" size={20} />
                <span>Automated fraud detection system</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-green-500 flex-shrink-0 mt-1" size={20} />
                <span>Export reports and analytics</span>
              </li>
            </ul>
            <Link href="/admin/login" className="block mt-8">
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white h-11">
                Admin Login
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
