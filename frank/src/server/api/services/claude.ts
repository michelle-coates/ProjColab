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
}

// Export singleton instance
export const claudeService = new ClaudeService();