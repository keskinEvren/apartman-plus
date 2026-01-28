"use client";

import { trpc } from "@/lib/trpc";
import { CreditCard, Home, Loader2, LogOut, Megaphone, Wrench } from "lucide-react";
import React from "react";

export default function DashboardPage() {
  // Queries (Stubs for now)
  const finance = trpc.finance.getDues.useQuery();
  const announcements = trpc.social.getAnnouncements.useQuery();

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#1A237E] text-white p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="text-2xl font-bold mb-10 flex items-center gap-2">
            <Home className="text-[#2ECC71]" /> Apartman+
          </div>
          <nav className="space-y-4">
            <NavLink icon={<Home size={20} />} label="Genel Bakış" active />
            <NavLink icon={<CreditCard size={20} />} label="Finansal Durum" />
            <NavLink icon={<Wrench size={20} />} label="Talepler & Arızalar" />
            <NavLink icon={<Megaphone size={20} />} label="Duyurular" />
          </nav>
        </div>
        <button className="flex items-center gap-3 text-slate-300 hover:text-white transition mt-8 md:mt-0">
          <LogOut size={20} /> Çıkış Yap
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Hoş Geldiniz, Evren 👋</h1>
            <p className="text-slate-500">Çiçek Apartmanı - Daire 12</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-slate-500 font-bold">
            E
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Ödenmesi Gereken"
            value="₺450.00"
            subtext="Son ödeme: 25 Ocak"
            color="text-[#1A237E]"
          />
          <StatCard
            title="Aktif Talepler"
            value="1"
            subtext="Asansör Arızası (İşlemde)"
            color="text-[#F1C40F]"
          />
          <StatCard
            title="Duyurular"
            value="2"
            subtext="Yeni mesajınız var"
            color="text-[#2ECC71]"
          />
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Payment */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CreditCard className="text-[#2ECC71]" size={20} /> Hızlı Ödeme
            </h2>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center py-8">
              <p className="text-slate-500 mb-2">Ocak 2026 Aidatı</p>
              <div className="text-3xl font-bold text-slate-800 mb-6">₺450.00</div>
              <button className="px-6 py-3 bg-[#2ECC71] hover:bg-[#27ae60] text-white rounded-xl font-semibold shadow-lg shadow-green-500/20 transition w-full md:w-auto">
                Kredi Kartı ile Öde
              </button>
            </div>
          </div>

          {/* Recent Announcements */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Megaphone className="text-[#1A237E]" size={20} /> Son Duyurular
            </h2>
            <div className="space-y-4">
              {announcements.isLoading ? (
                 <div className="flex justify-center p-4"><Loader2 className="animate-spin text-slate-400" /></div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border-l-4 border-[#1A237E]">
                  <h3 className="font-bold text-slate-800 text-sm">Apartman Toplantısı Hk.</h3>
                  <p className="text-slate-600 text-sm mt-1">Bu pazar saat 14:00&apos;te sığınakta olağan genel kurul yapılacaktır.</p>
                  <div className="text-xs text-slate-400 mt-2">Bugün, 10:30</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavLink({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <a
      href="#"
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active ? "bg-white/10 text-white font-medium" : "text-slate-300 hover:bg-white/5 hover:text-white"
      }`}
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}

function StatCard({ title, value, subtext, color }: { title: string; value: string; subtext: string; color: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
      <div className="text-sm text-slate-500 font-medium mb-1 uppercase tracking-wide">{title}</div>
      <div className={`text-3xl font-bold mb-2 ${color}`}>{value}</div>
      <div className="text-xs text-slate-400">{subtext}</div>
    </div>
  );
}
