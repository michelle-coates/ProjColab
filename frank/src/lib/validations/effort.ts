import { z } from "zod";
import { errorMessages } from "./error-messages";

/**
 * Validation schema for setting effort on an improvement
 * Used in improvements.setEffort tRPC mutation
 * Enhanced with custom error messages (Story 1.10)
 */
export const setEffortSchema = z.object({
  improvementId: z.string().cuid("Invalid improvement ID format"),
  effortLevel: z.enum(["SMALL", "MEDIUM", "LARGE"], {
    errorMap: () => ({ message: errorMessages.effort.level.invalid }),
  }),
  rationale: z
    .string()
    .min(10, "Let's add a brief explanation for this effort estimate (at least 10 characters helps)")
    .max(500, errorMessages.effort.rationale.tooLong)
    .trim(),
});

export type SetEffortInput = z.infer<typeof setEffortSchema>;

/**
 * Validation schema for requesting AI effort guidance
 * Used in improvements.getEffortGuidance tRPC query
 */
export const getEffortGuidanceSchema = z.object({
  improvementId: z.string().cuid("Invalid improvement ID format"),
});

export type GetEffortGuidanceInput = z.infer<typeof getEffortGuidanceSchema>;
