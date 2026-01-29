"use client";

import { trpc } from "@/lib/trpc";
import { ArrowLeft, Building2, Home, Loader2, Megaphone, Plus, Search, UserPlus, Users, Wrench } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

export default function ApartmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const apartmentId = params.id as string;
  
  const [isAddingUnit, setIsAddingUnit] = useState(false);
  const [unitForm, setUnitForm] = useState({ blockName: "", unitNumber: "" });

  // Assignment State
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [assignmentForm, setAssignmentForm] = useState({ userId: "", userType: "tenant" as "owner" | "tenant" });

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const utils = trpc.useUtils();
  const apartmentQuery = trpc.apartment.get.useQuery({ id: apartmentId });
  const unitsQuery = trpc.apartment.getUnits.useQuery({ apartmentId });
  const userSearchQuery = trpc.user.search.useQuery({ query: debouncedQuery }, { enabled: debouncedQuery.length >= 2 });

  const createUnitMutation = trpc.apartment.createUnit.useMutation({
    onSuccess: () => {
      utils.apartment.getUnits.invalidate();
      setIsAddingUnit(false);
      setUnitForm({ blockName: "", unitNumber: "" });
    }
  });

  const assignUserMutation = trpc.apartment.assignUser.useMutation({
    onSuccess: () => {
      utils.apartment.getUnits.invalidate();
      setSelectedUnitId(null);
      setSearchQuery("");
      setAssignmentForm({ userId: "", userType: "tenant" });
      alert("Sakin başarıyla atandı!");
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

  const handleAssignUser = () => {
    if (!selectedUnitId || !assignmentForm.userId) return;
    assignUserMutation.mutate({
        unitId: selectedUnitId,
        userId: assignmentForm.userId,
        userType: assignmentForm.userType
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
    <div className="space-y-6 relative">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admin/apartments" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#1A237E]">{apartment.name}</h1>
          <p className="text-gray-500 text-sm">{apartment.address}</p>
        </div>
      </div>

      {/* Finance & Operations Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href={`/dashboard/admin/apartments/${apartmentId}/finance`} className="bg-gradient-to-br from-[#1A237E] to-[#283593] p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all group">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                    <Building2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg">Finans Merkezi</h3>
            </div>
            <p className="text-indigo-100 text-sm">Aidat şablonları, borçlandırma ve kasa takibi.</p>
        </Link>

        {/* Announcements Card */}
        <Link href={`/dashboard/admin/apartments/${apartmentId}/announcements`} className="bg-gradient-to-br from-[#E65100] to-[#F57C00] p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all group">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                     <Megaphone className="w-6 h-6" />
                </div>
                 <h3 className="font-bold text-lg">Duyurular</h3>
            </div>
            <p className="text-orange-100 text-sm">Apartman duyurularını yönetin ve paylaşın.</p>
        </Link>

        {/* Requests Card */}
        <Link href={`/dashboard/admin/apartments/${apartmentId}/requests`} className="bg-gradient-to-br from-[#4A148C] to-[#7B1FA2] p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all group">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                    <Wrench className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg">Arıza & Talepler</h3>
            </div>
            <p className="text-purple-100 text-sm">Sakinlerden gelen arıza ve şikayetleri takip edin.</p>
        </Link>
      </div>

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
                <button 
                    onClick={() => setSelectedUnitId(unit.id)}
                    className="w-full mt-2 text-xs font-medium text-[#1A237E] bg-indigo-50 py-1.5 rounded hover:bg-indigo-100 transition-colors"
                >
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

       {/* Assignment Modal Overlay */}
       {selectedUnitId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Daireye Sakin Ata</h3>
                
                <div className="space-y-4">
                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rolü</label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setAssignmentForm({ ...assignmentForm, userType: "tenant" })}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium border ${assignmentForm.userType === "tenant" ? "bg-indigo-50 border-[#1A237E] text-[#1A237E]" : "border-gray-200 text-gray-600"}`}
                            >
                                Kiracı
                            </button>
                            <button
                                onClick={() => setAssignmentForm({ ...assignmentForm, userType: "owner" })}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium border ${assignmentForm.userType === "owner" ? "bg-indigo-50 border-[#1A237E] text-[#1A237E]" : "border-gray-200 text-gray-600"}`}
                            >
                                Ev Sahibi
                            </button>
                        </div>
                    </div>

                    {/* User Search */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Kullanıcı Ara</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input 
                                type="text"
                                className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1A237E] outline-none"
                                placeholder="İsim veya E-posta..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        
                        {/* Search Results */}
                        {searchQuery.length >= 2 && (
                            <div className="mt-2 border rounded-lg max-h-48 overflow-y-auto bg-gray-50">
                                {userSearchQuery.isLoading ? (
                                    <div className="p-3 text-center text-gray-400 text-xs">Aranıyor...</div>
                                ) : userSearchQuery.data?.length === 0 ? (
                                    <div className="p-3 text-center text-gray-400 text-xs">Kullanıcı bulunamadı.</div>
                                ) : (
                                    userSearchQuery.data?.map(user => (
                                        <button
                                            key={user.id}
                                            onClick={() => setAssignmentForm({ ...assignmentForm, userId: user.id })}
                                            className={`w-full text-left p-3 text-sm flex items-center justify-between hover:bg-indigo-50 transition-colors ${assignmentForm.userId === user.id ? "bg-indigo-100 ring-1 ring-inset ring-[#1A237E]" : ""}`}
                                        >
                                            <div>
                                                <div className="font-medium text-gray-900">{user.fullName || "İsimsiz"}</div>
                                                <div className="text-gray-500 text-xs">{user.email}</div>
                                            </div>
                                            {assignmentForm.userId === user.id && <UserPlus className="w-4 h-4 text-[#1A237E]" />}
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                    <button 
                        onClick={() => { setSelectedUnitId(null); setSearchQuery(""); }}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        İptal
                    </button>
                    <button 
                        onClick={handleAssignUser}
                        disabled={!assignmentForm.userId || assignUserMutation.isPending}
                        className="bg-[#1A237E] text-white px-6 py-2 rounded-lg hover:bg-[#151b60] disabled:opacity-70 transition-colors"
                    >
                        {assignUserMutation.isPending ? "Atanıyor..." : "Atama Yap"}
                    </button>
                </div>
            </div>
        </div>
       )}
    </div>
  );
}
