"use client";

import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

interface SessionPickerProps {
  facilityId: string;
  selectedDate: Date;
  selectedSessionId: string | null;
  onSelectSession: (sessionId: string, startTime: string, endTime: string) => void;
}

// Day names mapping
const DAY_NAMES = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

export function SessionPicker({ 
  facilityId, 
  selectedDate, 
  selectedSessionId, 
  onSelectSession 
}: SessionPickerProps) {
  const dayOfWeek = selectedDate.getDay(); // 0 = Sunday

  // Fetch sessions for this facility
  const { data: sessions, isLoading: sessionsLoading } = trpc.facility.listSessions.useQuery(
    { facilityId },
    { enabled: !!facilityId }
  );

  // Filter sessions by active day
  const availableSessions = sessions?.filter((session: any) => 
    session.isActive && session.daysOfWeek?.includes(dayOfWeek)
  );

  if (sessionsLoading) {
    return <div className="text-sm text-muted-foreground">Seanslar yükleniyor...</div>;
  }

  if (!availableSessions?.length) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <p>{DAY_NAMES[dayOfWeek]} günü için tanımlı seans bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {availableSessions.map((session: any) => (
        <SessionCard 
          key={session.id}
          session={session}
          facilityId={facilityId}
          selectedDate={selectedDate}
          isSelected={selectedSessionId === session.id}
          onSelect={() => onSelectSession(session.id, session.startTime, session.endTime)}
        />
      ))}
    </div>
  );
}

interface SessionCardProps {
  session: any;
  facilityId: string;
  selectedDate: Date;
  isSelected: boolean;
  onSelect: () => void;
}

function SessionCard({ session, facilityId, selectedDate, isSelected, onSelect }: SessionCardProps) {
  // Fetch occupancy for this session
  const { data: occupancy, isLoading } = trpc.reservation.getSessionOccupancy.useQuery(
    { 
      facilityId, 
      sessionId: session.id, 
      date: selectedDate.toISOString() 
    },
    { 
      enabled: !!facilityId && !!session.id,
      refetchInterval: 30000, // Auto-refresh every 30 seconds
    }
  );

  const isFull = occupancy?.isFull ?? false;
  const currentCount = occupancy?.currentCount ?? 0;
  const capacity = occupancy?.capacity ?? 1;
  const percentage = Math.round((currentCount / capacity) * 100);

  // Color based on occupancy
  const getOccupancyColor = () => {
    if (isFull) return "text-red-600 bg-red-50";
    if (percentage >= 70) return "text-orange-600 bg-orange-50";
    return "text-green-600 bg-green-50";
  };

  const getProgressColor = () => {
    if (isFull) return "bg-red-500";
    if (percentage >= 70) return "bg-orange-500";
    return "bg-green-500";
  };

  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      className={cn(
        "w-full h-auto py-4 px-4 flex flex-col items-start gap-2 text-left relative overflow-hidden",
        isFull && !isSelected && "opacity-70 cursor-not-allowed border-red-200",
        isSelected && "ring-2 ring-primary ring-offset-2"
      )}
      disabled={isFull}
      onClick={onSelect}
    >
      {/* Progress bar background */}
      <div 
        className={cn("absolute bottom-0 left-0 h-1", getProgressColor())}
        style={{ width: `${percentage}%` }}
      />
      
      <div className="flex items-center justify-between w-full">
        <span className="font-semibold text-base">{session.name}</span>
        <span className={cn(
          "text-xs px-2 py-1 rounded-full flex items-center gap-1",
          getOccupancyColor()
        )}>
          <Users className="h-3 w-3" />
          {isLoading ? "..." : `${currentCount}/${capacity}`}
        </span>
      </div>
      
      <div className="flex items-center gap-2 text-sm opacity-75">
        <span>{session.startTime} - {session.endTime}</span>
        {isFull && <span className="text-red-500 font-medium">(Dolu)</span>}
        {!isFull && occupancy?.remainingSlots && (
          <span className="text-green-600">({occupancy.remainingSlots} yer kaldı)</span>
        )}
      </div>
    </Button>
  );
}
