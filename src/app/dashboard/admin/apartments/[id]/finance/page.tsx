"use client";

import { trpc } from "@/lib/trpc";
import { ArrowLeft, Calendar, Coins, Plus, Send } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";

export default function ApartmentFinancePage() {
  const params = useParams();
  const apartmentId = params.id as string;
  const utils = trpc.useUtils();

  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ description: "", amount: "", dueDay: 1 });

  // Bulk Generation State
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [genMonth, setGenMonth] = useState(new Date().getMonth() + 1);
  const [genYear, setGenYear] = useState(new Date().getFullYear());

  const templatesQuery = trpc.finance.getDuesTemplates.useQuery({ apartmentId });
  
  const createTemplateMutation = trpc.finance.createDuesTemplate.useMutation({
    onSuccess: () => {
      utils.finance.getDuesTemplates.invalidate();
      setIsCreating(false);
      setFormData({ description: "", amount: "", dueDay: 1 });
    }
  });

  const generateMut = trpc.finance.generateBulkInvoices.useMutation({
    onSuccess: (data) => {
      alert(`${data.count} adet fatura başarıyla oluşturuldu!`);
      setSelectedTemplate(null);
    },
    onError: (err) => alert(err.message)
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createTemplateMutation.mutate({
      apartmentId,
      description: formData.description,
      amount: formData.amount,
      dueDay: Number(formData.dueDay)
    });
  };

  const handleGenerate = () => {
    if (!selectedTemplate) return;
    if (confirm(`${genMonth}/${genYear} dönemi için tüm dairelere borç eklenecek. Onaylıyor musunuz?`)) {
      generateMut.mutate({
        apartmentId,
        templateId: selectedTemplate,
        month: Number(genMonth),
        year: Number(genYear)
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/admin/apartments/${apartmentId}`} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#1A237E]">Finans Yönetimi</h1>
          <p className="text-gray-500 text-sm">Aidat Şablonları ve Toplu Borçlandırma</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-[#2ECC71] text-white px-4 py-2 rounded-lg hover:bg-[#27ae60] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yeni Şablon Ekle
        </button>
      </div>

      {isCreating && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-2">
            <h3 className="font-semibold text-gray-800 mb-4">Yeni Aidat Şablonu</h3>
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Açıklama</label>
                    <input 
                        type="text" 
                        placeholder="Örn: 2026 Genel Aidat"
                        className="w-full px-3 py-2 border rounded-lg"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        required
                    />
                </div>
                <div>
                     <label className="block text-xs font-medium text-gray-500 mb-1">Tutar (TL)</label>
                    <input 
                        type="number" 
                        placeholder="500"
                        className="w-full px-3 py-2 border rounded-lg"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        required
                    />
                </div>
                 <div>
                     <label className="block text-xs font-medium text-gray-500 mb-1">Son Ödeme Günü</label>
                    <select 
                        className="w-full px-3 py-2 border rounded-lg"
                        value={formData.dueDay}
                        onChange={(e) => setFormData({...formData, dueDay: Number(e.target.value)})}
                    >
                        {[...Array(30)].map((_, i) => (
                            <option key={i+1} value={i+1}>{i+1}. Gün</option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-2">
                     <button type="submit" disabled={createTemplateMutation.isPending} className="bg-[#1A237E] text-white px-4 py-2 rounded-lg w-full">
                        {createTemplateMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
                     </button>
                      <button type="button" onClick={() => setIsCreating(false)} className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg">İptal</button>
                </div>
            </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templatesQuery.data?.map(template => (
            <div key={template.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Coins className="w-24 h-24 text-[#1A237E]" />
                </div>
                
                <h3 className="text-lg font-bold text-gray-800">{template.description}</h3>
                <div className="text-3xl font-extrabold text-[#1A237E] my-3">
                    {template.amount} <span className="text-sm font-medium text-gray-500">TL</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Calendar className="w-4 h-4" />
                    Her ayın {template.dueDay}. günü
                </div>

                <button 
                  onClick={() => setSelectedTemplate(template.id)}
                  className="w-full bg-indigo-50 text-[#1A237E] font-medium py-2 rounded-lg hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                >
                    <Send className="w-4 h-4" />
                    Borç Oluştur
                </button>
            </div>
        ))}
      </div>

      {/* Bulk Generation Boolean */}
      {selectedTemplate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white p-6 rounded-xl w-full max-w-sm animate-in zoom-in-95">
                  <h3 className="text-lg font-bold mb-4">Toplu Borçlandırma</h3>
                  <p className="text-gray-600 text-sm mb-4">Seçilen ay için, apartmandaki TÜM dairelere borç çıkarılacaktır.</p>
                  
                  <div className="flex gap-4 mb-6">
                        <div className="flex-1">
                            <label className="text-xs font-semibold text-gray-500 block mb-1">Ay</label>
                            <select className="w-full border p-2 rounded" value={genMonth} onChange={e => setGenMonth(Number(e.target.value))}>
                                {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                                    <option key={m} value={m}>{new Date(0, m-1).toLocaleString('tr-TR', {month: 'long'})}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                             <label className="text-xs font-semibold text-gray-500 block mb-1">Yıl</label>
                             <input type="number" className="w-full border p-2 rounded" value={genYear} onChange={e => setGenYear(Number(e.target.value))} />
                        </div>
                  </div>

                  <div className="flex justify-end gap-3">
                      <button onClick={() => setSelectedTemplate(null)} className="text-gray-500 hover:bg-gray-100 px-4 py-2 rounded-lg">İptal</button>
                      <button 
                        onClick={handleGenerate} 
                        disabled={generateMut.isPending}
                        className="bg-[#1A237E] text-white px-4 py-2 rounded-lg"
                      >
                          {generateMut.isPending ? "İşleniyor..." : "Borçları Oluştur"}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
