import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { claudeService } from "../services/claude";

export const claudeRouter = createTRPCRouter({
  generateSocraticQuestions: publicProcedure
    .input(z.object({
      topic: z.string().min(1),
      context: z.string().optional().default(""),
      difficulty: z.enum(["beginner", "intermediate", "advanced"]).default("intermediate")
    }))
    .mutation(async ({ input }) => {
      return await claudeService.generateSocraticQuestions(
        input.topic,
        input.context,
        input.difficulty
      );
    }),

  processResponse: publicProcedure
    .input(z.object({
      originalQuestion: z.string().min(1),
      userResponse: z.string().min(1),
      sessionContext: z.string().optional().default("")
    }))
    .mutation(async ({ input }) => {
      return await claudeService.processResponse(
        input.originalQuestion,
        input.userResponse,
        input.sessionContext
      );
    }),

  generateLearningPath: publicProcedure
    .input(z.object({
      topic: z.string().min(1),
      userLevel: z.string().min(1),
      goals: z.array(z.string()).min(1)
    }))
    .mutation(async ({ input }) => {
      return await claudeService.generateLearningPath(
        input.topic,
        input.userLevel,
        input.goals
      );
    }),
});