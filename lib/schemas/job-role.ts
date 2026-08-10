import { z } from "zod";

export const createJobRoleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  jdText: z.string().min(1, "Paste the job description"),
  department: z.string().optional(),
  location: z.string().optional(),
  employmentType: z.string().optional(),
  seniority: z.string().optional(),
});
