"use client";

import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { ArrowLeft, Banknote, Calendar, CheckCircle2, Coins, CreditCard, Plus, Send, TrendingDown, TrendingUp, Wallet, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";

export default function ApartmentFinancePage() {
  const params = useParams();
  const apartmentId = params.id as string;
  const utils = trpc.useUtils();

  const [activeTab, setActiveTab] = useState<"income" | "expense">("income");
  
  // Income State
  const [formData, setFormData] = useState({ description: "", amount: "", dueDay: 1 });
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [genMonth, setGenMonth] = useState(new Date().getMonth() + 1);
  const [genYear, setGenYear] = useState(new Date().getFullYear());
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<any | null>(null);

  // Expense State
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ description: "", amount: "", category: "maintenance", date: format(new Date(), "yyyy-MM-dd") });

  // Queries
  const templatesQuery = trpc.finance.getDuesTemplates.useQuery({ apartmentId });
  const invoicesQuery = trpc.finance.getInvoices.useQuery({ apartmentId });
  const expensesQuery = trpc.finance.getExpenses.useQuery({ apartmentId }, { enabled: activeTab === "expense" || true }); // Always fetch for totals

  // Income Mutations
  const createTemplateMutation = trpc.finance.createDuesTemplate.useMutation({
    onSuccess: () => {
      utils.finance.getDuesTemplates.invalidate();
      setIsCreatingTemplate(false);
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

  // Expense Mutation
  const expenseMut = trpc.finance.createExpense.useMutation({
      onSuccess: () => {
          utils.finance.getExpenses.invalidate();
          setIsAddingExpense(false);
          setExpenseForm({ description: "", amount: "", category: "maintenance", date: format(new Date(), "yyyy-MM-dd") });
      }
  });

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    createTemplateMutation.mutate({
      apartmentId,
      description: formData.description,
      amount: formData.amount,
      dueDay: Number(formData.dueDay)
    });
  };

  const handleCreateExpense = (e: React.FormEvent) => {
      e.preventDefault();
      expenseMut.mutate({
          apartmentId,
          description: expenseForm.description,
          amount: expenseForm.amount,
          category: expenseForm.category as any,
          date: new Date(expenseForm.date),
      });
  }

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
  const totalExpenses = expensesQuery.data?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
  const netBalance = totalCollected - totalExpenses;

  const expenseCategories: Record<string, string> = {
      maintenance: "Bakım",
      repair: "Onarım",
      cleaning: "Temizlik",
      electricity: "Elektrik",
      water: "Su",
      personnel: "Personel",
      other: "Diğer"
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/admin/apartments/${apartmentId}`} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#1A237E]">Finans Merkezi</h1>
          <p className="text-gray-500 text-sm">Finansal Durum, Gelirler ve Giderler</p>
        </div>
      </div>

       {/* Kasa Özeti (Dashboard Stats) */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Tahsilat (Gelir)</h3>
                <div className="text-2xl font-bold text-[#2ECC71]">{totalCollected.toLocaleString('tr-TR')} TL</div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Toplam Gider</h3>
                <div className="text-2xl font-bold text-red-500">{totalExpenses.toLocaleString('tr-TR')} TL</div>
            </div>
             <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm md:col-span-2 flex items-center justify-between bg-gradient-to-r from-gray-900 to-[#1A237E] text-white">
                <div>
                    <h3 className="text-xs font-medium text-gray-300 mb-1 uppercase tracking-wider">NET KASA (Bakiye)</h3>
                    <div className="text-3xl font-bold">{netBalance.toLocaleString('tr-TR')} TL</div>
                </div>
                <div className="p-3 bg-white/10 rounded-lg">
                    <Banknote className="w-8 h-8 text-white" />
                </div>
            </div>
       </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
          <nav className="-mb-px flex gap-6">
              <button 
                onClick={() => setActiveTab("income")}
                className={`pb-4 px-2 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === "income" ? "border-[#1A237E] text-[#1A237E]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              >
                  <TrendingUp className="w-4 h-4" />
                  Gelirler & Aidatlar
              </button>
              <button 
                onClick={() => setActiveTab("expense")}
                className={`pb-4 px-2 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === "expense" ? "border-[#1A237E] text-[#1A237E]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              >
                   <TrendingDown className="w-4 h-4" />
                  Giderler (Faturalar)
              </button>
          </nav>
      </div>

      {/* INCOME TAB */}
      {activeTab === "income" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
            {/* Template Actions */}
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">Aidat Şablonları</h2>
                <button
                onClick={() => setIsCreatingTemplate(true)}
                className="flex items-center gap-2 bg-[#2ECC71] text-white px-4 py-2 rounded-lg hover:bg-[#27ae60] transition-colors text-sm font-medium"
                >
                <Plus className="w-4 h-4" />
                Yeni Şablon
                </button>
            </div>

            {isCreatingTemplate && (
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-4">Yeni Aidat Şablonu</h3>
                    <form onSubmit={handleCreateTemplate} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <input className="border p-2 rounded" placeholder="Açıklama" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                        <input className="border p-2 rounded" type="number" placeholder="Tutar" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                        <select className="border p-2 rounded" value={formData.dueDay} onChange={e => setFormData({...formData, dueDay: Number(e.target.value)})}>
                             {[...Array(30)].map((_, i) => <option key={i} value={i+1}>{i+1}. Gün</option>)}
                        </select>
                        <div className="flex gap-2">
                             <button type="submit" className="bg-[#1A237E] text-white px-4 py-2 rounded flex-1">Kaydet</button>
                             <button type="button" onClick={() => setIsCreatingTemplate(false)} className="bg-gray-100 px-4 py-2 rounded">İptal</button>
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

            {/* Invoices List */}
            <div className="pt-4 border-t">
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
                                <tr key={invoice.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">{unit.blockName} Blok / {unit.unitNumber}</td>
                                    <td className="px-6 py-4">{invoice.description}</td>
                                    <td className="px-6 py-4">{format(new Date(invoice.dueDate), "d MMM yyyy", {locale: tr})}</td>
                                    <td className="px-6 py-4 font-bold">{invoice.amount} TL</td>
                                     <td className="px-6 py-4">
                                        {invoice.status === 'paid' ? (
                                            <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3"/> Ödendi</span>
                                        ) : (
                                            <span className="text-orange-600 bg-orange-50 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit"><XCircle className="w-3 h-3"/> Bekliyor</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {invoice.status !== 'paid' && (
                                            <button onClick={() => setPaymentModalInvoice({invoice, unit})} className="text-[#1A237E] hover:underline font-medium text-xs">Tahsil Et</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                         </tbody>
                    </table>
                 </div>
            </div>
          </div>
      )}

      {/* EXPENSE TAB */}
      {activeTab === "expense" && (
           <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-300">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800">Gider Listesi</h2>
                    <button
                        onClick={() => setIsAddingExpense(true)}
                        className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Gider Ekle
                    </button>
                </div>

                {isAddingExpense && (
                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-4">Yeni Gider Girişi</h3>
                        <form onSubmit={handleCreateExpense} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                             <div className="md:col-span-2">
                                <label className="text-xs text-gray-500">Açıklama</label>
                                <input className="w-full border p-2 rounded" placeholder="Örn: Asansör Bakımı" value={expenseForm.description} onChange={e => setExpenseForm({...expenseForm, description: e.target.value})} required/>
                             </div>
                             <div>
                                <label className="text-xs text-gray-500">Tutar</label>
                                <input className="w-full border p-2 rounded" type="number" placeholder="0.00" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} required/>
                             </div>
                             <div>
                                <label className="text-xs text-gray-500">Kategori</label>
                                <select className="w-full border p-2 rounded" value={expenseForm.category} onChange={e => setExpenseForm({...expenseForm, category: e.target.value})}>
                                    {Object.entries(expenseCategories).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                             </div>
                              <div>
                                <label className="text-xs text-gray-500">Tarih</label>
                                <input className="w-full border p-2 rounded" type="date" value={expenseForm.date} onChange={e => setExpenseForm({...expenseForm, date: e.target.value})} required/>
                             </div>
                              <div className="md:col-span-5 flex gap-2 justify-end">
                                <button type="button" onClick={() => setIsAddingExpense(false)} className="bg-gray-100 px-4 py-2 rounded">İptal</button>
                                <button type="submit" disabled={expenseMut.isPending} className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600">{expenseMut.isPending ? "..." : "Kaydet"}</button>
                             </div>
                        </form>
                    </div>
                )}

                <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 border-b">
                            <tr>
                                <th className="px-6 py-3 font-medium">Tarih</th>
                                <th className="px-6 py-3 font-medium">Kategori</th>
                                <th className="px-6 py-3 font-medium">Açıklama</th>
                                <th className="px-6 py-3 font-medium text-right">Tutar</th>
                            </tr>
                        </thead>
                         <tbody className="divide-y">
                            {expensesQuery.data?.map((expense) => (
                                <tr key={expense.id} className="hover:bg-gray-50">
                                     <td className="px-6 py-4">{format(new Date(expense.date), "d MMM yyyy", {locale: tr})}</td>
                                     <td className="px-6 py-4">
                                         <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs select-none">
                                            {expenseCategories[expense.category] || expense.category}
                                         </span>
                                     </td>
                                     <td className="px-6 py-4 text-gray-800">{expense.description}</td>
                                     <td className="px-6 py-4 font-bold text-red-600 text-right">-{expense.amount} TL</td>
                                </tr>
                            ))}
                            {expensesQuery.data?.length === 0 && (
                                <tr><td colSpan={4} className="text-center py-8 text-gray-400">Henüz gider kaydı yok.</td></tr>
                            )}
                         </tbody>
                    </table>
                </div>
           </div>
      )}

      {/* Modals (Income) */}
      {selectedTemplate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white p-6 rounded-xl w-full max-w-sm animate-in zoom-in-95">
                  <h3 className="text-lg font-bold mb-4">Toplu Borçlandırma</h3>
                  <div className="flex gap-4 mb-6">
                        <select className="w-full border p-2 rounded" value={genMonth} onChange={e => setGenMonth(Number(e.target.value))}>{Array.from({length: 12}, (_, i) => i + 1).map(m => <option key={m} value={m}>{m}. Ay</option>)}</select>
                        <input type="number" className="w-full border p-2 rounded" value={genYear} onChange={e => setGenYear(Number(e.target.value))} />
                  </div>
                  <div className="flex justify-end gap-3">
                      <button onClick={() => setSelectedTemplate(null)} className="text-gray-500 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm">İptal</button>
                      <button onClick={handleGenerate} disabled={generateMut.isPending} className="bg-[#1A237E] text-white px-4 py-2 rounded-lg text-sm">Onayla</button>
                  </div>
              </div>
          </div>
      )}

       {paymentModalInvoice && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
             <div className="bg-white p-6 rounded-xl w-full max-w-sm animate-in zoom-in-95">
                 <h3 className="text-lg font-bold mb-2">Tahsilat Girişi</h3>
                 <p className="text-gray-500 text-sm mb-4">
                     {paymentModalInvoice.unit.blockName} - {paymentModalInvoice.unit.unitNumber} <br/>
                     <span className="font-bold text-gray-800">{paymentModalInvoice.invoice.description} - {paymentModalInvoice.invoice.amount} TL</span>
                 </p>
                 <div className="space-y-3">
                     <button onClick={() => handlePayment("cash")} disabled={paymentMut.isPending} className="w-full bg-green-50 text-green-700 py-3 rounded-lg font-medium border border-green-200 hover:bg-green-100 flex items-center justify-center gap-2"><Wallet className="w-4 h-4"/> Nakit</button>
                     <button onClick={() => handlePayment("bank_transfer")} disabled={paymentMut.isPending} className="w-full bg-blue-50 text-blue-700 py-3 rounded-lg font-medium border border-blue-200 hover:bg-blue-100 flex items-center justify-center gap-2"><CreditCard className="w-4 h-4"/> Havale</button>
                 </div>
                 <button onClick={() => setPaymentModalInvoice(null)} className="w-full mt-4 text-gray-400 text-sm hover:underline">Vazgeç</button>
             </div>
          </div>
      )}
    </div>
  );
}
