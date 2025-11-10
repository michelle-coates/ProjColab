import { z } from "zod";
import { titleValidation, descriptionValidation } from "./custom-validators";
import { errorMessages } from "./error-messages";

// Category enum matching Prisma schema with custom error messages
export const categoryEnum = z.enum([
  "UI_UX",
  "DATA_QUALITY",
  "WORKFLOW",
  "BUG_FIX",
  "FEATURE",
  "OTHER",
], {
  errorMap: () => ({ message: errorMessages.improvement.category.invalid }),
});

// Create improvement schema with enhanced validation
export const createImprovementSchema = z.object({
  title: titleValidation,
  description: descriptionValidation,
  category: categoryEnum,
  sessionId: z.string().optional(),
});

// Update improvement schema with enhanced validation
export const updateImprovementSchema = z.object({
  id: z.string(),
  title: titleValidation.optional(),
  description: descriptionValidation.optional(),
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
