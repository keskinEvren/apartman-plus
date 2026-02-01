"use client";

import { SessionPicker } from "@/components/booking/SessionPicker";
import { TimeSlotPicker } from "@/components/booking/TimeSlotPicker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { CalendarClock, Clock, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ResidentFacilitiesPage() {
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [selectedSessionTimes, setSelectedSessionTimes] = useState<{ start: string; end: string } | null>(null);

  const { data: facilities, isLoading } = trpc.facility.list.useQuery();
  
  const createReservationMutation = trpc.reservation.create.useMutation({
    onSuccess: () => {
      toast.success("Rezervasyon başarıyla oluşturuldu!");
      setSelectedFacility(null);
      setSelectedSlot(null);
      setSelectedSessionId(null);
      setSelectedSessionTimes(null);
    },
    onError: (error: any) => toast.error(error.message),
  });

  const handleBook = () => {
    if (!selectedFacility || !date) return;

    if (selectedFacility.useSessions) {
      // Session-based booking
      if (!selectedSessionId || !selectedSessionTimes) {
        toast.error("Lütfen bir seans seçin");
        return;
      }

      // Parse session times and combine with selected date
      // Use NOON as base to ensure we stay on the correct day after timezone conversion
      const safeDate = new Date(date);
      safeDate.setHours(12, 0, 0, 0);

      const [startHour, startMin] = selectedSessionTimes.start.split(":").map(Number);
      const [endHour, endMin] = selectedSessionTimes.end.split(":").map(Number);
      
      const startTime = new Date(safeDate);
      startTime.setHours(startHour, startMin, 0, 0);
      
      const endTime = new Date(safeDate);
      endTime.setHours(endHour, endMin, 0, 0);

      createReservationMutation.mutate({
        facilityId: selectedFacility.id,
        sessionId: selectedSessionId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });
    } else {
      // Hourly booking
      if (!selectedSlot) {
        toast.error("Lütfen bir saat seçin");
        return;
      }

      const endTime = new Date(selectedSlot);
      endTime.setHours(endTime.getHours() + 1); // 1 hour slots default

      createReservationMutation.mutate({
        facilityId: selectedFacility.id,
        startTime: selectedSlot.toISOString(),
        endTime: endTime.toISOString(),
      });
    }
  };

  const handleSelectSession = (sessionId: string, startTime: string, endTime: string) => {
    setSelectedSessionId(sessionId);
    setSelectedSessionTimes({ start: startTime, end: endTime });
  };

  const openBookingDialog = (facility: any) => {
    setSelectedFacility(facility);
    setSelectedSlot(null);
    setSelectedSessionId(null);
    setSelectedSessionTimes(null);
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
              <div className="flex items-center justify-between">
                <CardTitle>{facility.name}</CardTitle>
                {facility.useSessions && (
                  <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium bg-purple-50 text-purple-700">
                    <CalendarClock className="h-3 w-3" />
                    Seans
                  </span>
                )}
              </div>
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
              <Button className="w-full" onClick={() => openBookingDialog(facility)}>
                Rezervasyon Yap
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedFacility} onOpenChange={(open) => !open && setSelectedFacility(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Rezervasyon: {selectedFacility?.name}
              {selectedFacility?.useSessions && (
                <span className="ml-2 text-sm font-normal text-purple-600">(Seans Bazlı)</span>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid md:grid-cols-[300px_1fr] gap-6 py-4">
            <div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => {
                  setDate(d);
                  setSelectedSlot(null);
                  setSelectedSessionId(null);
                  setSelectedSessionTimes(null);
                }}
                disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                className="rounded-md border"
              />
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-3">
                  {date ? format(date, "d MMMM yyyy, EEEE", { locale: tr }) : "Tarih Seçiniz"}
                </h3>
                
                {date && selectedFacility && (
                  selectedFacility.useSessions ? (
                    // Session-based picker
                    <SessionPicker
                      facilityId={selectedFacility.id}
                      selectedDate={date}
                      selectedSessionId={selectedSessionId}
                      onSelectSession={handleSelectSession}
                    />
                  ) : (
                    // Hourly picker (legacy)
                    <TimeSlotPicker
                      openHour={selectedFacility.openHour}
                      closeHour={selectedFacility.closeHour}
                      selectedDate={date}
                      selectedSlot={selectedSlot}
                      onSelectSlot={setSelectedSlot}
                      reservations={[]}
                      capacity={selectedFacility.capacity}
                    />
                  )
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedFacility(null)}>İptal</Button>
            <Button 
              onClick={handleBook} 
              disabled={
                (!selectedSlot && !selectedSessionId) || 
                createReservationMutation.isPending
              }
            >
              {createReservationMutation.isPending ? "İşleniyor..." : "Onayla ve Bitir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
