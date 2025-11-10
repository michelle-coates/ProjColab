/**
 * Sample Data Generator for Onboarding
 * Creates realistic improvement items, evidence, and decisions for demo purposes
 */

import type { OnboardingRole } from "./types";
import { getRoleConfig } from "./role-configs";

export interface GeneratedOnboardingData {
  sessionId: string;
  improvements: GeneratedImprovement[];
  conversations: GeneratedConversation[];
  decisions: GeneratedDecision[];
}

export interface GeneratedImprovement {
  title: string;
  description: string;
  estimatedEffort: number;
  expectedImpact: string;
  evidence: string[];
}

export interface GeneratedConversation {
  improvementIndex: number;
  messages: ConversationMessage[];
}

export interface ConversationMessage {
  role: "assistant" | "user";
  content: string;
}

export interface GeneratedDecision {
  improvementAIndex: number;
  improvementBIndex: number;
  winner: "A" | "B";
  reasoning: string;
}

/**
 * Generate complete onboarding sample data for a given role
 */
export function generateSampleData(
  role: OnboardingRole,
  sessionId: string,
): GeneratedOnboardingData {
  const roleConfig = getRoleConfig(role);
  const improvements = roleConfig.sampleImprovements.map((sample) => ({
    title: sample.title,
    description: sample.description,
    estimatedEffort: sample.estimatedEffort,
    expectedImpact: sample.expectedImpact,
    evidence: sample.evidence,
  }));

  const conversations = generateSampleConversations(
    role,
    roleConfig.sampleImprovements,
  );
  const decisions = generateSampleDecisions(improvements.length);

  return {
    sessionId,
    improvements,
    conversations,
    decisions,
  };
}

/**
 * Generate sample AI conversations for demonstration
 */
function generateSampleConversations(
  role: OnboardingRole,
  improvements: GeneratedImprovement[],
): GeneratedConversation[] {
  // Generate conversation for the first improvement only (for demo purposes)
  const firstImprovement = improvements[0];
  if (!firstImprovement) return [];

  const messages: ConversationMessage[] = [
    {
      role: "assistant",
      content: `I see you want to "${firstImprovement.title}". Let me help you think this through. What specific problem are your users experiencing that this would solve?`,
    },
    {
      role: "user",
      content: `Users have been asking for this feature, and I think it would improve their experience significantly.`,
    },
    {
      role: "assistant",
      content: `That's helpful context. Can you quantify the impact? For example, how many users have requested this, or what metrics might improve if we implement it?`,
    },
    {
      role: "user",
      content:
        firstImprovement.evidence[0] ??
        "We've had several requests in support tickets.",
    },
    {
      role: "assistant",
      content: `Excellent data point. Now let's think about effort - what are the main technical challenges or risks you foresee in implementing this?`,
    },
    {
      role: "user",
      content: `The main work would be in the UI layer and ensuring it works well across different devices and contexts.`,
    },
    {
      role: "assistant",
      content: `Good assessment. One more question: if you had to choose between this and other improvements, what makes this particularly important right now?`,
    },
    {
      role: "user",
      content:
        firstImprovement.expectedImpact ||
        "It aligns with our goal of improving user satisfaction and retention.",
    },
  ];

  return [
    {
      improvementIndex: 0,
      messages,
    },
  ];
}

/**
 * Generate sample pairwise comparison decisions
 */
function generateSampleDecisions(
  improvementCount: number,
): GeneratedDecision[] {
  if (improvementCount < 2) return [];

  const decisions: GeneratedDecision[] = [];

  // Generate a few sample decisions for demonstration
  // Compare first item vs second item
  decisions.push({
    improvementAIndex: 0,
    improvementBIndex: 1,
    winner: "A",
    reasoning:
      "While both are valuable, the first option has clearer user demand and measurable impact metrics.",
  });

  if (improvementCount >= 3) {
    // Compare first item vs third item
    decisions.push({
      improvementAIndex: 0,
      improvementBIndex: 2,
      winner: "B",
      reasoning:
        "The third option has strong business impact and removes a key blocker for sales.",
    });

    // Compare second item vs third item
    decisions.push({
      improvementAIndex: 1,
      improvementBIndex: 2,
      winner: "B",
      reasoning:
        "Higher immediate business value outweighs the technical improvements.",
    });
  }

  if (improvementCount >= 4) {
    // Compare first item vs fourth item
    decisions.push({
      improvementAIndex: 0,
      improvementBIndex: 3,
      winner: "A",
      reasoning:
        "Quick wins with high user satisfaction are preferable to longer-term technical investments at this stage.",
    });
  }

  return decisions;
}

/**
 * Generate sample matrix data for visualization demo
 * Returns improvements positioned in the impact/effort quadrants
 */
export interface MatrixPosition {
  improvementIndex: number;
  impact: number; // 0-10
  effort: number; // 0-10
  quadrant: "quick-wins" | "big-bets" | "fill-ins" | "time-sinks";
}

export function generateSampleMatrixData(
  improvementCount: number,
): MatrixPosition[] {
  const positions: MatrixPosition[] = [];

  // Distribute improvements across quadrants for a balanced demo
  const quadrantDistribution: Array<{
    impact: number;
    effort: number;
    quadrant: MatrixPosition["quadrant"];
  }> = [
    { impact: 8, effort: 3, quadrant: "quick-wins" }, // High impact, low effort
    { impact: 9, effort: 8, quadrant: "big-bets" }, // High impact, high effort
    { impact: 7, effort: 4, quadrant: "quick-wins" }, // High impact, low effort
    { impact: 6, effort: 7, quadrant: "big-bets" }, // Medium-high impact, high effort
  ];

  for (let i = 0; i < Math.min(improvementCount, 4); i++) {
    const dist = quadrantDistribution[i];
    if (dist) {
      positions.push({
        improvementIndex: i,
        impact: dist.impact,
        effort: dist.effort,
        quadrant: dist.quadrant,
      });
    }
  }

  return positions;
}

// Note: Cleanup of onboarding data is handled by the completeOnboarding mutation
// in src/server/api/routers/onboarding.ts, which deletes the onboarding session
// and all related data via Prisma cascade deletes.
