import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/components/layout/SidebarContext";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex">
          <Sidebar />
          {/* Main Content: 
              - ml-0 on mobile (Sidebar is overlay)
              - md:ml-64 on desktop (Sidebar is fixed side)
          */}
          <main className="flex-1 ml-0 md:ml-64 mt-14 p-4 md:p-6 w-full max-w-[100vw] overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
