import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <div className="container mx-auto px-4 py-16">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-24">
          <div className="text-2xl font-bold text-[#1A237E]">Apartman Plus</div>
          <div className="space-x-4">
            <Link
              href="/login"
              className="px-6 py-2.5 rounded-lg border border-[#1A237E] text-[#1A237E] font-medium hover:bg-[#1A237E]/5 transition"
            >
              Yönetici Girişi
            </Link>
            <Link
              href="/register"
              className="px-6 py-2.5 rounded-lg bg-[#2ECC71] text-white font-medium hover:bg-[#27ae60] transition shadow-lg shadow-green-500/30"
            >
              Apartmanını Taşı
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-32">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-[#1A237E] leading-tight">
              Modern Komşuluk, <br />
              <span className="text-[#2ECC71]">Şeffaf Yönetim</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Apartman ve site yönetim süreçlerini dijitalleştirin. 
              Aidat takibi, online ödeme ve komşuluk ilişkileri artık tek bir platformda.
            </p>
            <div className="flex gap-4 pt-4">
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-[#1A237E] text-white rounded-xl font-semibold hover:bg-[#151b60] transition shadow-xl shadow-blue-900/20 flex items-center gap-2"
              >
                Dashboard&apos;a Git
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#2ECC71]/20 to-[#1A237E]/20 rounded-3xl transform rotate-3 scale-105 blur-2xl"></div>
            <div className="relative bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl">
              {/* Fake Dashboard UI Preview */}
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                  <div className="space-y-1">
                    <div className="h-2 w-24 bg-slate-200 rounded"></div>
                    <div className="h-4 w-48 bg-slate-100 rounded"></div>
                  </div>
                  <div className="h-10 w-10 bg-[#2ECC71]/20 rounded-full flex items-center justify-center text-[#2ECC71]">✓</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="text-xs text-slate-500 mb-1">Toplanan Aidat</div>
                    <div className="text-lg font-bold text-[#1A237E]">₺45,250</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="text-xs text-slate-500 mb-1">Aktif Arıza</div>
                    <div className="text-lg font-bold text-[#F1C40F]">3 Adet</div>
                  </div>
                </div>
                <div className="h-32 bg-slate-50 rounded-xl border border-slate-100 p-4 flex items-center justify-center text-slate-400 text-sm">
                  Kapsamlı Raporlama Sistemi
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon="💳"
            title="Online Tahsilat"
            description="Kredi kartı ile güvenli ve hızlı aidat ödeme altyapısı."
          />
          <FeatureCard
            icon="📢"
            title="Duyuru Sistemi"
            description="SMS ve bildirimler ile tüm sakinlere anında ulaşın."
          />
          <FeatureCard
            icon="🔧"
            title="Arıza Takibi"
            description="Talep oluşturun, süreci yönetin ve memnuniyeti artırın."
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white hover:bg-slate-50 transition p-8 rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md">
      <div className="text-4xl mb-4 p-3 bg-slate-100 w-fit rounded-xl">{icon}</div>
      <h3 className="text-xl font-bold text-[#1A237E] mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
