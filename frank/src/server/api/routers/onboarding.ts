import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  generateSampleData,
  generateSampleMatrixData,
} from "@/lib/onboarding/sample-data-generator";
import type { OnboardingRole, OnboardingStep } from "@/lib/onboarding/types";

const onboardingRoleSchema = z.enum(["SOLO_PM", "TEAM_LEAD", "FOUNDER"]);
const onboardingStepSchema = z.enum([
  "welcome",
  "role-selection",
  "improvement-capture",
  "ai-interrogation",
  "pairwise-comparison",
  "matrix-visualization",
  "export-demo",
  "completion",
]);

export const onboardingRouter = createTRPCRouter({
  /**
   * Get current onboarding status for the user
   */
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        onboardingCompleted: true,
        onboardingRole: true,
        onboardingProgress: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return {
      completed: user.onboardingCompleted,
      role: user.onboardingRole as OnboardingRole | null,
      progress: user.onboardingProgress as {
        currentStep: OnboardingStep;
        completedSteps: OnboardingStep[];
      } | null,
    };
  }),

  /**
   * Start onboarding with role selection
   */
  startOnboarding: protectedProcedure
    .input(
      z.object({
        role: onboardingRoleSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user already completed onboarding
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { onboardingCompleted: true },
      });

      if (user?.onboardingCompleted) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User has already completed onboarding",
        });
      }

      // Create onboarding session with sample data
      const session = await ctx.db.prioritizationSession.create({
        data: {
          name: "Onboarding Demo Session",
          description: `Sample session for ${input.role} onboarding experience`,
          userId: ctx.session.user.id,
          status: "ACTIVE",
          isOnboarding: true,
        },
      });

      // Generate sample data for the role
      const sampleData = generateSampleData(input.role, session.id);

      // Create sample improvements
      const improvementPromises = sampleData.improvements.map(
        async (improvement, index) => {
          // Map effort number to EffortLevel enum (SMALL, MEDIUM, LARGE only)
          const effortLevel =
            improvement.estimatedEffort <= 3 ? "SMALL" :
            improvement.estimatedEffort <= 6 ? "MEDIUM" : "LARGE";

          const createdImprovement = await ctx.db.improvementItem.create({
            data: {
              title: improvement.title,
              description: improvement.description,
              userId: ctx.session.user.id,
              sessionId: session.id,
              category: "FEATURE", // Default category for onboarding samples
              effortLevel: effortLevel,
              effortRationale: `Estimated based on: ${improvement.expectedImpact}`,
            },
          });

          // Create evidence for this improvement
          if (improvement.evidence.length > 0) {
            await ctx.db.evidenceEntry.createMany({
              data: improvement.evidence.map((evidenceText) => ({
                content: evidenceText,
                improvementId: createdImprovement.id,
                source: "USER_FEEDBACK", // Default source for onboarding samples
                confidence: 0.8, // Default confidence for onboarding samples
              })),
            });
          }

          // Create AI conversation for first improvement
          const conversation = sampleData.conversations.find(
            (conv) => conv.improvementIndex === index,
          );
          if (conversation) {
            await ctx.db.aIConversation.create({
              data: {
                improvementId: createdImprovement.id,
                sessionId: session.id,
                turns: conversation.messages as never, // Cast to satisfy Prisma Json type
              },
            });
          }

          return createdImprovement;
        },
      );

      const improvements = await Promise.all(improvementPromises);

      // Create sample pairwise decisions
      if (improvements.length >= 2) {
        for (const decision of sampleData.decisions) {
          const itemA = improvements[decision.improvementAIndex];
          const itemB = improvements[decision.improvementBIndex];
          const winner = improvements[
            decision.winner === "A"
              ? decision.improvementAIndex
              : decision.improvementBIndex
          ];

          if (itemA && itemB && winner) {
            await ctx.db.decisionRecord.create({
              data: {
                itemAId: itemA.id,
                itemBId: itemB.id,
                winnerId: winner.id,
                prompt: `Comparing "${itemA.title}" vs "${itemB.title}"`,
                rationale: decision.reasoning,
                sessionId: session.id,
                userId: ctx.session.user.id,
              },
            });
          }
        }
      }

      // Update user with onboarding progress
      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          onboardingRole: input.role,
          onboardingProgress: {
            currentStep: "improvement-capture",
            completedSteps: ["welcome", "role-selection"],
          },
        },
      });

      return {
        sessionId: session.id,
        role: input.role,
        improvementCount: improvements.length,
      };
    }),

  /**
   * Update onboarding progress
   */
  updateProgress: protectedProcedure
    .input(
      z.object({
        currentStep: onboardingStepSchema,
        completedSteps: z.array(onboardingStepSchema),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          onboardingProgress: {
            currentStep: input.currentStep,
            completedSteps: input.completedSteps,
          },
        },
      });

      return {
        success: true,
        currentStep: input.currentStep,
      };
    }),

  /**
   * Skip onboarding (mark user as experienced)
   */
  skipOnboarding: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.user.update({
      where: { id: ctx.session.user.id },
      data: {
        onboardingCompleted: true,
        onboardingProgress: Prisma.JsonNull,
        onboardingRole: null,
      },
    });

    return { success: true };
  }),

  /**
   * Complete onboarding and cleanup sample data
   */
  completeOnboarding: protectedProcedure.mutation(async ({ ctx }) => {
    // Find and delete onboarding session and all related data
    const onboardingSession = await ctx.db.prioritizationSession.findFirst({
      where: {
        userId: ctx.session.user.id,
        isOnboarding: true,
      },
    });

    if (onboardingSession) {
      // Prisma cascade deletes will handle related data
      await ctx.db.prioritizationSession.delete({
        where: { id: onboardingSession.id },
      });
    }

    // Mark onboarding as completed
    await ctx.db.user.update({
      where: { id: ctx.session.user.id },
      data: {
        onboardingCompleted: true,
        onboardingProgress: Prisma.JsonNull,
      },
    });

    return { success: true };
  }),

  /**
   * Reset onboarding (for testing/development only)
   */
  resetOnboarding: protectedProcedure.mutation(async ({ ctx }) => {
    // Delete any existing onboarding session
    await ctx.db.prioritizationSession.deleteMany({
      where: {
        userId: ctx.session.user.id,
        isOnboarding: true,
      },
    });

    // Reset user's onboarding status
    await ctx.db.user.update({
      where: { id: ctx.session.user.id },
      data: {
        onboardingCompleted: false,
        onboardingRole: null,
        onboardingProgress: Prisma.JsonNull,
      },
    });

    return { success: true };
  }),

  /**
   * Get onboarding session data
   */
  getSession: protectedProcedure.query(async ({ ctx }) => {
    const session = await ctx.db.prioritizationSession.findFirst({
      where: {
        userId: ctx.session.user.id,
        isOnboarding: true,
      },
      include: {
        improvements: {
          include: {
            evidence: true,
            conversations: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        decisions: {
          include: {
            itemA: true,
            itemB: true,
            winner: true,
          },
          orderBy: {
            decidedAt: "asc",
          },
        },
      },
    });

    if (!session) {
      return null;
    }

    // Generate matrix data from improvements
    const matrixData = generateSampleMatrixData(session.improvements.length);

    return {
      session,
      matrixData,
    };
  }),
});
