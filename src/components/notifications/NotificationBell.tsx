"use client";

import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { AlertTriangle, Bell, Check, CheckCircle, Info, XCircle } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const utils = trpc.useUtils();
  const { data: unreadCount = 0 } = trpc.notifications.getUnreadCount.useQuery(undefined, {
      refetchInterval: 30000 // Poll every 30s
  });
  
  const { data: notifications, isLoading } = trpc.notifications.getNotifications.useQuery(
      { limit: 10 }, 
      { enabled: isOpen }
  );

  const markReadMut = trpc.notifications.markAsRead.useMutation({
      onSuccess: () => {
          utils.notifications.getUnreadCount.invalidate();
          utils.notifications.getNotifications.invalidate();
      }
  });

  const markAllReadMut = trpc.notifications.markAllAsRead.useMutation({
    onSuccess: () => {
        utils.notifications.getUnreadCount.invalidate();
        utils.notifications.getNotifications.invalidate();
    }
});

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkRead = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      markReadMut.mutate({ id });
  };

  const getIcon = (type: string) => {
      switch(type) {
          case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
          case 'warning': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
          case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
          default: return <Info className="w-4 h-4 text-blue-500" />;
      }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
            </span>
        )}
      </button>

      {isOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-[100] animate-in slide-in-from-top-2">
              <div className="flex items-center justify-between p-3 border-b bg-gray-50/50">
                  <h3 className="font-semibold text-gray-900 text-sm">Bildirimler</h3>
                  {unreadCount > 0 && (
                      <button 
                        onClick={() => markAllReadMut.mutate()}
                        className="text-xs text-[#1A237E] font-medium hover:underline"
                      >
                          Tümünü Okundu İşaretle
                      </button>
                  )}
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                  {isLoading ? (
                      <div className="p-4 text-center text-gray-400 text-xs">Yükleniyor...</div>
                  ) : notifications?.length === 0 ? (
                      <div className="p-8 text-center text-gray-400">
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                          <p className="text-xs">Yeni bildirim yok</p>
                      </div>
                  ) : (
                      notifications?.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`p-3 border-b last:border-0 hover:bg-gray-50 transition-colors relative group ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
                          >
                              <div className="flex gap-3">
                                  <div className="mt-1 flex-shrink-0">
                                      {getIcon(notification.type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                      <h4 className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                          {notification.title}
                                      </h4>
                                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notification.message}</p>
                                      <span className="text-[10px] text-gray-400 mt-1 block">
                                          {format(new Date(notification.createdAt), "d MMM, HH:mm", { locale: tr })}
                                      </span>
                                  </div>
                                  {!notification.isRead && (
                                      <button 
                                        onClick={(e) => handleMarkRead(notification.id, e)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded text-gray-400"
                                        title="Okundu işaretle"
                                      >
                                          <Check className="w-3 h-3" />
                                      </button>
                                  )}
                              </div>
                              {notification.link && (
                                  <Link href={notification.link} className="absolute inset-0" onClick={() => setIsOpen(false)} />
                              )}
                          </div>
                      ))
                  )}
              </div>
          </div>
      )}
    </div>
  );
}
