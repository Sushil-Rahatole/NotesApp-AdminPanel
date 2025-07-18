import { z } from "zod";

export const semesterFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  pattern: z.string().min(1, "Pattern is required"),
  year: z.string().min(1, "Year is required"),
  sem: z.string().min(1, "Semester is required"),
  branch: z.string().min(1, "Branch is required"),
  university: z.string().optional(),
  syllabus: z.array(z.string()).optional(),
});

export const unitFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  branch: z.string().min(1, "Branch is required"),
  year: z.string().min(1, "Year is required"),
  sem: z.string().min(1, "Semester is required"),
  pattern: z.string().min(1, "Pattern is required"),
  unitno: z.string().min(1, "Unit number is required"),
  description: z.string().min(1, "Description is required"),
  url: z.string().url("Invalid URL").refine(url => url.endsWith('.pdf'), "URL must end with .pdf"),
  youtube: z.array(z.string().url("Invalid YouTube URL").refine(url => 
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/.test(url), 
    "Must be a valid YouTube URL"
  )).optional(),
  question: z.array(z.string()).optional(),
});

export type SemesterFormData = z.infer<typeof semesterFormSchema>;
export type UnitFormData = z.infer<typeof unitFormSchema>;
