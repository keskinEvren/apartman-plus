"use client";

import { trpc } from "@/lib/trpc";
import { Car, Search, Phone, User } from "lucide-react";
import React, { useState } from "react";

export default function ParkingPage() {
  const [plateQuery, setPlateQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(plateQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [plateQuery]);

  const { data: results, isLoading, error } = trpc.profile.searchPlate.useMutation();
  const searchMut = trpc.profile.searchPlate.useMutation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (plateQuery.length >= 3) {
        searchMut.mutate({ plateNumber: plateQuery });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
             <Car className="w-8 h-8 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Otopark & Araç Sorgulama</h1>
          <p className="text-gray-500 text-sm">Plaka sorgulayarak araç sahibine ulaşın</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <form onSubmit={handleSearch} className="relative max-w-xl mx-auto flex flex-col md:block">
            <input 
                type="text" 
                placeholder="Plaka Giriniz (Örn: 34 AB 123)" 
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all uppercase placeholder:normal-case mb-3 md:mb-0"
                value={plateQuery}
                onChange={(e) => setPlateQuery(e.target.value.toUpperCase())}
            />
            <Search className="absolute left-4 top-4 md:top-1/2 md:-translate-y-1/2 text-gray-400 w-6 h-6" />
            <button 
                type="submit"
                disabled={plateQuery.length < 3 || searchMut.isPending}
                className="w-full md:w-auto md:absolute md:right-2 md:top-2 md:bottom-2 bg-indigo-600 text-white px-6 py-3 md:py-0 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
                {searchMut.isPending ? "Aranıyor..." : "Sorgula"}
            </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-3">En az 3 karakter giriniz.</p>
      </div>

      {/* Results */}
      {searchMut.data && (
        <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Arama Sonuçları</h2>
            
            {searchMut.data.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <Car className="w-12 h-12 mx-auto text-gray-200 mb-2" />
                    <p>Bu plakaya ait kayıt bulunamadı.</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {searchMut.data.map((item: any, idx: number) => (
                        <div key={idx} className="p-4 border rounded-xl hover:bg-gray-50 transition-colors flex justify-between items-start group">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-mono font-bold text-xl bg-gray-100 px-2 py-0.5 rounded text-gray-800 border bg-gradient-to-b from-white to-gray-50">
                                        {item.vehicle.plateNumber}
                                    </span>
                                    {item.vehicle.verified && <span className="text-green-600 text-xs font-bold">✓ Onaylı</span>}
                                </div>
                                <p className="text-gray-600 text-sm mb-3">{item.vehicle.model}</p>
                                
                                <div className="flex items-center gap-2 text-sm text-gray-900 font-medium">
                                    <User className="w-4 h-4 text-gray-400" />
                                    {item.owner.fullName}
                                </div>
                            </div>
                            
                            {item.owner.phoneNumber && (
                                <a 
                                    href={`tel:${item.owner.phoneNumber}`} 
                                    className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg hover:bg-green-100 transition-colors"
                                >
                                    <Phone className="w-4 h-4" />
                                    <span>Ara</span>
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
      )}

      {/* Quick Info */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800">
            <strong className="block mb-1">Misafir Araçlar</strong>
            Misafir araçları için lütfen güvenlik (Dahili: 100) ile iletişime geçiniz.
        </div>
        <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-sm text-orange-800">
            <strong className="block mb-1">Hatalı Park</strong>
            Hatalı park durumunda araç sahibini aramadan önce fotoğraf çekmeniz önerilir.
        </div>
        <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl text-sm text-purple-800">
            <strong className="block mb-1">Bilgi Güncelleme</strong>
            Kendi araç bilginizi "Ayarlar > Hane Bilgileri" menüsünden güncelleyebilirsiniz.
        </div>
      </div>
    </div>
  );
}
