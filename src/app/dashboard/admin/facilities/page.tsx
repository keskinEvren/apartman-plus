"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { CalendarClock, Clock, Pencil, Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Days of week labels
const DAYS = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

export default function AdminFacilitiesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<any>(null);
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [selectedFacilityForSession, setSelectedFacilityForSession] = useState<any>(null);
  const [editingSession, setEditingSession] = useState<any>(null);
  const utils = trpc.useUtils();

  const { data: facilities, isLoading } = trpc.facility.adminList.useQuery();
  const { data: sessions } = trpc.facility.listSessions.useQuery(
    { facilityId: selectedFacilityForSession?.id ?? "" },
    { enabled: !!selectedFacilityForSession }
  );

  const createMutation = trpc.facility.create.useMutation({
    onSuccess: () => {
      toast.success("Tesis başarıyla oluşturuldu");
      setIsDialogOpen(false);
      utils.facility.adminList.invalidate();
    },
    onError: (error: any) => toast.error(error.message),
  });

  const updateMutation = trpc.facility.update.useMutation({
    onSuccess: () => {
      toast.success("Tesis güncellendi");
      setIsDialogOpen(false);
      setEditingFacility(null);
      utils.facility.adminList.invalidate();
    },
    onError: (error: any) => toast.error(error.message),
  });

  const deleteMutation = trpc.facility.delete.useMutation({
    onSuccess: () => {
      toast.success("Tesis silindi");
      utils.facility.adminList.invalidate();
    },
    onError: (error) => toast.error(error.message),
  });

  // Session mutations
  const createSessionMutation = trpc.facility.createSession.useMutation({
    onSuccess: () => {
      toast.success("Seans oluşturuldu");
      setEditingSession(null);
      utils.facility.listSessions.invalidate();
    },
    onError: (error: any) => toast.error(error.message),
  });

  const updateSessionMutation = trpc.facility.updateSession.useMutation({
    onSuccess: () => {
      toast.success("Seans güncellendi");
      setEditingSession(null);
      utils.facility.listSessions.invalidate();
    },
    onError: (error: any) => toast.error(error.message),
  });

  const deleteSessionMutation = trpc.facility.deleteSession.useMutation({
    onSuccess: () => {
      toast.success("Seans silindi");
      utils.facility.listSessions.invalidate();
    },
    onError: (error: any) => toast.error(error.message),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      capacity: parseInt(formData.get("capacity") as string),
      openHour: parseInt(formData.get("openHour") as string),
      closeHour: parseInt(formData.get("closeHour") as string),
      useSessions: formData.get("useSessions") === "on",
    };

    if (editingFacility) {
      updateMutation.mutate({ id: editingFacility.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleSessionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Collect selected days
    const daysOfWeek: number[] = [];
    DAYS.forEach((_, index) => {
      if (formData.get(`day_${index}`) === "on") {
        daysOfWeek.push(index);
      }
    });

    const data = {
      facilityId: selectedFacilityForSession.id,
      name: formData.get("sessionName") as string,
      startTime: formData.get("startTime") as string,
      endTime: formData.get("endTime") as string,
      daysOfWeek,
      isActive: true,
    };

    if (editingSession) {
      updateSessionMutation.mutate({ id: editingSession.id, ...data });
    } else {
      createSessionMutation.mutate(data);
    }
  };

  const handleEdit = (facility: any) => {
    setEditingFacility(facility);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bu tesisi silmek istediğinize emin misiniz?")) {
      deleteMutation.mutate({ id });
    }
  };

  const openSessionManager = (facility: any) => {
    setSelectedFacilityForSession(facility);
    setSessionDialogOpen(true);
    setEditingSession(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sosyal Tesisler</h1>
          <p className="text-muted-foreground">
             Site sakinlerinin kullanabileceği ortak alanları buradan yönetebilirsiniz.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingFacility(null);
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Tesis Ekle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingFacility ? "Tesisi Düzenle" : "Yeni Tesis Ekle"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tesis Adı</label>
                <Input name="name" defaultValue={editingFacility?.name} placeholder="Örn: Açık Havuz" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Açıklama</label>
                <Input name="description" defaultValue={editingFacility?.description} placeholder="Kısa açıklama..." />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kapasite</label>
                  <Input name="capacity" type="number" min="1" defaultValue={editingFacility?.capacity || 1} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Açılış (0-23)</label>
                  <Input name="openHour" type="number" min="0" max="23" defaultValue={editingFacility?.openHour || 8} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kapanış (0-23)</label>
                  <Input name="closeHour" type="number" min="0" max="23" defaultValue={editingFacility?.closeHour || 22} required />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="useSessions" 
                  name="useSessions" 
                  defaultChecked={editingFacility?.useSessions || false}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="useSessions" className="text-sm font-medium">
                  Seans bazlı rezervasyon kullan
                </label>
              </div>
              <Button type="submit" className="w-full" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingFacility ? "Güncelle" : "Oluştur"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Session Management Dialog */}
      <Dialog open={sessionDialogOpen} onOpenChange={(open) => {
        setSessionDialogOpen(open);
        if (!open) {
          setSelectedFacilityForSession(null);
          setEditingSession(null);
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedFacilityForSession?.name} - Seans Yönetimi
            </DialogTitle>
          </DialogHeader>
          
          {/* Add/Edit Session Form */}
          <form onSubmit={handleSessionSubmit} className="space-y-4 border-b pb-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Seans Adı</label>
                <Input 
                  name="sessionName" 
                  defaultValue={editingSession?.name} 
                  placeholder="Örn: Sabah Seansı" 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Başlangıç</label>
                  <Input 
                    name="startTime" 
                    type="time"
                    defaultValue={editingSession?.startTime || "09:00"} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bitiş</label>
                  <Input 
                    name="endTime" 
                    type="time"
                    defaultValue={editingSession?.endTime || "11:00"} 
                    required 
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Aktif Günler</label>
              <div className="flex gap-2">
                {DAYS.map((day, index) => (
                  <label key={index} className="flex flex-col items-center gap-1">
                    <input 
                      type="checkbox" 
                      name={`day_${index}`}
                      defaultChecked={editingSession?.daysOfWeek?.includes(index) ?? true}
                      className="h-4 w-4"
                    />
                    <span className="text-xs">{day}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={createSessionMutation.isPending || updateSessionMutation.isPending}>
                {editingSession ? "Güncelle" : "Seans Ekle"}
              </Button>
              {editingSession && (
                <Button type="button" variant="outline" onClick={() => setEditingSession(null)}>
                  İptal
                </Button>
              )}
            </div>
          </form>

          {/* Sessions List */}
          <div className="space-y-2">
            <h4 className="font-medium">Mevcut Seanslar</h4>
            {sessions?.length === 0 ? (
              <p className="text-sm text-muted-foreground">Henüz seans tanımlanmamış.</p>
            ) : (
              <div className="space-y-2">
                {sessions?.map((session: any) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium">{session.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {session.startTime} - {session.endTime} | 
                        {session.daysOfWeek?.map((d: number) => DAYS[d]).join(", ")}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setEditingSession(session)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-600"
                        onClick={() => {
                          if (confirm("Bu seansı silmek istediğinize emin misiniz?")) {
                            deleteSessionMutation.mutate({ id: session.id });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tesis Adı</TableHead>
              <TableHead>Kapasite</TableHead>
              <TableHead>Çalışma Saatleri</TableHead>
              <TableHead>Mod</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
               <TableRow>
                 <TableCell colSpan={6} className="text-center py-8">Yükleniyor...</TableCell>
               </TableRow>
            ) : facilities?.map((facility) => (
              <TableRow key={facility.id}>
                <TableCell className="font-medium">
                  <div>{facility.name}</div>
                  <div className="text-xs text-muted-foreground">{facility.description}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    {facility.capacity}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {facility.openHour}:00 - {facility.closeHour}:00
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    facility.useSessions ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {facility.useSessions ? 'Seans' : 'Saatlik'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    facility.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                  }`}>
                    {facility.status === 'active' ? 'Aktif' : 'Bakımda'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {facility.useSessions && (
                      <Button variant="ghost" size="icon" onClick={() => openSessionManager(facility)} title="Seansları Yönet">
                        <CalendarClock className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(facility)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(facility.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {facilities?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Henüz bir tesis eklenmemiş.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
