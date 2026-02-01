"use client";

import { trpc } from "@/lib/trpc";
import { Car, Cat, Phone, X } from "lucide-react";

interface AdminHouseholdViewProps {
  userId: string;
  userName: string;
  onClose: () => void;
}

export function AdminHouseholdView({ userId, userName, onClose }: AdminHouseholdViewProps) {
  const utils = trpc.useUtils();
  const { data, isLoading, error } = trpc.profile.adminGetHousehold.useQuery({ userId });
  
  const toggleVerification = trpc.profile.toggleVehicleVerification.useMutation({
    onSuccess: () => {
        utils.profile.adminGetHousehold.invalidate({ userId });
    }
  });

  if (isLoading) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-lg min-h-[200px] flex items-center justify-center">
                <p className="text-gray-500">Yükleniyor...</p>
            </div>
        </div>
    );
  }

  if (error) {
     return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-lg">
                <p className="text-red-500">Hata oluştu: {error.message}</p>
                <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded-lg">Kapat</button>
            </div>
        </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gray-50 rounded-t-xl sticky top-0 z-10">
            <div>
                <h3 className="text-xl font-bold text-gray-900">{userName}</h3>
                <p className="text-sm text-gray-500">Hane Bilgileri Detayı</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-6 h-6" />
            </button>
        </div>

        <div className="p-6 space-y-8">
            
            {/* Vehicles */}
            <section>
                <h4 className="flex items-center gap-2 font-bold text-gray-900 border-b pb-2 mb-4">
                    <Car className="w-5 h-5 text-indigo-600" />
                    Kayıtlı Araçlar
                </h4>
                {data?.vehicles.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">Kayıtlı araç bulunmuyor.</p>
                ) : (
                    <div className="grid gap-3">
                        {data?.vehicles.map(v => (
                            <div key={v.id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
                                <div>
                                    <p className="font-bold font-mono text-lg">{v.plateNumber}</p>
                                    <p className="text-sm text-gray-600">{v.model}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {v.verified ? (
                                        <>
                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Onaylı</span>
                                            <button 
                                                onClick={() => toggleVerification.mutate({ id: v.id, verified: false })}
                                                disabled={toggleVerification.isPending}
                                                className="text-xs text-red-600 hover:underline disabled:opacity-50"
                                            >
                                                İptal Et
                                            </button>
                                        </>
                                    ) : (
                                        <button 
                                            onClick={() => toggleVerification.mutate({ id: v.id, verified: true })}
                                            disabled={toggleVerification.isPending}
                                            className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                        >
                                            {toggleVerification.isPending ? "İşleniyor..." : "Onayla"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Pets */}
            <section>
                <h4 className="flex items-center gap-2 font-bold text-gray-900 border-b pb-2 mb-4">
                    <Cat className="w-5 h-5 text-orange-500" />
                    Evcil Hayvanlar
                </h4>
                {data?.pets.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">Kayıtlı evcil hayvan bulunmuyor.</p>
                ) : (
                    <div className="grid gap-3">
                        {data?.pets.map(p => (
                            <div key={p.id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
                                <div>
                                    <p className="font-bold">{p.name}</p>
                                    <p className="text-sm text-gray-600">{p.type} - {p.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Contacts */}
            <section>
                <h4 className="flex items-center gap-2 font-bold text-gray-900 border-b pb-2 mb-4">
                    <Phone className="w-5 h-5 text-red-500" />
                    Acil Durum Kişileri
                </h4>
                {data?.contacts.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">Acil durum kişisi eklenmemiş.</p>
                ) : (
                    <div className="grid gap-3">
                        {data?.contacts.map(c => (
                            <div key={c.id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
                                <div>
                                    <p className="font-bold">{c.name}</p>
                                    <p className="text-sm text-gray-600">{c.relation}</p>
                                </div>
                                <div className="text-right">
                                    <a href={`tel:${c.phoneNumber}`} className="text-indigo-600 font-bold hover:underline">
                                        {c.phoneNumber}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

        </div>
      </div>
    </div>
  );
}
