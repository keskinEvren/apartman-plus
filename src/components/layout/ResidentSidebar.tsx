
"use client";

import { cn } from "@/lib/utils";
import { Home, Megaphone, User, Wallet, Wrench } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ResidentSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard/resident/announcements", label: "Duyurular", icon: Megaphone },
    { href: "/dashboard/resident/requests", label: "Taleplerim", icon: Wrench },
    { href: "/dashboard/resident/payments", label: "Ödemelerim", icon: Wallet },
  ];

  return (
    <div className="w-64 bg-white border-r h-full flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Home className="w-6 h-6 text-blue-600" />
          Apartman<span className="text-blue-600">Plus</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">Sakin Paneli</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-500" />
            </div>
            <div className="text-sm">
                <p className="font-medium text-gray-900">Sakin</p>
                <Link href="/api/auth/signout" className="text-xs text-red-500 hover:underline">Çıkış Yap</Link>
            </div>
        </div>
      </div>
    </div>
  );
}
