"use client";

import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { ArrowLeft, CheckCircle2, Clock, Plus, Wrench } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const urgencyColors = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
};

const statusColors = {
  open: "bg-gray-100 text-gray-800",
  approved: "bg-blue-50 text-blue-600",
  in_progress: "bg-purple-50 text-purple-600",
  resolved: "bg-green-50 text-green-600",
  cancelled: "bg-red-50 text-red-600",
};

const statusLabels: Record<string, string> = {
    open: "Açık",
    approved: "Onaylandı",
    in_progress: "İşlemde",
    resolved: "Çözüldü",
    cancelled: "İptal"
};

const categoryLabels: Record<string, string> = {
    plumbing: "Sıhhi Tesisat",
    electrical: "Elektrik",
    elevator: "Asansör",
    cleaning: "Temizlik",
    other: "Diğer"
};

export default function RequestsPage() {
  const params = useParams();
  const apartmentId = params.id as string;
  const utils = trpc.useUtils();

  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", category: "other", urgency: "medium" });
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { data: tickets, isLoading } = trpc.ops.getTickets.useQuery();
  const createMut = trpc.ops.createTicket.useMutation({
      onSuccess: () => {
          utils.ops.getTickets.invalidate();
          setIsCreating(false);
          setFormData({ title: "", description: "", category: "other", urgency: "medium" });
      }
  });

  const updateStatusMut = trpc.ops.updateTicketStatus.useMutation({
      onSuccess: () => utils.ops.getTickets.invalidate()
  });

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      createMut.mutate({
          title: formData.title,
          description: formData.description,
          category: formData.category as any,
          urgency: formData.urgency as any
      });
  };

  const filteredTickets = filterStatus === "all" 
      ? tickets 
      : tickets?.filter(t => t.status === filterStatus);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <Link href={`/dashboard/admin/apartments/${apartmentId}`} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                 <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Wrench className="w-6 h-6 text-[#1A237E]" />
                    Arıza ve Talepler
                </h1>
                <p className="text-gray-500 text-sm">Bina bakım ve sakin taleplerini yönetin</p>
            </div>
        </div>
        <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-[#1A237E] text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors shadow-lg shadow-blue-900/20"
        >
            <Plus className="w-4 h-4" />
            Yeni Talep Oluştur
        </button>
      </div>

      {/* Stats/Filter Bar */}
      <div className="flex gap-2 overflow-x-auto pb-2">
           <button onClick={() => setFilterStatus("all")} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filterStatus === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Tümü</button>
           {Object.entries(statusLabels).map(([key, label]) => (
                <button key={key} onClick={() => setFilterStatus(key)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filterStatus === key ? 'bg-[#1A237E] text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}>
                    {label}
                </button>
           ))}
      </div>

      {/* Creation Modal */}
      {isCreating && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95">
                  <div className="p-6 border-b bg-gray-50">
                      <h3 className="font-bold text-gray-900 text-lg">Yeni Talep Oluştur</h3>
                  </div>
                  <form onSubmit={handleSubmit} className="p-6 space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Başlık</label>
                          <input className="w-full border p-3 rounded-lg bg-gray-50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-[#1A237E]/20" placeholder="Örn: Asansör Arızası" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required minLength={3}/>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                           <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Kategori</label>
                                <select className="w-full border p-3 rounded-lg bg-gray-50 outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                    {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                </select>
                           </div>
                           <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Aciliyet</label>
                                <select className="w-full border p-3 rounded-lg bg-gray-50 outline-none" value={formData.urgency} onChange={e => setFormData({...formData, urgency: e.target.value})}>
                                    <option value="low">Düşük</option>
                                    <option value="medium">Orta</option>
                                    <option value="critical">Kritik</option>
                                </select>
                           </div>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Açıklama</label>
                          <textarea className="w-full border p-3 rounded-lg bg-gray-50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-[#1A237E]/20 h-32" placeholder="Detaylı açıklama..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required minLength={10}/>
                      </div>
                      
                      <div className="flex justify-end gap-3 pt-4">
                          <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">İptal</button>
                          <button type="submit" disabled={createMut.isPending} className="px-6 py-2 bg-[#1A237E] text-white rounded-lg hover:bg-blue-900 font-medium">
                              {createMut.isPending ? "Kaydediliyor..." : "Oluştur"}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* Tickets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading ? (
              <div className="col-span-2 text-center py-12 text-gray-400">Yükleniyor...</div>
          ) : filteredTickets?.length === 0 ? (
              <div className="col-span-2 text-center py-12 bg-gray-50 rounded-2xl border border-dashed">
                  <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Görüntülenecek talep bulunamadı.</p>
              </div>
          ) : (
              filteredTickets?.map((ticket) => (
                  <div key={ticket.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative">
                      <div className="flex justify-between items-start mb-3">
                          <div className="flex gap-2">
                               <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${urgencyColors[ticket.urgency as keyof typeof urgencyColors]}`}>
                                   {ticket.urgency === 'critical' ? '🔥 Kritik' : ticket.urgency === 'medium' ? '⚠️ Orta' : 'ℹ️ Düşük'}
                               </span>
                               <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                   {categoryLabels[ticket.category] || ticket.category}
                               </span>
                          </div>
                           <select 
                                value={ticket.status} 
                                onChange={(e) => updateStatusMut.mutate({ ticketId: ticket.id, status: e.target.value as any })}
                                className={`text-xs font-bold px-2 py-1 rounded border-none outline-none cursor-pointer ${statusColors[ticket.status as keyof typeof statusColors]}`}
                                onClick={(e) => e.stopPropagation()}
                           >
                               {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                           </select>
                      </div>
                      
                      <h3 className="font-bold text-gray-800 mb-1 line-clamp-1">{ticket.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4 h-10">{ticket.description}</p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-400 border-t pt-3 mt-auto">
                          <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {format(new Date(ticket.createdAt), "d MMM, HH:mm", { locale: tr })}
                          </div>
                          {/* Mock user fetch would go here if we had requester info populated */}
                      </div>
                  </div>
              ))
          )}
      </div>
    </div>
  );
}
