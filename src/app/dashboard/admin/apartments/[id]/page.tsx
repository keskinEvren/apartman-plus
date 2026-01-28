"use client";

import { trpc } from "@/lib/trpc";
import { ArrowLeft, Home, Loader2, Plus, Users } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

export default function ApartmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const apartmentId = params.id as string;
  
  const [isAddingUnit, setIsAddingUnit] = useState(false);
  const [unitForm, setUnitForm] = useState({ blockName: "", unitNumber: "" });

  const utils = trpc.useUtils();
  const apartmentQuery = trpc.apartment.get.useQuery({ id: apartmentId });
  const unitsQuery = trpc.apartment.getUnits.useQuery({ apartmentId });
  
  const createUnitMutation = trpc.apartment.createUnit.useMutation({
    onSuccess: () => {
      utils.apartment.getUnits.invalidate();
      setIsAddingUnit(false);
      setUnitForm({ blockName: "", unitNumber: "" });
    }
  });

  const handleCreateUnit = (e: React.FormEvent) => {
    e.preventDefault();
    createUnitMutation.mutate({
      apartmentId,
      blockName: unitForm.blockName || undefined,
      unitNumber: unitForm.unitNumber
    });
  };

  if (apartmentQuery.isLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-[#1A237E]" /></div>;
  }

  const apartment = apartmentQuery.data;

  if (!apartment) {
    return <div className="text-center py-10">Apartman bulunamadı.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admin/apartments" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#1A237E]">{apartment.name}</h1>
          <p className="text-gray-500 text-sm">{apartment.address}</p>
        </div>
      </div>

      {/* Stats/Overview Cards could go here */}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Home className="w-5 h-5 text-[#2ECC71]" />
            Daireler (Bölümler)
          </h2>
          <button
            onClick={() => setIsAddingUnit(true)}
            className="flex items-center gap-2 text-sm bg-[#1A237E] text-white px-3 py-2 rounded-lg hover:bg-[#151b60] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Daire Ekle
          </button>
        </div>

        {isAddingUnit && (
          <form onSubmit={handleCreateUnit} className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-in fade-in slide-in-from-top-2">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Yeni Daire Tanımla</h3>
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Blok (Opsiyonel)</label>
                <input
                  type="text"
                  placeholder="A"
                  className="px-3 py-2 border rounded-md w-24 focus:ring-1 focus:ring-[#1A237E]"
                  value={unitForm.blockName}
                  onChange={(e) => setUnitForm({...unitForm, blockName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Daire No</label>
                <input
                  type="text"
                  placeholder="1, 2, 3..."
                  className="px-3 py-2 border rounded-md w-24 focus:ring-1 focus:ring-[#1A237E]"
                  value={unitForm.unitNumber}
                  onChange={(e) => setUnitForm({...unitForm, unitNumber: e.target.value})}
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={createUnitMutation.isPending}
                className="bg-[#2ECC71] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#27ae60] disabled:opacity-70"
              >
                {createUnitMutation.isPending ? "Ekleniyor..." : "Ekle"}
              </button>
              <button 
                 type="button"
                 onClick={() => setIsAddingUnit(false)}
                 className="text-gray-500 text-sm hover:underline ml-2"
              >
                Vazgeç
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {unitsQuery.data?.map(unit => (
            <div key={unit.id} className="border border-gray-100 rounded-lg p-4 hover:border-indigo-200 transition-colors bg-white">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                    {unit.unitNumber}
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">
                      {unit.blockName ? `${unit.blockName} Blok` : "Bağımsız"}
                    </span>
                    <h4 className="font-medium text-gray-800">Daire {unit.unitNumber}</h4>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-[#1A237E]">
                  <Users className="w-4 h-4" />
                </button>
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-50">
                <p className="text-xs text-center text-gray-400 italic">
                  Henüz sakin atanmamış
                </p>
                <button className="w-full mt-2 text-xs font-medium text-[#1A237E] bg-indigo-50 py-1.5 rounded hover:bg-indigo-100 transition-colors">
                  + Sakin Ekle
                </button>
              </div>
            </div>
          ))}
          
          {unitsQuery.data?.length === 0 && !isAddingUnit && (
             <div className="col-span-full py-8 text-center text-gray-400 text-sm">
               Bu apartmanda henüz tanımlı daire yok.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
