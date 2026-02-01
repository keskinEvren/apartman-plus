"use client";

import { trpc } from "@/lib/trpc";
import { Copy, Mail, RefreshCw, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";

export default function InvitationsPage() {
  const utils = trpc.useUtils();
  const [form, setForm] = useState({ email: "", role: "resident" });
  
  const { data: invitations, isLoading } = trpc.invitation.getAll.useQuery();
  
  const createMutation = trpc.invitation.create.useMutation({
    onSuccess: () => {
        utils.invitation.getAll.invalidate();
        setForm({ email: "", role: "resident" });
        alert("Davetiye oluşturuldu ve konsola yazıldı! (Geliştirme Modu)");
    },
    onError: (err) => {
        alert("Hata: " + err.message);
    }
  });

  const revokeMutation = trpc.invitation.revoke.useMutation({
    onSuccess: () => utils.invitation.getAll.invalidate()
  });

  const copyLink = (token: string) => {
    const link = `${window.location.origin}/register?token=${token}`;
    navigator.clipboard.writeText(link);
    alert("Kayıt linki kopyalandı!");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserPlus className="h-8 w-8 text-indigo-600" />
            Davetiye Yönetimi
           </h1>
           <p className="text-gray-500 text-sm">Yeni sakinleri veya yöneticileri e-posta ile davet edin.</p>
        </div>
      </div>

      {/* Invite Form */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Yeni Davetiye Gönder</h2>
        <form 
            onSubmit={(e) => {
                e.preventDefault();
                createMutation.mutate({ email: form.email, role: form.role as any });
            }}
            className="flex flex-col md:flex-row gap-4 items-end"
        >
            <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">E-posta Adresi</label>
                <input 
                    type="email" 
                    required
                    placeholder="ornek@site.com"
                    className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                />
            </div>
            <div className="w-full md:w-48">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                 <select 
                    className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 bg-white"
                    value={form.role}
                    onChange={e => setForm({...form, role: e.target.value})}
                 >
                    <option value="resident">Sakin</option>
                    <option value="security">Güvenlik</option>
                    <option value="admin">Yönetici</option>
                 </select>
            </div>
            <button 
                type="submit"
                disabled={createMutation.isPending}
                className="w-full md:w-auto bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {createMutation.isPending ? <RefreshCw className="animate-spin w-4 h-4"/> : <Mail className="w-4 h-4" />}
                Davet Et
            </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
         <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Gönderilen Davetiyeler</h3>
            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">Toplam: {invitations?.length || 0}</span>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                    <tr>
                        <th className="px-6 py-3">E-posta</th>
                        <th className="px-6 py-3">Rol</th>
                        <th className="px-6 py-3">Durum</th>
                        <th className="px-6 py-3">Bitiş Tarihi</th>
                        <th className="px-6 py-3 text-right">İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    {invitations?.map((invite) => (
                        <tr key={invite.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900">{invite.email}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                    invite.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                    invite.role === 'security' ? 'bg-blue-100 text-blue-700' :
                                    'bg-green-100 text-green-700'
                                }`}>
                                    {invite.role === 'resident' ? 'Sakin' : invite.role.toUpperCase()}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-xs ${
                                    invite.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    invite.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {invite.status === 'pending' ? 'Bekliyor' :
                                     invite.status === 'accepted' ? 'Kabul Edildi' : 'Geçersiz'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-500">
                                {new Date(invite.expiresAt).toLocaleDateString("tr-TR")}
                            </td>
                            <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                {invite.status === 'pending' && (
                                    <>
                                        <button 
                                            onClick={() => copyLink(invite.token)}
                                            className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded"
                                            title="Linki Kopyala"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => {
                                                if(confirm("Bu davetiyeyi iptal etmek istediğinize emin misiniz?")) {
                                                    revokeMutation.mutate({ id: invite.id });
                                                }
                                            }}
                                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                                            title="İptal Et"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                    {invitations?.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                Henüz gönderilmiş davetiye yok.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
