import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  generateCSV,
  generateCSVFilename,
  type ImprovementExportData,
  type ExportMetadata,
} from "@/lib/integrations/export/csv-generator";
import {
  generateSummaryReport,
  generateSummaryFilename,
} from "@/lib/integrations/export/summary-generator";

// Input validation schema
const exportInputSchema = z.object({
  sessionId: z.string(),
});

/**
 * Export Router
 * Provides endpoints for exporting prioritization session data in various formats
 */
export const exportRouter = createTRPCRouter({
  /**
   * Export session data as CSV
   * Returns CSV data as a string with filename
   */
  exportCSV: protectedProcedure
    .input(exportInputSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const userName = ctx.session.user.name ?? "Unknown User";

      // Verify session ownership
      const session = await ctx.db.prioritizationSession.findFirst({
        where: {
          id: input.sessionId,
          userId: userId,
        },
      });

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found or you do not have access to it",
        });
      }

      // Fetch improvements with all related data
      const improvements = await ctx.db.improvementItem.findMany({
        where: {
          sessionId: input.sessionId,
          userId: userId,
        },
        include: {
          evidence: {
            select: {
              content: true,
              source: true,
              confidence: true,
            },
          },
          decisionsAsWinner: {
            select: {
              rationale: true,
              quickRationale: true,
            },
          },
        },
        orderBy: {
          rankPosition: "asc",
        },
      });

      // Transform to export format
      const exportData: ImprovementExportData[] = improvements.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category,
        effortLevel: item.effortLevel,
        impactScore: item.impactScore,
        rankPosition: item.rankPosition,
        evidence: item.evidence,
        decisionsAsWinner: item.decisionsAsWinner,
      }));

      // Prepare metadata
      const metadata: ExportMetadata = {
        sessionId: input.sessionId,
        userName: userName,
        exportDate: new Date(),
      };

      // Generate CSV
      const csvData = generateCSV(exportData, metadata);
      const filename = generateCSVFilename(input.sessionId);

      return {
        filename,
        data: csvData,
        mimeType: "text/csv",
      };
    }),

  /**
   * Export session summary report
   * Returns a text-based summary with prioritization methodology and recommendations
   */
  exportSummary: protectedProcedure
    .input(exportInputSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const userName = ctx.session.user.name ?? "Unknown User";

      // Verify session ownership
      const session = await ctx.db.prioritizationSession.findFirst({
        where: {
          id: input.sessionId,
          userId: userId,
        },
      });

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found or you do not have access to it",
        });
      }

      // Fetch improvements with all related data
      const improvements = await ctx.db.improvementItem.findMany({
        where: {
          sessionId: input.sessionId,
          userId: userId,
        },
        include: {
          evidence: {
            select: {
              content: true,
              source: true,
              confidence: true,
            },
          },
          decisionsAsWinner: {
            select: {
              rationale: true,
              quickRationale: true,
            },
          },
        },
        orderBy: {
          rankPosition: "asc",
        },
      });

      // Transform to export format
      const exportData: ImprovementExportData[] = improvements.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category,
        effortLevel: item.effortLevel,
        impactScore: item.impactScore,
        rankPosition: item.rankPosition,
        evidence: item.evidence,
        decisionsAsWinner: item.decisionsAsWinner,
      }));

      // Prepare metadata
      const metadata: ExportMetadata = {
        sessionId: input.sessionId,
        userName: userName,
        exportDate: new Date(),
      };

      // Generate summary report
      const summaryData = generateSummaryReport(
        exportData,
        metadata,
        session.name
      );
      const filename = generateSummaryFilename(input.sessionId);

      return {
        filename,
        data: summaryData,
        mimeType: "text/plain",
      };
    }),

  /**
   * Get export data preview
   * Returns formatted data for preview before download
   */
  getExportData: protectedProcedure
    .input(exportInputSchema)
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Verify session ownership
      const session = await ctx.db.prioritizationSession.findFirst({
        where: {
          id: input.sessionId,
          userId: userId,
        },
      });

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found or you do not have access to it",
        });
      }

      // Get improvement count and basic stats
      const improvements = await ctx.db.improvementItem.findMany({
        where: {
          sessionId: input.sessionId,
          userId: userId,
        },
        select: {
          id: true,
          title: true,
          category: true,
          effortLevel: true,
          rankPosition: true,
        },
      });

      const totalCount = improvements.length;
      const categoryCounts = improvements.reduce(
        (acc, item) => {
          acc[item.category] = (acc[item.category] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      return {
        sessionId: input.sessionId,
        sessionName: session.name,
        totalImprovements: totalCount,
        categoryCounts,
        hasData: totalCount > 0,
      };
    }),
});
