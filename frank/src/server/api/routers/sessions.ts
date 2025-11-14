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
   * Get or create active session for the current user
   * Creates a default session if user has no active session
   */
  getOrCreateActiveSession: protectedProcedure
    .query(async ({ ctx }) => {
      // First, check if user already has an active session set
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        include: {
          PrioritizationSession_User_activeSessionIdToPrioritizationSession: {
            include: {
              improvements: true,
              decisions: true,
            },
          },
        },
      });

      // If user has an active session and it exists, return it
      if (user?.PrioritizationSession_User_activeSessionIdToPrioritizationSession) {
        return user.PrioritizationSession_User_activeSessionIdToPrioritizationSession;
      }

      // Check if user has any ACTIVE sessions at all
      const existingActiveSession = await ctx.db.prioritizationSession.findFirst({
        where: {
          userId: ctx.session.user.id,
          status: "ACTIVE",
        },
        include: {
          improvements: true,
          decisions: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // If there's an active session, set it as the user's active session
      if (existingActiveSession) {
        await ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: { activeSessionId: existingActiveSession.id },
        });
        return existingActiveSession;
      }

      // No active sessions exist, create a default one
      const newSession = await ctx.db.prioritizationSession.create({
        data: {
          userId: ctx.session.user.id,
          name: "My Prioritization",
          description: "Default prioritization session",
          status: "ACTIVE",
        },
        include: {
          improvements: true,
          decisions: true,
        },
      });

      // Set as user's active session
      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { activeSessionId: newSession.id },
      });

      return newSession;
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
              effortLevel: true,
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

  /**
   * Get session state for progress tracking and workflow guidance
   * Story 1.16: Session Flow UX Improvements
   */
  getSessionState: protectedProcedure
    .input(z.object({
      sessionId: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      // Get session ID from input or use active session
      let sessionId = input.sessionId;

      if (!sessionId) {
        const activeSession = await ctx.db.user.findUnique({
          where: { id: ctx.session.user.id },
          select: { activeSessionId: true },
        });
        sessionId = activeSession?.activeSessionId ?? undefined;
      }

      if (!sessionId) {
        // No session exists yet
        return {
          itemsCount: 0,
          itemsWithEffort: 0,
          itemsWithQuestions: 0,
          comparisonsCompleted: 0,
          comparisonsRequired: 0,
          readyForMatrix: false,
          currentStage: "capture" as const,
          nextAction: {
            title: "Add your first improvement",
            description: "Start by capturing the improvements you want to prioritize",
            action: "Add Improvement",
            link: "/dashboard",
          },
        };
      }

      const session = await ctx.db.prioritizationSession.findUnique({
        where: { id: sessionId },
        include: {
          improvements: {
            include: {
              conversations: true,
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

      const itemsCount = session.improvements.length;
      const itemsWithEffort = session.improvements.filter(i => i.effortLevel !== null).length;
      const itemsWithQuestions = session.improvements.filter(i =>
        i.conversations.length > 0 && i.conversations.some(c => c.finalInsights !== null)
      ).length;
      const comparisonsCompleted = session.decisions.length;

      // Calculate required comparisons: n * (n-1) / 2 for items with effort
      const itemsReadyForComparison = itemsWithEffort;
      const comparisonsRequired = itemsReadyForComparison >= 2
        ? (itemsReadyForComparison * (itemsReadyForComparison - 1)) / 2
        : 0;

      // Determine current stage
      let currentStage: "capture" | "estimate" | "questions" | "compare" | "results";
      let nextAction: { title: string; description: string; action: string; link: string };

      if (itemsCount === 0) {
        currentStage = "capture";
        nextAction = {
          title: "Add your first improvement",
          description: "Start by capturing the improvements you want to prioritize",
          action: "Add Improvement",
          link: "/dashboard",
        };
      } else if (itemsWithEffort < itemsCount) {
        currentStage = "estimate";
        const remaining = itemsCount - itemsWithEffort;
        nextAction = {
          title: `Estimate effort for ${remaining} ${remaining === 1 ? "item" : "items"}`,
          description: "Assign Small, Medium, or Large effort to each improvement",
          action: "Estimate Effort",
          link: "/dashboard",
        };
      } else if (itemsWithQuestions < itemsCount) {
        currentStage = "questions";
        const remaining = itemsCount - itemsWithQuestions;
        nextAction = {
          title: `Answer impact questions for ${remaining} ${remaining === 1 ? "item" : "items"}`,
          description: "Help Frank understand the impact of each improvement",
          action: "Answer Questions",
          link: "/dashboard",
        };
      } else if (comparisonsCompleted < comparisonsRequired) {
        currentStage = "compare";
        const remaining = comparisonsRequired - comparisonsCompleted;
        const percentage = comparisonsRequired > 0
          ? Math.round((comparisonsCompleted / comparisonsRequired) * 100)
          : 0;
        nextAction = {
          title: comparisonsCompleted === 0 ? "Start comparing items" : "Continue comparing",
          description: `${remaining} ${remaining === 1 ? "comparison" : "comparisons"} remaining (${percentage}% complete)`,
          action: comparisonsCompleted === 0 ? "Start Comparing" : "Continue",
          link: "/comparisons",
        };
      } else {
        currentStage = "results";
        nextAction = {
          title: "View your prioritization matrix",
          description: "See your improvements ranked by impact and effort",
          action: "View Matrix",
          link: "/matrix",
        };
      }

      const readyForMatrix = itemsWithEffort > 0 &&
                            itemsWithQuestions > 0 &&
                            comparisonsCompleted >= comparisonsRequired;

      return {
        itemsCount,
        itemsWithEffort,
        itemsWithQuestions,
        comparisonsCompleted,
        comparisonsRequired,
        readyForMatrix,
        currentStage,
        nextAction,
      };
    }),
});