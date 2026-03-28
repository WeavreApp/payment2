"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/actions/auth";
import { LayoutDashboard, Users, CreditCard, CircleCheck as CheckCircle2, LogOut, GraduationCap } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Students",
      href: "/admin/students",
      icon: Users,
    },
    {
      label: "Record Payment",
      href: "/admin/payments",
      icon: CreditCard,
    },
    {
      label: "Pending Review",
      href: "/admin/pending",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <GraduationCap className="text-white" size={24} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">School Admin</h2>
            <p className="text-xs text-gray-600">Payment System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link key={item.href} href={item.href}>
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon size={20} />
                <span className="text-sm">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <form
          action={async () => {
            await signOut();
          }}
        >
          <Button
            type="submit"
            variant="outline"
            className="w-full justify-start gap-3 text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut size={20} />
            Logout
          </Button>
        </form>
      </div>
    </div>
  );
}
