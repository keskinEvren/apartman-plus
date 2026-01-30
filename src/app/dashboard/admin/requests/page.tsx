
"use client";

import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export default function AdminRequestsPage() {
  const utils = trpc.useUtils();
  const { data: tickets, isLoading } = trpc.ops.getTickets.useQuery({ limit: 100 });
  
  const updateStatusMutation = trpc.ops.updateTicketStatus.useMutation({
    onSuccess: () => {
      utils.ops.getTickets.invalidate();
    }
  });

  const handleStatusChange = (ticketId: string, newStatus: any) => {
    updateStatusMutation.mutate({ ticketId, status: newStatus });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tüm Talepler</h2>
          <p className="text-muted-foreground">Sakinlerden gelen tüm arıza ve istek bildirimleri</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Talep</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aciliyet</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-4 text-center">Yükleniyor...</td></tr>
            ) : tickets?.map((ticket) => (
              <tr key={ticket.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{ticket.title}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">{ticket.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <span className="capitalize text-sm text-gray-700">{ticket.category}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <span className={`capitalize text-sm px-2 py-0.5 rounded ${ticket.urgency === 'critical' ? 'bg-red-100 text-red-800' : 'bg-gray-100'}`}>
                    {ticket.urgency}
                   </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(ticket.createdAt), "d MMM yyyy", { locale: tr })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select 
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                    className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                    <option value="open">Açık</option>
                    <option value="in_progress">İşleniyor</option>
                    <option value="resolved">Çözüldü</option>
                    <option value="cancelled">İptal</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
