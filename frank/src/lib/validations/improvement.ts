import { z } from "zod";

// Category enum matching Prisma schema
export const categoryEnum = z.enum([
  "UI_UX",
  "DATA_QUALITY",
  "WORKFLOW",
  "BUG_FIX",
  "FEATURE",
  "OTHER",
]);

// Create improvement schema
export const createImprovementSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be at most 200 characters")
    .trim(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be at most 2000 characters")
    .trim(),
  category: categoryEnum,
  sessionId: z.string().optional(),
});

// Update improvement schema
export const updateImprovementSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be at most 200 characters")
    .trim()
    .optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be at most 2000 characters")
    .trim()
    .optional(),
  category: categoryEnum.optional(),
});

// Delete improvement schema
export const deleteImprovementSchema = z.object({
  id: z.string(),
});

// List improvements schema (for filtering)
export const listImprovementsSchema = z.object({
  sessionId: z.string().optional(),
  category: categoryEnum.optional(),
});

// TypeScript types derived from schemas
export type CreateImprovementInput = z.infer<typeof createImprovementSchema>;
export type UpdateImprovementInput = z.infer<typeof updateImprovementSchema>;
export type DeleteImprovementInput = z.infer<typeof deleteImprovementSchema>;
export type ListImprovementsInput = z.infer<typeof listImprovementsSchema>;
export type Category = z.infer<typeof categoryEnum>;
