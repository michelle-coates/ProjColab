import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";

export const sessionsRouter = createTRPCRouter({
  /**
   * Create a new prioritization session
   */
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1, "Session name is required"),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const session = await ctx.db.prioritizationSession.create({
        data: {
          name: input.name,
          description: input.description,
          userId: ctx.session.user.id,
          status: "ACTIVE",
        },
      });

      return session;
    }),

  /**
   * Get current active session or null if none exists
   */
  getCurrent: protectedProcedure
    .query(async ({ ctx }) => {
      const session = await ctx.db.prioritizationSession.findFirst({
        where: {
          userId: ctx.session.user.id,
          status: "ACTIVE",
        },
        include: {
          improvements: {
            include: {
              evidence: true,
              conversations: true,
              decisionsAsItemA: true,
              decisionsAsItemB: true,
              decisionsAsWinner: true,
            },
          },
          decisions: {
            include: {
              itemA: true,
              itemB: true,
              winner: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return session;
    }),

  /**
   * List all sessions for the current user
   */
  list: protectedProcedure
    .query(async ({ ctx }) => {
      const sessions = await ctx.db.prioritizationSession.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        include: {
          improvements: {
            select: {
              id: true,
            },
          },
          decisions: {
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return sessions.map(session => ({
        ...session,
        improvementCount: session.improvements.length,
        decisionCount: session.decisions.length,
      }));
    }),

  /**
   * Get a specific session by ID
   */
  getById: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const session = await ctx.db.prioritizationSession.findUnique({
        where: {
          id: input.id,
        },
        include: {
          improvements: {
            include: {
              evidence: true,
              conversations: true,
              decisionsAsItemA: true,
              decisionsAsItemB: true,
              decisionsAsWinner: true,
            },
          },
          decisions: {
            include: {
              itemA: true,
              itemB: true,
              winner: true,
            },
          },
        },
      });

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found",
        });
      }

      if (session.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to this session",
        });
      }

      return session;
    }),

  /**
   * Update session status (ACTIVE/PAUSED/COMPLETED)
   */
  updateStatus: protectedProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(["ACTIVE", "PAUSED", "COMPLETED"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const session = await ctx.db.prioritizationSession.findUnique({
        where: { id: input.id },
      });

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found",
        });
      }

      if (session.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to this session",
        });
      }

      // If completing session, set completedAt
      const data = input.status === "COMPLETED"
        ? { status: input.status, completedAt: new Date() }
        : { status: input.status };

      const updated = await ctx.db.prioritizationSession.update({
        where: { id: input.id },
        data,
      });

      return updated;
    }),

  /**
   * Delete a session and all its associated data
   */
  delete: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const session = await ctx.db.prioritizationSession.findUnique({
        where: { id: input.id },
      });

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found",
        });
      }

      if (session.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to this session",
        });
      }

      // Prisma will handle cascading deletes for improvements and decisions
      await ctx.db.prioritizationSession.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  /**
   * Get session summary with statistics
   */
  getStats: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const session = await ctx.db.prioritizationSession.findUnique({
        where: { id: input.id },
        include: {
          improvements: {
            include: {
              evidence: true,
              decisionsAsWinner: true,
            },
          },
          decisions: true,
        },
      });

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found",
        });
      }

      if (session.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to this session",
        });
      }

      const totalImprovements = session.improvements.length;
      const totalDecisions = session.decisions.length;
      const withEvidence = session.improvements.filter(i => i.evidence.length > 0).length;
      const withEffort = session.improvements.filter(i => i.effortLevel).length;
      const topPriorities = session.improvements
        .filter(i => i.decisionsAsWinner.length > 0)
        .sort((a, b) => b.decisionsAsWinner.length - a.decisionsAsWinner.length)
        .slice(0, 3);

      return {
        id: session.id,
        name: session.name,
        status: session.status,
        createdAt: session.createdAt,
        completedAt: session.completedAt,
        stats: {
          totalImprovements,
          totalDecisions,
          withEvidence,
          withEffort,
          completionPercentage: Math.round((withEvidence + withEffort) / (totalImprovements * 2) * 100),
          topPriorities: topPriorities.map(i => ({
            id: i.id,
            title: i.title,
            wins: i.decisionsAsWinner.length,
          })),
        },
      };
    }),
});