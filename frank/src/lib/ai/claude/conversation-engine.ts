import Anthropic from '@anthropic-ai/sdk';
import type { TextBlock } from '@anthropic-ai/sdk/resources';
import { env } from '../../../env';

// Type definitions matching Prisma schema
export type Category = 'UI_UX' | 'DATA_QUALITY' | 'WORKFLOW' | 'BUG_FIX' | 'FEATURE' | 'OTHER';
export type EvidenceSource = 'ANALYTICS' | 'SUPPORT_TICKETS' | 'USER_FEEDBACK' | 'ASSUMPTIONS' | 'USER_UPLOAD';

export interface ImprovementContext {
  title: string;
  description: string;
  category: Category;
}

// Initialize Claude AI client
const anthropic = new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY ?? '',
});

export interface ConversationTurn {
  speaker: 'AI' | 'USER';
  message: string;
  timestamp: string;
  metadata?: {
    evidenceType?: EvidenceSource;
    questionReasoning?: string;
    fallback?: boolean;
  };
}

export interface SocraticQuestion {
  question: string;
  context: string;
  evidenceType: EvidenceSource[];
  followUpPrompts: string[];
  reasoning: string;
}

interface GenerateQuestionParams {
  improvement: ImprovementContext;
  conversationHistory: ConversationTurn[];
  evidenceGaps: string[];
  userExpertise?: 'beginner' | 'intermediate' | 'expert';
}

/**
 * Claude Conversation Engine for Evidence-Based Prioritization
 * Implements Socratic questioning to gather concrete evidence about improvements
 */
export class ClaudeConversationEngine {
  /**
   * Generate a Socratic question for evidence gathering
   * @throws Error if Claude API fails (caught by router for fallback)
   */
  async generateQuestion(params: GenerateQuestionParams): Promise<SocraticQuestion> {
    if (!env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not configured');
    }

    const systemPrompt = this.buildSystemPrompt();
    const userPrompt = this.buildUserPrompt(params);

    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages: this.buildMessages(params.conversationHistory, userPrompt),
      });

      const content = response.content[0] as TextBlock;
      if (content?.type === 'text') {
        return this.parseClaudeResponse(content.text);
      }

      throw new Error('Unexpected response format from Claude');
    } catch (error) {
      console.error('Claude API error in conversation engine:', error);
      throw error; // Re-throw for router to catch and use fallback
    }
  }

  /**
   * Build the system prompt that defines Frank's role and behavior
   */
  private buildSystemPrompt(): string {
    return `You are Frank, an AI assistant helping product managers gather evidence for prioritization decisions. Your role is to ask Socratic questions that:

1. Challenge assumptions and prompt concrete evidence
2. Focus on beneficiaries, frequency, and measurable impact
3. Connect micro-improvements to business objectives
4. Encourage checking data sources: analytics, support tickets, user feedback
5. Avoid yes/no questions, prompting detailed evidence-based responses

Maintain a friendly, collaborative tone. You're thinking with the user, not interrogating them.

When generating questions, always respond in this JSON format:
{
  "question": "The main question to ask",
  "context": "Why this question matters for evidence gathering",
  "evidenceType": ["ANALYTICS", "SUPPORT_TICKETS", "USER_FEEDBACK", "ASSUMPTIONS"],
  "followUpPrompts": ["Specific action 1", "Specific action 2", "Specific action 3"],
  "reasoning": "Brief explanation of what this question helps discover"
}

Focus on one clear question at a time. Make it conversational and specific to the improvement being discussed.`;
  }

  /**
   * Build the user prompt with improvement context
   */
  private buildUserPrompt(params: GenerateQuestionParams): string {
    const { improvement, evidenceGaps, conversationHistory } = params;

    const historyText = conversationHistory.length > 0
      ? `\n\nPrevious conversation:\n${this.formatHistory(conversationHistory)}`
      : '\n\nThis is the first question in the conversation.';

    const gapsText = evidenceGaps.length > 0
      ? `\n\nEvidence gaps identified: ${evidenceGaps.join(', ')}`
      : '\n\nNo evidence collected yet. Start by understanding who benefits and how often this occurs.';

    return `Improvement to analyze:
Title: ${improvement.title}
Description: ${improvement.description}
Category: ${improvement.category}${historyText}${gapsText}

Generate a Socratic question that helps gather concrete evidence about this improvement's impact, beneficiaries, and frequency. The question should be specific to the ${this.getCategoryLabel(improvement.category)} category and build naturally on any previous conversation.`;
  }

  /**
   * Format conversation history for context
   */
  private formatHistory(history: ConversationTurn[]): string {
    return history
      .slice(-10) // Keep last 10 turns for context
      .map(turn => {
        const speaker = turn.speaker === 'AI' ? 'Frank' : 'User';
        return `${speaker}: ${turn.message}`;
      })
      .join('\n');
  }

  /**
   * Build message array for Claude API
   */
  private buildMessages(
    conversationHistory: ConversationTurn[],
    userPrompt: string
  ): Array<{ role: 'user' | 'assistant'; content: string }> {
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [];

    // Add conversation history
    conversationHistory.forEach(turn => {
      messages.push({
        role: turn.speaker === 'AI' ? 'assistant' : 'user',
        content: turn.message,
      });
    });

    // Add current prompt
    messages.push({
      role: 'user',
      content: userPrompt,
    });

    return messages;
  }

  /**
   * Parse Claude's JSON response into SocraticQuestion
   */
  private parseClaudeResponse(text: string): SocraticQuestion {
    // Remove markdown code blocks if present
    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    try {
      const parsed = JSON.parse(cleanText) as SocraticQuestion;
      
      // Validate required fields
      if (!parsed.question || !parsed.context || !parsed.reasoning) {
        throw new Error('Missing required fields in Claude response');
      }

      // Ensure arrays exist
      parsed.evidenceType = parsed.evidenceType || [];
      parsed.followUpPrompts = parsed.followUpPrompts || [];

      return parsed;
    } catch (error) {
      console.error('Failed to parse Claude response:', text, error);
      throw new Error('Invalid JSON response from Claude');
    }
  }

  /**
   * Get human-readable category label
   */
  private getCategoryLabel(category: Category): string {
    const labels: Record<Category, string> = {
      UI_UX: 'UI/UX',
      DATA_QUALITY: 'data quality',
      WORKFLOW: 'workflow',
      BUG_FIX: 'bug fix',
      FEATURE: 'feature',
      OTHER: 'general',
    };
    return labels[category] || category;
  }
}

// Export singleton instance
export const claudeConversationEngine = new ClaudeConversationEngine();
