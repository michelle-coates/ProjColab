/**
 * AI-Powered Description Quality Analyzer
 * Story 1.10: Input Validation and Error Handling
 *
 * Uses Claude to detect vague descriptions and suggest improvements
 */

import Anthropic from '@anthropic-ai/sdk';
import type { TextBlock } from '@anthropic-ai/sdk/resources';
import { env } from '@/env';

export interface DescriptionAnalysis {
  /** Overall quality score 0.0-1.0 */
  qualityScore: number;
  /** Is the description vague or generic? */
  isVague: boolean;
  /** Specific issues detected */
  issues: string[];
  /** Suggested clarifying questions */
  clarifyingQuestions: string[];
  /** Suggestions for improvement */
  improvements: string[];
  /** Analysis confidence (0.0-1.0) */
  confidence: number;
}

/**
 * Analyze description quality using Claude AI
 */
export async function analyzeDescriptionQuality(
  description: string,
  context?: {
    title?: string;
    category?: string;
  }
): Promise<DescriptionAnalysis> {
  if (!env.ANTHROPIC_API_KEY) {
    // Fallback to rule-based analysis if API key not available
    return fallbackAnalysis(description);
  }

  try {
    const anthropic = new Anthropic({
      apiKey: env.ANTHROPIC_API_KEY,
    });

    const prompt = `You are an expert at analyzing improvement descriptions for a prioritization tool called Frank.

Analyze this improvement description for quality and clarity:

Title: ${context?.title || 'Not provided'}
Category: ${context?.category || 'Not provided'}
Description: ${description}

Evaluate the description and provide analysis in JSON format:
{
  "qualityScore": 0.0-1.0 (0.0 = very vague, 1.0 = excellent detail),
  "isVague": boolean (true if description lacks specifics),
  "issues": ["issue1", "issue2"] (specific problems found),
  "clarifyingQuestions": ["question1", "question2"] (2-4 questions to help user add more detail),
  "improvements": ["suggestion1", "suggestion2"] (specific ways to improve),
  "confidence": 0.0-1.0 (how confident you are in this analysis)
}

Criteria for quality:
- Specificity: Does it clearly state what needs to change?
- Context: Does it explain why this matters?
- Measurability: Can success be measured?
- Actionability: Is it clear what to do?
- Detail: Are there concrete examples or evidence?

A vague description might say "improve the dashboard" while a good one says "add real-time data refresh to the dashboard metrics panel because users report seeing stale data (last updated 24+ hours ago) causing incorrect business decisions."`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.content[0] as TextBlock;
    if (content?.type === 'text') {
      let text = content.text.trim();

      // Remove markdown code blocks if present
      if (text.startsWith('```json')) {
        text = text.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      } else if (text.startsWith('```')) {
        text = text.replace(/^```\n?/, '').replace(/\n?```$/, '');
      }

      const analysis = JSON.parse(text) as DescriptionAnalysis;
      return analysis;
    }

    throw new Error('Unexpected response format from Claude');
  } catch (error) {
    console.error('Claude API error during description analysis:', error);
    // Fallback to rule-based analysis
    return fallbackAnalysis(description);
  }
}

/**
 * Rule-based fallback analysis when Claude API is unavailable
 */
function fallbackAnalysis(description: string): DescriptionAnalysis {
  const trimmed = description.trim();
  const wordCount = trimmed.split(/\s+/).length;
  const lower = trimmed.toLowerCase();

  const issues: string[] = [];
  const clarifyingQuestions: string[] = [];
  const improvements: string[] = [];

  let qualityScore = 0.5; // Start neutral

  // Check length
  if (wordCount < 5) {
    issues.push('Description is too short to provide adequate context');
    clarifyingQuestions.push('Can you explain in more detail what needs to be improved?');
    improvements.push('Add at least a few sentences explaining the improvement');
    qualityScore -= 0.3;
  } else if (wordCount >= 20) {
    qualityScore += 0.2;
  }

  // Check for vague patterns
  const vaguePatterns = [
    { pattern: /^(improve|fix|update|change)\s+(it|this|that)/i, message: 'Description starts with vague action' },
    { pattern: /make\s+(it|this|that)\s+better/i, message: 'Too generic - "make it better" needs specifics' },
    { pattern: /^(broken|not working|bad|slow)$/i, message: 'One-word descriptions lack detail' },
  ];

  for (const { pattern, message } of vaguePatterns) {
    if (pattern.test(trimmed)) {
      issues.push(message);
      qualityScore -= 0.2;
    }
  }

  // Check for specifics
  const hasNumbers = /\d+/.test(trimmed);
  const hasExamples = /e\.g\.|example|specifically|currently|for instance/i.test(trimmed);
  const hasWhy = /because|since|so that|in order to/i.test(trimmed);
  const hasWhat = /what|which|where|when|how/i.test(trimmed);

  if (!hasNumbers && !hasExamples) {
    issues.push('No specific examples or data provided');
    clarifyingQuestions.push('Can you provide specific examples or metrics?');
    improvements.push('Include concrete examples (e.g., "users wait 5+ seconds for page load")');
    qualityScore -= 0.15;
  }

  if (!hasWhy) {
    clarifyingQuestions.push('Why is this improvement important? What problem does it solve?');
    improvements.push('Explain the impact or reason for this improvement');
    qualityScore -= 0.1;
  }

  if (!hasWhat) {
    clarifyingQuestions.push('What exactly needs to change?');
    improvements.push('Be specific about what should change, not just that it should change');
  }

  // Default questions if none generated
  if (clarifyingQuestions.length === 0) {
    clarifyingQuestions.push('What specific problem are you trying to solve?');
    clarifyingQuestions.push('Who is affected by this improvement?');
    clarifyingQuestions.push('How will you know when this improvement is successful?');
  }

  // Clamp score
  qualityScore = Math.max(0, Math.min(1, qualityScore));

  const isVague = qualityScore < 0.6 || issues.length > 2;

  return {
    qualityScore,
    isVague,
    issues,
    clarifyingQuestions: clarifyingQuestions.slice(0, 4), // Max 4 questions
    improvements: improvements.slice(0, 3), // Max 3 suggestions
    confidence: 0.7, // Fallback analysis has moderate confidence
  };
}

/**
 * Quick vagueness check (synchronous, rule-based only)
 */
export function isDescriptionVague(description: string): boolean {
  const trimmed = description.trim();
  const wordCount = trimmed.split(/\s+/).length;

  if (wordCount < 5) return true;

  const vaguePatterns = [
    /^(improve|fix|update|change)\s+(it|this|that)/i,
    /make\s+(it|this|that)\s+better/i,
    /^(broken|not working|bad|slow)$/i,
  ];

  return vaguePatterns.some(pattern => pattern.test(trimmed));
}
