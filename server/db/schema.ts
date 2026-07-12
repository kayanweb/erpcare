import { pgTable, text, integer, numeric, jsonb } from "drizzle-orm/pg-core";

export const patients = pgTable("patients", {
  id: text("id").primaryKey(),
  mrn: text("mrn").notNull(),
  nameEn: text("name_en").notNull(),
  nameAr: text("name_ar").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  phone: text("phone").notNull(),
  status: text("status").notNull(),
  insurance: text("insurance").notNull(),
  clinicalData: jsonb("clinical_data"),
});

export const prescriptions = pgTable("prescriptions", {
  id: text("id").primaryKey(),
  patientId: text("patient_id").notNull(),
  medication: text("medication").notNull(),
  dose: text("dose").notNull(),
  qty: integer("qty").notNull(),
  status: text("status").notNull(),
  date: text("date").notNull(),
});

export const invoices = pgTable("invoices", {
  id: text("id").primaryKey(),
  patientId: text("patient_id").notNull(),
  amount: numeric("amount").notNull(),
  status: text("status").notNull(),
  date: text("date").notNull(),
});

export const staff = pgTable("staff", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  department: text("department").notNull(),
});

export const logs = pgTable("logs", {
  id: text("id").primaryKey(),
  message: text("message").notNull(),
  timestamp: text("timestamp").notNull(),
});

export const dutyTasks = pgTable("duty_tasks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  status: text("status").notNull(),
});

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  message: text("message").notNull(),
  timestamp: text("timestamp").notNull(),
});

export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  senderNameAr: text("sender_name_ar").notNull(),
  senderNameEn: text("sender_name_en").notNull(),
  content: text("content").notNull(),
  timestamp: text("timestamp").notNull(),
});

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
});

export const collectionsStore = pgTable("collections_store", {
  id: text("id").primaryKey(),
  collectionName: text("collection_name").notNull(),
  data: jsonb("data").notNull(),
  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
});

