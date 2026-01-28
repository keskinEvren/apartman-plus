"use client";

import { trpc } from "@/lib/trpc";
import { Building2, Loader2, MapPin, Plus } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function AdminApartmentsPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ name: "", address: "" });
  const [error, setError] = useState("");

  const utils = trpc.useUtils();
  const apartmentsQuery = trpc.apartment.list.useQuery();
  const createMutation = trpc.apartment.create.useMutation({
    onSuccess: () => {
      utils.apartment.list.invalidate();
      setIsCreating(false);
      setFormData({ name: "", address: "" });
    },
    onError: (err) => {
      setError(err.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address) return;
    createMutation.mutate(formData);
  };

  if (apartmentsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#1A237E]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A237E]">Apartman Yönetimi</h1>
          <p className="text-gray-600">Sistemdeki apartman ve siteleri yönetin.</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-[#2ECC71] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#27ae60] transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Yeni Apartman Ekle
        </button>
      </div>

      {isCreating && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-in slide-in-from-top-4 fade-in duration-300">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Yeni Apartman Oluştur</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apartman Adı</label>
                <input
                  type="text"
                  placeholder="Örn: Güneş Sitesi A Blok"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A237E] outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açık Adres</label>
                <input
                  type="text"
                  placeholder="Mahalle, Sokak, No..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A237E] outline-none"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-[#1A237E] text-white px-6 py-2 rounded-lg hover:bg-[#151b60] disabled:opacity-70 transition-colors"
              >
                {createMutation.isPending ? "Oluşturuluyor..." : "Kaydet"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apartmentsQuery.data?.map((apt) => (
          <div key={apt.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer border-l-4 border-l-[#1A237E]">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg text-[#1A237E]">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full capitalize">
                {apt.subscriptionType} Paketi
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-[#1A237E] transition-colors">{apt.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{apt.address}</span>
            </div>
            
            <div className="mt-6 pt-4 border-t flex items-center justify-between text-sm">
               <span className="text-gray-500">Daire sayısı: ...</span> {/* Placeholder for unit count */}
               <Link 
                 href={`/dashboard/admin/apartments/${apt.id}`}
                 className="text-[#1A237E] font-medium group-hover:underline flex items-center gap-1"
               >
                 Yönet &rarr;
               </Link>
            </div>
          </div>
        ))}

        {apartmentsQuery.data?.length === 0 && !isCreating && (
          <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">Henüz apartman yok</h3>
            <p className="text-gray-500 mb-4">Sistemi kullanmaya başlamak için ilk apartmanınızı ekleyin.</p>
            <button
              onClick={() => setIsCreating(true)}
              className="text-[#1A237E] font-medium hover:underline"
            >
              Şimdi Oluştur
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
