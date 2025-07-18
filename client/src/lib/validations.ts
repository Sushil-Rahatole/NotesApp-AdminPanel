import { z } from "zod";

export const semesterFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  pattern: z.string().min(1, "Pattern is required"),
  year: z.string().min(1, "Year is required"),
  sem: z.string().min(1, "Semester is required"),
  branch: z.string().min(1, "Branch is required"),
  university: z.string().min(1, "University is required"),
  syllabus: z.array(z.string()).min(1, "At least one syllabus topic is required"),
});

export const unitFormSchema = z.object({
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

export type SemesterFormData = z.infer<typeof semesterFormSchema>;
export type UnitFormData = z.infer<typeof unitFormSchema>;
