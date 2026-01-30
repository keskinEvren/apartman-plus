
"use client";

import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Edit2, Search, Trash2, UserCog } from "lucide-react";
import React, { useState } from "react";

export default function AdminUsersPage() {
  const utils = trpc.useUtils();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<any>(null);

  const { data: users, isLoading } = trpc.user.getAll.useQuery();
  const { data: currentUser } = trpc.user.me.useQuery();

  const updateRoleMut = trpc.user.updateRole.useMutation({
    onSuccess: () => {
      utils.user.getAll.invalidate();
      setEditingUser(null);
    }
  });

  const deleteUserMut = trpc.user.deleteUser.useMutation({
    onSuccess: () => {
      utils.user.getAll.invalidate();
    }
  });

  const handleDelete = (userId: string) => {
    if (confirm("Bu kullanıcıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) {
      deleteUserMut.mutate({ userId });
    }
  };

  const handleRoleUpdate = (e: React.FormEvent) => {
      e.preventDefault();
      if(!editingUser) return;
      updateRoleMut.mutate({
          userId: editingUser.id,
          role: editingUser.role
      });
  };

  const filteredUsers = users?.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(u => !u.deletedAt); // Don't show soft-deleted users

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
          <p className="text-gray-500 text-sm">Sistemdeki tüm kullanıcıları yönetin</p>
        </div>
        <div className="relative">
             <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             <input 
                type="text" 
                placeholder="İsim veya E-posta ara..." 
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanıcı</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kayıt Tarihi</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Yükleniyor...</td></tr>
            ) : filteredUsers?.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                        {user.fullName.charAt(0)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.role === 'admin' || user.role === 'super_admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(user.createdAt), "d MMM yyyy", { locale: tr })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    {currentUser?.role === 'super_admin' && (
                      <>
                        <button 
                          onClick={() => setEditingUser(user)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Rolü Düzenle"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Kullanıcıyı Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Role Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
           <div className="bg-white p-6 rounded-xl w-full max-w-sm">
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                   <UserCog className="w-5 h-5 text-indigo-600" />
                   Rol Düzenle
               </h3>
               <p className="text-sm text-gray-500 mb-4">{editingUser.fullName} kullanıcısının rolünü değiştiriyorsunuz.</p>
               
               <form onSubmit={handleRoleUpdate}>
                   <div className="space-y-3 mb-6">
                       <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                           <input type="radio" name="role" value="resident" checked={editingUser.role === 'resident'} onChange={() => setEditingUser({...editingUser, role: 'resident'})} />
                           <span className="text-sm font-medium">Sakin (Resident)</span>
                       </label>
                       <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                           <input type="radio" name="role" value="admin" checked={editingUser.role === 'admin'} onChange={() => setEditingUser({...editingUser, role: 'admin'})} />
                           <span className="text-sm font-medium">Yönetici (Admin)</span>
                       </label>
                       <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                           <input type="radio" name="role" value="super_admin" checked={editingUser.role === 'super_admin'} onChange={() => setEditingUser({...editingUser, role: 'super_admin'})} />
                           <span className="text-sm font-medium">Süper Admin</span>
                       </label>
                   </div>
                   
                   <div className="flex justify-end gap-3">
                       <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">İptal</button>
                       <button type="submit" disabled={updateRoleMut.isPending} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
                           {updateRoleMut.isPending ? "Kaydediliyor..." : "Kaydet"}
                       </button>
                   </div>
               </form>
           </div>
        </div>
      )}
    </div>
  );
}
