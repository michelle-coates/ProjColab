import { postRouter } from "@/server/api/routers/post";
import { claudeRouter } from "@/server/api/routers/claude";
import { authRouter } from "@/server/api/routers/auth";
import { improvementsRouter } from "@/server/api/routers/improvements";
import { conversationsRouter } from "@/server/api/routers/conversations";
import { decisionsRouter } from "@/server/api/routers/decisions";
import { matrixRouter } from "@/server/api/routers/matrix";
import { sessionsRouter } from "@/server/api/routers/sessions";
import { exportRouter } from "@/server/api/routers/export";
import { onboardingRouter } from "@/server/api/routers/onboarding";
import { validationRouter } from "@/server/api/routers/validation";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  claude: claudeRouter,
  auth: authRouter,
  improvements: improvementsRouter,
  conversations: conversationsRouter,
  decisions: decisionsRouter,
  sessions: sessionsRouter,
  matrix: matrixRouter,
  export: exportRouter,
  onboarding: onboardingRouter,
  validation: validationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
