"use client";

import { TimeSlotPicker } from "@/components/booking/TimeSlotPicker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Clock, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ResidentFacilitiesPage() {
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);

  const { data: facilities, isLoading } = trpc.facility.list.useQuery();
  
  // NOTE: This is a simplification. In a real app, you'd fetch reservations for the selected facility & date via TRPC
  // Here we assume reservation logic is handled in mutation validation mostly, 
  // but for UI red-state we would need a `facility.getAvailability` query.
  // For now, let's proceed with just the booking action.
  const createReservationMutation = trpc.reservation.create.useMutation({
    onSuccess: () => {
      toast.success("Rezervasyon başarıyla oluşturuldu!");
      setSelectedFacility(null);
      setSelectedSlot(null);
    },
    onError: (error: any) => toast.error(error.message),
  });

  const handleBook = () => {
    if (!selectedFacility || !selectedSlot) return;

    const endTime = new Date(selectedSlot);
    endTime.setHours(endTime.getHours() + 1); // 1 hour slots default

    createReservationMutation.mutate({
      facilityId: selectedFacility.id,
      startTime: selectedSlot.toISOString(),
      endTime: endTime.toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sosyal Tesisler</h1>
        <p className="text-muted-foreground">
          Sitenizin sunduğu imkanlardan faydalanmak için rezervasyon yapın.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p>Yükleniyor...</p>
        ) : facilities?.map((facility) => (
          <Card key={facility.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{facility.name}</CardTitle>
              <CardDescription>{facility.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                 <Clock className="w-4 h-4" />
                 {facility.openHour}:00 - {facility.closeHour}:00
              </div>
              <div className="flex items-center gap-2">
                 <Users className="w-4 h-4" />
                 Kapasite: {facility.capacity} Kişi
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => setSelectedFacility(facility)}>
                Rezervasyon Yap
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedFacility} onOpenChange={(open) => !open && setSelectedFacility(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Rezervasyon: {selectedFacility?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="grid md:grid-cols-[300px_1fr] gap-6 py-4">
            <div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                className="rounded-md border"
              />
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">
                  {date ? format(date, "d MMMM yyyy, EEEE", { locale: tr }) : "Tarih Seçiniz"}
                </h3>
                {date && selectedFacility && (
                  <TimeSlotPicker
                    openHour={selectedFacility.openHour}
                    closeHour={selectedFacility.closeHour}
                    selectedDate={date}
                    selectedSlot={selectedSlot}
                    onSelectSlot={setSelectedSlot}
                    reservations={[]} // TODO: Fetch real availability
                    capacity={selectedFacility.capacity}
                  />
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedFacility(null)}>İptal</Button>
            <Button onClick={handleBook} disabled={!selectedSlot || createReservationMutation.isPending}>
              {createReservationMutation.isPending ? "İşleniyor..." : "Onayla ve Bitir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
