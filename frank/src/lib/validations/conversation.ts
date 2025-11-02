import { z } from "zod";

// Evidence source enum matching Prisma schema
export const evidenceSourceEnum = z.enum([
  "ANALYTICS",
  "SUPPORT_TICKETS",
  "USER_FEEDBACK",
  "ASSUMPTIONS",
  "USER_UPLOAD",
]);

// Conversation turn schema
export const conversationTurnSchema = z.object({
  speaker: z.enum(["AI", "USER"]),
  message: z.string().min(1, "Message cannot be empty"),
  timestamp: z.string(),
  metadata: z
    .object({
      evidenceType: evidenceSourceEnum.optional(),
      questionReasoning: z.string().optional(),
      fallback: z.boolean().optional(),
    })
    .optional(),
});

// Generate question schema
export const generateQuestionSchema = z.object({
  improvementId: z.string().min(1, "Improvement ID is required"),
  conversationHistory: z.array(conversationTurnSchema).optional(),
});

// Submit response schema
export const submitResponseSchema = z.object({
  conversationId: z.string().min(1, "Conversation ID is required"),
  improvementId: z.string().min(1, "Improvement ID is required"),
  response: z
    .string()
    .min(10, "Please provide at least 10 characters of detail")
    .max(5000, "Response is too long (max 5000 characters)")
    .trim(),
  evidenceType: evidenceSourceEnum.optional(),
});

// Get conversation schema
export const getConversationSchema = z.object({
  improvementId: z.string().min(1, "Improvement ID is required"),
});

// Skip question schema
export const skipQuestionSchema = z.object({
  improvementId: z.string().min(1, "Improvement ID is required"),
});

// Complete assessment schema
export const completeAssessmentSchema = z.object({
  improvementId: z.string().min(1, "Improvement ID is required"),
  finalNotes: z.string().optional(),
  keepEvidence: z.boolean().default(true),
});

// TypeScript types derived from schemas
export type EvidenceSource = z.infer<typeof evidenceSourceEnum>;
export type ConversationTurn = z.infer<typeof conversationTurnSchema>;
export type GenerateQuestionInput = z.infer<typeof generateQuestionSchema>;
export type SubmitResponseInput = z.infer<typeof submitResponseSchema>;
export type GetConversationInput = z.infer<typeof getConversationSchema>;
export type SkipQuestionInput = z.infer<typeof skipQuestionSchema>;
