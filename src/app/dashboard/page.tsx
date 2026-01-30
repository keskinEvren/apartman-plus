
"use client";

import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const { data: user, isLoading } = trpc.user.me.useQuery();

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === "admin" || user.role === "super_admin") {
        router.replace("/dashboard/admin/apartments");
      } else if (user.role === "resident") {
        router.replace("/dashboard/resident/announcements");
      } else if (user.role === "security") {
        // Future: Security dashboard
        router.replace("/dashboard/security"); 
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-[#1A237E] animate-spin" />
        <p className="text-gray-500 font-medium">Yönlendiriliyorsunuz...</p>
      </div>
    </div>
  );
}
