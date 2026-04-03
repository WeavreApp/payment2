import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto w-full lg:w-auto">
        <div className="lg:hidden h-16" />
        {children}
      </main>
    </div>
  );
}
