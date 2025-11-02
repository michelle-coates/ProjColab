import type { Category, SocraticQuestion } from './conversation-engine';

/**
 * Fallback Question Bank
 * Predefined Socratic questions organized by category for when Claude API is unavailable
 * These questions follow the same evidence-focused approach as Claude-generated questions
 */

const UI_UX_QUESTIONS: SocraticQuestion[] = [
  {
    question: "Who specifically experiences the pain point this UI improvement addresses?",
    context: "Understanding beneficiaries helps prioritize based on user base size and strategic importance.",
    evidenceType: ['USER_FEEDBACK', 'SUPPORT_TICKETS'],
    followUpPrompts: ["All users or specific roles?", "New vs. existing users?", "Check user survey data"],
    reasoning: "Identifies scope and strategic value by understanding the affected user base",
  },
  {
    question: "How often do users encounter this UI issue? Daily? Weekly? Occasionally?",
    context: "Frequency data from analytics or support tickets reveals actual impact scale.",
    evidenceType: ['ANALYTICS', 'SUPPORT_TICKETS'],
    followUpPrompts: ["Check heatmaps or session recordings", "Review support ticket frequency", "Analyze user behavior data"],
    reasoning: "Frequency indicates priority urgency and potential impact magnitude",
  },
  {
    question: "What evidence shows this UI issue affects user satisfaction or task completion?",
    context: "Connecting UI problems to outcomes justifies prioritization investment.",
    evidenceType: ['ANALYTICS', 'USER_FEEDBACK'],
    followUpPrompts: ["Survey responses?", "Usability test findings?", "Completion rate drops?"],
    reasoning: "Links UI change to measurable business impact",
  },
  {
    question: "Can you describe the current user workflow and where this improvement fits in?",
    context: "Understanding the broader user journey helps assess the improvement's strategic placement.",
    evidenceType: ['USER_FEEDBACK', 'ANALYTICS'],
    followUpPrompts: ["Which step causes friction?", "What do users do instead?", "Review user flow analytics"],
    reasoning: "Maps improvement to user journey to identify leverage points",
  },
  {
    question: "What would success look like for this UI change? How would you measure it?",
    context: "Defining measurable success criteria enables future validation of the improvement's impact.",
    evidenceType: ['ANALYTICS', 'ASSUMPTIONS'],
    followUpPrompts: ["Reduced support tickets?", "Higher completion rates?", "Improved satisfaction scores?"],
    reasoning: "Establishes concrete metrics for validating improvement effectiveness",
  },
];

const DATA_QUALITY_QUESTIONS: SocraticQuestion[] = [
  {
    question: "Who relies on this data, and how do inaccuracies affect their decisions?",
    context: "Understanding data consumers and impacts reveals the business cost of poor data quality.",
    evidenceType: ['USER_FEEDBACK', 'SUPPORT_TICKETS'],
    followUpPrompts: ["Which teams are affected?", "What decisions are impacted?", "Check incident reports"],
    reasoning: "Connects data quality to business decision-making impact",
  },
  {
    question: "How frequently does this data quality issue occur? Can you quantify it?",
    context: "Frequency and scale data help prioritize which data quality issues to fix first.",
    evidenceType: ['ANALYTICS', 'SUPPORT_TICKETS'],
    followUpPrompts: ["Check error logs", "Review data validation reports", "Analyze anomaly frequency"],
    reasoning: "Quantifies the problem's occurrence rate for impact assessment",
  },
  {
    question: "What's the current workaround, and how much time does it consume?",
    context: "Understanding manual workarounds reveals hidden costs and opportunity for efficiency gains.",
    evidenceType: ['USER_FEEDBACK', 'ASSUMPTIONS'],
    followUpPrompts: ["Who performs the workaround?", "Time spent per occurrence?", "Survey affected users"],
    reasoning: "Identifies hidden operational costs from poor data quality",
  },
  {
    question: "Has this data quality issue caused any specific incidents or errors recently?",
    context: "Concrete incidents provide strong evidence for prioritization urgency.",
    evidenceType: ['SUPPORT_TICKETS', 'USER_FEEDBACK'],
    followUpPrompts: ["Check incident logs", "Review error reports", "Ask stakeholders for examples"],
    reasoning: "Establishes urgency through concrete impact examples",
  },
  {
    question: "What's the source of this data quality problem? Is it a systemic issue?",
    context: "Understanding root causes helps assess whether fixing this improves multiple downstream issues.",
    evidenceType: ['ANALYTICS', 'ASSUMPTIONS'],
    followUpPrompts: ["Data entry errors?", "System integration issues?", "Lack of validation?"],
    reasoning: "Identifies whether fix has cascading benefits to other systems",
  },
];

const WORKFLOW_QUESTIONS: SocraticQuestion[] = [
  {
    question: "Which team members or roles are affected by this workflow bottleneck?",
    context: "Understanding who's impacted reveals the scope and potential productivity gains.",
    evidenceType: ['USER_FEEDBACK', 'SUPPORT_TICKETS'],
    followUpPrompts: ["How many people affected?", "Which departments?", "Check team feedback"],
    reasoning: "Scopes the improvement to quantify potential productivity impact",
  },
  {
    question: "How much time does this workflow inefficiency add to each occurrence?",
    context: "Time data enables ROI calculation for the improvement investment.",
    evidenceType: ['USER_FEEDBACK', 'ANALYTICS'],
    followUpPrompts: ["Minutes or hours per task?", "How many occurrences per day/week?", "Survey affected users"],
    reasoning: "Quantifies time waste for ROI calculation",
  },
  {
    question: "What triggers this workflow step? How frequently does it occur?",
    context: "Frequency determines the cumulative impact of any efficiency gain.",
    evidenceType: ['ANALYTICS', 'USER_FEEDBACK'],
    followUpPrompts: ["Daily? Weekly? Occasional?", "Check workflow analytics", "Review task completion data"],
    reasoning: "Establishes frequency multiplier for impact assessment",
  },
  {
    question: "Is this workflow blocker preventing other work from progressing?",
    context: "Dependency blockers have cascading impacts beyond their direct time cost.",
    evidenceType: ['USER_FEEDBACK', 'SUPPORT_TICKETS'],
    followUpPrompts: ["What gets delayed?", "Who's waiting?", "Check project timelines"],
    reasoning: "Identifies whether improvement removes critical path bottleneck",
  },
  {
    question: "How would improving this workflow affect your team's capacity or throughput?",
    context: "Capacity gains translate to measurable business value in completed work.",
    evidenceType: ['ASSUMPTIONS', 'USER_FEEDBACK'],
    followUpPrompts: ["More tasks completed?", "Faster project delivery?", "Reduced overtime?"],
    reasoning: "Links workflow improvement to business capacity metrics",
  },
];

const BUG_FIX_QUESTIONS: SocraticQuestion[] = [
  {
    question: "How many users or transactions are affected by this bug?",
    context: "Scale of impact determines urgency for bug fixes.",
    evidenceType: ['ANALYTICS', 'SUPPORT_TICKETS'],
    followUpPrompts: ["All users or specific segment?", "Check error logs", "Review impact metrics"],
    reasoning: "Quantifies the bug's reach to assess priority",
  },
  {
    question: "How frequently does this bug occur? Is it reproducible every time?",
    context: "Frequency and reproducibility affect both impact severity and fix difficulty.",
    evidenceType: ['ANALYTICS', 'SUPPORT_TICKETS'],
    followUpPrompts: ["Always? Intermittent?", "Specific conditions?", "Check error rate trends"],
    reasoning: "Establishes occurrence pattern for impact and fix planning",
  },
  {
    question: "What workarounds are users employing? Does the bug block critical functionality?",
    context: "Whether users can work around the issue affects its priority classification.",
    evidenceType: ['USER_FEEDBACK', 'SUPPORT_TICKETS'],
    followUpPrompts: ["Complete blocker?", "Annoying but manageable?", "Check support escalations"],
    reasoning: "Determines severity based on user ability to accomplish goals",
  },
  {
    question: "Has this bug caused any data loss, security issues, or compliance problems?",
    context: "Bugs with legal, security, or data implications require immediate attention.",
    evidenceType: ['SUPPORT_TICKETS', 'USER_FEEDBACK'],
    followUpPrompts: ["Data integrity affected?", "Security vulnerabilities?", "Check incident reports"],
    reasoning: "Identifies critical severity factors requiring immediate action",
  },
  {
    question: "When did this bug first appear? Is it getting worse or more frequent?",
    context: "Trend data helps assess whether this is a growing problem or stable issue.",
    evidenceType: ['ANALYTICS', 'SUPPORT_TICKETS'],
    followUpPrompts: ["Recent regression?", "Long-standing issue?", "Review error trends over time"],
    reasoning: "Establishes urgency based on problem trajectory",
  },
];

const FEATURE_QUESTIONS: SocraticQuestion[] = [
  {
    question: "Which users or customers have requested this feature?",
    context: "User demand provides direct evidence for feature value and market fit.",
    evidenceType: ['USER_FEEDBACK', 'SUPPORT_TICKETS'],
    followUpPrompts: ["How many requests?", "From strategic customers?", "Check feature request logs"],
    reasoning: "Validates market demand through concrete user requests",
  },
  {
    question: "How would users' work or experience change with this feature?",
    context: "Understanding the before/after state reveals the feature's value proposition.",
    evidenceType: ['USER_FEEDBACK', 'ASSUMPTIONS'],
    followUpPrompts: ["What becomes possible?", "What becomes easier?", "Survey potential users"],
    reasoning: "Defines value proposition and expected user benefit",
  },
  {
    question: "Do competitors or alternatives offer this feature? Are we losing users because of its absence?",
    context: "Competitive positioning helps assess strategic importance beyond user requests.",
    evidenceType: ['USER_FEEDBACK', 'SUPPORT_TICKETS'],
    followUpPrompts: ["Check churn reasons", "Win/loss analysis", "Review competitive research"],
    reasoning: "Establishes competitive necessity and churn risk",
  },
  {
    question: "How many users would realistically use this feature? Daily? Occasionally?",
    context: "Usage estimates help prioritize features by breadth and frequency of value delivery.",
    evidenceType: ['ANALYTICS', 'USER_FEEDBACK'],
    followUpPrompts: ["Core vs. edge case?", "Power users only?", "Survey user interest levels"],
    reasoning: "Quantifies feature reach and usage frequency for ROI",
  },
  {
    question: "How does this feature align with your product strategy and business goals?",
    context: "Strategic alignment ensures features drive toward business objectives, not just user requests.",
    evidenceType: ['ASSUMPTIONS', 'USER_FEEDBACK'],
    followUpPrompts: ["Supports which goals?", "Enables which use cases?", "Review product roadmap"],
    reasoning: "Validates strategic fit beyond immediate user demand",
  },
];

const OTHER_QUESTIONS: SocraticQuestion[] = [
  {
    question: "Who would benefit from this improvement?",
    context: "Understanding beneficiaries is the foundation for impact assessment.",
    evidenceType: ['USER_FEEDBACK', 'ASSUMPTIONS'],
    followUpPrompts: ["Internal users?", "External customers?", "Specific roles?"],
    reasoning: "Identifies stakeholders to scope improvement value",
  },
  {
    question: "How often does the situation this improvement addresses occur?",
    context: "Frequency determines the cumulative impact of the improvement.",
    evidenceType: ['ANALYTICS', 'SUPPORT_TICKETS'],
    followUpPrompts: ["Daily?", "Weekly?", "Occasional?"],
    reasoning: "Establishes occurrence rate for impact calculation",
  },
  {
    question: "What evidence supports the need for this improvement?",
    context: "Gathering concrete evidence transforms assumptions into validated priorities.",
    evidenceType: ['ANALYTICS', 'USER_FEEDBACK', 'SUPPORT_TICKETS'],
    followUpPrompts: ["User complaints?", "Usage data?", "Business metrics?"],
    reasoning: "Prompts evidence gathering to validate improvement need",
  },
  {
    question: "What would change if this improvement were implemented?",
    context: "Defining expected outcomes enables impact measurement and priority assessment.",
    evidenceType: ['ASSUMPTIONS', 'USER_FEEDBACK'],
    followUpPrompts: ["User behavior?", "Business metrics?", "Team efficiency?"],
    reasoning: "Establishes measurable success criteria",
  },
  {
    question: "Is there data or feedback that could validate the importance of this improvement?",
    context: "Identifying available data sources enables evidence-based prioritization.",
    evidenceType: ['ANALYTICS', 'USER_FEEDBACK', 'SUPPORT_TICKETS'],
    followUpPrompts: ["Check analytics", "Review feedback", "Survey stakeholders"],
    reasoning: "Guides user to evidence sources for validation",
  },
];

/**
 * Get a fallback question for a specific category and turn number
 * @param category - The improvement category
 * @param turnNumber - Which question in the sequence (0-indexed)
 * @returns A Socratic question formatted identically to Claude responses
 */
export function getFallbackQuestion(category: Category, turnNumber: number): SocraticQuestion {
  const questionSet = getQuestionSetForCategory(category);
  
  // Cycle through questions if turnNumber exceeds available questions
  const index = turnNumber % questionSet.length;
  
  return questionSet[index]!;
}

/**
 * Get the question set for a specific category
 */
function getQuestionSetForCategory(category: Category): SocraticQuestion[] {
  const questionSets: Record<Category, SocraticQuestion[]> = {
    UI_UX: UI_UX_QUESTIONS,
    DATA_QUALITY: DATA_QUALITY_QUESTIONS,
    WORKFLOW: WORKFLOW_QUESTIONS,
    BUG_FIX: BUG_FIX_QUESTIONS,
    FEATURE: FEATURE_QUESTIONS,
    OTHER: OTHER_QUESTIONS,
  };

  return questionSets[category] || OTHER_QUESTIONS;
}

/**
 * Get the total number of questions available for a category
 */
export function getQuestionCount(category: Category): number {
  return getQuestionSetForCategory(category).length;
}
