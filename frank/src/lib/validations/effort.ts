import { z } from "zod";

/**
 * Validation schema for setting effort on an improvement
 * Used in improvements.setEffort tRPC mutation
 */
export const setEffortSchema = z.object({
  improvementId: z.string().cuid("Invalid improvement ID format"),
  effortLevel: z.enum(["SMALL", "MEDIUM", "LARGE"], {
    errorMap: () => ({ message: "Effort level must be Small, Medium, or Large" }),
  }),
  rationale: z
    .string()
    .min(10, "Please explain your effort estimate (at least 10 characters)")
    .max(10000, "Rationale is too long (maximum 10000 characters)"),
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
