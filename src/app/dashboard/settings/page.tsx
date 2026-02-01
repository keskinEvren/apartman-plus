"use client";

import { trpc } from "@/lib/trpc";
import { Home, Lock, Save, Settings, User } from "lucide-react";
import React, { useState } from "react";
import { HouseholdTab } from "./components/HouseholdTab";

export default function SettingsPage() {
  const utils = trpc.useUtils();
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "household">("profile");
  
  // Profile State
  const { data: user, isLoading } = trpc.user.me.useQuery();
  const [profileForm, setProfileForm] = useState({ fullName: "", phoneNumber: "" });
  
  // Security State
  const [securityForm, setSecurityForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });

  // Sync profile form when data loads
  React.useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName,
        phoneNumber: user.phoneNumber || ""
      });
    }
  }, [user]);

  const updateProfileMut = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      utils.user.me.invalidate();
      alert("Profil başarıyla güncellendi!");
    }
  });

  const changePasswordMut = trpc.user.changePassword.useMutation({
    onSuccess: () => {
      setSecurityForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      alert("Şifreniz başarıyla değiştirildi!");
    },
    onError: (err) => alert(err.message)
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMut.mutate(profileForm);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      alert("Yeni şifreler uyuşmuyor!");
      return;
    }
    changePasswordMut.mutate({
      oldPassword: securityForm.oldPassword,
      newPassword: securityForm.newPassword
    });
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Yükleniyor...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
             <Settings className="w-8 h-8 text-[#1A237E]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hesap Ayarları</h1>
          <p className="text-gray-500 text-sm">Profil bilgilerinizi ve güvenliğinizi yönetin</p>
        </div>
      </div>

      <div className="flex gap-6 items-start flex-col md:flex-row">
        {/* Sidebar Navigation for Settings */}
        <div className="w-full md:w-64 bg-white rounded-xl border shadow-sm p-4 space-y-2">
            <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "profile" ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50"}`}
            >
                <User className="w-4 h-4" />
                Profil Bilgileri
            </button>
            <button
                onClick={() => setActiveTab("household")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "household" ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50"}`}
            >
                <Home className="w-4 h-4" />
                Hane Bilgileri
            </button>
            <button
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "security" ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50"}`}
            >
                <Lock className="w-4 h-4" />
                Güvenlik & Şifre
            </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-xl border shadow-sm p-8 min-h-[400px] w-full">
            {activeTab === "profile" && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b">Profil Bilgileri</h2>
                    <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-lg">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                            <input 
                                type="text" 
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                value={profileForm.fullName}
                                onChange={e => setProfileForm({...profileForm, fullName: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon Numarası</label>
                            <input 
                                type="tel" 
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                value={profileForm.phoneNumber}
                                onChange={e => setProfileForm({...profileForm, phoneNumber: e.target.value})}
                                placeholder="05XX XXX XX XX"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">E-posta Adresi</label>
                            <input 
                                type="email" 
                                disabled
                                className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-lg p-2.5 cursor-not-allowed"
                                value={user?.email || ""}
                            />
                            <p className="text-xs text-gray-400 mt-1">E-posta adresi değiştirilemez.</p>
                        </div>
                        <div className="pt-4">
                            <button type="submit" disabled={updateProfileMut.isPending} className="flex items-center gap-2 bg-[#1A237E] text-white px-6 py-2.5 rounded-lg hover:bg-indigo-900 transition-colors shadow-sm disabled:opacity-50">
                                <Save className="w-4 h-4" />
                                {updateProfileMut.isPending ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {activeTab === "household" && (
                <HouseholdTab />
            )}

            {activeTab === "security" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b">Şifre Değiştir</h2>
                    <form onSubmit={handlePasswordChange} className="space-y-6 max-w-lg">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mevcut Şifre</label>
                            <input 
                                type="password" 
                                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                value={securityForm.oldPassword}
                                onChange={e => setSecurityForm({...securityForm, oldPassword: e.target.value})}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre</label>
                                <input 
                                    type="password" 
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                    value={securityForm.newPassword}
                                    onChange={e => setSecurityForm({...securityForm, newPassword: e.target.value})}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre (Tekrar)</label>
                                <input 
                                    type="password" 
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                    value={securityForm.confirmPassword}
                                    onChange={e => setSecurityForm({...securityForm, confirmPassword: e.target.value})}
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>
                        <div className="pt-4">
                            <button type="submit" disabled={changePasswordMut.isPending} className="flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50">
                                <Lock className="w-4 h-4" />
                                {changePasswordMut.isPending ? "Güncelleniyor..." : "Şifreyi Güncelle"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
