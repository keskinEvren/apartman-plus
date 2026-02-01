"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Calendar, Clock, MapPin, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function MyReservationsPage() {
  const utils = trpc.useUtils();
  const { data: reservations, isLoading } = trpc.reservation.myReservations.useQuery();

  const cancelMutation = trpc.reservation.cancel.useMutation({
    onSuccess: () => {
      toast.success("Rezervasyon iptal edildi.");
      utils.reservation.myReservations.invalidate();
    },
    onError: (error: any) => toast.error(error.message),
  });

  const handleCancel = (id: string) => {
    if (confirm("Rezervasyonu iptal etmek istediğinize emin misiniz?")) {
      cancelMutation.mutate({ id });
    }
  };

  if (isLoading) return <div className="p-8 text-center">Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Rezervasyonlarım</h1>
        <p className="text-muted-foreground">
          Aktif ve geçmiş rezervasyonlarınızı buradan takip edebilirsiniz.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reservations?.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-lg border border-dashed">
            <p className="text-muted-foreground">Henüz bir rezervasyonunuz yok.</p>
            <Button variant="link" asChild className="mt-2">
              <a href="/dashboard/facilities">Yeni Rezervasyon Yap</a>
            </Button>
          </div>
        )}

        {reservations?.map((res) => {
          const startDate = new Date(res.startTime);
          const endDate = new Date(res.endTime);
          const isPast = endDate < new Date();
          const isCancelled = res.status === "cancelled";
          const canCancel = !isPast && !isCancelled;

          return (
            <Card key={res.id} className={`${isCancelled ? "opacity-60 bg-slate-50" : ""} ${isPast ? "opacity-75" : ""}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex justify-between items-start">
                  <span>{res.facility.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full border ${
                    res.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                    res.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                  }`}>
                    {res.status === 'approved' ? 'Onaylandı' : 
                     res.status === 'cancelled' ? 'İptal Edildi' : 
                     res.status === 'pending' ? 'Bekliyor' : res.status}
                  </span>
                </CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {res.facility.description || "Sosyal Tesis"}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm space-y-2 pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  {format(startDate, "d MMMM yyyy", { locale: tr })}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-500" />
                  {format(startDate, "HH:mm")} - {format(endDate, "HH:mm")}
                </div>
              </CardContent>
              {canCancel && (
                <CardFooter className="pt-0">
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="w-full h-8" 
                    onClick={() => handleCancel(res.id)}
                    disabled={cancelMutation.isPending}
                  >
                    <XCircle className="w-3 h-3 mr-2" />
                    İptal Et
                  </Button>
                </CardFooter>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
