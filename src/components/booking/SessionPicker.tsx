"use client";

import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { Loader2, Users } from "lucide-react";
import { toast } from "sonner";

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
  const utils = trpc.useUtils();

  // Ensure we query for the correct day by setting time to noon to avoid timezone shifts
  const queryDate = new Date(selectedDate);
  queryDate.setHours(12, 0, 0, 0);

  // Fetch occupancy for this session
  const { data: occupancy, isLoading: isOccupancyLoading } = trpc.reservation.getSessionOccupancy.useQuery(
    { 
      facilityId, 
      sessionId: session.id, 
      date: queryDate.toISOString() 
    },
    { 
      enabled: !!facilityId && !!session.id,
      refetchInterval: 30000,
    }
  );

  // Fetch waitlist status
  const { data: waitlistStatus, isLoading: isWaitlistLoading } = trpc.facility.getWaitlistStatus.useQuery(
    {
      sessionId: session.id,
      date: queryDate.toISOString()
    },
    {
      enabled: !!session.id,
      refetchInterval: 10000,
    }
  );

  const joinWaitlistMutation = trpc.facility.joinWaitlist.useMutation({
    onSuccess: () => {
      toast.success("Bekleme listesine alındınız!");
      utils.facility.getWaitlistStatus.invalidate({ sessionId: session.id });
    },
    onError: (err) => toast.error(err.message),
  });

  const leaveWaitlistMutation = trpc.facility.leaveWaitlist.useMutation({
    onSuccess: () => {
      toast.info("Bekleme listesinden ayrıldınız.");
      utils.facility.getWaitlistStatus.invalidate({ sessionId: session.id });
    },
    onError: (err) => toast.error(err.message),
  });

  const isFull = occupancy?.isFull ?? false;
  const currentCount = occupancy?.currentCount ?? 0;
  const capacity = occupancy?.capacity ?? 1;
  const percentage = Math.round((currentCount / capacity) * 100);

  const handleJoinWaitlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    joinWaitlistMutation.mutate({
      facilityId,
      sessionId: session.id,
      date: queryDate.toISOString()
    });
  };

  const handleLeaveWaitlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    leaveWaitlistMutation.mutate({
      sessionId: session.id,
      date: queryDate.toISOString()
    });
  };

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

  // UI States
  const isWaitlisted = waitlistStatus?.isInWaitlist;
  const isLoading = isOccupancyLoading || isWaitlistLoading; 
  const isActionLoading = joinWaitlistMutation.isPending || leaveWaitlistMutation.isPending;

  return (
    <div className="relative group">
      <Button
        variant={isSelected ? "default" : "outline"}
        className={cn(
          "w-full h-auto py-4 px-4 flex flex-col items-start gap-2 text-left relative overflow-hidden",
          isFull && !isSelected && !isWaitlisted && "opacity-90 border-red-200 bg-red-50/10", // Full style
          isSelected && "ring-2 ring-primary ring-offset-2",
          isWaitlisted && "border-blue-300 bg-blue-50/20" // Waitlisted style
        )}
        disabled={isFull && !isWaitlisted} // Disabled only if full AND not in waitlist (since we employ a separate button for waitlist)
        onClick={isFull ? undefined : onSelect}
      >
        {/* Progress bar background */}
        {!isWaitlisted && (
          <div 
            className={cn("absolute bottom-0 left-0 h-1 transition-all", getProgressColor())}
            style={{ width: `${percentage}%` }}
          />
        )}
        
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
        
        <div className="flex items-center gap-2 text-sm opacity-75 justify-between w-full mt-1">
          <span>{session.startTime} - {session.endTime}</span>
          
          {/* Status Text */}
          {isFull ? (
             <span className="text-red-500 font-medium font-mono text-xs uppercase flex items-center gap-1">
               (DOLU)
             </span>
          ) : (
            occupancy?.remainingSlots && (
              <span className="text-green-600 font-medium text-xs">({occupancy.remainingSlots} Yer)</span>
            )
          )}
        </div>
      </Button>

      {/* OVERLAY ACTIONS FOR FULL / WAITLISTED SESSIONS */}
      {(isFull || isWaitlisted) && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
          {isWaitlisted ? (
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-md">
                Sıradasınız: {waitlistStatus?.position}. Kişi
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-[10px] text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={handleLeaveWaitlist}
                disabled={isActionLoading}
              >
                {isActionLoading ? <Loader2 className="h-3 w-3 animate-spin"/> : "Sıradan Çık"}
              </Button>
            </div>
          ) : isFull ? (
            <Button 
              size="sm" 
              variant="secondary" 
              className="bg-white/90 shadow-sm border text-xs h-8 hover:bg-white"
              onClick={handleJoinWaitlist}
              disabled={isActionLoading}
            >
              {isActionLoading ? <Loader2 className="h-3 w-3 animate-spin mr-1"/> : "Sıraya Gir"}
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}

