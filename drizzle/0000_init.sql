CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"reference" varchar(24) NOT NULL,
	"service_slug" varchar(80) NOT NULL,
	"addon_slug" varchar(80),
	"customer_name" varchar(160) NOT NULL,
	"email" varchar(200) NOT NULL,
	"phone" varchar(40) NOT NULL,
	"vehicle_reg" varchar(20) NOT NULL,
	"vehicle_details" varchar(200) NOT NULL,
	"booking_date" date NOT NULL,
	"time_slot" time NOT NULL,
	"notes" text,
	"status" varchar(24) DEFAULT 'confirmed' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bookings_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(80) NOT NULL,
	"name" varchar(160) NOT NULL,
	"category" varchar(80) NOT NULL,
	"description" text NOT NULL,
	"price_gbp" integer NOT NULL,
	"duration_minutes" integer NOT NULL,
	"bookable" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "services_slug_unique" UNIQUE("slug")
);
