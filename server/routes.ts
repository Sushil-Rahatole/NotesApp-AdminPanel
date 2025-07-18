import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSemesterSchema, insertUnitSchema } from "@shared/schema";
import { z } from "zod";

// Enhanced validation schemas
const enhancedSemesterSchema = insertSemesterSchema.extend({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  pattern: z.string().min(1, "Pattern is required"),
  year: z.string().min(1, "Year is required"),
  sem: z.string().min(1, "Semester is required"),
  branch: z.string().min(1, "Branch is required"),
  university: z.string().min(1, "University is required"),
  syllabus: z.array(z.string()).min(1, "At least one syllabus topic is required"),
});

const enhancedUnitSchema = insertUnitSchema.extend({
  title: z.string().min(1, "Title is required"),
  branch: z.string().min(1, "Branch is required"),
  year: z.string().min(1, "Year is required"),
  sem: z.string().min(1, "Semester is required"),
  pattern: z.string().min(1, "Pattern is required"),
  unitno: z.string().min(1, "Unit number is required"),
  description: z.string().min(1, "Description is required"),
  url: z.string().url("Invalid URL").refine(url => 
    url.includes('drive.google.com') || url.endsWith('.pdf'), 
    "Must be a Google Drive link or PDF URL"
  ),
  youtube: z.array(z.string().url("Invalid YouTube URL").refine(url => 
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/.test(url), 
    "Must be a valid YouTube URL"
  )).min(1, "At least one YouTube video is required"),
  question: z.array(z.string()).min(1, "At least one practice question is required"),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // POST /api/semester - Create a new semester
  app.post("/api/semester", async (req, res) => {
    try {
      const validatedData = enhancedSemesterSchema.parse(req.body);
      const semester = await storage.createSemester(validatedData);
      res.status(201).json(semester);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // GET /api/semesters - Get all semesters
  app.get("/api/semesters", async (req, res) => {
    try {
      const semesters = await storage.getSemesters();
      res.json(semesters);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // POST /api/unit - Create a new unit
  app.post("/api/unit", async (req, res) => {
    try {
      const validatedData = enhancedUnitSchema.parse(req.body);
      const unit = await storage.createUnit(validatedData);
      res.status(201).json(unit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // GET /api/units - Get all units
  app.get("/api/units", async (req, res) => {
    try {
      const units = await storage.getUnits();
      res.json(units);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
