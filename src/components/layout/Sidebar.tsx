"use client";

import { cn } from "@/lib/utils";
import {
    Building2,
    Car,
    Home,
    LogOut,
    Megaphone,
    Settings,
    UserPlus,
    Users,
    Wallet,
    Wrench
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSidebar } from "./SidebarContext";

interface NavItem {
  href: string;
  label: string;
  icon: any;
}

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  const { isOpen, close } = useSidebar();

  useEffect(() => {
    // Basic role extraction from token or localStorage
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setRole(payload.role);
      } catch (e) {
        console.error("Failed to decode token", e);
      }
    }
  }, []);

  const adminItems: NavItem[] = [
    { href: "/dashboard", label: "Genel Bakış", icon: Home },
    { href: "/dashboard/admin/apartments", label: "Apartmanlar", icon: Building2 },
    { href: "/dashboard/finance", label: "Finans Yönetimi", icon: Wallet },
    { href: "/dashboard/admin/requests", label: "Arıza Talepleri", icon: Wrench },
    { href: "/dashboard/admin/announcements", label: "Duyurular", icon: Megaphone },
    { href: "/dashboard/admin/invitations", label: "Davetiyeler", icon: UserPlus },
    { href: "/dashboard/admin/users", label: "Kullanıcılar", icon: Users },
  ];

  const residentItems: NavItem[] = [
    { href: "/dashboard/resident/announcements", label: "Duyurular", icon: Megaphone },
    { href: "/dashboard/resident/requests", label: "Taleplerim", icon: Wrench },
    { href: "/dashboard/resident/payments", label: "Ödemelerim", icon: Wallet },
    { href: "/dashboard/parking", label: "Otopark", icon: Car },
  ];

  const items = (role === "admin" || role === "super_admin") ? adminItems : residentItems;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden animate-in fade-in"
          onClick={close}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={cn(
          "fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-64 border-r bg-white text-slate-800 transition-transform duration-300 ease-in-out",
          // Mobile: Translate based on isOpen
          isOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: Always visible
          "md:translate-x-0",
          className
        )}
      >
        <nav className="flex flex-col justify-between h-full p-4">
          <div className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => window.innerWidth < 768 && close()}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#1A237E]/10 text-[#1A237E]"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t space-y-1">
             <Link
               href="/dashboard/settings"
               onClick={() => window.innerWidth < 768 && close()}
               className={cn(
                 "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                 pathname === "/dashboard/settings"
                   ? "bg-[#1A237E]/10 text-[#1A237E]"
                   : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
               )}
             >
               <Settings className="h-5 w-5" />
               Ayarlar
             </Link>
             <button 
               onClick={() => {
                 localStorage.removeItem("token");
                 document.cookie = "token=; path=/; max-age=0";
                 window.location.href = "/login";
               }}
               className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
             >
               <LogOut className="h-5 w-5" />
               Çıkış Yap
             </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
