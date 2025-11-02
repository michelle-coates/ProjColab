import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  createImprovementSchema,
  updateImprovementSchema,
  deleteImprovementSchema,
  listImprovementsSchema,
} from "@/lib/validations/improvement";
import {
  setEffortSchema,
  getEffortGuidanceSchema,
} from "@/lib/validations/effort";
import { claudeService } from "@/server/api/services/claude";

export const improvementsRouter = createTRPCRouter({
  // Create a new improvement
  create: protectedProcedure
    .input(createImprovementSchema)
    .mutation(async ({ input, ctx }) => {
      const improvement = await ctx.db.improvementItem.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });

      return { success: true, data: improvement };
    }),

  // List improvements for the authenticated user
  list: protectedProcedure
    .input(listImprovementsSchema)
    .query(async ({ input, ctx }) => {
      const improvements = await ctx.db.improvementItem.findMany({
        where: {
          userId: ctx.session.user.id,
          ...(input.sessionId && { sessionId: input.sessionId }),
          ...(input.category && { category: input.category }),
        },
        orderBy: { createdAt: "desc" },
      });

      return improvements;
    }),

  // Get a single improvement by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const improvement = await ctx.db.improvementItem.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });

      if (!improvement) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Improvement not found",
        });
      }

      return improvement;
    }),

  // Update an improvement
  update: protectedProcedure
    .input(updateImprovementSchema)
    .mutation(async ({ input, ctx }) => {
      // Verify ownership
      const existing = await ctx.db.improvementItem.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Improvement not found",
        });
      }

      const { id, ...data } = input;
      const improvement = await ctx.db.improvementItem.update({
        where: { id },
        data,
      });

      return { success: true, data: improvement };
    }),

  // Delete an improvement
  delete: protectedProcedure
    .input(deleteImprovementSchema)
    .mutation(async ({ input, ctx }) => {
      // Verify ownership
      const existing = await ctx.db.improvementItem.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Improvement not found",
        });
      }

      // Note: Dependency checking (evidence, decisions) will be added in future stories
      // For now, we allow deletion

      await ctx.db.improvementItem.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  // Story 1.4: Set or update effort estimate on an improvement
  setEffort: protectedProcedure
    .input(setEffortSchema)
    .mutation(async ({ input, ctx }) => {
      console.log('[SET EFFORT] Input:', input);
      
      // Verify ownership
      const existing = await ctx.db.improvementItem.findFirst({
        where: {
          id: input.improvementId,
          userId: ctx.session.user.id,
        },
        select: { effortLevel: true },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Improvement not found",
        });
      }

      console.log('[SET EFFORT] Existing effort:', existing.effortLevel);

      const isRevision = existing.effortLevel !== null;

      // Update effort estimate
      const improvement = await ctx.db.improvementItem.update({
        where: { id: input.improvementId },
        data: {
          effortLevel: input.effortLevel,
          effortRationale: input.rationale,
          effortEstimatedAt: isRevision ? undefined : new Date(),
          effortRevisedAt: isRevision ? new Date() : undefined,
        },
      });

      console.log('[SET EFFORT] Updated improvement effort:', improvement.effortLevel);

      // Create history entry if this is a revision
      if (isRevision && existing.effortLevel !== input.effortLevel) {
        await ctx.db.effortHistory.create({
          data: {
            improvementId: input.improvementId,
            previousLevel: existing.effortLevel,
            newLevel: input.effortLevel,
            rationale: input.rationale,
          },
        });
      }

      return { success: true, data: improvement };
    }),

  // Story 1.4: Get AI-powered effort guidance questions
  getEffortGuidance: protectedProcedure
    .input(getEffortGuidanceSchema)
    .query(async ({ input, ctx }) => {
      // Verify ownership and load improvement with evidence
      const improvement = await ctx.db.improvementItem.findFirst({
        where: {
          id: input.improvementId,
          userId: ctx.session.user.id,
        },
        include: {
          evidence: true,
        },
      });

      if (!improvement) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Improvement not found",
        });
      }

      // Call Claude service for effort guidance
      try {
        const guidance = await claudeService.generateEffortGuidance({
          title: improvement.title,
          description: improvement.description,
          category: improvement.category,
          evidence: improvement.evidence.map(e => ({
            content: e.content,
            source: e.source,
          })),
        });

        return guidance;
      } catch (error) {
        console.error("Error generating effort guidance:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate effort guidance. Please try again.",
        });
      }
    }),

  // Story 1.4: Analyze user's effort responses and get AI recommendation
  analyzeEffortResponses: protectedProcedure
    .input(z.object({
      improvementId: z.string().cuid(),
      userResponses: z.array(z.string().min(1)),
    }))
    .mutation(async ({ input, ctx }) => {
      // Verify ownership
      const improvement = await ctx.db.improvementItem.findFirst({
        where: {
          id: input.improvementId,
          userId: ctx.session.user.id,
        },
      });

      if (!improvement) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Improvement not found",
        });
      }

      // Call Claude service for effort analysis
      try {
        const analysis = await claudeService.analyzeEffortResponses({
          title: improvement.title,
          description: improvement.description,
          category: improvement.category,
          userResponses: input.userResponses,
        });

        return analysis;
      } catch (error) {
        console.error("Error analyzing effort responses:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to analyze effort responses. Please try again.",
        });
      }
    }),

  // Story 1.4: Get effort distribution across all user's improvements
  getEffortDistribution: protectedProcedure
    .query(async ({ ctx }) => {
      const items = await ctx.db.improvementItem.findMany({
        where: { userId: ctx.session.user.id },
        select: { effortLevel: true },
      });

      console.log('[EFFORT DISTRIBUTION] Total items:', items.length);
      console.log('[EFFORT DISTRIBUTION] Items:', items);

      const small = items.filter((i: { effortLevel: string | null }) => i.effortLevel === "SMALL").length;
      const medium = items.filter((i: { effortLevel: string | null }) => i.effortLevel === "MEDIUM").length;
      const large = items.filter((i: { effortLevel: string | null }) => i.effortLevel === "LARGE").length;
      const total = items.length;
      const unestimated = items.filter((i: { effortLevel: string | null }) => i.effortLevel === null).length;

      console.log('[EFFORT DISTRIBUTION] Distribution:', { small, medium, large, total, unestimated });

      return {
        small,
        medium,
        large,
        total,
        unestimated,
      };
    }),

  // Add improvement(s) to a session
  addToSession: protectedProcedure
    .input(z.object({
      improvementId: z.string(),
      sessionId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Verify improvement ownership
      const improvement = await ctx.db.improvementItem.findFirst({
        where: {
          id: input.improvementId,
          userId: ctx.session.user.id,
        },
      });

      if (!improvement) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Improvement not found",
        });
      }

      // Verify session ownership
      const session = await ctx.db.prioritizationSession.findFirst({
        where: {
          id: input.sessionId,
          userId: ctx.session.user.id,
        },
        include: {
          improvements: true,
        },
      });

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found",
        });
      }

      // Don't allow duplicates in the same session
      const isDuplicate = session.improvements.some(imp => imp.id === input.improvementId);
      if (isDuplicate) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This improvement is already in the session",
        });
      }

      // Add improvement to session with initial matrix position
      const updated = await ctx.db.improvementItem.update({
        where: { id: input.improvementId },
        data: { 
          sessionId: input.sessionId,
          matrixPosition: {
            x: Math.random(), // Random initial position
            y: Math.random(),
          },
        },
      });

      return { success: true, data: updated };
    }),
});
