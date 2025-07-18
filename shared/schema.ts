import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const semesters = pgTable("semesters", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  pattern: text("pattern").notNull(),
  year: text("year").notNull(),
  sem: text("sem").notNull(),
  branch: text("branch").notNull(),
  university: text("university").notNull(),
  syllabus: text("syllabus").array(),
});

export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  branch: text("branch").notNull(),
  year: text("year").notNull(),
  sem: text("sem").notNull(),
  pattern: text("pattern").notNull(),
  unitno: text("unitno").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull(),
  youtube: text("youtube").array(),
  question: text("question").array(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSemesterSchema = createInsertSchema(semesters).omit({
  id: true,
});

export const insertUnitSchema = createInsertSchema(units).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSemester = z.infer<typeof insertSemesterSchema>;
export type Semester = typeof semesters.$inferSelect;
export type InsertUnit = z.infer<typeof insertUnitSchema>;
export type Unit = typeof units.$inferSelect;
