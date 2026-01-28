"use client";

import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { ArrowLeft, Calendar, CheckCircle2, Coins, CreditCard, Plus, Send, Wallet, XCircle } from "lucide-react";
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

  // Payment State
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<any | null>(null);

  const templatesQuery = trpc.finance.getDuesTemplates.useQuery({ apartmentId });
  const invoicesQuery = trpc.finance.getInvoices.useQuery({ apartmentId });
  
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
      utils.finance.getInvoices.invalidate();
      setSelectedTemplate(null);
    },
    onError: (err) => alert(err.message)
  });

  const paymentMut = trpc.finance.addPayment.useMutation({
      onSuccess: () => {
          utils.finance.getInvoices.invalidate();
          setPaymentModalInvoice(null);
      }
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

  const handlePayment = (method: "cash" | "bank_transfer") => {
      if(!paymentModalInvoice) return;
      paymentMut.mutate({
          invoiceId: paymentModalInvoice.invoice.id,
          amount: paymentModalInvoice.invoice.amount,
          method
      });
  };

  // Calculations
  const totalReceivable = invoicesQuery.data?.reduce((acc, curr) => acc + Number(curr.invoice.amount), 0) || 0;
  const totalCollected = invoicesQuery.data?.filter(i => i.invoice.status === 'paid').reduce((acc, curr) => acc + Number(curr.invoice.amount), 0) || 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/admin/apartments/${apartmentId}`} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#1A237E]">Finans Merkezi</h1>
          <p className="text-gray-500 text-sm">Aidat Şablonları, Borçlandırma ve Kasa</p>
        </div>
      </div>

       {/* Kasa Özeti (Dashboard Stats) */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Toplam Tahakkuk (Alacak)</h3>
                    <div className="text-2xl font-bold text-gray-800">{totalReceivable.toLocaleString('tr-TR')} TL</div>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <Wallet className="w-6 h-6" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Kasa (Tahsil Edilen)</h3>
                    <div className="text-2xl font-bold text-[#2ECC71]">{totalCollected.toLocaleString('tr-TR')} TL</div>
                </div>
                 <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-[#2ECC71]">
                    <CreditCard className="w-6 h-6" />
                </div>
            </div>
       </div>

      <div className="flex justify-between items-center pt-8 border-t">
        <h2 className="text-lg font-bold text-gray-800">Aidat Şablonları</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-[#2ECC71] text-white px-4 py-2 rounded-lg hover:bg-[#27ae60] transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Yeni Şablon
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
                     <button type="submit" disabled={createTemplateMutation.isPending} className="bg-[#1A237E] text-white px-4 py-2 rounded-lg w-full text-sm">
                        {createTemplateMutation.isPending ? "..." : "Kaydet"}
                     </button>
                      <button type="button" onClick={() => setIsCreating(false)} className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg text-sm">İptal</button>
                </div>
            </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  className="w-full bg-indigo-50 text-[#1A237E] font-medium py-2 rounded-lg hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                    <Send className="w-4 h-4" />
                    Borç Oluştur
                </button>
            </div>
        ))}
      </div>

       {/* Invoice List */}
       <div className="pt-8 border-t">
           <h2 className="text-lg font-bold text-gray-800 mb-4">Borçlar & Ödemeler</h2>
           <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
               <table className="w-full text-left text-sm">
                   <thead className="bg-gray-50 text-gray-500 border-b">
                       <tr>
                           <th className="px-6 py-3 font-medium">Daire</th>
                           <th className="px-6 py-3 font-medium">Açıklama</th>
                           <th className="px-6 py-3 font-medium">Son Ödeme</th>
                           <th className="px-6 py-3 font-medium">Tutar</th>
                           <th className="px-6 py-3 font-medium">Durum</th>
                           <th className="px-6 py-3 font-medium text-right">İşlem</th>
                       </tr>
                   </thead>
                   <tbody className="divide-y">
                       {invoicesQuery.data?.map(({invoice, unit}) => (
                           <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                               <td className="px-6 py-4 font-medium text-gray-800">
                                   {unit.blockName} Blok / No: {unit.unitNumber}
                               </td>
                               <td className="px-6 py-4 text-gray-600">{invoice.description}</td>
                               <td className="px-6 py-4 text-gray-500">
                                   {format(new Date(invoice.dueDate), "d MMMM yyyy", { locale: tr })}
                               </td>
                               <td className="px-6 py-4 font-bold text-gray-800">
                                   {invoice.amount} TL
                               </td>
                               <td className="px-6 py-4">
                                   {invoice.status === 'paid' ? (
                                       <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-semibold">
                                           <CheckCircle2 className="w-3 h-3" /> Ödendi
                                       </span>
                                   ) : (
                                        <span className="inline-flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded-full text-xs font-semibold">
                                           <XCircle className="w-3 h-3" /> Bekliyor
                                       </span>
                                   )}
                               </td>
                               <td className="px-6 py-4 text-right">
                                   {invoice.status !== 'paid' && (
                                       <button 
                                          onClick={() => setPaymentModalInvoice({invoice, unit})}
                                          className="text-[#1A237E] hover:underline font-medium text-xs"
                                       >
                                           Tahsil Et
                                       </button>
                                   )}
                               </td>
                           </tr>
                       ))}
                       {invoicesQuery.data?.length === 0 && (
                           <tr><td colSpan={6} className="text-center py-8 text-gray-400">Henüz borç kaydı yok.</td></tr>
                       )}
                   </tbody>
               </table>
           </div>
       </div>

      {/* Bulk Generation Modal */}
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
                      <button onClick={() => setSelectedTemplate(null)} className="text-gray-500 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm">İptal</button>
                      <button 
                        onClick={handleGenerate} 
                        disabled={generateMut.isPending}
                        className="bg-[#1A237E] text-white px-4 py-2 rounded-lg text-sm"
                      >
                          {generateMut.isPending ? "İşleniyor..." : "Borçları Oluştur"}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Payment Modal */}
      {paymentModalInvoice && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
             <div className="bg-white p-6 rounded-xl w-full max-w-sm animate-in zoom-in-95">
                 <h3 className="text-lg font-bold mb-2">Tahsilat Girişi</h3>
                 <p className="text-gray-500 text-sm mb-4">
                     {paymentModalInvoice.unit.blockName} Blok / No: {paymentModalInvoice.unit.unitNumber} <br/>
                     <span className="font-bold text-gray-800">{paymentModalInvoice.invoice.description} - {paymentModalInvoice.invoice.amount} TL</span>
                 </p>
                 
                 <div className="space-y-3">
                     <button  
                        onClick={() => handlePayment("cash")}
                        disabled={paymentMut.isPending}
                        className="w-full bg-green-50 text-green-700 py-3 rounded-lg font-medium border border-green-200 hover:bg-green-100 flex items-center justify-center gap-2"
                     >
                         <Wallet className="w-4 h-4"/> Nakit Tahsilat
                     </button>
                     <button  
                         onClick={() => handlePayment("bank_transfer")}
                         disabled={paymentMut.isPending}
                         className="w-full bg-blue-50 text-blue-700 py-3 rounded-lg font-medium border border-blue-200 hover:bg-blue-100 flex items-center justify-center gap-2"
                     >
                         <CreditCard className="w-4 h-4"/> Banka Havalesi
                     </button>
                 </div>

                 <button 
                    onClick={() => setPaymentModalInvoice(null)}
                    className="w-full mt-4 text-gray-400 text-sm hover:underline"
                >
                    Vazgeç
                </button>
             </div>
          </div>
      )}
    </div>
  );
}
