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
import { Clock, Pencil, Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminFacilitiesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<any>(null);
  const utils = trpc.useUtils();

  const { data: facilities, isLoading } = trpc.facility.adminList.useQuery();

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      capacity: parseInt(formData.get("capacity") as string),
      openHour: parseInt(formData.get("openHour") as string),
      closeHour: parseInt(formData.get("closeHour") as string),
    };

    if (editingFacility) {
      updateMutation.mutate({ id: editingFacility.id, ...data });
    } else {
      createMutation.mutate(data);
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
              <Button type="submit" className="w-full" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingFacility ? "Güncelle" : "Oluştur"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tesis Adı</TableHead>
              <TableHead>Kapasite</TableHead>
              <TableHead>Çalışma Saatleri</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
               <TableRow>
                 <TableCell colSpan={5} className="text-center py-8">Yükleniyor...</TableCell>
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
                    facility.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                  }`}>
                    {facility.status === 'active' ? 'Aktif' : 'Bakımda'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
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
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
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
