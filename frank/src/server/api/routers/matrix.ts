import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const matrixRouter = createTRPCRouter({
  updatePosition: protectedProcedure
    .input(z.object({
      improvementId: z.string(),
      x: z.number().min(0).max(1),
      y: z.number().min(0).max(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const improvement = await ctx.db.improvementItem.findUnique({
        where: { id: input.improvementId },
        select: { userId: true },
      });

      if (!improvement) {
        throw new Error("Improvement not found");
      }

      if (improvement.userId !== ctx.session.user.id) {
        throw new Error("Unauthorized");
      }

      return ctx.db.improvementItem.update({
        where: { id: input.improvementId },
        data: {
          matrixPosition: {
            x: input.x,
            y: input.y,
          },
        },
      });
    }),

  getMatrixData: protectedProcedure
    .input(z.object({
      sessionId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.db.improvementItem.findMany({
        where: {
          sessionId: input.sessionId,
          userId: ctx.session.user.id,
        },
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          effortLevel: true,
          matrixPosition: true,
          impactScore: true,
        },
      });
    }),
});