/**
 * Evidence validation schemas
 * Story 1.10: Input Validation and Error Handling
 */

import { z } from "zod";
import { evidenceContentValidation, evidenceSourceValidation } from "./custom-validators";

/**
 * Create evidence schema
 */
export const createEvidenceSchema = z.object({
  improvementId: z.string().cuid("Invalid improvement ID format"),
  content: evidenceContentValidation,
  source: evidenceSourceValidation,
});

export type CreateEvidenceInput = z.infer<typeof createEvidenceSchema>;

/**
 * Update evidence schema
 */
export const updateEvidenceSchema = z.object({
  id: z.string().cuid("Invalid evidence ID format"),
  content: evidenceContentValidation.optional(),
  source: evidenceSourceValidation.optional(),
});

export type UpdateEvidenceInput = z.infer<typeof updateEvidenceSchema>;

/**
 * Delete evidence schema
 */
export const deleteEvidenceSchema = z.object({
  id: z.string().cuid("Invalid evidence ID format"),
});

export type DeleteEvidenceInput = z.infer<typeof deleteEvidenceSchema>;

/**
 * List evidence schema (for querying)
 */
export const listEvidenceSchema = z.object({
  improvementId: z.string().cuid("Invalid improvement ID format"),
});

export type ListEvidenceInput = z.infer<typeof listEvidenceSchema>;
