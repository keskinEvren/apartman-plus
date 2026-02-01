CREATE TABLE IF NOT EXISTS "facility_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"facility_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"days_of_week" integer[] DEFAULT 0,1,2,3,4,5,6 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "facilities" ADD COLUMN "use_sessions" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "reservations" ADD COLUMN "session_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "facility_sessions" ADD CONSTRAINT "facility_sessions_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
