# Frank Architecture Document

**Author:** Winston (Architect)  
**Date:** November 1, 2025  
**Project:** Frank - AI-Powered Micro-Improvement Prioritization Platform  
**Version:** 1.0  

---

## Executive Summary

Frank is a web-first AI-powered SaaS platform that transforms product decision-making for startup teams through evidence-based prioritization using Socratic questioning. The architecture leverages the T3 Stack foundation with Claude AI integration to support progressive UX complexity from guided learning to power-user efficiency.

**Core Value Proposition:** "Think with me. We'll figure it out." - Frank serves as an intelligent thinking partner that challenges assumptions and builds evidence systematically while preserving user decision-making authority.

---

## Project Initialization

**First Implementation Story:** Project setup using T3 Stack

```bash
npm create t3-app@latest frank --nextAuth --prisma --tailwind --trpc --typescript
cd frank
npm install @anthropic-ai/sdk
npm install @vercel/blob
```

**Foundation Provided by T3 Stack:**
- Next.js 15 with App Router - Full-stack React framework
- TypeScript - Type safety across entire application  
- Tailwind CSS - Utility-first CSS matching UX design system
- tRPC - End-to-end type-safe APIs for AI data flow
- Prisma - Type-safe database ORM for complex data relationships
- NextAuth.js - Authentication framework supporting freemium model

---

## Decision Summary Table

| Category | Decision | Version/Provider | Epic Mapping | Rationale |
|----------|----------|------------------|--------------|-----------|
| **Foundation** | T3 Stack | Latest | All Epics | Full-stack TypeScript, proven SaaS patterns |
| **Frontend Framework** | Next.js | 15.x | All Epics | App Router, Server Components, optimal for AI UX |
| **AI Integration** | Claude API | 4.5 Sonnet | Epics 1,2,5 | Superior analytical reasoning for Socratic questioning |
| **Database** | PostgreSQL | 16.x | All Epics | Complex queries for clustering, enterprise-ready |
| **ORM** | Prisma | 5.x | All Epics | Type-safe, handles complex Frank data relationships |
| **API Layer** | tRPC | 10.x | All Epics | End-to-end type safety for AI conversations |
| **Authentication** | NextAuth.js | 4.x | Epics 1,3,4 | Supports Email + Google + GitHub OAuth |
| **Styling** | Tailwind CSS | 3.x | All Epics | Matches UX spec, utility-first approach |
| **UI Components** | shadcn/ui | Latest | All Epics | Professional design system with accessibility |
| **File Storage** | Vercel Blob | Latest | Epics 1,2 | Evidence attachments, edge-distributed |
| **Real-time** | tRPC Subscriptions | Built-in | Epic 3 | Live team collaboration for comparisons |
| **Deployment** | Vercel | Latest | All Epics | Seamless Next.js hosting with edge functions |

---

## Complete Project Structure

```
frank/
├── prisma/
│   ├── schema.prisma              # Database models and relationships
│   └── migrations/                # Database migration history
├── src/
│   ├── app/                       # Next.js App Router pages
│   │   ├── (auth)/               # Authentication routes
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   ├── dashboard/            # Main Frank dashboard
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── session/              # Prioritization sessions
│   │   │   ├── [sessionId]/
│   │   │   │   ├── page.tsx      # Session interface
│   │   │   │   ├── evidence/     # Evidence gathering flow
│   │   │   │   └── comparison/   # Pairwise comparison flow
│   │   │   └── new/
│   │   ├── team/                 # Team collaboration (Epic 3)
│   │   │   ├── [teamId]/
│   │   │   │   ├── workspace/
│   │   │   │   └── settings/
│   │   │   └── create/
│   │   ├── analytics/            # Business intelligence (Epic 4)
│   │   │   ├── dashboard/
│   │   │   └── reports/
│   │   ├── admin/                # Enterprise features (Epic 4)
│   │   │   ├── users/
│   │   │   ├── billing/
│   │   │   └── audit/
│   │   ├── api/                  # API routes and webhooks
│   │   │   ├── webhooks/
│   │   │   │   └── slack/
│   │   │   └── trpc/[trpc]/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/               # Reusable UI components
│   │   ├── ui/                   # shadcn/ui base components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ... (40+ components)
│   │   ├── frank/                # Custom Frank components
│   │   │   ├── evidence-confidence-visualizer.tsx
│   │   │   ├── pairwise-comparison-interface.tsx
│   │   │   ├── strategic-clustering-display.tsx
│   │   │   ├── ai-conversation-bubbles.tsx
│   │   │   └── progress-indicators.tsx
│   │   ├── layouts/              # Layout components
│   │   │   ├── dashboard-layout.tsx
│   │   │   ├── session-layout.tsx
│   │   │   └── team-layout.tsx
│   │   └── providers/            # Context providers
│   │       ├── auth-provider.tsx
│   │       ├── theme-provider.tsx
│   │       └── trpc-provider.tsx
│   ├── server/                   # Server-side code
│   │   ├── api/                  # tRPC routers
│   │   │   ├── routers/
│   │   │   │   ├── improvements.ts    # Core improvement management
│   │   │   │   ├── conversations.ts   # AI conversation handling
│   │   │   │   ├── decisions.ts       # Decision tracking
│   │   │   │   ├── teams.ts          # Team management (Epic 3)
│   │   │   │   ├── collaboration.ts   # Real-time features (Epic 3)
│   │   │   │   ├── analytics.ts      # Usage metrics (Epic 4)
│   │   │   │   ├── billing.ts        # Subscription management (Epic 4)
│   │   │   │   └── ai-optimization.ts # Advanced AI (Epic 5)
│   │   │   ├── root.ts           # Root router
│   │   │   └── trpc.ts           # tRPC configuration
│   │   ├── auth.ts               # NextAuth configuration
│   │   └── db.ts                 # Database connection
│   ├── lib/                      # Shared libraries and utilities
│   │   ├── ai/                   # AI integration modules
│   │   │   ├── claude/
│   │   │   │   ├── conversation-engine.ts    # Socratic questioning logic
│   │   │   │   ├── response-parser.ts        # Claude response processing
│   │   │   │   └── fallback-questions.ts     # Backup question sets
│   │   │   ├── clustering/
│   │   │   │   ├── semantic-grouping.ts      # Improvement clustering
│   │   │   │   └── theme-identification.ts   # Strategic theme discovery
│   │   │   ├── analytics/
│   │   │   │   ├── evidence-scoring.ts       # Confidence calculations
│   │   │   │   ├── decision-tracking.ts      # Decision rationale capture
│   │   │   │   └── strategic-alignment.ts    # Business goal correlation
│   │   │   └── optimization/               # Epic 5 - Advanced AI
│   │   │       ├── learning-engine.ts        # Adaptive AI behavior
│   │   │       ├── predictive-analytics.ts   # Outcome prediction
│   │   │       ├── recommendation-engine.ts  # Smart suggestions
│   │   │       └── personalization.ts       # User-specific adaptations
│   │   ├── integrations/         # External service integrations
│   │   │   ├── slack/
│   │   │   │   ├── bot-handlers.ts
│   │   │   │   └── webhook-processor.ts
│   │   │   ├── export/
│   │   │   │   ├── csv-generator.ts
│   │   │   │   ├── notion-integration.ts
│   │   │   │   └── jira-integration.ts
│   │   │   └── storage/
│   │   │       ├── vercel-blob.ts
│   │   │       └── evidence-uploader.ts
│   │   ├── metrics/              # Business intelligence (Epic 4)
│   │   │   ├── usage-tracking.ts
│   │   │   ├── decision-analytics.ts
│   │   │   └── business-impact.ts
│   │   ├── compliance/           # Enterprise features (Epic 4)
│   │   │   ├── audit-logging.ts
│   │   │   ├── data-retention.ts
│   │   │   └── security-controls.ts
│   │   ├── auth.ts               # Authentication helpers
│   │   ├── db.ts                 # Database utilities
│   │   ├── utils.ts              # General utilities
│   │   ├── validations.ts        # Zod schemas
│   │   └── constants.ts          # Application constants
│   ├── styles/                   # Styling and themes
│   │   ├── globals.css
│   │   └── components.css
│   ├── types/                    # TypeScript type definitions
│   │   ├── ai.ts                 # AI-related types
│   │   ├── database.ts           # Database types
│   │   ├── api.ts                # API types
│   │   └── ui.ts                 # UI component types
│   └── hooks/                    # Custom React hooks
│       ├── use-conversation.ts   # AI conversation state
│       ├── use-evidence.ts       # Evidence management
│       ├── use-collaboration.ts  # Real-time collaboration
│       └── use-analytics.ts      # Analytics data
├── public/                       # Static assets
│   ├── icons/
│   ├── images/
│   └── docs/
├── docs/                         # Documentation
│   ├── api.md
│   ├── deployment.md
│   └── contributing.md
├── .env.local                    # Environment variables
├── .env.example                  # Environment template
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies and scripts
└── README.md                     # Project documentation
```

---

## Epic to Architecture Mapping

### **Epic 1: Foundation & Core Prioritization Engine**
**Architecture Components:**
- `src/app/dashboard/` - Main user interface
- `src/app/session/` - Prioritization session management
- `src/components/frank/` - Core Frank UI components
- `src/server/api/routers/improvements.ts` - Improvement CRUD operations
- `src/server/api/routers/conversations.ts` - AI conversation management
- `src/server/api/routers/decisions.ts` - Decision tracking
- `src/lib/ai/claude/` - Claude integration for Socratic questioning
- `src/lib/ai/analytics/` - Evidence scoring and confidence tracking

**Key Database Models:** User, ImprovementItem, EvidenceEntry, AIConversation, DecisionRecord

### **Epic 2: Intelligence & Visualization Platform**
**Architecture Components:**
- `src/lib/ai/clustering/` - Semantic grouping algorithms
- `src/lib/ai/analytics/strategic-alignment.ts` - Business goal correlation
- `src/components/frank/strategic-clustering-display.tsx` - Visualization UI
- Enhanced conversation engine with strategic questioning

**Key Database Models:** ClusterTheme, StrategyAlignment, BusinessObjective

### **Epic 3: Team Collaboration & Integration Hub**
**Architecture Components:**
- `src/app/team/` - Team workspace interfaces
- `src/server/api/routers/teams.ts` - Team management
- `src/server/api/routers/collaboration.ts` - Real-time features using tRPC subscriptions
- `src/lib/integrations/slack/` - Slack bot integration
- `src/lib/integrations/export/` - Export to external tools

**Key Database Models:** Team, Workspace, CollaborationSession, SlackIntegration

### **Epic 4: Business Intelligence & Enterprise Features**
**Architecture Components:**
- `src/app/analytics/` - Business intelligence dashboards
- `src/app/admin/` - Enterprise administration
- `src/server/api/routers/analytics.ts` - Usage metrics and insights
- `src/server/api/routers/billing.ts` - Subscription management
- `src/lib/metrics/` - Business intelligence calculations
- `src/lib/compliance/` - Enterprise security and audit logging

**Key Database Models:** UsageMetrics, BillingSubscription, AuditLog, ComplianceRecord

### **Epic 5: Advanced AI & Optimization Platform**
**Architecture Components:**
- `src/lib/ai/optimization/` - Advanced AI capabilities
- `src/server/api/routers/ai-optimization.ts` - ML-powered features
- Enhanced conversation engine with learning capabilities
- Predictive analytics and recommendation systems

**Key Database Models:** UserBehaviorPattern, PredictiveModel, RecommendationEngine

---

## Technology Stack Details

### **Core Framework: Next.js 15**
- **App Router:** File-based routing supporting Frank's progressive UX complexity
- **Server Components:** Optimized for AI conversation rendering
- **API Routes:** Webhooks for Slack integration and external services
- **Edge Functions:** Real-time collaboration with global distribution

### **AI Integration: Claude API**
- **Model:** Claude 4.5 Sonnet (claude-sonnet-4-20250514)
- **Use Cases:** Socratic questioning, evidence analysis, strategic insights
- **Rate Limiting:** Built-in fallback to predefined questions
- **Cost Optimization:** Conversation context management and response caching

### **Database: PostgreSQL + Prisma**
- **Prisma Schema:** Type-safe models for complex Frank data relationships
- **Connection Pooling:** Optimized for serverless deployment
- **Migrations:** Version-controlled database evolution
- **Query Optimization:** Indexed fields for evidence search and clustering

### **Authentication: NextAuth.js**
- **Providers:** Email/Password, Google OAuth, GitHub OAuth
- **Session Management:** JWT tokens with role-based access control
- **Freemium Support:** User tier enforcement (FREE/TEAM/ENTERPRISE)
- **Enterprise Features:** SAML/LDAP integration ready for Epic 4

### **Real-time: tRPC Subscriptions**
- **WebSocket Layer:** Live team collaboration and decision sharing
- **Type Safety:** End-to-end TypeScript for AI conversations
- **Subscription Management:** Automatic cleanup and reconnection
- **State Synchronization:** Optimistic updates with conflict resolution

---

## Integration Points

### **AI ↔ Database Integration**
```typescript
// Claude conversations stored for learning and context
interface AIConversation {
  sessionId: string
  improvementId: string
  turns: ConversationTurn[]
  insights: GeneratedInsight[]
  evidenceDiscovered: EvidenceEntry[]
  claudeModel: string
  tokenUsage: number
}
```

### **Real-time ↔ UI Integration**
```typescript
// tRPC subscriptions update React components instantly
const collaborationSubscription = api.collaboration.subscribeToSession.useSubscription(
  { sessionId },
  {
    onData: (update) => {
      // Update UI state immediately
      setCollaborationState(update)
    }
  }
)
```

### **Auth ↔ Features Integration**
```typescript
// Feature gating based on user tier
const createAdvancedSession = api.sessions.createAdvanced.useMutation({
  onError: (error) => {
    if (error.code === 'FEATURE_REQUIRES_UPGRADE') {
      // Show upgrade modal
    }
  }
})
```

### **Storage ↔ Evidence Integration**
```typescript
// Evidence attachments flow through Vercel Blob
const evidenceUpload = async (file: File, improvementId: string) => {
  const blob = await put(`evidence/${improvementId}/${file.name}`, file, {
    access: 'public',
  })
  
  await db.evidenceEntry.create({
    data: {
      improvementId,
      fileUrl: blob.url,
      source: 'user-upload',
      type: 'attachment'
    }
  })
}
```

---

## Novel Pattern Designs

### **AI Socratic Interrogation Pattern**
**Purpose:** Structured conversation that builds evidence systematically while preserving user agency

**Components:**
- **ConversationEngine:** Manages question flow and context
- **EvidenceTracker:** Monitors confidence levels and gaps
- **InsightGenerator:** Identifies key realizations from responses
- **FallbackHandler:** Graceful degradation when AI unavailable

**Implementation:**
```typescript
interface SocraticConversation {
  phase: 'discovery' | 'evidence-gathering' | 'assumption-testing' | 'synthesis'
  context: ConversationContext
  questions: QuestionQueue
  evidenceState: EvidenceConfidenceState
  userExpertise: 'beginner' | 'intermediate' | 'expert'
}

class ConversationEngine {
  async generateNextQuestion(conversation: SocraticConversation): Promise<SocraticQuestion> {
    const claudeResponse = await this.claude.generateQuestion({
      improvement: conversation.context.improvement,
      conversationHistory: conversation.questions.history,
      evidenceGaps: conversation.evidenceState.gaps,
      userLevel: conversation.userExpertise
    })
    
    return this.parseAndValidateQuestion(claudeResponse)
  }
}
```

### **Progressive UX Complexity Pattern**
**Purpose:** Interface adapts from guided learning to power-user efficiency

**Flow:** Split Context Panel → Evidence Builder → Power User Dense

**Implementation:**
```typescript
interface UXComplexityState {
  currentMode: 'split-context' | 'evidence-builder' | 'power-user'
  userConfidence: number
  sessionsCompleted: number
  expertiseIndicators: string[]
}

const determineOptimalInterface = (state: UXComplexityState): InterfaceMode => {
  if (state.sessionsCompleted < 3 || state.userConfidence < 0.7) {
    return 'split-context' // Guided learning
  }
  if (state.sessionsCompleted < 10 || state.userConfidence < 0.9) {
    return 'evidence-builder' // Systematic building
  }
  return 'power-user' // Efficient workflow
}
```

---

## Implementation Patterns

### **Naming Conventions**
```typescript
// File naming: kebab-case
evidence-confidence-visualizer.tsx
strategic-clustering-display.tsx
ai-conversation-bubbles.tsx

// Component naming: PascalCase
<EvidenceConfidenceVisualizer />
<StrategicClusteringDisplay />
<AIConversationBubbles />

// Hook naming: camelCase with 'use' prefix
useConversationState()
useEvidenceTracking()
useCollaborationSync()

// Database models: PascalCase singular
User, Team, ImprovementItem, EvidenceEntry, AIConversation

// API routes: resource.action pattern
improvements.create()
conversations.generateQuestions()
teams.collaboration.startSession()
```

### **API Response Format**
```typescript
// Success response
interface APISuccess<T> {
  success: true
  data: T
  metadata?: {
    confidence?: number          // For AI-generated content
    reasoning?: string          // AI decision rationale
    evidenceStrength?: number   // Frank-specific scoring
  }
}

// Error response
interface APIError {
  success: false
  error: {
    code: 'INSUFFICIENT_EVIDENCE' | 'CLAUDE_API_ERROR' | 'VALIDATION_FAILED'
    message: string
    field?: string             // For validation errors
    suggestion?: string        // Frank-style guidance
  }
}
```

### **Database Consistency Patterns**
```typescript
// Audit trail for all decisions
model DecisionRecord {
  id              String   @id @default(cuid())
  improvementId   String
  comparedAgainst String?  // Other improvement ID for pairwise
  chosenReason    String   // User's rationale
  evidenceUsed    Json     // Evidence that influenced decision
  confidenceLevel Int      // 1-10 scale
  questionsAsked  Json     // Claude questions that led to decision
  aiInsights      Json     // Generated insights
  createdAt       DateTime @default(now())
  createdBy       String   // User ID
}

// Evidence tracking with source attribution
model EvidenceEntry {
  id            String   @id @default(cuid())
  improvementId String
  content       String
  source        SourceType // 'analytics' | 'support-tickets' | 'user-feedback' | 'assumptions'
  confidence    Float    // 0.0 - 1.0 confidence score
  addedBy       String   // User ID
  validatedBy   String?  // Team validation
  createdAt     DateTime @default(now())
}
```

### **Error Handling Strategy**
```typescript
// Claude API resilience
async function generateSocraticQuestion(context: QuestionContext): Promise<Result<SocraticQuestion>> {
  try {
    const response = await claude.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: buildPrompt(context) }]
    })
    return { success: true, data: parseClaudeResponse(response) }
  } catch (error) {
    if (error.code === 'RATE_LIMIT_EXCEEDED') {
      // Graceful degradation to predefined questions
      return { success: true, data: getFallbackQuestion(context) }
    }
    return { 
      success: false, 
      error: { 
        code: 'CLAUDE_API_ERROR', 
        message: 'AI is taking a moment to think. Let\'s continue with a guided question.',
        suggestion: 'Try describing what evidence you have so far'
      }
    }
  }
}
```

---

## Data Architecture

### **Core Data Models**
```typescript
// User and Team Management
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String?
  role        UserRole @default(FREE)
  teams       TeamMember[]
  sessions    PrioritizationSession[]
  decisions   DecisionRecord[]
  createdAt   DateTime @default(now())
}

model Team {
  id          String   @id @default(cuid())
  name        String
  tier        TeamTier @default(TEAM)
  members     TeamMember[]
  workspaces  Workspace[]
  createdAt   DateTime @default(now())
}

// Core Frank Entities
model ImprovementItem {
  id              String   @id @default(cuid())
  title           String
  description     String
  category        Category
  effort          EffortLevel
  evidence        EvidenceEntry[]
  decisions       DecisionRecord[]
  strategicScore  Float?
  clusterId       String?
  cluster         ClusterTheme? @relation(fields: [clusterId], references: [id])
  createdAt       DateTime @default(now())
}

model EvidenceEntry {
  id              String   @id @default(cuid())
  improvementId   String
  improvement     ImprovementItem @relation(fields: [improvementId], references: [id])
  content         String
  source          EvidenceSource
  confidence      Float    // 0.0 - 1.0
  fileUrl         String?  // Vercel Blob URL
  addedBy         String
  createdAt       DateTime @default(now())
}

// AI Conversation Tracking
model AIConversation {
  id              String   @id @default(cuid())
  sessionId       String
  improvementId   String
  improvement     ImprovementItem @relation(fields: [improvementId], references: [id])
  turns           ConversationTurn[]
  finalInsights   Json?
  evidenceGained  Json?
  claudeModel     String   @default("claude-sonnet-4-20250514")
  tokenUsage      Int?
  duration        Int?     // Conversation time in seconds
  createdAt       DateTime @default(now())
}

// Strategic Intelligence
model ClusterTheme {
  id              String   @id @default(cuid())
  name            String
  description     String
  improvements    ImprovementItem[]
  strategicValue  Float
  confidence      Float
  createdAt       DateTime @default(now())
}

enum UserRole {
  FREE
  TEAM
  ENTERPRISE
}

enum EvidenceSource {
  ANALYTICS
  SUPPORT_TICKETS
  USER_FEEDBACK
  ASSUMPTIONS
  USER_UPLOAD
}

enum EffortLevel {
  SMALL
  MEDIUM
  LARGE
}

enum Category {
  UI_UX
  DATA_QUALITY
  WORKFLOW
  BUG_FIX
  FEATURE
  OTHER
}
```

---

## API Contracts

### **tRPC Router Structure**
```typescript
// Root router combining all feature routers
export const appRouter = createTRPCRouter({
  improvements: improvementsRouter,
  conversations: conversationsRouter,
  decisions: decisionsRouter,
  teams: teamsRouter,
  collaboration: collaborationRouter,
  analytics: analyticsRouter,
  billing: billingRouter,
  aiOptimization: aiOptimizationRouter,
})

// Example: Improvements router
export const improvementsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createImprovementSchema)
    .mutation(async ({ input, ctx }) => {
      const improvement = await ctx.db.improvementItem.create({
        data: {
          ...input,
          createdBy: ctx.session.user.id,
        },
      })
      return { success: true, data: improvement }
    }),

  getWithEvidence: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const improvement = await ctx.db.improvementItem.findUnique({
        where: { id: input.id },
        include: {
          evidence: true,
          decisions: true,
          cluster: true,
        },
      })
      if (!improvement) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
      return improvement
    }),
})

// Real-time collaboration
export const collaborationRouter = createTRPCRouter({
  subscribeToSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .subscription(async function* ({ input, ctx }) {
      // WebSocket subscription for live updates
      for await (const update of getSessionUpdates(input.sessionId)) {
        yield update
      }
    }),
})
```

### **Claude AI Integration API**
```typescript
interface ClaudeConversationAPI {
  generateQuestion(params: {
    improvement: ImprovementItem
    conversationHistory: ConversationTurn[]
    evidenceGaps: string[]
    userExpertise: UserExpertiseLevel
  }): Promise<SocraticQuestion>

  analyzeEvidence(params: {
    evidenceEntries: EvidenceEntry[]
    businessGoals: string[]
  }): Promise<EvidenceAnalysis>

  identifyInsights(params: {
    conversationTurns: ConversationTurn[]
    decisions: DecisionRecord[]
  }): Promise<GeneratedInsight[]>
}

// Example implementation
export class ClaudeConversationEngine implements ClaudeConversationAPI {
  private claude: Anthropic

  async generateQuestion(params): Promise<SocraticQuestion> {
    const prompt = this.buildSocraticPrompt(params)
    
    const response = await this.claude.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
      system: `You are Frank, an intelligent thinking partner who helps product managers make evidence-based decisions. 
               Ask Socratic questions that challenge assumptions and gather concrete evidence.
               Be curious and helpful, never prescriptive. Your role is to sharpen thinking, not make decisions.`
    })

    return this.parseQuestionResponse(response)
  }
}
```

---

## Security Architecture

### **Authentication & Authorization**
```typescript
// NextAuth configuration
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    EmailProvider({
      // Email/password authentication
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.role = user.role
        token.teamIds = user.teams?.map(t => t.teamId) ?? []
      }
      return token
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
        role: token.role,
        teamIds: token.teamIds,
      },
    }),
  },
}

// Feature gating based on user tier
export const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

export const teamProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session.user.role === 'FREE') {
    throw new TRPCError({ 
      code: "FORBIDDEN",
      message: "Team features require upgrade to Team plan"
    })
  }
  return next({ ctx })
})
```

### **Data Protection**
```typescript
// Sensitive data encryption for evidence
export const encryptEvidence = (content: string): string => {
  // Implementation using Node.js crypto
  return encrypt(content, env.EVIDENCE_ENCRYPTION_KEY)
}

// API key security for Claude integration
export const getClaudeClient = (): Anthropic => {
  if (!env.CLAUDE_API_KEY) {
    throw new Error("Claude API key not configured")
  }
  
  return new Anthropic({
    apiKey: env.CLAUDE_API_KEY,
    // Additional security headers
  })
}

// File upload validation for evidence attachments
export const validateEvidenceUpload = (file: File): ValidationResult => {
  const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf', 'text/plain']
  const maxSize = 10 * 1024 * 1024 // 10MB
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not allowed' }
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File too large (max 10MB)' }
  }
  
  return { valid: true }
}
```

---

## Performance Considerations

### **Database Optimization**
```sql
-- Critical indexes for Frank's query patterns
CREATE INDEX idx_improvements_user_created ON improvement_items(created_by, created_at DESC);
CREATE INDEX idx_evidence_improvement ON evidence_entries(improvement_id, confidence DESC);
CREATE INDEX idx_conversations_session ON ai_conversations(session_id, created_at DESC);
CREATE INDEX idx_decisions_user_time ON decision_records(created_by, created_at DESC);

-- Full-text search for improvement clustering
CREATE INDEX idx_improvements_text_search ON improvement_items USING gin(to_tsvector('english', title || ' ' || description));
```

### **Claude API Optimization**
```typescript
// Response caching for similar questions
const questionCache = new Map<string, SocraticQuestion>()

export const generateQuestionWithCache = async (context: QuestionContext): Promise<SocraticQuestion> => {
  const cacheKey = hashContext(context)
  
  if (questionCache.has(cacheKey)) {
    return questionCache.get(cacheKey)!
  }
  
  const question = await claudeEngine.generateQuestion(context)
  questionCache.set(cacheKey, question)
  
  // Cache expires after 1 hour
  setTimeout(() => questionCache.delete(cacheKey), 3600000)
  
  return question
}

// Token usage tracking and optimization
export const trackClaudeUsage = async (sessionId: string, tokenCount: number) => {
  await db.aiConversation.update({
    where: { sessionId },
    data: { tokenUsage: { increment: tokenCount } }
  })
  
  // Alert if approaching usage limits
  const totalUsage = await getTotalMonthlyUsage()
  if (totalUsage > USAGE_WARNING_THRESHOLD) {
    await notifyAdmins("High Claude API usage detected")
  }
}
```

### **Real-time Performance**
```typescript
// Connection pooling for tRPC subscriptions
export const subscriptionManager = {
  connections: new Map<string, Set<WebSocket>>(),
  
  addConnection(sessionId: string, ws: WebSocket) {
    if (!this.connections.has(sessionId)) {
      this.connections.set(sessionId, new Set())
    }
    this.connections.get(sessionId)!.add(ws)
  },
  
  broadcast(sessionId: string, data: CollaborationUpdate) {
    const connections = this.connections.get(sessionId)
    if (connections) {
      connections.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data))
        }
      })
    }
  },
  
  cleanup() {
    // Remove closed connections
    this.connections.forEach((connections, sessionId) => {
      const activeConnections = new Set(
        Array.from(connections).filter(ws => ws.readyState === WebSocket.OPEN)
      )
      if (activeConnections.size === 0) {
        this.connections.delete(sessionId)
      } else {
        this.connections.set(sessionId, activeConnections)
      }
    })
  }
}
```

---

## Deployment Architecture

### **Vercel Configuration**
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  images: {
    domains: ["avatars.githubusercontent.com", "lh3.googleusercontent.com"],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
}

module.exports = nextConfig
```

### **Environment Configuration**
```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# AI Integration
CLAUDE_API_KEY="sk-ant-..."
CLAUDE_MODEL="claude-sonnet-4-20250514"

# Authentication
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://frank.vercel.app"

# OAuth Providers
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_ID="..."
GITHUB_SECRET="..."

# Storage
BLOB_READ_WRITE_TOKEN="..."

# Feature Flags
ENABLE_ADVANCED_AI="true"
ENABLE_ENTERPRISE_FEATURES="false"

# Monitoring
SENTRY_DSN="..."
ANALYTICS_ID="..."
```

### **Database Deployment**
```yaml
# Railway PostgreSQL configuration
version: "3.8"
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: frank
      POSTGRES_USER: frank_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

---

## Development Environment

### **Prerequisites**
- Node.js 18+ (LTS recommended)
- PostgreSQL 16+ 
- Claude API access (Pro account recommended)
- Git for version control

### **Setup Instructions**
```bash
# 1. Initialize project with T3 Stack
npm create t3-app@latest frank --nextAuth --prisma --tailwind --trpc --typescript

# 2. Install additional dependencies
cd frank
npm install @anthropic-ai/sdk @vercel/blob lucide-react

# 3. Install shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card dialog input textarea

# 4. Environment setup
cp .env.example .env.local
# Edit .env.local with your configuration

# 5. Database setup
npx prisma db push
npx prisma generate

# 6. Development server
npm run dev
```

### **Development Scripts**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "playwright test"
  }
}
```

---

## Architecture Decision Records

### **ADR-001: T3 Stack Foundation**
**Date:** November 1, 2025  
**Status:** Accepted  
**Decision:** Use T3 Stack (Next.js + TypeScript + Tailwind + tRPC + Prisma + NextAuth) as foundation  
**Rationale:** Provides type-safe full-stack development optimized for SaaS applications with complex AI integration requirements  
**Consequences:** 
- ✅ End-to-end type safety reduces AI agent implementation errors
- ✅ Proven patterns for auth, database, and API layers
- ✅ Excellent developer experience and documentation
- ⚠️ Learning curve for developers unfamiliar with tRPC

### **ADR-002: Claude API for AI Integration**
**Date:** November 1, 2025  
**Status:** Accepted  
**Decision:** Use Anthropic Claude 4.5 Sonnet for conversational AI and Socratic questioning  
**Rationale:** Superior analytical reasoning capabilities essential for Frank's evidence-based prioritization approach  
**Consequences:**
- ✅ High-quality Socratic questioning and insight generation
- ✅ Better at challenging assumptions than alternatives
- ✅ User already has Pro license, reducing cost concerns
- ⚠️ External API dependency requires fallback strategies
- ⚠️ Usage costs scale with user engagement

### **ADR-003: PostgreSQL with Prisma ORM**
**Date:** November 1, 2025  
**Status:** Accepted  
**Decision:** PostgreSQL as primary database with Prisma ORM for type-safe data access  
**Rationale:** Complex relational data model for evidence, decisions, and AI conversations requires robust SQL database  
**Consequences:**
- ✅ Full ACID compliance for financial/audit requirements
- ✅ Complex queries for clustering and analytics
- ✅ Prisma provides type safety and migration management
- ⚠️ Higher infrastructure costs than NoSQL alternatives

### **ADR-004: tRPC Subscriptions for Real-time**
**Date:** November 1, 2025  
**Status:** Accepted  
**Decision:** Use tRPC subscriptions for real-time team collaboration features  
**Rationale:** Maintains end-to-end type safety while providing WebSocket functionality for live decision-making  
**Consequences:**
- ✅ Type-safe real-time updates
- ✅ Integrated with existing tRPC API layer
- ✅ Automatic reconnection and error handling
- ⚠️ WebSocket infrastructure complexity for deployment

### **ADR-005: Vercel Deployment Platform**
**Date:** November 1, 2025  
**Status:** Accepted  
**Decision:** Deploy on Vercel with Edge Functions and Blob storage  
**Rationale:** Seamless Next.js integration with global edge distribution for AI conversations  
**Consequences:**
- ✅ Zero-configuration deployment for Next.js
- ✅ Global CDN reduces latency for international users
- ✅ Integrated Blob storage for evidence attachments
- ⚠️ Vendor lock-in to Vercel ecosystem
- ⚠️ Cold start latency for serverless functions

---

## Implementation Roadmap

### **Phase 1: MVP Foundation (Epic 1)**
**Timeline:** 4-6 weeks  
**First Story:** Project initialization with T3 Stack
```bash
npm create t3-app@latest frank --nextAuth --prisma --tailwind --trpc --typescript
```

**Key Deliverables:**
- User authentication and basic profiles
- Improvement item CRUD operations
- Basic Claude AI integration for questioning
- Simple evidence gathering interface
- Pairwise comparison functionality
- CSV export capability

### **Phase 2: Intelligence Platform (Epic 2)**
**Timeline:** 3-4 weeks  
**Dependencies:** Phase 1 complete

**Key Deliverables:**
- Semantic clustering algorithms
- Advanced conversation engine
- Strategic alignment scoring
- Interactive visualization components
- Enhanced evidence confidence tracking

### **Phase 3: Team Collaboration (Epic 3)**
**Timeline:** 4-5 weeks  
**Dependencies:** Phase 1 complete

**Key Deliverables:**
- Team workspace management
- Real-time collaboration features
- Slack integration
- Export to Notion/Jira/Linear
- Asynchronous decision-making

### **Phase 4: Enterprise Features (Epic 4)**
**Timeline:** 5-6 weeks  
**Dependencies:** Phases 1-3 complete

**Key Deliverables:**
- Usage analytics and dashboards
- Billing and subscription management
- Enterprise audit logging
- Advanced user administration
- Compliance features

### **Phase 5: Advanced AI (Epic 5)**
**Timeline:** 6-8 weeks  
**Dependencies:** All previous phases

**Key Deliverables:**
- Adaptive learning algorithms
- Predictive analytics
- Advanced personalization
- Batch processing capabilities
- ML-powered recommendations

---

## Success Metrics

### **Technical Metrics**
- **API Response Time:** <200ms for 95th percentile
- **Claude Integration Uptime:** >99.5% with fallback coverage
- **Database Query Performance:** <50ms for evidence retrieval
- **Real-time Latency:** <100ms for collaboration updates
- **Type Safety Coverage:** 100% TypeScript strict mode compliance

### **User Experience Metrics**
- **Session Completion Rate:** >90% for guided prioritization
- **Evidence Quality Improvement:** Measurable increase in evidence-to-assumption ratio
- **User Confidence Increase:** Self-reported confidence scores trending upward
- **Feature Adoption:** Progressive complexity adoption (Split Context → Power User)
- **Team Collaboration Success:** Consensus reached in <30 minutes for team sessions

### **Business Metrics**
- **User Retention:** >80% monthly active users after onboarding
- **Upgrade Conversion:** >15% free-to-paid conversion within 90 days
- **Support Ticket Reduction:** <5% of users require support intervention
- **Decision Quality:** Retrospective analysis shows improved outcomes vs. gut-feel prioritization

---

## Conclusion

This architecture provides a solid foundation for Frank's mission to transform product decision-making through AI-powered evidence-based prioritization. The T3 Stack foundation ensures type safety and developer productivity, while Claude integration delivers the sophisticated reasoning capabilities that differentiate Frank from traditional prioritization tools.

The progressive UX complexity pattern allows users to grow from guided learning to power-user efficiency, while the comprehensive data model supports both individual insight generation and team collaboration. Real-time collaboration through tRPC subscriptions and enterprise-grade features position Frank for scaling from individual PMs to large product organizations.

**Next Steps:**
1. Execute project initialization using the documented T3 Stack setup
2. Implement Epic 1 stories in sequence, starting with authentication and basic improvement management
3. Integrate Claude API with robust error handling and fallback strategies
4. Build and test core evidence gathering and comparison interfaces
5. Deploy MVP to Vercel for user validation and feedback

The architecture is designed to support Frank's core value proposition: "Think with me. We'll figure it out." - creating an intelligent thinking partner that empowers users rather than replacing their judgment.

---

*Architecture complete. Ready for implementation.*