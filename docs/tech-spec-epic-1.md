# Epic Technical Specification: Foundation & Core Prioritization Engine

Date: November 1, 2025
Author: Michelle
Epic ID: 1
Status: Draft

---

## Overview

Epic 1 establishes the foundational Frank application delivering core micro-improvement prioritization capabilities through AI-powered Socratic questioning. This epic creates a deployable web application where individual users can capture improvement items, engage with Claude AI for evidence gathering, perform pairwise comparisons, and export prioritized results. The implementation leverages the T3 Stack (Next.js 15, TypeScript, Tailwind, tRPC, Prisma, NextAuth) with Claude 3.5 Sonnet integration to demonstrate Frank's unique value proposition: "Think with me. We'll figure it out."

This epic delivers end-to-end functionality from user account creation through improvement capture, AI interrogation, pairwise ranking, data persistence, visualization, export, and guided onboarding - establishing the complete foundation for subsequent intelligence and collaboration features.

## Objectives and Scope

**In Scope:**
- User authentication system (email/password with session management)
- Improvement item capture with categorization and basic metadata
- Claude AI integration for Socratic questioning and evidence gathering
- Effort estimation (S/M/L) with AI-guided contextual prompts
- Pairwise comparison engine building progressive rankings
- Data persistence across sessions with PostgreSQL/Prisma
- Impact vs Effort 2x2 matrix visualization
- CSV export with rationale and session metadata
- Guided onboarding for 15-minute productivity achievement
- Input validation and graceful error handling

**Out of Scope (Deferred to Later Epics):**
- Team collaboration and shared workspaces (Epic 3)
- Advanced AI clustering and strategic alignment (Epic 2)
- Real-time collaboration features (Epic 3)
- Business intelligence and analytics (Epic 4)
- Advanced AI learning and personalization (Epic 5)
- Slack integration and external tool sync (Epic 3)
- Enterprise security and audit logging (Epic 4)

## System Architecture Alignment

**T3 Stack Foundation:**
Epic 1 implements the core T3 Stack architecture established in the Architecture document:

- **Next.js 15 App Router**: File-based routing for auth flows, dashboard, and prioritization sessions
- **TypeScript**: End-to-end type safety from Claude API responses through database models to React components
- **Tailwind CSS**: Implementing Frank's "calm clarity" design system with sage green accents
- **tRPC**: Type-safe API layer for improvement CRUD, Claude conversations, and decision tracking
- **Prisma**: ORM managing User, ImprovementItem, EvidenceEntry, AIConversation, and DecisionRecord models
- **NextAuth.js**: Email/password authentication with JWT session management

**Claude AI Integration:**
- Model: claude-3-5-sonnet-20241022
- Purpose: Socratic questioning engine generating evidence-based interrogation
- Pattern: ConversationEngine with fallback to predefined questions on API failures
- Cost Optimization: Conversation context management and response caching

**Database Architecture:**
PostgreSQL database with core data models for Epic 1:
- `User`: Authentication and profile data
- `ImprovementItem`: Captured improvements with title, description, category, effort
- `EvidenceEntry`: Evidence gathered during AI interrogation with confidence scoring
- `AIConversation`: Claude conversation history for learning and context
- `DecisionRecord`: Pairwise comparison decisions with rationale capture
- `PrioritizationSession`: Session management and state persistence

**Deployment Target:**
Vercel platform with serverless functions for Next.js API routes and Edge Functions for real-time features (prepared for future epics)

## Detailed Design

### Services and Modules

**Authentication Module** (`src/server/auth.ts`, `src/app/(auth)/`)
- **Responsibilities**: User registration, login, session management, password reset
- **Inputs**: Email, password, profile data (name, role)
- **Outputs**: Authenticated session with JWT token
- **Owner**: NextAuth.js with Prisma adapter
- **Dependencies**: Prisma User model, email verification service

**Improvement Management Router** (`src/server/api/routers/improvements.ts`)
- **Responsibilities**: CRUD operations for improvement items
- **Inputs**: `createImprovementSchema` (title, description, category)
- **Outputs**: ImprovementItem with generated ID and timestamps
- **Owner**: tRPC protected procedure
- **Dependencies**: Prisma ImprovementItem model

**AI Conversation Engine** (`src/lib/ai/claude/conversation-engine.ts`)
- **Responsibilities**: Generate Socratic questions, analyze evidence, provide insights
- **Inputs**: Improvement context, conversation history, evidence gaps, user expertise level
- **Outputs**: SocraticQuestion objects with targeted prompts
- **Owner**: ClaudeConversationEngine class
- **Dependencies**: @anthropic-ai/sdk, environment variables for API key

**Conversations Router** (`src/server/api/routers/conversations.ts`)
- **Responsibilities**: Manage AI conversation state, store turns, track evidence discovery
- **Inputs**: Session ID, improvement ID, user responses
- **Outputs**: Conversation history with generated insights
- **Owner**: tRPC protected procedure
- **Dependencies**: ClaudeConversationEngine, Prisma AIConversation model

**Decision Tracking Router** (`src/server/api/routers/decisions.ts`)
- **Responsibilities**: Record pairwise comparison decisions, build cumulative rankings
- **Inputs**: Comparison choices with rationale
- **Outputs**: Progressive ranking based on decision graph
- **Owner**: tRPC protected procedure
- **Dependencies**: Prisma DecisionRecord model, ranking algorithm

**Evidence Tracking Module** (`src/lib/ai/analytics/evidence-scoring.ts`)
- **Responsibilities**: Calculate evidence confidence scores, identify gaps
- **Inputs**: Array of EvidenceEntry objects
- **Outputs**: Confidence score (0.0-1.0) and gap analysis
- **Owner**: Utility module
- **Dependencies**: Evidence classification logic

**Visualization Components** (`src/components/frank/`)
- **Responsibilities**: Render Impact vs Effort matrix, evidence confidence displays
- **Inputs**: Prioritization data, decision records
- **Outputs**: Interactive React components
- **Owner**: React component library
- **Dependencies**: shadcn/ui foundation, chart libraries

**Export Service** (`src/lib/integrations/export/csv-generator.ts`)
- **Responsibilities**: Generate CSV exports with decision rationale
- **Inputs**: Prioritized improvement list, session metadata
- **Outputs**: Downloadable CSV file
- **Owner**: Utility module
- **Dependencies**: CSV formatting library

### Data Models and Contracts

**User Model:**
```typescript
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String?
  role        UserRole @default(FREE)
  sessions    PrioritizationSession[]
  improvements ImprovementItem[]
  decisions   DecisionRecord[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum UserRole {
  FREE
  TEAM
  ENTERPRISE
}
```

**ImprovementItem Model:**
```typescript
model ImprovementItem {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  title           String
  description     String
  category        Category
  effort          EffortLevel?
  evidence        EvidenceEntry[]
  conversations   AIConversation[]
  decisions       DecisionRecord[]
  sessionId       String?
  session         PrioritizationSession? @relation(fields: [sessionId], references: [id])
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum Category {
  UI_UX
  DATA_QUALITY
  WORKFLOW
  BUG_FIX
  FEATURE
  OTHER
}

enum EffortLevel {
  SMALL
  MEDIUM
  LARGE
}
```

**EvidenceEntry Model:**
```typescript
model EvidenceEntry {
  id              String   @id @default(cuid())
  improvementId   String
  improvement     ImprovementItem @relation(fields: [improvementId], references: [id])
  content         String
  source          EvidenceSource
  confidence      Float    // 0.0 - 1.0
  addedBy         String
  createdAt       DateTime @default(now())
}

enum EvidenceSource {
  ANALYTICS
  SUPPORT_TICKETS
  USER_FEEDBACK
  ASSUMPTIONS
  USER_UPLOAD
}
```

**AIConversation Model:**
```typescript
model AIConversation {
  id              String   @id @default(cuid())
  sessionId       String
  session         PrioritizationSession @relation(fields: [sessionId], references: [id])
  improvementId   String
  improvement     ImprovementItem @relation(fields: [improvementId], references: [id])
  turns           ConversationTurn[] // JSON array
  finalInsights   Json?
  evidenceGained  Json?
  claudeModel     String   @default("claude-3-5-sonnet-20241022")
  tokenUsage      Int?
  duration        Int?     // Conversation time in seconds
  createdAt       DateTime @default(now())
}
```

**DecisionRecord Model:**
```typescript
model DecisionRecord {
  id              String   @id @default(cuid())
  sessionId       String
  session         PrioritizationSession @relation(fields: [sessionId], references: [id])
  improvementA    String
  improvementARef ImprovementItem @relation("DecisionA", fields: [improvementA], references: [id])
  improvementB    String
  improvementBRef ImprovementItem @relation("DecisionB", fields: [improvementB], references: [id])
  chosen          String   // ID of chosen improvement
  chosenReason    String   // User's rationale
  evidenceUsed    Json     // Evidence that influenced decision
  confidenceLevel Int      // 1-10 scale
  claudeQuestion  String?  // Frank's guiding question for this comparison
  createdAt       DateTime @default(now())
  createdBy       String
  user            User     @relation(fields: [createdBy], references: [id])
}
```

**PrioritizationSession Model:**
```typescript
model PrioritizationSession {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  name            String?  // Optional session name
  improvements    ImprovementItem[]
  conversations   AIConversation[]
  decisions       DecisionRecord[]
  finalRanking    Json?    // Calculated ranking from decisions
  status          SessionStatus @default(IN_PROGRESS)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  completedAt     DateTime?
}

enum SessionStatus {
  IN_PROGRESS
  COMPLETED
  ARCHIVED
}
```

### APIs and Interfaces

**tRPC Router Structure:**

**Improvements Router** (`improvements`)
```typescript
export const improvementsRouter = createTRPCRouter({
  // Create new improvement
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(5).max(200),
      description: z.string().min(10).max(2000),
      category: z.enum(['UI_UX', 'DATA_QUALITY', 'WORKFLOW', 'BUG_FIX', 'FEATURE', 'OTHER']),
      sessionId: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Creates improvement item in database
      // Returns: { success: true, data: ImprovementItem }
    }),

  // Get improvement with evidence
  getWithEvidence: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      // Returns improvement with all evidence entries
    }),

  // Update effort estimation
  updateEffort: protectedProcedure
    .input(z.object({
      id: z.string(),
      effort: z.enum(['SMALL', 'MEDIUM', 'LARGE']),
      rationale: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Updates effort level and creates evidence entry
    }),

  // List user's improvements
  list: protectedProcedure
    .input(z.object({
      sessionId: z.string().optional(),
      category: z.enum(['UI_UX', 'DATA_QUALITY', 'WORKFLOW', 'BUG_FIX', 'FEATURE', 'OTHER']).optional(),
    }))
    .query(async ({ input, ctx }) => {
      // Returns filtered list of improvements
    }),
})
```

**Conversations Router** (`conversations`)
```typescript
export const conversationsRouter = createTRPCRouter({
  // Generate next question from Claude
  generateQuestion: protectedProcedure
    .input(z.object({
      improvementId: z.string(),
      sessionId: z.string(),
      conversationHistory: z.array(conversationTurnSchema).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Calls ClaudeConversationEngine
      // Returns: { success: true, data: SocraticQuestion, metadata: { confidence, reasoning } }
    }),

  // Submit user response
  submitResponse: protectedProcedure
    .input(z.object({
      conversationId: z.string(),
      response: z.string(),
      evidenceType: z.enum(['ANALYTICS', 'SUPPORT_TICKETS', 'USER_FEEDBACK', 'ASSUMPTIONS']).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Stores response, creates evidence entry if applicable
      // Triggers next question generation
    }),

  // Get conversation history
  getHistory: protectedProcedure
    .input(z.object({ sessionId: z.string(), improvementId: z.string() }))
    .query(async ({ input, ctx }) => {
      // Returns full conversation with insights
    }),
})
```

**Decisions Router** (`decisions`)
```typescript
export const decisionsRouter = createTRPCRouter({
  // Record pairwise comparison decision
  recordDecision: protectedProcedure
    .input(z.object({
      sessionId: z.string(),
      improvementA: z.string(),
      improvementB: z.string(),
      chosen: z.string(),
      rationale: z.string(),
      evidenceUsed: z.array(z.string()), // Evidence entry IDs
      confidenceLevel: z.number().min(1).max(10),
    }))
    .mutation(async ({ input, ctx }) => {
      // Creates decision record
      // Updates ranking algorithm
      // Returns: { success: true, data: DecisionRecord }
    }),

  // Get next comparison pair
  getNextComparison: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input, ctx }) => {
      // Intelligent pairing algorithm
      // Returns two improvements to compare with Frank's question
    }),

  // Calculate final ranking
  calculateRanking: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input, ctx }) => {
      // Processes decision graph
      // Returns sorted improvement list with confidence scores
    }),
})
```

**Sessions Router** (`sessions`)
```typescript
export const sessionsRouter = createTRPCRouter({
  // Create new prioritization session
  create: protectedProcedure
    .input(z.object({
      name: z.string().optional(),
      businessGoals: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Creates session with strategic context
    }),

  // Get session with full context
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      // Returns session with improvements, conversations, decisions
    }),

  // Complete session
  complete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Marks session complete, calculates final ranking
      // Generates export data
    }),
})
```

**Claude API Integration:**

```typescript
interface SocraticQuestion {
  question: string
  context: string
  evidenceType: EvidenceSource[]  // Suggested evidence types
  followUpPrompts: string[]       // Potential follow-ups
  reasoning: string               // Why Frank is asking this
}

interface ClaudeConversationAPI {
  generateQuestion(params: {
    improvement: ImprovementItem
    conversationHistory: ConversationTurn[]
    evidenceGaps: string[]
    userExpertise: 'beginner' | 'intermediate' | 'expert'
  }): Promise<SocraticQuestion>

  analyzeEvidence(params: {
    evidenceEntries: EvidenceEntry[]
  }): Promise<{
    confidenceScore: number
    gaps: string[]
    insights: string[]
  }>
}
```

### Workflows and Sequencing

**User Registration and Onboarding Flow:**
1. User lands on sign-up page (`/sign-up`)
2. Submits email, password, name, role
3. Email verification sent (verification handled by auth provider)
4. User activates account via email link
5. Redirected to onboarding flow (`/onboarding`)
6. Guided tour: Sample data → Evidence gathering demo → Comparison demo → Export demo
7. Onboarding completion redirects to dashboard

**Improvement Capture and Interrogation Flow:**
1. User creates new session or continues existing (`/session/new` or `/session/[id]`)
2. User adds improvement items via form or bulk import
3. For each improvement:
   a. User enters title, description, category
   b. Frank generates initial context questions
   c. User responds, Frank analyzes and asks follow-ups
   d. Evidence entries created from responses
   e. User sets effort level (S/M/L) with Frank's guidance
4. Evidence confidence calculated and visualized in real-time

**Pairwise Comparison and Ranking Flow:**
1. User initiates comparison phase (minimum 2 improvements required)
2. System selects first comparison pair (intelligent algorithm)
3. Frank generates contextual question for this specific comparison
4. User sees both improvements with evidence summaries
5. User selects choice and provides rationale
6. Decision recorded, ranking updated
7. System selects next pair (8-12 total comparisons for typical session)
8. After sufficient comparisons, final ranking calculated
9. User can review ranking and make adjustments

**Visualization and Export Flow:**
1. User completes comparisons (or proceeds with partial ranking)
2. System generates Impact vs Effort matrix
3. User sees 2x2 visualization with improvements plotted
4. User can:
   a. Filter by category or effort level
   b. Review evidence for any improvement
   c. Adjust positioning by dragging (updates underlying data)
   d. Identify "high value, low effort" opportunities
5. User initiates export:
   a. Selects format (CSV, summary report)
   b. Export includes: improvement details, priority rank, effort, evidence summary, decision rationale
   c. Download triggered, file includes session metadata

**Data Persistence Pattern:**
- All user actions auto-save every 30 seconds
- Critical operations (improvement creation, decision recording) save immediately
- Session state persisted in database, allowing resume across devices
- Optimistic UI updates with background sync
- Conflict resolution: last-write-wins for single-user sessions

**Error Recovery Workflows:**
- Claude API failure: Fallback to predefined question bank based on improvement category
- Database connection loss: Queue mutations in IndexedDB, sync when reconnected
- Session timeout: Preserve state in localStorage, restore on re-authentication
- Partial evidence: Continue workflow with assumptions clearly marked

## Non-Functional Requirements

### Performance

**Response Time Targets:**
- Page load (dashboard, session): <2 seconds (95th percentile)
- API response (tRPC queries): <200ms (95th percentile)
- Claude AI response: <5 seconds (95th percentile)
- Evidence confidence calculation: <50ms
- Pairwise comparison transition: <100ms

**Optimization Strategies:**
- Next.js Server Components for initial page rendering
- React Query caching for tRPC data fetching
- Claude response caching for similar questions (1-hour TTL)
- Database indexes on frequently queried fields (user_id, session_id, created_at)
- Progressive loading: Essential UI → Evidence data → Historical context

**Scalability Considerations:**
- Session size limit: 100 improvements per session (UI warning at 50+)
- Conversation history: Last 20 turns kept in memory, older archived
- Evidence entries: Paginated loading (20 per page)
- Comparison algorithm: O(n log n) complexity for ranking calculation

### Security

**Authentication Security:**
- Password hashing: bcrypt with salt rounds = 12
- Session tokens: JWT with 7-day expiration, refresh token pattern
- Password reset: Time-limited tokens (1-hour expiration), one-time use
- CSRF protection: Built-in Next.js CSRF tokens
- Email verification: Required before account activation

**Data Protection:**
- Sensitive evidence: Encrypted at rest (AES-256)
- API keys: Stored in environment variables, never client-exposed
- User data isolation: Row-level security via Prisma queries filtering by userId
- Input sanitization: Zod validation on all user inputs
- XSS prevention: React's built-in escaping, CSP headers

**API Security:**
- Rate limiting: 100 requests per minute per user
- Input validation: Zod schemas on all tRPC procedures
- Authorization: protectedProcedure middleware checks authentication
- Error handling: Generic error messages (no stack traces to client)

**Claude API Security:**
- API key rotation: Monthly rotation schedule
- Usage tracking: Monitor token consumption, alert on anomalies
- Fallback mechanism: Predefined questions if API unavailable
- Cost controls: Monthly budget limits, user quotas for free tier

### Reliability/Availability

**Uptime Target:** 99.5% (allowing 3.6 hours downtime per month)

**Deployment Architecture:**
- Vercel serverless functions: Auto-scaling, global distribution
- Database: Managed PostgreSQL with automated backups (daily)
- CDN: Static assets served via Vercel Edge Network

**Error Handling Strategies:**
- Claude API failures: Graceful degradation to fallback questions
- Database connection issues: Retry logic (3 attempts with exponential backoff)
- Transaction failures: Rollback with user notification
- Session recovery: Auto-save every 30 seconds, restore from last checkpoint

**Data Backup:**
- Database: Automated daily backups with 30-day retention
- User data export: Available on-demand via export feature
- Disaster recovery: Point-in-time recovery (last 7 days)

**Health Monitoring:**
- Application health checks: `/api/health` endpoint
- Database connection monitoring: Alert on connection failures
- Claude API availability: Fallback trigger monitoring
- Error rate tracking: Alert on >5% error rate spike

### Observability

**Logging Requirements:**
- Application logs: Structured JSON logging (Winston/Pino)
- User actions: Session start, improvement creation, decisions recorded, exports
- AI interactions: Claude API calls, token usage, response times, fallback triggers
- Error logs: Stack traces, context, user session ID, timestamp

**Metrics Collection:**
- Request metrics: Response times, error rates, throughput
- Business metrics: Sessions created, improvements captured, comparisons completed, exports generated
- AI metrics: Claude API calls, token consumption, question quality ratings
- User engagement: Session duration, completion rates, onboarding progress

**Tracing:**
- Request tracing: Distributed tracing for tRPC calls (OpenTelemetry ready)
- Database query tracing: Prisma query logging in development
- Claude API tracing: Request/response logging with correlation IDs

**Alerting:**
- Error rate >5% for 5 minutes: PagerDuty alert
- Claude API response time >10 seconds: Warning notification
- Database connection failures: Immediate alert
- Unusual token consumption (>2x normal): Cost alert

**Monitoring Tools:**
- Application: Vercel Analytics built-in
- Errors: Sentry integration (ready for Phase 2)
- Performance: Next.js built-in performance metrics
- Business intelligence: Custom dashboard (Epic 4)

## Dependencies and Integrations

**Core Dependencies (from package.json):**

**Production:**
- `@anthropic-ai/sdk` (^0.68.0): Claude AI integration
- `@auth/prisma-adapter` (^2.7.2): NextAuth database adapter
- `@prisma/client` (^6.5.0): Database ORM
- `@t3-oss/env-nextjs` (^0.12.0): Environment variable validation
- `@tanstack/react-query` (^5.69.0): Data fetching and caching
- `@trpc/client` (^11.0.0): tRPC client
- `@trpc/react-query` (^11.0.0): React Query integration
- `@trpc/server` (^11.0.0): tRPC server
- `next` (^15.2.3): React framework
- `next-auth` (5.0.0-beta.25): Authentication
- `react` (^19.0.0): UI library
- `react-dom` (^19.0.0): React DOM renderer
- `server-only` (^0.0.1): Server-side code protection
- `superjson` (^2.2.1): JSON serialization for tRPC
- `zod` (^3.24.2): Schema validation

**Development:**
- `@tailwindcss/postcss` (^4.0.15): Tailwind CSS processing
- `@types/node` (^20.14.10): Node.js type definitions
- `@types/react` (^19.0.0): React type definitions
- `@types/react-dom` (^19.0.0): React DOM types
- `eslint` (^9.23.0): Code linting
- `eslint-config-next` (^15.2.3): Next.js ESLint config
- `prettier` (^3.5.3): Code formatting
- `prettier-plugin-tailwindcss` (^0.6.11): Tailwind class sorting
- `prisma` (^6.5.0): Prisma CLI
- `tailwindcss` (^4.0.15): Utility-first CSS
- `typescript` (^5.8.2): TypeScript compiler
- `typescript-eslint` (^8.27.0): TypeScript ESLint

**Additional Dependencies Needed for Epic 1:**
```bash
npm install lucide-react  # Icons for UI
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu  # shadcn/ui base
npm install recharts  # Visualization charts
npm install papaparse  # CSV export
npm install @types/papaparse --save-dev  # CSV types
```

**External Services:**
- **Anthropic Claude API**: AI conversation engine
  - Authentication: API key via environment variable
  - Rate limits: Based on Pro account tier
  - Error handling: Fallback to predefined questions
  
- **Vercel Platform**: Deployment and hosting
  - Environment: Production, Preview, Development
  - Configuration: `vercel.json` for routing and functions
  
- **PostgreSQL Database**: Managed database (Vercel Postgres or Railway)
  - Connection: DATABASE_URL environment variable
  - Migrations: Prisma migrate
  - Backups: Provider-managed

**Integration Points:**
- NextAuth → Prisma: User authentication and session storage
- tRPC → Prisma: Type-safe database queries
- React Query → tRPC: Client-side data fetching and caching
- Claude SDK → tRPC: AI conversation API calls
- Tailwind → React: Component styling
- Zod → tRPC: Input validation schemas

**Environment Variables Required:**
```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."  # For Prisma migrations

# AI Integration
ANTHROPIC_API_KEY="sk-ant-..."

# Authentication
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://frank.vercel.app"  # or http://localhost:3000

# Feature Flags
ENABLE_ONBOARDING="true"
ENABLE_CSV_EXPORT="true"

# Development
NODE_ENV="development"
```

## Acceptance Criteria (Authoritative)

**AC-001: User Account Creation and Authentication**
✅ User can register with email, password, and basic profile information (name, role)
✅ Email verification process completed before account activation
✅ Secure login/logout functionality with session management working across browser tabs
✅ Password reset capability via email with time-limited tokens
✅ Basic user profile editing (name, role, preferences) persists correctly
✅ Session timeout after 7 days with automatic re-authentication prompt

**AC-002: Improvement Item Capture Interface**
✅ Simple form interface for adding improvement items with title (5-200 chars) and description (10-2000 chars)
✅ Basic categorization dropdown (UI/UX, Data Quality, Workflow, Bug Fix, Feature, Other) saves correctly
✅ Ability to edit and delete improvement items with confirmation dialog
✅ List view showing all captured improvements sorted by creation date
✅ Basic validation ensuring required fields are completed with helpful error messages
✅ Auto-save draft state every 30 seconds

**AC-003: AI-Powered Context Gathering**
✅ AI generates contextual questions based on improvement category and description
✅ Questions focus on evidence gathering: beneficiaries, frequency, impact measurement
✅ Conversational interface allows follow-up questions based on user responses
✅ Context responses stored with each improvement item as evidence entries
✅ Ability to skip or revisit questions for any improvement without losing data
✅ Fallback to predefined questions if Claude API unavailable

**AC-004: Effort Estimation with AI Guidance**
✅ Simple S/M/L effort selection interface for each improvement
✅ AI provides context-specific guidance for effort estimation based on improvement type
✅ Effort rationale capture (why S vs M vs L) stored as evidence
✅ Ability to revise effort estimates with new reasoning tracked
✅ Visual indicators showing effort distribution across all items in session

**AC-005: Basic Pairwise Comparison Engine**
✅ Simple A vs B comparison interface presenting two improvements clearly
✅ Contextual decision prompts generated by Claude: "Which would make users happier?" or "Which removes a bigger blocker?"
✅ Progressive ranking system building from pairwise choices with at least 8-12 comparisons
✅ Rationale capture for each comparison decision (minimum 10 characters)
✅ Ability to review and modify previous comparison decisions without breaking ranking logic

**AC-006: Basic Data Persistence and Session Management**
✅ All improvement data automatically saved to user account within 30 seconds
✅ Prioritization session state preserved between visits (refresh doesn't lose data)
✅ Ability to start new prioritization sessions while keeping historical data accessible
✅ Data backup via export feature available at any time
✅ Session timeout handling with work preservation and restore on re-authentication

**AC-007: Simple Impact vs Effort Visualization**
✅ 2x2 matrix visualization plotting improvements by Impact (from ranking) vs Effort (S/M/L)
✅ Interactive plot points showing improvement titles on hover with evidence summary
✅ Clear quadrant labels: "Quick Wins," "Big Bets," "Fill-ins," "Questionable"
✅ Ability to adjust improvement positioning by dragging plot points (updates data)
✅ Visual highlighting of "high value, low effort" recommendations in Quick Wins quadrant

**AC-008: Basic Export and Handoff**
✅ CSV export including improvement details, priority ranking, effort estimates, and rationale
✅ Summary report showing prioritization methodology and key decisions made
✅ Action-ready format suitable for development team handoff with clear next steps
✅ Export includes date, user information, and session metadata for context
✅ Multiple export formats working: CSV for tools, summary report for stakeholders

**AC-009: Guided Onboarding Experience**
✅ Interactive onboarding flow with sample data and guided actions completing in <15 minutes
✅ Role-specific onboarding paths (Solo PM, Team Lead, Founder) with relevant examples
✅ Progressive disclosure of features without overwhelming new users
✅ Completion tracking with achievement indicators (e.g., "First improvement captured!")
✅ Ability to skip onboarding for experienced users with clear "Skip" option

**AC-010: Input Validation and Error Handling**
✅ Real-time validation of required fields with helpful error messages (not generic "Required")
✅ AI detects incomplete or vague improvement descriptions and prompts for clarity
✅ Graceful error handling with user-friendly messages and recovery suggestions
✅ Input completeness scoring with recommendations for improvement quality
✅ Contextual help available throughout the application via "?" icons or tooltips

## Traceability Mapping

| AC ID | PRD Requirement | Architecture Component | Implementation |
|-------|----------------|------------------------|----------------|
| AC-001 | FR018: Individual user accounts | NextAuth.js, User model | `src/server/auth.ts`, `src/app/(auth)/` |
| AC-002 | FR001: Manual input of improvement items | Improvements router, ImprovementItem model | `src/server/api/routers/improvements.ts` |
| AC-003 | FR004: Targeted AI questions | ClaudeConversationEngine | `src/lib/ai/claude/conversation-engine.ts` |
| AC-004 | FR002: Effort estimation with AI guidance | Conversations router | `src/server/api/routers/conversations.ts` |
| AC-005 | FR008: Pairwise comparison interface | Decisions router, DecisionRecord model | `src/server/api/routers/decisions.ts` |
| AC-006 | FR021: Persist improvement data | PrioritizationSession model | `src/server/api/routers/sessions.ts` |
| AC-007 | FR010: Impact vs Effort visualization | Visualization components | `src/components/frank/impact-effort-matrix.tsx` |
| AC-008 | FR015: Export prioritized lists CSV | CSV export service | `src/lib/integrations/export/csv-generator.ts` |
| AC-009 | FR024: Guided onboarding workflow | Onboarding flow | `src/app/onboarding/` |
| AC-010 | FR028: Input validation and guidance | Zod schemas, validation utilities | `src/lib/validations.ts` |

**Component Mapping:**

| Component | Stories Using | Test Requirements |
|-----------|---------------|-------------------|
| User authentication | 1.1, 1.6, 1.9 | Login flow, password reset, session persistence |
| Improvement CRUD | 1.2, 1.10 | Create, edit, delete with validation |
| Claude conversation engine | 1.3, 1.4 | Socratic questions, fallback handling |
| Pairwise comparison | 1.5 | Ranking algorithm, decision recording |
| Data persistence | 1.6 | Auto-save, session restore |
| Visualization | 1.7 | Matrix rendering, interactive positioning |
| Export | 1.8 | CSV generation, summary report |
| Onboarding | 1.9 | Guided flow, sample data |

**Test Strategy Cross-Reference:**
- **Unit Tests**: All tRPC routers, ClaudeConversationEngine, ranking algorithm
- **Integration Tests**: Auth flow, improvement capture → interrogation → comparison → export
- **E2E Tests**: Complete user journey from signup → onboarding → first session → export

## Risks, Assumptions, Open Questions

**Risks:**

**R-001: Claude API Availability and Cost**
- **Risk**: Claude API downtime or rate limiting disrupts core user experience
- **Mitigation**: Fallback question bank by category, predefined Socratic prompts
- **Monitoring**: Claude API health checks, usage alerts at 80% of monthly budget
- **Next Step**: Implement fallback system in Story 1.3

**R-002: User Onboarding Complexity**
- **Risk**: 15-minute productivity target too aggressive, users abandon during onboarding
- **Mitigation**: Progressive disclosure, skip option, role-specific paths with sample data
- **Validation**: User testing with 5 target users during Story 1.9 implementation
- **Next Step**: A/B test onboarding flow lengths (10 min vs 15 min)

**R-003: Pairwise Comparison Fatigue**
- **Risk**: Too many comparisons (66 for 12 items) causes user frustration
- **Mitigation**: Intelligent pairing algorithm (Story 1.5), show progress indicators
- **Assumption**: 8-12 comparisons sufficient for rough ranking (validated in Epic 2 with clustering)
- **Next Step**: Track comparison completion rates, optimize algorithm

**R-004: Database Performance at Scale**
- **Risk**: Evidence entries and conversation history grow unbounded, slow queries
- **Mitigation**: Pagination (20 items per page), archive old sessions, database indexes
- **Monitoring**: Query performance monitoring, alert on >200ms query times
- **Next Step**: Implement pagination in Story 1.6, add indexes in Prisma schema

**R-005: Session State Complexity**
- **Risk**: Concurrent edits across tabs/devices cause data conflicts
- **Mitigation**: Last-write-wins strategy for single-user sessions, optimistic UI updates
- **Assumption**: Epic 1 users are single-player, no real-time collaboration needed yet
- **Next Step**: Add conflict detection in Story 1.6

**Assumptions:**

**A-001: User Expertise Level**
- **Assumption**: Target users (startup founders, PMs) comfortable with web applications, minimal training needed
- **Validation**: Onboarding completion rates >90% within 15 minutes
- **Impact if Wrong**: May need more extensive tutorials, in-app guidance

**A-002: Evidence Quality**
- **Assumption**: Users have access to analytics, support tickets, user feedback to provide evidence
- **Validation**: Evidence source distribution analysis (not all "assumptions")
- **Impact if Wrong**: Need to guide users on gathering evidence, provide templates

**A-003: Comparison Algorithm Sufficiency**
- **Assumption**: Simple transitive ranking from pairwise comparisons produces "good enough" results
- **Validation**: User satisfaction with final rankings >80%
- **Impact if Wrong**: May need more sophisticated ranking algorithms (Epic 2 clustering helps)

**A-004: Claude 3.5 Sonnet Capabilities**
- **Assumption**: Claude can generate insightful Socratic questions without fine-tuning
- **Validation**: Question quality ratings by users, fallback usage rate <10%
- **Impact if Wrong**: May need question templates, prompt engineering iteration

**A-005: Single-User Session Model**
- **Assumption**: Epic 1 users prioritize individually, team collaboration deferred to Epic 3
- **Validation**: User requests for team features tracked but not prioritized
- **Impact if Wrong**: May need to accelerate Epic 3 features

**Open Questions:**

**Q-001: Email Verification Timing**
- **Question**: Should email verification be required before or after first session?
- **Current Plan**: After registration, before first session
- **Decision Needed By**: Story 1.1 implementation
- **Impact**: User onboarding friction vs. spam prevention

**Q-002: Session Auto-Archive**
- **Question**: When should sessions auto-archive? 30 days inactive? 90 days?
- **Current Plan**: Manual archive only in Epic 1
- **Decision Needed By**: Story 1.6 implementation
- **Impact**: Database growth, user dashboard clutter

**Q-003: Evidence Confidence Algorithm**
- **Question**: How to weight different evidence sources (Analytics > Support Tickets > Assumptions)?
- **Current Plan**: Simple count with source multipliers (1.0, 0.8, 0.3)
- **Decision Needed By**: Story 1.3 implementation
- **Impact**: User confidence in AI guidance

**Q-004: Comparison Pair Selection**
- **Question**: Random pairs or intelligent selection (similar effort, different categories)?
- **Current Plan**: Start with random, optimize in Epic 2 with clustering
- **Decision Needed By**: Story 1.5 implementation
- **Impact**: User comparison fatigue, ranking quality

**Q-005: Export Format Flexibility**
- **Question**: Should Epic 1 support custom export formats or just CSV + summary?
- **Current Plan**: CSV + summary report only (custom formats in Epic 3)
- **Decision Needed By**: Story 1.8 implementation
- **Impact**: User integration with existing tools

**Q-006: Claude API Token Budget**
- **Question**: What's acceptable monthly Claude API cost per user? How to enforce?
- **Current Plan**: Monitor usage, no hard limits in Epic 1 (quotas in Epic 4)
- **Decision Needed By**: Pre-production deployment
- **Impact**: Operating costs, free tier sustainability

**Q-007: Visualization Interactivity**
- **Question**: Should Epic 1 support dragging plot points to adjust rankings or read-only?
- **Current Plan**: Read-only matrix, manual ranking adjustment via list (interactive in Epic 2)
- **Decision Needed By**: Story 1.7 implementation
- **Impact**: User agency vs. complexity

## Test Strategy Summary

**Testing Approach:**
Epic 1 follows a comprehensive testing strategy aligned with T3 Stack best practices:

**Unit Testing:**
- **Framework**: Jest + React Testing Library
- **Coverage Target**: 80% for business logic, 60% for components
- **Focus Areas**:
  - tRPC routers: Input validation, authorization, database operations
  - ClaudeConversationEngine: Question generation, fallback logic
  - Evidence scoring algorithms: Confidence calculations, gap detection
  - Ranking algorithm: Pairwise decision graph processing
  - Validation schemas: Zod schema edge cases

**Integration Testing:**
- **Framework**: Playwright
- **Coverage Target**: All critical user flows
- **Test Scenarios**:
  - Auth flow: Registration → email verification → login → session persistence
  - Improvement capture: Create → interrogate → estimate effort → validate persistence
  - Pairwise comparison: Multiple comparisons → ranking calculation → result accuracy
  - Export: Session completion → CSV generation → data integrity
  - Error handling: Claude API failure → fallback questions → user notification

**End-to-End Testing:**
- **Framework**: Playwright with real browser automation
- **Coverage Target**: 5 critical user journeys
- **Test Cases**:
  1. Complete onboarding flow (15-minute target validation)
  2. First prioritization session (capture → interrogate → compare → export)
  3. Session resumption across browser close/reopen
  4. Password reset flow with email verification
  5. Multi-improvement session with 10+ items

**API Testing:**
- **Framework**: tRPC test client
- **Coverage**: All tRPC procedures
- **Focus Areas**:
  - Request/response validation
  - Error handling and edge cases
  - Rate limiting behavior
  - Authentication/authorization
  - Database transaction integrity

**Performance Testing:**
- **Framework**: k6 or Artillery
- **Scenarios**:
  - Page load time under load (target <2s)
  - tRPC API response time (target <200ms)
  - Claude API integration (target <5s)
  - Session with 50+ improvements
  - Concurrent user simulation (10 simultaneous sessions)

**Accessibility Testing:**
- **Framework**: axe-core + manual testing
- **Coverage**: WCAG 2.1 AA compliance
- **Focus Areas**:
  - Keyboard navigation (all interactive elements)
  - Screen reader compatibility (conversation flow, evidence building)
  - Color contrast (Frank's palette validation)
  - Focus management (modals, dialogs)
  - ARIA labels (AI conversation components)

**Security Testing:**
- **Static Analysis**: ESLint security rules
- **Dependency Scanning**: npm audit, Snyk
- **Manual Testing**:
  - Authentication bypass attempts
  - SQL injection via tRPC inputs
  - XSS vulnerability scanning
  - CSRF token validation
  - API key exposure checks

**User Acceptance Testing:**
- **Participants**: 5 target users (startup founders, PMs)
- **Scenarios**: Complete onboarding → first session → export
- **Success Metrics**:
  - Onboarding completion <15 minutes (100% of testers)
  - At least one "aha moment" reported (80%+ of testers)
  - Evidence-based decision confidence increase (self-reported)
  - Willingness to use Frank for real work (80%+ of testers)

**Test Data Strategy:**
- **Fixtures**: Sample improvement items, predefined questions, test users
- **Factories**: Dynamic test data generation for variety
- **Seeding**: Database seed scripts for consistent test environments
- **Cleanup**: Automated test data cleanup after test runs

**Continuous Integration:**
- **Pipeline**: GitHub Actions on every PR
- **Checks**:
  - Linting (ESLint)
  - Type checking (TypeScript)
  - Unit tests (Jest)
  - Integration tests (Playwright)
  - Build validation (Next.js build)
  - Security scans (npm audit)

**Test Environment:**
- **Development**: Local PostgreSQL, mock Claude API
- **Staging**: Vercel preview deployment, real Claude API with test account
- **Production**: Vercel production, real Claude API with monitoring

**Defect Tracking:**
- **Priority Levels**:
  - P0 (Critical): Authentication failures, data loss, Claude API total failure
  - P1 (High): Evidence persistence issues, ranking algorithm errors
  - P2 (Medium): UI glitches, performance degradation
  - P3 (Low): Minor UX improvements, cosmetic issues

**Acceptance Criteria Validation:**
Each AC has corresponding test cases:
- AC-001: Auth flow tests (unit + integration + E2E)
- AC-002: Improvement CRUD tests (unit + integration)
- AC-003: Claude conversation tests (unit + integration with mocks)
- AC-004: Effort estimation tests (unit + integration)
- AC-005: Pairwise comparison tests (unit + integration + algorithm validation)
- AC-006: Persistence tests (integration + E2E)
- AC-007: Visualization tests (component + integration)
- AC-008: Export tests (unit + integration + format validation)
- AC-009: Onboarding tests (E2E + UAT)
- AC-010: Validation tests (unit + integration)

**Test Automation Goal**: 90% of regression testing automated by Epic 1 completion

---

**Epic 1 Tech Spec Complete - Ready for Story Implementation**

This technical specification provides comprehensive guidance for implementing all 10 stories in Epic 1: Foundation & Core Prioritization Engine. Each story maps to specific architecture components, acceptance criteria, and test requirements.

**Next Steps:**
1. Review and approve Epic 1 tech spec
2. Begin Story 1.1 implementation (User Account Creation and Authentication)
3. Update sprint-status.yaml to mark epic-1 as "contexted"
4. Load SM agent and run `*create-story` to draft Story 1.1

---

*Tech Spec generated: November 1, 2025*
*Epic Status: Ready for implementation*
