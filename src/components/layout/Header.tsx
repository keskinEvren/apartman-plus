"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { NotificationBell } from "../notifications/NotificationBell";

interface HeaderProps {
  className?: string;
}

import { Menu } from "lucide-react";
import { useSidebar } from "./SidebarContext";

export function Header({ className }: HeaderProps) {
  const { toggle } = useSidebar();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="container flex h-14 items-center">
        <button
          onClick={toggle}
          className="mr-4 md:hidden p-2 hover:bg-slate-100 rounded-md"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">🚀 Apartman Plus</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="flex items-center gap-2">
             <NotificationBell />
          </div>
          <nav className="flex items-center space-x-2">
            <Link
              href="/dashboard"
              className="px-3 py-2 text-sm font-medium hover:text-primary transition"
            >
              Dashboard
            </Link>
            <Link
              href="/settings"
              className="px-3 py-2 text-sm font-medium hover:text-primary transition"
            >
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
