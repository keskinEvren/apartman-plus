
"use client";

import { trpc } from "@/lib/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Plus, Wrench } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ticketSchema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter olmalıdır"),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalıdır"),
  category: z.enum(['plumbing', 'electrical', 'elevator', 'cleaning', 'other']),
  urgency: z.enum(['low', 'medium', 'critical']),
});

type TicketFormValues = z.infer<typeof ticketSchema>;

export default function ResidentRequestsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const utils = trpc.useUtils();
  
  const { data: tickets, isLoading } = trpc.ops.getTickets.useQuery({ limit: 50 });
  
  const createMutation = trpc.ops.createTicket.useMutation({
    onSuccess: () => {
      utils.ops.getTickets.invalidate();
      setIsModalOpen(false);
      reset();
    }
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema)
  });

  const onSubmit = (data: TicketFormValues) => {
    createMutation.mutate(data);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'open': return <span className="bg-yellow-100 text-yellow-800 px-2.5 py-0.5 rounded text-xs font-medium">Açık</span>;
      case 'in_progress': return <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded text-xs font-medium">İşleniyor</span>;
      case 'resolved': return <span className="bg-green-100 text-green-800 px-2.5 py-0.5 rounded text-xs font-medium">Çözüldü</span>;
      default: return <span className="bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded text-xs font-medium">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Taleplerim & Arızalar</h2>
          <p className="text-muted-foreground">Arıza bildirimleri ve yönetim talepleriniz</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni Talep
        </button>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-center py-12">Yükleniyor...</div>
        ) : tickets?.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500">Henüz oluşturduğunuz bir talep bulunmuyor.</p>
          </div>
        ) : (
          tickets?.map((ticket) => (
            <div key={ticket.id} className="p-5 bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900">{ticket.title}</h3>
                  {getStatusBadge(ticket.status)}
                </div>
                <span className="text-xs text-gray-500">
                  {format(new Date(ticket.createdAt), "d MMM HH:mm", { locale: tr })}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{ticket.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500 border-t pt-3">
                <span className="capitalize px-2 py-1 bg-gray-50 rounded border">Kategori: {ticket.category}</span>
                <span className={`capitalize px-2 py-1 rounded border ${ticket.urgency === 'critical' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-gray-50'}`}>
                  Aciliyet: {ticket.urgency}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Simple Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold">Yeni Talep Oluştur</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Başlık</label>
                <input {...register("title")} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Örn: Asansör arızası" />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Kategori</label>
                  <select {...register("category")} className="w-full border rounded-lg px-3 py-2 text-sm bg-white">
                    <option value="plumbing">Sıhhi Tesisat</option>
                    <option value="electrical">Elektrik</option>
                    <option value="elevator">Asansör</option>
                    <option value="cleaning">Temizlik</option>
                    <option value="other">Diğer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Aciliyet</label>
                  <select {...register("urgency")} className="w-full border rounded-lg px-3 py-2 text-sm bg-white">
                    <option value="low">Düşük</option>
                    <option value="medium">Orta</option>
                    <option value="critical">Kritik</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Açıklama</label>
                <textarea {...register("description")} rows={3} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Detaylı açıklama..." />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={createMutation.isPending}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {createMutation.isPending ? "Gönderiliyor..." : "Talebi Gönder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
