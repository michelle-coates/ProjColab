/**
 * Validation tRPC Router
 * Story 1.10: Input Validation and Error Handling
 *
 * Provides endpoints for AI-powered validation and quality analysis
 */

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { analyzeDescriptionQuality } from "@/lib/ai/validation/description-analyzer";
import { scoreImprovementCompleteness, scoreEvidenceCompleteness } from "@/lib/validations/completeness-scoring";

export const validationRouter = createTRPCRouter({
  /**
   * Analyze improvement description quality using AI
   */
  analyzeDescription: protectedProcedure
    .input(
      z.object({
        description: z.string(),
        title: z.string().optional(),
        category: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const analysis = await analyzeDescriptionQuality(input.description, {
        title: input.title,
        category: input.category,
      });

      return analysis;
    }),

  /**
   * Get completeness score for improvement data
   */
  scoreImprovement: protectedProcedure
    .input(
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        evidenceCount: z.number().optional(),
        effortLevel: z.string().optional(),
      })
    )
    .query(({ input }) => {
      const score = scoreImprovementCompleteness(input);
      return score;
    }),

  /**
   * Get completeness score for evidence item
   */
  scoreEvidence: protectedProcedure
    .input(
      z.object({
        content: z.string().optional(),
        source: z.string().optional(),
      })
    )
    .query(({ input }) => {
      const score = scoreEvidenceCompleteness(input);
      return score;
    }),
});
