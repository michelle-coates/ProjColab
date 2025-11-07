/**
 * Role-specific configurations for onboarding
 * Defines sample data and examples for each user role
 */

import type { RoleConfig, OnboardingRole } from "./types";

export const ROLE_CONFIGS: Record<OnboardingRole, RoleConfig> = {
  SOLO_PM: {
    role: "SOLO_PM",
    title: "Solo Product Manager",
    description:
      "You're managing your own product roadmap and need to make smart prioritization decisions quickly.",
    sampleImprovements: [
      {
        title: "Add dark mode to mobile app",
        description:
          "Users have been requesting dark mode support. Would reduce eye strain and improve battery life on OLED screens.",
        evidence: [
          "127 feature requests in the last 3 months",
          "Competitor apps all have dark mode",
          "Can reduce battery usage by up to 30% on OLED displays",
        ],
        estimatedEffort: 3,
        expectedImpact:
          "Improved user satisfaction and reduced churn for power users",
      },
      {
        title: "Implement OAuth login",
        description:
          "Replace email/password with social login options (Google, GitHub, Apple) for faster signup.",
        evidence: [
          "Current signup completion rate is only 45%",
          "Industry average with OAuth is 75-80%",
          "Support tickets about password reset account for 15% of volume",
        ],
        estimatedEffort: 5,
        expectedImpact:
          "Higher conversion rates and reduced support burden for password issues",
      },
      {
        title: "Add export to PDF feature",
        description:
          "Allow users to export their reports and dashboards as PDF files for sharing with stakeholders.",
        evidence: [
          "Top 5 requested feature in user survey",
          "Currently users take screenshots which looks unprofessional",
          "Sales team says this is blocking 3 enterprise deals",
        ],
        estimatedEffort: 4,
        expectedImpact:
          "Enable enterprise sales and improve professional perception",
      },
      {
        title: "Performance optimization for large datasets",
        description:
          "App becomes sluggish when users have more than 1000 items. Need to implement pagination and virtualization.",
        evidence: [
          "23% of active users have >1000 items",
          "Average load time for these users is 8 seconds vs 1.2s for others",
          "5 churned customers cited performance as primary reason",
        ],
        estimatedEffort: 8,
        expectedImpact: "Retain power users and prevent churn in growth segment",
      },
    ],
  },
  TEAM_LEAD: {
    role: "TEAM_LEAD",
    title: "Team Lead",
    description:
      "You're coordinating multiple priorities across your team and need to align everyone on what matters most.",
    sampleImprovements: [
      {
        title: "Implement code review automation",
        description:
          "Set up automated code quality checks and linting to catch issues before human review.",
        evidence: [
          "Code reviews currently take 2-3 days on average",
          "30% of review comments are about formatting/style issues",
          "Team velocity could increase by 15-20% with faster reviews",
        ],
        estimatedEffort: 4,
        expectedImpact:
          "Faster review cycles and team can focus on architectural feedback",
      },
      {
        title: "Set up shared component library",
        description:
          "Create a centralized library of reusable UI components to reduce duplication across projects.",
        evidence: [
          "3 teams are building similar components independently",
          "Estimated 40% code duplication across frontend projects",
          "Inconsistent UX patterns confusing users",
        ],
        estimatedEffort: 10,
        expectedImpact:
          "Faster feature development and consistent user experience",
      },
      {
        title: "Improve onboarding documentation",
        description:
          "Update and expand technical documentation for new team members joining the project.",
        evidence: [
          "New developers take 3-4 weeks to become productive",
          "Last 2 hires said documentation was 'confusing and outdated'",
          "Senior devs spend ~5 hours per week helping new team members",
        ],
        estimatedEffort: 6,
        expectedImpact:
          "Faster team ramp-up and reduced burden on senior developers",
      },
      {
        title: "Implement feature flagging system",
        description:
          "Add feature flags to enable progressive rollout and A/B testing of new features.",
        evidence: [
          "Last 2 releases had to be rolled back due to issues",
          "Can't test features with subset of users safely",
          "Marketing team wants A/B testing capability",
        ],
        estimatedEffort: 7,
        expectedImpact:
          "Safer deployments and data-driven feature decisions",
      },
    ],
  },
  FOUNDER: {
    role: "FOUNDER",
    title: "Founder",
    description:
      "You're balancing product, growth, and business goals. Every decision needs to move the needle on your core metrics.",
    sampleImprovements: [
      {
        title: "Launch referral program",
        description:
          "Implement a referral system where users can invite friends and earn rewards/credits.",
        evidence: [
          "Current CAC is $45, viral coefficient could reduce this by 40%",
          "User survey shows 62% would refer if incentivized",
          "Competitors have successful referral programs (Dropbox grew 60% via referrals)",
        ],
        estimatedEffort: 8,
        expectedImpact:
          "Reduce customer acquisition cost and increase organic growth rate",
      },
      {
        title: "Add annual billing option",
        description:
          "Offer annual subscription plans at a discount to improve cash flow and retention.",
        evidence: [
          "12% of users asking about annual plans in sales calls",
          "Annual plans typically reduce churn by 30-40%",
          "Could improve runway by securing 12 months cash upfront",
        ],
        estimatedEffort: 3,
        expectedImpact:
          "Improved cash flow and reduced churn through longer commitment",
      },
      {
        title: "Build API for enterprise integrations",
        description:
          "Create public API to enable enterprise customers to integrate with their existing tools.",
        evidence: [
          "3 enterprise deals blocked on lack of API",
          "Total contract value of blocked deals: $180K ARR",
          "Integration capabilities are table stakes for enterprise segment",
        ],
        estimatedEffort: 12,
        expectedImpact: "Unlock enterprise segment and $180K+ in near-term ARR",
      },
      {
        title: "Implement analytics dashboard",
        description:
          "Add product analytics to understand user behavior and optimize conversion funnel.",
        evidence: [
          "Making product decisions based on gut feel and anecdotes",
          "Don't know where users drop off in onboarding",
          "Can't measure impact of feature releases on engagement",
        ],
        estimatedEffort: 6,
        expectedImpact:
          "Data-driven product decisions and ability to optimize key metrics",
      },
    ],
  },
};

/**
 * Get role configuration by role type
 */
export function getRoleConfig(role: OnboardingRole): RoleConfig {
  return ROLE_CONFIGS[role];
}

/**
 * Get all available roles for selection
 */
export function getAvailableRoles(): RoleConfig[] {
  return Object.values(ROLE_CONFIGS);
}
