# Story 1.4: Effort Estimation with AI Guidance

Status: done

**Created:** November 2, 2025

## Story

As a product manager,
I want to estimate effort levels (S/M/L) with AI-guided questions,
so that I can make realistic assessments about implementation complexity.

## Requirements Context Summary

**Epic 1:** Foundation & Core Prioritization Engine

**Source Documents:**
- Epic Breakdown: `docs/epics.md` - Story 1.4
- Architecture: `docs/architecture.md` - Claude AI Integration, tRPC Routers
- PRD: `docs/PRD.md` - FR005: Simple effort estimation (S/M/L)
- Epic Tech Spec: `docs/tech-spec-epic-1.md`

**Business Context:**

This story adds effort estimation to Frank's prioritization engine, building on Story 1.3's evidence gathering. While Frank focuses on impact discovery through AI interrogation, effort estimation provides the second dimension needed for value-based prioritization. The S/M/L framework keeps estimation lightweight and prevents analysis paralysis, while AI guidance helps users think through technical complexity, dependencies, and scope realistically.

**Strategic Importance:**
- Enables Impact vs Effort visualization (Story 1.7)
- Critical for identifying "Quick Wins" (high impact, low effort)
- Prevents over-investment in low-value improvements
- AI guidance reduces estimation bias and anchoring effects
- Rationale capture creates accountability and learning opportunities

**Prerequisites:**
- Story 1.1: User authentication (completed)
- Story 1.2: Improvement capture interface (completed)
- Story 1.3: AI-powered context gathering (completed)

## Acceptance Criteria

1. **Simple S/M/L Effort Selection Interface**
   - Clear effort selection UI with three options: Small, Medium, Large
   - Visual effort descriptions:
     - Small: "Hours to a day" - Minor tweaks, config changes, simple fixes
     - Medium: "Days to a week" - Feature additions, moderate refactoring, multi-component changes
     - Large: "Weeks or more" - Significant features, architectural changes, cross-system impacts
   - Radio button or card-based selection pattern
   - Effort estimate visible on improvement cards/list items
   - Easy to revise estimates after selection

2. **AI-Guided Effort Context Questions**
   - Claude generates contextual questions to calibrate effort thinking:
     - "How many components or files would this touch?"
     - "Are there external dependencies or integrations involved?"
     - "Does this require coordination across teams?"
     - "What's your team's familiarity with this area of the codebase?"
   - Category-specific guidance:
     - UI/UX: Frontend complexity, design system usage, responsive considerations
     - Data Quality: Schema changes, migration needs, data volume impacts
     - Workflow: Business logic complexity, state management, edge cases
     - Bug Fix: Root cause complexity, regression risk, testing scope
   - Questions adapt based on improvement description and evidence from Story 1.3
   - AI highlights factors that might increase complexity (e.g., "You mentioned this affects mobile - that typically increases scope")

3. **Effort Rationale Capture**
   - Text area for explaining effort estimate reasoning
   - Prompts encouraging specificity:
     - "What makes this [S/M/L]? Consider: scope, dependencies, unknowns, risk"
     - "What could make this bigger than expected?"
     - "What assumptions are you making about effort?"
   - AI summarizes user responses into concise rationale
   - Rationale saved with effort estimate for future reference
   - Rationale visible in improvement detail view and export

4. **Ability to Revise Effort Estimates**
   - "Revise effort" action available on any improvement with existing estimate
   - Shows previous estimate and rationale for context
   - New rationale required when changing estimate
   - Version history tracking effort changes over time
   - AI prompts: "Your previous estimate was [X] because [rationale]. What's changed?"
   - Clear visual indicator when estimate has been revised

5. **Visual Effort Distribution**
   - Dashboard widget showing effort distribution across all improvements
   - Bar chart or pie chart: X% Small, Y% Medium, Z% Large
   - Total estimated effort indicator (e.g., "8 Small, 5 Medium, 3 Large")
   - Warning indicators for concerning patterns:
     - All Large efforts: "Consider breaking down some improvements"
     - Very few Small: "Look for quick wins - they build momentum"
   - Filter improvements by effort level
   - Distribution helps identify portfolio balance issues

## Technical Implementation Notes

**Database Schema (Prisma):**

```prisma
model ImprovementItem {
  id          String   @id @default(cuid())
  userId      String
  title       String
  description String   @db.Text
  category    Category
  
  // Story 1.3 additions
  evidenceEntries   EvidenceEntry[]
  conversations     AIConversation[]
  
  // Story 1.4 additions
  effortLevel       EffortLevel?
  effortRationale   String?          @db.Text
  effortEstimatedAt DateTime?
  effortRevisedAt   DateTime?
  effortHistory     EffortHistory[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
}

enum EffortLevel {
  SMALL
  MEDIUM
  LARGE
}

model EffortHistory {
  id                String      @id @default(cuid())
  improvementId     String
  previousLevel     EffortLevel?
  newLevel          EffortLevel
  rationale         String      @db.Text
  changedAt         DateTime    @default(now())
  
  improvement ImprovementItem @relation(fields: [improvementId], references: [id], onDelete: Cascade)
  
  @@index([improvementId])
}
```

**tRPC Router (Extend improvements router):**

```typescript
// src/server/api/routers/improvements.ts

export const improvementsRouter = createTRPCRouter({
  // ... existing procedures from Story 1.2, 1.3
  
  setEffort: protectedProcedure
    .input(z.object({
      improvementId: z.string().cuid(),
      effortLevel: z.enum(['SMALL', 'MEDIUM', 'LARGE']),
      rationale: z.string().min(10, 'Please explain your effort estimate'),
    }))
    .mutation(async ({ ctx, input }) => {
      // Get current effort for history
      const current = await ctx.db.improvementItem.findUnique({
        where: { id: input.improvementId },
        select: { effortLevel: true },
      });
      
      // Update effort
      const updated = await ctx.db.improvementItem.update({
        where: { id: input.improvementId },
        data: {
          effortLevel: input.effortLevel,
          effortRationale: input.rationale,
          effortEstimatedAt: current?.effortLevel ? undefined : new Date(),
          effortRevisedAt: current?.effortLevel ? new Date() : undefined,
        },
      });
      
      // Record history if this is a revision
      if (current?.effortLevel && current.effortLevel !== input.effortLevel) {
        await ctx.db.effortHistory.create({
          data: {
            improvementId: input.improvementId,
            previousLevel: current.effortLevel,
            newLevel: input.effortLevel,
            rationale: input.rationale,
          },
        });
      }
      
      return updated;
    }),
  
  getEffortGuidance: protectedProcedure
    .input(z.object({
      improvementId: z.string().cuid(),
    }))
    .query(async ({ ctx, input }) => {
      // Get improvement with evidence for context
      const improvement = await ctx.db.improvementItem.findUnique({
        where: { id: input.improvementId },
        include: {
          evidenceEntries: true,
        },
      });
      
      if (!improvement) throw new TRPCError({ code: 'NOT_FOUND' });
      
      // Call Claude for effort guidance questions
      const guidance = await generateEffortGuidance({
        title: improvement.title,
        description: improvement.description,
        category: improvement.category,
        evidence: improvement.evidenceEntries,
      });
      
      return guidance;
    }),
    
  getEffortDistribution: protectedProcedure
    .query(async ({ ctx }) => {
      const items = await ctx.db.improvementItem.findMany({
        where: { userId: ctx.session.user.id },
        select: { effortLevel: true },
      });
      
      return {
        small: items.filter(i => i.effortLevel === 'SMALL').length,
        medium: items.filter(i => i.effortLevel === 'MEDIUM').length,
        large: items.filter(i => i.effortLevel === 'LARGE').length,
        total: items.length,
        unestimated: items.filter(i => !i.effortLevel).length,
      };
    }),
});
```

**Claude Service Extension:**

```typescript
// src/server/services/claude.ts (extend existing)

export async function generateEffortGuidance(params: {
  title: string;
  description: string;
  category: Category;
  evidence: EvidenceEntry[];
}) {
  const systemPrompt = `You are Frank, an AI product prioritization assistant. 
The user is estimating effort for an improvement. Ask 3-4 focused questions to help them 
think through complexity factors: scope, dependencies, unknowns, technical complexity.

Adapt questions to the improvement category and evidence gathered.
Keep questions conversational and practical.`;

  const userPrompt = `Help me estimate effort for this improvement:

Title: ${params.title}
Description: ${params.description}
Category: ${params.category}

Evidence gathered: ${params.evidence.map(e => `- ${e.content}`).join('\n')}

Ask me questions to calibrate my effort thinking. Focus on what might make this 
more complex than it appears.`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      { role: "user", content: userPrompt }
    ],
    system: systemPrompt,
  });

  return {
    questions: response.content[0].text,
    metadata: {
      model: response.model,
      usage: response.usage,
    },
  };
}
```

**UI Components:**

```typescript
// src/app/_components/frank/effort-estimator.tsx

'use client';

import { useState } from 'react';
import { Card } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Textarea } from '~/components/ui/textarea';
import { api } from '~/trpc/react';
import type { EffortLevel } from '@prisma/client';

export function EffortEstimator({ improvementId }: { improvementId: string }) {
  const [selectedEffort, setSelectedEffort] = useState<EffortLevel | null>(null);
  const [rationale, setRationale] = useState('');
  const [showGuidance, setShowGuidance] = useState(false);
  
  const { data: guidance } = api.improvements.getEffortGuidance.useQuery(
    { improvementId },
    { enabled: showGuidance }
  );
  
  const setEffort = api.improvements.setEffort.useMutation({
    onSuccess: () => {
      // Refresh improvement data
    },
  });
  
  const effortOptions = [
    {
      level: 'SMALL' as EffortLevel,
      label: 'Small',
      description: 'Hours to a day',
      examples: 'Minor tweaks, config changes, simple fixes',
      color: 'border-green-500',
    },
    {
      level: 'MEDIUM' as EffortLevel,
      label: 'Medium',
      description: 'Days to a week',
      examples: 'Feature additions, moderate refactoring',
      color: 'border-yellow-500',
    },
    {
      level: 'LARGE' as EffortLevel,
      label: 'Large',
      description: 'Weeks or more',
      examples: 'Significant features, architectural changes',
      color: 'border-red-500',
    },
  ];
  
  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {effortOptions.map((option) => (
          <Card
            key={option.level}
            className={`cursor-pointer border-2 p-4 transition-all hover:shadow-md ${
              selectedEffort === option.level
                ? `${option.color} bg-accent/10`
                : 'border-border'
            }`}
            onClick={() => setSelectedEffort(option.level)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-frank-primary">{option.label}</h4>
                <p className="text-sm text-muted-foreground">{option.description}</p>
                <p className="mt-1 text-xs text-muted-foreground">{option.examples}</p>
              </div>
              {selectedEffort === option.level && (
                <div className="h-5 w-5 rounded-full bg-frank-accent" />
              )}
            </div>
          </Card>
        ))}
      </div>
      
      {!showGuidance && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowGuidance(true)}
        >
          Need help deciding? Get AI guidance
        </Button>
      )}
      
      {showGuidance && guidance && (
        <Card className="bg-accent/5 p-4">
          <p className="whitespace-pre-line text-sm">{guidance.questions}</p>
        </Card>
      )}
      
      {selectedEffort && (
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">
              Why {selectedEffort.toLowerCase()}? Consider scope, dependencies, unknowns, risk.
            </label>
            <Textarea
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder="Explain your effort estimate..."
              className="mt-1"
              rows={3}
            />
          </div>
          
          <Button
            onClick={() => setEffort.mutate({
              improvementId,
              effortLevel: selectedEffort,
              rationale,
            })}
            disabled={rationale.length < 10}
            className="w-full"
          >
            Set Effort Estimate
          </Button>
        </div>
      )}
    </div>
  );
}
```

```typescript
// src/app/_components/frank/effort-distribution.tsx

'use client';

import { Card } from '~/components/ui/card';
import { api } from '~/trpc/react';

export function EffortDistribution() {
  const { data: distribution } = api.improvements.getEffortDistribution.useQuery();
  
  if (!distribution) return null;
  
  const total = distribution.small + distribution.medium + distribution.large;
  const smallPct = total > 0 ? (distribution.small / total * 100).toFixed(0) : 0;
  const mediumPct = total > 0 ? (distribution.medium / total * 100).toFixed(0) : 0;
  const largePct = total > 0 ? (distribution.large / total * 100).toFixed(0) : 0;
  
  return (
    <Card className="p-4">
      <h3 className="mb-3 font-semibold text-frank-primary">Effort Distribution</h3>
      
      <div className="mb-3 flex h-8 overflow-hidden rounded-lg">
        {distribution.small > 0 && (
          <div
            className="bg-green-500"
            style={{ width: `${smallPct}%` }}
            title={`${distribution.small} Small (${smallPct}%)`}
          />
        )}
        {distribution.medium > 0 && (
          <div
            className="bg-yellow-500"
            style={{ width: `${mediumPct}%` }}
            title={`${distribution.medium} Medium (${mediumPct}%)`}
          />
        )}
        {distribution.large > 0 && (
          <div
            className="bg-red-500"
            style={{ width: `${largePct}%` }}
            title={`${distribution.large} Large (${largePct}%)`}
          />
        )}
      </div>
      
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Small:</span>
          <span className="font-medium">{distribution.small}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Medium:</span>
          <span className="font-medium">{distribution.medium}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Large:</span>
          <span className="font-medium">{distribution.large}</span>
        </div>
        {distribution.unestimated > 0 && (
          <div className="flex justify-between border-t pt-1">
            <span className="text-muted-foreground">Not estimated:</span>
            <span className="font-medium">{distribution.unestimated}</span>
          </div>
        )}
      </div>
      
      {distribution.large > distribution.small + distribution.medium && (
        <p className="mt-3 text-xs text-yellow-600">
          ⚠️ Mostly large efforts - consider breaking down some improvements
        </p>
      )}
      
      {distribution.small === 0 && total > 0 && (
        <p className="mt-3 text-xs text-yellow-600">
          💡 No small efforts found - look for quick wins to build momentum
        </p>
      )}
    </Card>
  );
}
```

**Integration Points:**

1. **Dashboard Integration:**
   - Add EffortDistribution widget to dashboard
   - Add "Estimate effort" action to improvement cards
   - Show effort badge on improvements that have estimates

2. **Improvement Detail View:**
   - Display current effort estimate and rationale
   - Show effort history if revised
   - Provide "Revise effort" button

3. **Workflow Integration:**
   - After evidence gathering (Story 1.3), prompt for effort estimation
   - Allow skipping effort estimation and returning later
   - Show completion indicator: Evidence ✓, Effort ✓

## Tasks

1. **Database Schema Updates**
   - [ ] Add EffortLevel enum to Prisma schema
   - [ ] Add effort fields to ImprovementItem model
   - [ ] Create EffortHistory model for tracking revisions
   - [ ] Run migration to update database

2. **tRPC Router Extensions**
   - [ ] Add `setEffort` mutation with validation
   - [ ] Add `getEffortGuidance` query calling Claude
   - [ ] Add `getEffortDistribution` query for dashboard
   - [ ] Add effort history tracking in mutation

3. **Claude Service for Effort Guidance**
   - [ ] Extend claude.ts with `generateEffortGuidance` function
   - [ ] Create category-specific prompts for effort questions
   - [ ] Use evidence from Story 1.3 to inform guidance
   - [ ] Handle fallback if Claude unavailable

4. **UI Components**
   - [ ] Create EffortEstimator component with S/M/L cards
   - [ ] Create EffortDistribution dashboard widget
   - [ ] Add effort badge to improvement cards
   - [ ] Create effort revision UI with history display

5. **Dashboard Integration**
   - [ ] Add EffortDistribution widget to dashboard
   - [ ] Add "Estimate effort" action to improvement list
   - [ ] Show effort indicators on improvement cards
   - [ ] Add filter by effort level

6. **Testing**
   - [ ] Test effort selection with all three levels
   - [ ] Test AI guidance generation for different categories
   - [ ] Test effort revision and history tracking
   - [ ] Test effort distribution calculations
   - [ ] Test edge cases: no efforts, all same level, etc.

## Success Metrics

- All improvements can have effort estimates assigned
- AI guidance helps users think through complexity factors
- Effort rationale captures reasoning for estimates
- Distribution widget helps identify portfolio balance issues
- Revision capability allows updating estimates as understanding improves

## Notes

**Design Decisions:**

1. **S/M/L vs Story Points:** S/M/L is more intuitive for non-engineering PMs and prevents false precision. Story points can be added in Epic 2 for engineering teams.

2. **AI Guidance Optional:** Some users will have strong intuition about effort. Make AI guidance helpful but not required.

3. **Rationale Required:** Capturing "why" creates accountability and learning. Also helps with revisions ("What changed?").

4. **Distribution Warnings:** Proactive coaching about portfolio balance helps users avoid common pitfalls (all big projects, no quick wins).

5. **History Tracking:** Effort estimates often change as understanding improves. Tracking history prevents confusion and supports learning.

**Learnings from Story 1.3:**

- Claude service pattern works well - reuse for effort guidance
- Conversational prompts more engaging than forms
- Evidence context improves AI relevance
- Fallback handling important for reliability
- UI should show AI value without overwhelming

**Dependencies for Story 1.5:**

- Effort estimates used in pairwise comparison prompts: "Both seem high impact - which is easier to implement?"
- Impact vs Effort visualization needs both dimensions
- Export will include effort estimates and rationale

---

**For SM Review:** Once drafted, run `*story-ready 1.4` to generate Story Context XML for dev implementation.
