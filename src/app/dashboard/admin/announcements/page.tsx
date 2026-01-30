
"use client";

import { ArrowRight, Building } from "lucide-react";
import Link from "next/link";

export default function AdminAnnouncementsLandingPage() {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border text-center space-y-4">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
        <Building className="w-8 h-8 text-blue-600" />
      </div>
      <h2 className="text-xl font-bold">Duyuru Yönetimi</h2>
      <p className="text-gray-500 max-w-md">
        Duyuru oluşturmak veya görüntülemek için lütfen işlem yapmak istediğiniz apartmanı seçiniz.
      </p>
      <Link 
        href="/dashboard/admin/apartments" 
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
      >
        Apartmanları Listele
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
