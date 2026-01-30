
"use client";

import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Calendar, Megaphone } from "lucide-react";

export default function ResidentAnnouncementsPage() {
  const { data: user } = trpc.user.me.useQuery();
  
  const { data: announcements, isLoading } = trpc.social.getAnnouncements.useQuery(
    { apartmentId: user?.apartmentId! },
    { enabled: !!user?.apartmentId }
  );

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Yükleniyor...</div>;
  }

  if (!user?.apartmentId) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed text-center">
        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
          <Megaphone className="w-6 h-6 text-yellow-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">Henüz Bir Daireye Atanmadınız</h3>
        <p className="text-gray-500 mt-2 max-w-sm">
          Duyuruları görebilmek için yönetim tarafından bir daireye atanmanız gerekmektedir.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Duyurular</h2>
          <p className="text-muted-foreground">Apartman yönetimi ve komşulardan önemli duyurular</p>
        </div>
      </div>

      <div className="grid gap-4">
        {announcements?.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-gray-500">Henüz yayınlanmış bir duyuru bulunmuyor.</p>
          </div>
        ) : (
          announcements?.map((announcement) => (
            <div key={announcement.id} className="p-6 bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(announcement.createdAt), "d MMMM yyyy", { locale: tr })}
                </span>
              </div>
              <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                {announcement.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
