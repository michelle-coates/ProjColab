/**
 * Onboarding Types and State Machine
 * Defines the structure and flow of the guided onboarding experience
 */

export type OnboardingRole = "SOLO_PM" | "TEAM_LEAD" | "FOUNDER";

export type OnboardingStep =
  | "welcome"
  | "role-selection"
  | "improvement-capture"
  | "ai-interrogation"
  | "pairwise-comparison"
  | "matrix-visualization"
  | "export-demo"
  | "completion";

export interface OnboardingState {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  role: OnboardingRole | null;
  sessionId: string | null;
  achievements: Achievement[];
  startedAt: Date;
  lastUpdatedAt: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: Date;
}

export interface StepDefinition {
  id: OnboardingStep;
  title: string;
  description: string;
  estimatedMinutes: number;
  features: string[];
  nextStep: OnboardingStep | null;
  previousStep: OnboardingStep | null;
}

/**
 * Onboarding flow state machine
 * Defines valid transitions and step order
 */
export const ONBOARDING_FLOW: Record<OnboardingStep, StepDefinition> = {
  welcome: {
    id: "welcome",
    title: "Welcome to Frank",
    description: "Introduction to Frank's value proposition and what to expect",
    estimatedMinutes: 1,
    features: [],
    nextStep: "role-selection",
    previousStep: null,
  },
  "role-selection": {
    id: "role-selection",
    title: "Select Your Role",
    description: "Choose your role to personalize your onboarding experience",
    estimatedMinutes: 1,
    features: [],
    nextStep: "improvement-capture",
    previousStep: "welcome",
  },
  "improvement-capture": {
    id: "improvement-capture",
    title: "Capture Improvements",
    description: "Learn how to add improvement items to Frank",
    estimatedMinutes: 3,
    features: ["Improvement capture interface", "Quick add functionality"],
    nextStep: "ai-interrogation",
    previousStep: "role-selection",
  },
  "ai-interrogation": {
    id: "ai-interrogation",
    title: "AI Context Gathering",
    description: "Experience how Frank's AI helps you think through improvements",
    estimatedMinutes: 4,
    features: ["AI-powered questioning", "Evidence collection"],
    nextStep: "pairwise-comparison",
    previousStep: "improvement-capture",
  },
  "pairwise-comparison": {
    id: "pairwise-comparison",
    title: "Pairwise Comparison",
    description: "Learn Frank's intuitive comparison approach",
    estimatedMinutes: 3,
    features: ["Pairwise decision making", "Decision tracking"],
    nextStep: "matrix-visualization",
    previousStep: "ai-interrogation",
  },
  "matrix-visualization": {
    id: "matrix-visualization",
    title: "Impact vs Effort Matrix",
    description: "Visualize your priorities in an actionable matrix",
    estimatedMinutes: 2,
    features: ["Interactive matrix", "Priority quadrants"],
    nextStep: "export-demo",
    previousStep: "pairwise-comparison",
  },
  "export-demo": {
    id: "export-demo",
    title: "Export & Share",
    description: "Learn how to export your prioritization results",
    estimatedMinutes: 1,
    features: ["CSV export", "Summary reports"],
    nextStep: "completion",
    previousStep: "matrix-visualization",
  },
  completion: {
    id: "completion",
    title: "You're Ready!",
    description: "Congratulations! You've mastered the basics of Frank",
    estimatedMinutes: 0,
    features: [],
    nextStep: null,
    previousStep: "export-demo",
  },
};

/**
 * Role-specific content and examples
 */
export interface RoleConfig {
  role: OnboardingRole;
  title: string;
  description: string;
  sampleImprovements: SampleImprovement[];
}

export interface SampleImprovement {
  title: string;
  description: string;
  evidence: string[];
  estimatedEffort: number;
  expectedImpact: string;
}

/**
 * Achievement definitions
 */
export const ACHIEVEMENTS = {
  FIRST_IMPROVEMENT: {
    id: "first-improvement",
    title: "First Improvement Captured!",
    description: "You've added your first improvement to Frank",
  },
  AI_CONVERSATION: {
    id: "ai-conversation",
    title: "AI Collaboration",
    description: "You've completed your first AI-assisted context gathering",
  },
  FIRST_COMPARISON: {
    id: "first-comparison",
    title: "Decision Made",
    description: "You've made your first pairwise comparison",
  },
  MATRIX_EXPLORED: {
    id: "matrix-explored",
    title: "Visual Thinker",
    description: "You've explored the impact vs effort matrix",
  },
  FIRST_EXPORT: {
    id: "first-export",
    title: "Ready to Share",
    description: "You've exported your first prioritization",
  },
  ONBOARDING_COMPLETE: {
    id: "onboarding-complete",
    title: "Frank Expert",
    description: "You've completed the guided onboarding experience",
  },
} as const;

/**
 * Progress tracking helpers
 */
export function getNextStep(
  currentStep: OnboardingStep,
): OnboardingStep | null {
  return ONBOARDING_FLOW[currentStep].nextStep;
}

export function getPreviousStep(
  currentStep: OnboardingStep,
): OnboardingStep | null {
  return ONBOARDING_FLOW[currentStep].previousStep;
}

export function getStepProgress(completedSteps: OnboardingStep[]): number {
  const totalSteps = Object.keys(ONBOARDING_FLOW).length;
  return Math.round((completedSteps.length / totalSteps) * 100);
}

export function getTotalEstimatedMinutes(): number {
  return Object.values(ONBOARDING_FLOW).reduce(
    (total, step) => total + step.estimatedMinutes,
    0,
  );
}
