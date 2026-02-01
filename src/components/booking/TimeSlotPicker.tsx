"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Moon, Sun, Sunrise } from "lucide-react";

interface TimeSlotPickerProps {
  openHour: number;
  closeHour: number;
  selectedDate: Date;
  selectedSlot: Date | null;
  onSelectSlot: (date: Date) => void;
  reservations: any[]; // Array of existing reservations
  capacity: number;
}

export function TimeSlotPicker({
  openHour,
  closeHour,
  selectedDate,
  selectedSlot,
  onSelectSlot,
  reservations,
  capacity
}: TimeSlotPickerProps) {
  // Generate slots for the day
  const slots: Date[] = [];
  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);

  for (let i = openHour; i < closeHour; i++) {
    const slot = new Date(startOfDay);
    slot.setHours(i);
    slots.push(slot);
  }

  // Group slots by time of day
  const morningSlots = slots.filter(s => s.getHours() < 12);
  const afternoonSlots = slots.filter(s => s.getHours() >= 12 && s.getHours() < 18);
  const eveningSlots = slots.filter(s => s.getHours() >= 18);

  const renderSlotGrid = (slots: Date[]) => (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {slots.map((slot) => {
        const bookedCount = reservations.filter(res => {
          const resStart = new Date(res.startTime);
          return resStart.getHours() === slot.getHours();
        }).length;

        const isFull = bookedCount >= capacity;
        const isSelected = selectedSlot?.getTime() === slot.getTime();
        const isPast = slot < new Date();

        const isDisabled = isFull || isPast;

        return (
          <Button
            key={slot.toISOString()}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            className={cn(
              "w-full font-medium transition-all duration-200",
              isSelected && "shadow-md scale-105",
              isDisabled && "opacity-40 hover:bg-transparent"
            )}
            disabled={isDisabled}
            onClick={() => onSelectSlot(slot)}
          >
            {slot.getHours().toString().padStart(2, '0')}:00
          </Button>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      {morningSlots.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Sunrise className="w-4 h-4" />
            <span>Sabah</span>
          </div>
          {renderSlotGrid(morningSlots)}
        </div>
      )}

      {afternoonSlots.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
             <Sun className="w-4 h-4" />
             <span>Öğleden Sonra</span>
          </div>
          {renderSlotGrid(afternoonSlots)}
        </div>
      )}

      {eveningSlots.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Moon className="w-4 h-4" />
            <span>Akşam</span>
          </div>
          {renderSlotGrid(eveningSlots)}
        </div>
      )}
      
      {slots.length === 0 && (
         <p className="text-center text-muted-foreground py-8">Bugün için uygun saat bulunamadı.</p>
      )}
    </div>
  );
}
