import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  generateQuestionSchema,
  submitResponseSchema,
  getConversationSchema,
  skipQuestionSchema,
  completeAssessmentSchema,
  type ConversationTurn,
} from "@/lib/validations/conversation";
import { claudeConversationEngine } from "@/lib/ai/claude/conversation-engine";
import { getFallbackQuestion } from "@/lib/ai/claude/fallback-questions";
import {
  calculateConfidence,
  identifyEvidenceGaps,
  getConfidenceForSource,
  type EvidenceEntry,
} from "@/lib/ai/analytics/evidence-scoring";

export const conversationsRouter = createTRPCRouter({
  /**
   * Generate a Socratic question for evidence gathering
   * Uses Claude AI with fallback to predefined questions
   */
  generateQuestion: protectedProcedure
    .input(generateQuestionSchema)
    .mutation(async ({ input, ctx }) => {
      // Load improvement and verify ownership
      const improvement = await ctx.db.improvementItem.findFirst({
        where: {
          id: input.improvementId,
          userId: ctx.session.user.id,
        },
        include: {
          evidence: true,
          conversations: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });

      if (!improvement) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Improvement not found or access denied',
        });
      }

      // Identify evidence gaps
      const evidenceGaps = identifyEvidenceGaps(improvement.evidence as EvidenceEntry[]);

      // Get conversation history from latest conversation or use provided history
      const existingConversation = improvement.conversations[0];
      const conversationHistory: ConversationTurn[] = input.conversationHistory ??
        (existingConversation?.turns as ConversationTurn[]) ?? [];

      // Try Claude AI first, fallback to predefined questions on error
      try {
        const question = await claudeConversationEngine.generateQuestion({
          improvement: {
            title: improvement.title,
            description: improvement.description,
            category: improvement.category,
          },
          conversationHistory,
          evidenceGaps,
        });

        // Create or update conversation record
        const aiTurn: ConversationTurn = {
          speaker: 'AI',
          message: question.question,
          timestamp: new Date().toISOString(),
          metadata: {
            questionReasoning: question.reasoning,
          },
        };

        const updatedTurns = [...conversationHistory, aiTurn];

        const conversation = existingConversation
          ? await ctx.db.aIConversation.update({
              where: { id: existingConversation.id },
              data: {
                turns: updatedTurns,
              },
            })
          : await ctx.db.aIConversation.create({
              data: {
                improvementId: input.improvementId,
                sessionId: improvement.sessionId,
                turns: updatedTurns,
                claudeModel: 'claude-sonnet-4-20250514',
              },
            });

        return {
          success: true,
          data: question,
          conversationId: conversation.id,
          source: 'claude' as const,
        };
      } catch (error) {
        console.error('Claude API error, using fallback:', error);

        // Fallback to predefined questions
        const turnNumber = conversationHistory.filter(t => t.speaker === 'AI').length;
        const fallbackQuestion = getFallbackQuestion(improvement.category, turnNumber);

        const aiTurn: ConversationTurn = {
          speaker: 'AI',
          message: fallbackQuestion.question,
          timestamp: new Date().toISOString(),
          metadata: {
            questionReasoning: fallbackQuestion.reasoning,
            fallback: true,
          },
        };

        const updatedTurns = [...conversationHistory, aiTurn];

        const conversation = existingConversation
          ? await ctx.db.aIConversation.update({
              where: { id: existingConversation.id },
              data: {
                turns: updatedTurns,
                usingFallback: true,
              },
            })
          : await ctx.db.aIConversation.create({
              data: {
                improvementId: input.improvementId,
                sessionId: improvement.sessionId,
                turns: updatedTurns,
                usingFallback: true,
              },
            });

        return {
          success: true,
          data: fallbackQuestion,
          conversationId: conversation.id,
          source: 'fallback' as const,
        };
      }
    }),

  /**
   * Submit a user response to create evidence and continue conversation
   */
  submitResponse: protectedProcedure
    .input(submitResponseSchema)
    .mutation(async ({ input, ctx }) => {
      // Verify conversation ownership
      const conversation = await ctx.db.aIConversation.findFirst({
        where: {
          id: input.conversationId,
        },
        include: {
          improvement: true,
        },
      });

      if (!conversation || conversation.improvement.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Access denied to this conversation',
        });
      }

      // Create evidence entry from response
      const evidenceSource = input.evidenceType ?? 'ASSUMPTIONS';
      const evidence = await ctx.db.evidenceEntry.create({
        data: {
          improvementId: input.improvementId,
          content: input.response,
          source: evidenceSource,
          confidence: getConfidenceForSource(evidenceSource),
        },
      });

      // Update conversation with user turn
      const userTurn: ConversationTurn = {
        speaker: 'USER',
        message: input.response,
        timestamp: new Date().toISOString(),
        metadata: {
          evidenceType: evidenceSource,
        },
      };

      const currentTurns = conversation.turns as ConversationTurn[];
      const updatedTurns = [...currentTurns, userTurn];

      await ctx.db.aIConversation.update({
        where: { id: input.conversationId },
        data: {
          turns: updatedTurns,
        },
      });

      // Calculate new confidence level
      const allEvidence = await ctx.db.evidenceEntry.findMany({
        where: { improvementId: input.improvementId },
      });

      const overallConfidence = calculateConfidence(allEvidence as EvidenceEntry[]);

      // Determine if conversation should continue
      const conversationComplete = overallConfidence >= 0.7;

      return {
        success: true,
        evidenceId: evidence.id,
        conversationComplete,
        confidence: overallConfidence,
        message: conversationComplete
          ? "Great! You've gathered strong evidence for this improvement."
          : "Evidence recorded. Ready for the next question?",
      };
    }),

  /**
   * Get conversation details with evidence and confidence
   */
  getConversation: protectedProcedure
    .input(getConversationSchema)
    .query(async ({ input, ctx }) => {
      // First check if improvement exists and user owns it
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
          code: 'NOT_FOUND',
          message: 'Improvement not found or access denied',
        });
      }

      const conversation = await ctx.db.aIConversation.findFirst({
        where: {
          improvementId: input.improvementId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const confidence = calculateConfidence(improvement.evidence as EvidenceEntry[]);

      // If no conversation exists yet, return empty conversation structure
      if (!conversation) {
        return {
          conversation: {
            id: '',
            turns: [] as ConversationTurn[],
            usingFallback: false,
            createdAt: new Date(),
          },
          improvement: {
            id: improvement.id,
            title: improvement.title,
            description: improvement.description,
            category: improvement.category,
          },
          evidence: improvement.evidence,
          confidence,
          evidenceCount: improvement.evidence.length,
        };
      }

      return {
        conversation: {
          id: conversation.id,
          turns: conversation.turns as ConversationTurn[],
          usingFallback: conversation.usingFallback,
          createdAt: conversation.createdAt,
        },
        improvement: {
          id: improvement.id,
          title: improvement.title,
          description: improvement.description,
          category: improvement.category,
        },
        evidence: improvement.evidence,
        confidence,
        evidenceCount: improvement.evidence.length,
      };
    }),

  /**
   * Skip evidence gathering for now without losing data
   */
  skipQuestion: protectedProcedure
    .input(skipQuestionSchema)
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
          code: 'NOT_FOUND',
          message: 'Improvement not found or access denied',
        });
      }

      // No data modification - conversation state is preserved
      return {
        success: true,
        message: 'Question skipped. You can gather evidence later from the improvement details.',
      };
    }),

  /**
   * Complete the evidence gathering assessment
   */
  completeAssessment: protectedProcedure
    .input(completeAssessmentSchema)
    .mutation(async ({ input, ctx }) => {
      // Verify improvement ownership
      const improvement = await ctx.db.improvementItem.findFirst({
        where: {
          id: input.improvementId,
          userId: ctx.session.user.id,
        },
        include: {
          evidence: true,
          conversations: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });

      if (!improvement) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Improvement not found or access denied',
        });
      }

      const currentConversation = improvement.conversations[0];

      if (!currentConversation) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'No active conversation found',
        });
      }

      // Calculate final confidence
      const confidence = calculateConfidence(improvement.evidence as EvidenceEntry[]);

      // Update conversation as complete
      await ctx.db.aIConversation.update({
        where: { id: currentConversation.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          confidence,
          notes: input.finalNotes || null,
        },
      });

      // If not keeping evidence, clear it
      if (!input.keepEvidence) {
        await ctx.db.evidenceEntry.deleteMany({
          where: { improvementId: input.improvementId },
        });
      }

      return {
        success: true,
        confidence,
        message: 'Evidence gathering completed successfully.',
      };
    }),
});
