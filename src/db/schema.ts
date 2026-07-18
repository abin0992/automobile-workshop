import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  date,
  time,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 80 }).notNull().unique(),
  name: varchar("name", { length: 160 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  description: text("description").notNull(),
  priceGbp: integer("price_gbp").notNull(), // pence
  durationMinutes: integer("duration_minutes").notNull(),
  bookable: boolean("bookable").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  reference: varchar("reference", { length: 24 }).notNull().unique(),
  serviceSlug: varchar("service_slug", { length: 80 }).notNull(),
  addonSlug: varchar("addon_slug", { length: 80 }),
  customerName: varchar("customer_name", { length: 160 }).notNull(),
  email: varchar("email", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  vehicleReg: varchar("vehicle_reg", { length: 20 }).notNull(),
  vehicleDetails: varchar("vehicle_details", { length: 200 }).notNull(),
  bookingDate: date("booking_date").notNull(),
  timeSlot: time("time_slot").notNull(),
  notes: text("notes"),
  status: varchar("status", { length: 24 }).notNull().default("confirmed"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
