import Anthropic from '@anthropic-ai/sdk';
import type { TextBlock } from '@anthropic-ai/sdk/resources';
import { env } from '../../../env';

// Initialize Claude AI client
const anthropic = new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY ?? '',
});

export interface SocraticQuestion {
  question: string;
  context: string;
  followUpSuggestions: string[];
}

export interface SocraticResponse {
  response: string;
  nextQuestions: SocraticQuestion[];
  insights: string[];
}

/**
 * Frank's AI Socratic Interrogation Service
 * Implements the novel AI patterns defined in the architecture
 */
export class ClaudeService {
  /**
   * Generate Socratic questions based on user input
   * Core feature of Frank's AI-driven learning approach
   */
  async generateSocraticQuestions(
    topic: string,
    context: string = '',
    difficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'
  ): Promise<SocraticQuestion[]> {
    if (!env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not configured');
    }

    const prompt = `You are Frank, an AI Socratic interrogation system. Generate thoughtful, probing questions about: ${topic}

Context: ${context}
Difficulty: ${difficulty}

Generate 3-5 Socratic questions that:
1. Help the user discover deeper insights
2. Challenge assumptions
3. Connect to broader concepts
4. Encourage critical thinking

Format as JSON:
{
  "questions": [
    {
      "question": "The main question",
      "context": "Why this question matters",
      "followUpSuggestions": ["suggestion1", "suggestion2"]
    }
  ]
}`;

    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const content = response.content[0] as TextBlock;
      if (content?.type === 'text') {
        // Remove markdown code blocks if present
        let text = content.text.trim();
        if (text.startsWith('```json')) {
          text = text.replace(/^```json\n/, '').replace(/\n```$/, '');
        } else if (text.startsWith('```')) {
          text = text.replace(/^```\n/, '').replace(/\n```$/, '');
        }
        const parsed = JSON.parse(text);
        return parsed.questions;
      }
      
      throw new Error('Unexpected response format');
    } catch (error) {
      console.error('Claude API error:', error);
      throw new Error('Failed to generate Socratic questions');
    }
  }

  /**
   * Process user response and generate follow-up
   * Implements Frank's adaptive learning patterns
   */
  async processResponse(
    originalQuestion: string,
    userResponse: string,
    sessionContext: string = ''
  ): Promise<SocraticResponse> {
    if (!env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not configured');
    }

    const prompt = `You are Frank, analyzing a user's response in a Socratic dialogue.

Original Question: ${originalQuestion}
User Response: ${userResponse}
Session Context: ${sessionContext}

Provide:
1. A thoughtful response that builds on their answer
2. 2-3 follow-up questions that deepen understanding
3. Key insights discovered

Format as JSON:
{
  "response": "Your thoughtful response",
  "nextQuestions": [
    {
      "question": "Follow-up question",
      "context": "Why this matters",
      "followUpSuggestions": ["suggestion1", "suggestion2"]
    }
  ],
  "insights": ["insight1", "insight2"]
}`;

    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1200,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const content = response.content[0] as TextBlock;
      if (content?.type === 'text') {
        // Remove markdown code blocks if present
        let text = content.text.trim();
        if (text.startsWith('```json')) {
          text = text.replace(/^```json\n/, '').replace(/\n```$/, '');
        } else if (text.startsWith('```')) {
          text = text.replace(/^```\n/, '').replace(/\n```$/, '');
        }
        return JSON.parse(text);
      }
      
      throw new Error('Unexpected response format');
    } catch (error) {
      console.error('Claude API error:', error);
      throw new Error('Failed to process response');
    }
  }

  /**
   * Generate learning path recommendations
   * Part of Frank's adaptive learning system
   */
  async generateLearningPath(
    topic: string,
    userLevel: string,
    goals: string[]
  ): Promise<{
    path: string[];
    estimatedTime: string;
    keyMilestones: string[];
  }> {
    if (!env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not configured');
    }

    const prompt = `Create a personalized learning path for: ${topic}

User Level: ${userLevel}
Goals: ${goals.join(', ')}

Provide a structured learning path with:
1. Step-by-step progression
2. Time estimates
3. Key milestones

Format as JSON:
{
  "path": ["step1", "step2", "step3"],
  "estimatedTime": "X weeks/months",
  "keyMilestones": ["milestone1", "milestone2"]
}`;

    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 800,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const content = response.content[0] as TextBlock;
      if (content?.type === 'text') {
        // Remove markdown code blocks if present
        let text = content.text.trim();
        if (text.startsWith('```json')) {
          text = text.replace(/^```json\n/, '').replace(/\n```$/, '');
        } else if (text.startsWith('```')) {
          text = text.replace(/^```\n/, '').replace(/\n```$/, '');
        }
        return JSON.parse(text);
      }
      
      throw new Error('Unexpected response format');
    } catch (error) {
      console.error('Claude API error:', error);
      throw new Error('Failed to generate learning path');
    }
  }

  /**
   * Generate effort estimation guidance questions
   * Helps users calibrate their effort estimates with contextual questions
   * Story 1.4: Effort Estimation with AI Guidance
   */
  async generateEffortGuidance(params: {
    title: string;
    description: string;
    category: string;
    evidence: Array<{ content: string; source: string }>;
  }): Promise<{
    questions: string;
    metadata: {
      model: string;
      usage: {
        input_tokens: number;
        output_tokens: number;
      };
    };
  }> {
    if (!env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not configured');
    }

    // Build category-specific context
    const categoryContext = this.getCategorySpecificGuidance(params.category);

    // Format evidence for context
    const evidenceContext = params.evidence.length > 0
      ? `\n\nEvidence gathered:\n${params.evidence.map(e => `- ${e.content} (${e.source})`).join('\n')}`
      : '';

    const systemPrompt = `You are Frank, an AI product prioritization assistant. 
Help users estimate effort (Small: hours-1day | Medium: days-1week | Large: 1week+).

Ask 3-4 short, direct questions focused on:
1. Dependencies - What else does this touch? Any integrations or APIs?
2. Reusability - Can you use existing components/patterns, or build from scratch?
3. Infrastructure impact - Does this affect shared systems, databases, or architecture?

${categoryContext}

Be conversational and concise. One question per line.`;

    const userPrompt = `Effort estimate for:
Title: ${params.title}
Description: ${params.description}
Category: ${params.category}${evidenceContext}

Ask brief questions about dependencies, reusable components, and infrastructure impact.`;

    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ],
        system: systemPrompt,
      });

      const content = response.content[0] as TextBlock;
      if (content?.type === 'text') {
        return {
          questions: content.text,
          metadata: {
            model: response.model,
            usage: {
              input_tokens: response.usage.input_tokens,
              output_tokens: response.usage.output_tokens,
            },
          },
        };
      }
      
      throw new Error('Unexpected response format');
    } catch (error) {
      console.error('Claude API error in effort guidance:', error);
      throw new Error('Failed to generate effort guidance');
    }
  }

  /**
   * Get category-specific guidance for effort estimation
   * @private
   */
  private getCategorySpecificGuidance(category: string): string {
    const categoryGuidance: Record<string, string> = {
      UI_UX: 'For UI/UX: Consider design system reuse, responsive needs, browser compatibility.',
      DATA_QUALITY: 'For data quality: Think about schema changes, migrations, data volume.',
      WORKFLOW: 'For workflow: Focus on business logic, state management, integration points.',
      BUG_FIX: 'For bugs: Consider root cause depth, regression risk, testing scope.',
      FEATURE: 'For features: Look at integration needs, API changes, backward compatibility.',
      OTHER: 'Consider scope, dependencies, and coordination needs.',
    };

    return categoryGuidance[category] ?? categoryGuidance['OTHER']!;
  }

  /**
   * Analyze user's effort responses and provide recommendation
   * Story 1.4: Interactive effort estimation
   */
  async analyzeEffortResponses(params: {
    title: string;
    description: string;
    category: string;
    userResponses: string[];
  }): Promise<{
    recommendation: string;
    suggestedLevel: 'SMALL' | 'MEDIUM' | 'LARGE';
    reasoning: string;
    metadata: {
      model: string;
      usage: {
        input_tokens: number;
        output_tokens: number;
      };
    };
  }> {
    if (!env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not configured');
    }

    const systemPrompt = `You are Frank, an AI product prioritization assistant helping estimate effort.
Based on the user's responses to your calibration questions, provide an effort recommendation.

Effort levels:
- SMALL: Hours to a day (minor tweaks, config changes, simple fixes)
- MEDIUM: Days to a week (feature additions, moderate refactoring)
- LARGE: Weeks or more (significant features, architectural changes)

Analyze their responses for complexity signals:
- Scope: How many components/systems affected?
- Dependencies: External integrations, team coordination needed?
- Unknowns: Research required, technical uncertainty?
- Risk: Testing scope, regression potential?

Provide a recommendation with clear reasoning.`;

    const userPrompt = `Improvement: ${params.title}
Description: ${params.description}
Category: ${params.category}

User's responses to calibration questions:
${params.userResponses.map((r, i) => `${i + 1}. ${r}`).join('\n\n')}

Based on these responses, what effort level do you recommend and why?

Respond in this format:
RECOMMENDATION: [Brief summary of your recommendation]
SUGGESTED_LEVEL: [SMALL, MEDIUM, or LARGE]
REASONING: [Detailed explanation of why, citing specific points from their responses]`;

    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ],
        system: systemPrompt,
      });

      const content = response.content[0] as TextBlock;
      if (content?.type === 'text') {
        const text = content.text;
        
        // Parse the structured response
        const recommendationMatch = text.match(/RECOMMENDATION:\s*(.+?)(?=\n|$)/i);
        const levelMatch = text.match(/SUGGESTED_LEVEL:\s*(SMALL|MEDIUM|LARGE)/i);
        const reasoningMatch = text.match(/REASONING:\s*(.+)/is);

        return {
          recommendation: recommendationMatch?.[1]?.trim() ?? text,
          suggestedLevel: (levelMatch?.[1]?.toUpperCase() as 'SMALL' | 'MEDIUM' | 'LARGE') ?? 'MEDIUM',
          reasoning: reasoningMatch?.[1]?.trim() ?? text,
          metadata: {
            model: response.model,
            usage: {
              input_tokens: response.usage.input_tokens,
              output_tokens: response.usage.output_tokens,
            },
          },
        };
      }
      
      throw new Error('Unexpected response format');
    } catch (error) {
      console.error('Claude API error in effort analysis:', error);
      throw new Error('Failed to analyze effort responses');
    }
  }
}

// Export singleton instance
export const claudeService = new ClaudeService();