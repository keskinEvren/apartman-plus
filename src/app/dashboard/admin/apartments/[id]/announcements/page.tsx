"use client";

import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { ArrowLeft, Bell, Megaphone, Plus, User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";

export default function AnnouncementsPage() {
  const params = useParams();
  const apartmentId = params.id as string;
  const utils = trpc.useUtils();

  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "" });

  const { data: announcements, isLoading } = trpc.social.getAnnouncements.useQuery({ apartmentId });
  
  const createMut = trpc.social.createAnnouncement.useMutation({
      onSuccess: () => {
          utils.social.getAnnouncements.invalidate();
          setIsCreating(false);
          setFormData({ title: "", content: "" });
      }
  });

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      createMut.mutate({
          apartmentId,
          title: formData.title,
          content: formData.content
      });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Link href={`/dashboard/admin/apartments/${apartmentId}`} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Megaphone className="w-6 h-6 text-[#1A237E]" />
                Duyurular
            </h1>
            <p className="text-gray-500 text-sm">Apartman sakinlerine önemli bilgilendirmeler</p>
            </div>
        </div>
        <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-[#1A237E] text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors shadow-lg shadow-blue-900/20"
        >
            <Plus className="w-4 h-4" />
            Yeni Duyuru
        </button>
      </div>

      {/* Creation Form */}
      {isCreating && (
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/50 animate-in slide-in-from-top-4">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#1A237E]" />
                  Yeni Duyuru Oluştur
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                      <input 
                        className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-[#1A237E]/20 outline-none transition-all" 
                        placeholder="Örn: Su Kesintisi Hakkında" 
                        value={formData.title} 
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        required
                        minLength={3}
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">İçerik</label>
                      <textarea 
                        className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-[#1A237E]/20 outline-none transition-all h-32" 
                        placeholder="Duyuru detaylarını buraya yazın..." 
                        value={formData.content} 
                        onChange={e => setFormData({...formData, content: e.target.value})}
                        required
                        minLength={10}
                      />
                  </div>
                  <div className="flex gap-3 justify-end pt-2">
                      <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium">Vazgeç</button>
                      <button type="submit" disabled={createMut.isPending} className="px-6 py-2 bg-[#1A237E] text-white rounded-lg hover:bg-blue-900 transition-colors text-sm font-medium shadow-md">
                          {createMut.isPending ? "Paylaşılıyor..." : "Duyuruyu Yayınla"}
                      </button>
                  </div>
              </form>
          </div>
      )}

      {/* Announcements List */}
      <div className="grid gap-4">
          {isLoading ? (
              <div className="p-8 text-center text-gray-400">Yükleniyor...</div>
          ) : announcements?.length === 0 ? (
              <div className="bg-gray-50 rounded-2xl p-12 text-center border border-dashed border-gray-200">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <Megaphone className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-gray-900 font-medium mb-1">Henüz duyuru yok</h3>
                  <p className="text-gray-500 text-sm">İlk duyuruyu oluşturarak sakinleri bilgilendirin.</p>
              </div>
          ) : (
              announcements?.map((announcement) => (
                  <div key={announcement.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                      <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#1A237E] transition-colors">{announcement.title}</h3>
                          <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                              {format(new Date(announcement.createdAt), "d MMMM, HH:mm", { locale: tr })}
                          </span>
                      </div>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{announcement.content}</p>
                      <div className="mt-4 flex items-center gap-2 text-xs text-gray-400 border-t pt-4">
                          <User className="w-3 h-3" />
                          <span>Yönetici tarafından paylaşıldı</span>
                      </div>
                  </div>
              ))
          )}
      </div>
    </div>
  );
}
