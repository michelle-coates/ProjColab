/**
 * Story 1.5: Decisions tRPC Router
 * Handles pairwise comparison decisions and ranking
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { calculateRanking } from "@/lib/ranking/ranking-algorithm";
import { selectNextPair } from "@/lib/ranking/pair-selector";
import { generateDecisionPrompt } from "@/lib/ranking/prompt-generator";

export const decisionsRouter = createTRPCRouter({
  /**
   * Record a pairwise comparison decision
   */
  recordDecision: protectedProcedure
    .input(z.object({
      sessionId: z.string().cuid().optional(),
      itemAId: z.string().cuid(),
      itemBId: z.string().cuid(),
      winnerId: z.string().cuid(),
      rationale: z.string().optional(),
      quickRationale: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Validate winner is one of the items
      if (input.winnerId !== input.itemAId && input.winnerId !== input.itemBId) {
        throw new TRPCError({ 
          code: 'BAD_REQUEST', 
          message: 'Winner must be either itemA or itemB' 
        });
      }
      
      // Get items and validate ownership in single query
      const items = await ctx.db.improvementItem.findMany({
        where: { 
          id: { in: [input.itemAId, input.itemBId] },
          userId: ctx.session.user.id,
          ...(input.sessionId && { sessionId: input.sessionId }),
        },
        include: { evidence: true },
      });
      
      // Validate both items found and belong to user
      if (items.length !== 2) {
        throw new TRPCError({ 
          code: 'FORBIDDEN', 
          message: 'Items not found or access denied' 
        });
      }
      
      const itemA = items.find((item: { id: string }) => item.id === input.itemAId);
      const itemB = items.find((item: { id: string }) => item.id === input.itemBId);
      
      if (!itemA || !itemB) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Item not found' });
      }
      
      const prompt = generateDecisionPrompt(
        { 
          category: itemA.category, 
          effortLevel: itemA.effortLevel,
          evidenceEntries: itemA.evidence,
        },
        { 
          category: itemB.category, 
          effortLevel: itemB.effortLevel,
          evidenceEntries: itemB.evidence,
        }
      );
      
      // Create or update decision record
      const decision = await ctx.db.decisionRecord.upsert({
        where: {
          userId_itemAId_itemBId: {
            userId: ctx.session.user.id,
            itemAId: input.itemAId,
            itemBId: input.itemBId,
          },
        },
        create: {
          userId: ctx.session.user.id,
          sessionId: input.sessionId,
          itemAId: input.itemAId,
          itemBId: input.itemBId,
          winnerId: input.winnerId,
          prompt,
          rationale: input.rationale,
          quickRationale: input.quickRationale,
        },
        update: {
          winnerId: input.winnerId,
          rationale: input.rationale,
          quickRationale: input.quickRationale,
          modifiedAt: new Date(),
          isModified: true,
        },
      });
      
      // Recalculate ranking for session or all user items
      const itemsToRank = input.sessionId
        ? await ctx.db.improvementItem.findMany({ 
            where: { sessionId: input.sessionId },
            include: { decisionsAsWinner: true },
          })
        : await ctx.db.improvementItem.findMany({ 
            where: { userId: ctx.session.user.id },
            include: { decisionsAsWinner: true },
          });
      
      const decisions = await ctx.db.decisionRecord.findMany({
        where: input.sessionId 
          ? { sessionId: input.sessionId }
          : { userId: ctx.session.user.id, sessionId: null },
      });
      
      const ranking = calculateRanking(itemsToRank, decisions);
      
      // Update rank positions and scores
      await Promise.all(
        ranking.map((item) =>
          ctx.db.improvementItem.update({
            where: { id: item.id },
            data: {
              rankPosition: item.rankPosition,
              rankConfidence: item.confidence,
              impactScore: item.impactScore,
            },
          })
        )
      );
      
      return decision;
    }),

  /**
   * Get next pair of items to compare
   */
  getNextPair: protectedProcedure
    .input(z.object({
      sessionId: z.string().cuid().optional(),
    }))
    .query(async ({ ctx, input }) => {
      // Get all items and existing decisions
      const items = input.sessionId
        ? await ctx.db.improvementItem.findMany({ 
            where: { sessionId: input.sessionId },
            include: { 
              evidence: true,
            },
          })
        : await ctx.db.improvementItem.findMany({ 
            where: { userId: ctx.session.user.id, sessionId: null },
            include: { 
              evidence: true,
            },
          });
      
      if (items.length < 2) {
        throw new TRPCError({ 
          code: 'BAD_REQUEST', 
          message: 'Need at least 2 items to compare' 
        });
      }
      
      const decisions = await ctx.db.decisionRecord.findMany({
        where: input.sessionId 
          ? { sessionId: input.sessionId }
          : { userId: ctx.session.user.id, sessionId: null },
      });
      
      // Intelligent pair selection
      const pair = selectNextPair(items, decisions);
      
      if (!pair) {
        return { 
          complete: true, 
          itemA: null, 
          itemB: null, 
          prompt: null,
          progress: { completed: decisions.length, total: decisions.length, percentage: 100 },
        };
      }
      
      const prompt = generateDecisionPrompt(
        { 
          category: pair.itemA.category, 
          effortLevel: pair.itemA.effortLevel,
          evidenceEntries: pair.itemA.evidence,
        },
        { 
          category: pair.itemB.category, 
          effortLevel: pair.itemB.effortLevel,
          evidenceEntries: pair.itemB.evidence,
        }
      );
      
      // Calculate progress estimate (n log n comparisons needed)
      const estimatedTotal = Math.ceil(items.length * Math.log2(items.length));
      
      return {
        complete: false,
        itemA: pair.itemA,
        itemB: pair.itemB,
        prompt,
        progress: {
          completed: decisions.length,
          total: estimatedTotal,
          percentage: Math.min(100, Math.round((decisions.length / estimatedTotal) * 100)),
        },
      };
    }),

  /**
   * Get current ranking
   */
  getRanking: protectedProcedure
    .input(z.object({
      sessionId: z.string().cuid().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.improvementItem.findMany({
        where: input.sessionId
          ? { sessionId: input.sessionId }
          : { userId: ctx.session.user.id, sessionId: null },
        orderBy: { rankPosition: 'asc' },
        include: {
          decisionsAsWinner: true,
          evidence: true,
        },
      });
      
      return items;
    }),

  /**
   * Get decision history for review
   */
  getDecisionHistory: protectedProcedure
    .input(z.object({
      sessionId: z.string().cuid().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const decisions = await ctx.db.decisionRecord.findMany({
        where: input.sessionId
          ? { sessionId: input.sessionId }
          : { userId: ctx.session.user.id, sessionId: null },
        include: {
          itemA: true,
          itemB: true,
          winner: true,
        },
        orderBy: { decidedAt: 'desc' },
      });
      
      return decisions;
    }),

  /**
   * Update an existing decision
   */
  updateDecision: protectedProcedure
    .input(z.object({
      decisionId: z.string().cuid(),
      winnerId: z.string().cuid(),
      rationale: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const existingDecision = await ctx.db.decisionRecord.findUnique({
        where: { id: input.decisionId },
      });

      if (!existingDecision) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Decision not found' });
      }

      if (existingDecision.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Unauthorized' });
      }

      // Update decision
      const decision = await ctx.db.decisionRecord.update({
        where: { id: input.decisionId },
        data: {
          winnerId: input.winnerId,
          rationale: input.rationale,
          modifiedAt: new Date(),
          isModified: true,
        },
      });
      
      // Recalculate ranking
      const itemsToRank = existingDecision.sessionId
        ? await ctx.db.improvementItem.findMany({ 
            where: { sessionId: existingDecision.sessionId },
          })
        : await ctx.db.improvementItem.findMany({ 
            where: { userId: ctx.session.user.id, sessionId: null },
          });
      
      const decisions = await ctx.db.decisionRecord.findMany({
        where: existingDecision.sessionId 
          ? { sessionId: existingDecision.sessionId }
          : { userId: ctx.session.user.id, sessionId: null },
      });
      
      const ranking = calculateRanking(itemsToRank, decisions);
      
      // Update rank positions and scores
      await Promise.all(
        ranking.map((item) =>
          ctx.db.improvementItem.update({
            where: { id: item.id },
            data: {
              rankPosition: item.rankPosition,
              rankConfidence: item.confidence,
              impactScore: item.impactScore,
            },
          })
        )
      );
      
      return decision;
    }),
});
