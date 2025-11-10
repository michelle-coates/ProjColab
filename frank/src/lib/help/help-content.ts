/**
 * Help Content Database
 * Story 1.10: Centralized help content for all features
 */

export interface HelpContent {
  id: string;
  title: string;
  content: string;
  learnMoreUrl?: string;
  category: string;
  keywords: string[];
}

/**
 * Help content for all major workflows
 */
export const helpContent: Record<string, HelpContent> = {
  // Improvement Capture
  "improvement-title": {
    id: "improvement-title",
    title: "Writing Good Improvement Titles",
    content: "A good title is clear and concise. Think of it as a headline - it should tell someone what needs to improve in 5-10 words.",
    category: "improvement-capture",
    keywords: ["title", "improvement", "create", "add"],
  },
  "improvement-description": {
    id: "improvement-description",
    title: "Describing Improvements",
    content: "Include what needs to change, why it matters, and who it affects. Specific examples help the AI ask better questions.",
    category: "improvement-capture",
    keywords: ["description", "improvement", "details", "specific"],
  },
  "improvement-category": {
    id: "improvement-category",
    title: "Choosing Categories",
    content: "Categories help organize your improvements. Pick the one that best fits - you can always change it later.",
    category: "improvement-capture",
    keywords: ["category", "type", "classification"],
  },
  "completeness-score": {
    id: "completeness-score",
    title: "Completeness Score",
    content: "This score shows how much context you've provided. Higher scores help the AI generate better questions and recommendations.",
    category: "improvement-capture",
    keywords: ["score", "quality", "completeness"],
  },

  // Evidence Gathering
  "evidence-what": {
    id: "evidence-what",
    title: "What is Evidence?",
    content: "Evidence is anything that supports why this improvement matters - user feedback, metrics, support tickets, or observations.",
    category: "evidence",
    keywords: ["evidence", "support", "data", "proof"],
  },
  "evidence-source": {
    id: "evidence-source",
    title: "Evidence Sources",
    content: "The source tells us where this evidence came from. Examples: 'User feedback survey', 'Analytics dashboard', or 'Support ticket #123'.",
    category: "evidence",
    keywords: ["source", "where", "from"],
  },

  // Effort Estimation
  "effort-levels": {
    id: "effort-levels",
    title: "Effort Levels Explained",
    content: "Small: Hours to a day. Medium: Days to a week. Large: Weeks or more. These are rough estimates - the AI will help you calibrate.",
    category: "effort",
    keywords: ["effort", "estimate", "size", "small", "medium", "large"],
  },
  "effort-rationale": {
    id: "effort-rationale",
    title: "Why Explain Your Estimate?",
    content: "Your rationale helps others understand your thinking and makes it easier to revisit estimates later when you learn more.",
    category: "effort",
    keywords: ["rationale", "reasoning", "why"],
  },

  // Pairwise Comparison
  "pairwise-what": {
    id: "pairwise-what",
    title: "Pairwise Comparison",
    content: "We show you two improvements at a time and ask which has more impact. This is faster and more accurate than ranking many items at once.",
    category: "comparison",
    keywords: ["pairwise", "compare", "comparison", "ranking"],
  },
  "pairwise-confidence": {
    id: "pairwise-confidence",
    title: "Confidence Level",
    content: "How sure are you about this comparison? Higher confidence means you have clear reasons; lower means you're less certain.",
    category: "comparison",
    keywords: ["confidence", "sure", "certain"],
  },

  // Matrix Visualization
  "matrix-what": {
    id: "matrix-what",
    title: "Impact vs. Effort Matrix",
    content: "This chart shows all your improvements plotted by impact (how much value they deliver) and effort (how hard they are to do).",
    category: "matrix",
    keywords: ["matrix", "chart", "visualization", "impact", "effort"],
  },
  "matrix-quadrants": {
    id: "matrix-quadrants",
    title: "Matrix Quadrants",
    content: "Top-left (high impact, low effort) are 'quick wins'. Bottom-right (low impact, high effort) should be reconsidered. The AI can help interpret your matrix.",
    category: "matrix",
    keywords: ["quadrants", "quick wins", "strategic"],
  },

  // Export
  "export-formats": {
    id: "export-formats",
    title: "Export Formats",
    content: "CSV works great for spreadsheets and project management tools. JSON is for technical integrations. Pick what works for your team.",
    category: "export",
    keywords: ["export", "download", "format", "csv", "json"],
  },

  // Onboarding
  "role-selection": {
    id: "role-selection",
    title: "Choosing Your Role",
    content: "Your role helps us personalize your experience. Product managers get strategic views, developers get technical insights, etc.",
    category: "onboarding",
    keywords: ["role", "persona", "who", "job"],
  },

  // Sessions
  "session-what": {
    id: "session-what",
    title: "Prioritization Sessions",
    content: "A session is a focused prioritization effort. You might create separate sessions for different projects, teams, or time periods.",
    category: "sessions",
    keywords: ["session", "what", "workspace"],
  },
};

/**
 * Search help content by keyword
 */
export function searchHelpContent(query: string): HelpContent[] {
  const lowerQuery = query.toLowerCase();

  return Object.values(helpContent).filter((content) =>
    content.keywords.some((keyword) => keyword.includes(lowerQuery)) ||
    content.title.toLowerCase().includes(lowerQuery) ||
    content.content.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get help content by ID
 */
export function getHelpContent(id: string): HelpContent | undefined {
  return helpContent[id];
}

/**
 * Get help content by category
 */
export function getHelpByCategory(category: string): HelpContent[] {
  return Object.values(helpContent).filter((content) =>
    content.category === category
  );
}
