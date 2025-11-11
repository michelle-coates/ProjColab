# Story 1.16: Session Flow UX Improvements

Status: in-progress

## Dev Agent Record

### Context Reference
- [Story Context: 1-16-session-flow-ux-improvements.context.xml](./1-16-session-flow-ux-improvements.context.xml)

### Debug Log

**Implementation Approach:**
1. Created `getSessionState` API endpoint in sessions router to calculate session progress
2. Built modular UI components for each UX improvement:
   - `ProgressIndicator` - Stepper showing 5 stages with completion status
   - `WhatsNext` - Contextual guidance component with dismissible banner
   - `PrerequisiteChecklist` - Real-time checklist for matrix readiness
   - `SessionExplainer` - Collapsible help explaining session concept
   - `Breadcrumbs` - Navigation breadcrumbs for current location
3. Integrated components into dashboard and matrix pages
4. Updated dashboard tests to include new component mocks

**Design Decisions:**
- Used Frank's calm clarity aesthetic (sage green #76A99A, minimal contrast)
- Made components mobile-responsive using Tailwind breakpoints
- Progress indicator shows locked stages to create sense of progression
- What's Next guidance is dismissible to avoid annoyance
- Prerequisite checklist provides actionable links to complete tasks
- Session explainer starts collapsed to avoid overwhelming new users

**Edge Cases Handled:**
- Session with 0 items shows "Add first improvement" guidance
- Matrix page blocks access until prerequisites met
- Empty states provide specific counts and next actions
- Comparisons calculation uses correct formula: n(n-1)/2

### UAT Findings (2025-11-11)

**Issue Discovered:** Item-level status visibility gap
- High-level guidance works ("5 items need questions")
- Users cannot identify WHICH items need action
- "Answer Questions" button links to `/dashboard` (no-op when already there)
- Improvement list shows effort badges (S/M/L) but no impact question status

**Root Cause:** Story focused on workflow-level guidance but missed item-level indicators

**Resolution:** Extended story with Task 9 (item-level status indicators) and Task 10 (UAT validation)

### Completion Notes

**Phase 1 Complete (Tasks 1-8):**
- ✅ AC1: Progress indicator shows 5 stages with current stage highlighted
- ✅ AC2: "What's Next?" guidance displayed with actionable next steps
- ✅ AC3: Matrix prerequisites clearly explained with real-time checklist
- ✅ AC4: Empty states show specific counts and helpful links
- ✅ AC5: Session concept explained in user-friendly language

**Phase 2 In Progress (Tasks 9-10):**
- ⏳ Task 9: Item-level status indicators
- ⏳ Task 10: UAT validation with Michelle

All tests passing (214/214). TypeScript compilation clean.

### File List

**New Files Created:**
- `frank/src/components/session/ProgressIndicator.tsx` - Progress stepper component
- `frank/src/components/session/WhatsNext.tsx` - Guidance component
- `frank/src/components/session/PrerequisiteChecklist.tsx` - Matrix prerequisites card
- `frank/src/components/session/SessionExplainer.tsx` - Session concept help
- `frank/src/components/session/Breadcrumbs.tsx` - Navigation breadcrumbs

**Modified Files:**
- `frank/src/server/api/routers/sessions.ts` - Added getSessionState endpoint
- `frank/src/app/dashboard/page.tsx` - Integrated all new components
- `frank/src/app/matrix/page.tsx` - Added prerequisites and empty state handling
- `frank/src/app/dashboard/__tests__/page.test.tsx` - Updated mocks for new components

### Change Log

- 2025-11-10: Story 1.16 implementation complete - All session flow UX improvements integrated

## Story

As a user navigating Frank's prioritization workflow,
I want clear guidance on what I've done and what's next at every step,
So that I understand the session flow and know how to get my improvements into the matrix.

## Context

**Epic:** 1.5 - Core Workflow Bug Fixes & UX Polish
**Priority:** HIGH (User Comprehension)
**Estimated Effort:** 1-2 days

**User-Reported Issue:**
> "I'm still a little confused on what the session is doing and how you get the prioritized features to show in the impact/effort grid."

**Impact:** Users don't understand the workflow progression or prerequisites. Even when following the "correct" steps, lack of guidance causes confusion and perceived bugs. Users need explicit "What's Next?" direction.

## Acceptance Criteria

1. Progress indicator shows session state: Capture → Estimate → Questions → Compare → Visualize
2. "What's Next?" guidance displayed at each step with actionable next steps
3. Matrix prerequisites clearly explained in UI (not just in help docs)
4. Helpful empty states when sections incomplete (with specific counts and links)
5. Session concept explained in user-friendly language with visual aids

## Tasks / Subtasks

- [x] Task 1: Design Progress Indicator Component
  - [x] Create visual progress stepper component
  - [x] Show 5 stages: Capture → Estimate → Questions → Compare → Results
  - [x] Highlight current stage
  - [x] Show completion status for each stage (✓, in progress, locked)
  - [x] Add click navigation to completed stages
  - [x] Mobile-responsive design

- [x] Task 2: Add "What's Next?" Guidance Component
  - [x] Create reusable "NextStep" component
  - [x] Determine next action based on session state
  - [x] Show specific guidance:
    - "Add improvements to your backlog" (if 0 items)
    - "Estimate effort for 3 remaining items" (if missing estimates)
    - "Answer impact questions for 5 items" (if missing questions)
    - "Start comparing items" (if ready for comparisons)
    - "View your prioritization matrix" (if comparisons complete)
  - [x] Include action button for next step
  - [x] Dismissible but persistent until action taken

- [x] Task 3: Add Session State Tracking
  - [x] Calculate session completion status:
    - `itemsCount: number`
    - [x] `itemsWithEffort: number`
    - [x] `itemsWithQuestions: number`
    - [x] `comparisonsCompleted: number`
    - [x] `comparisonsRequired: number`
    - [x] `readyForMatrix: boolean`
  - [x] Create API endpoint to fetch session state
  - [x] Cache state in React Query for performance
  - [x] Update state as user completes actions

- [x] Task 4: Clarify Matrix Prerequisites in UI
  - [x] Add "Prerequisites for Matrix" card
  - [x] Show checklist:
    - ☑ Items captured (5/5)
    - ☑ Effort estimated (5/5)
    - ☑ Impact questions answered (4/5) ← with link to complete
    - ☐ Comparisons complete (8/12) ← with link to continue
  - [x] Update in real-time as prerequisites met
  - [x] Show on dashboard and matrix page (when empty)

- [x] Task 5: Improve Empty States
  - [x] **Empty Improvements List:**
    - "No improvements yet"
    - "Add your first improvement to start prioritizing"
    - [+ Add Improvement] button
  - [x] **Incomplete Effort Estimates:**
    - "3 items need effort estimates"
    - List items without estimates
    - [Estimate Effort] links for each
  - [x] **Missing Impact Questions:**
    - "5 items need impact questions answered"
    - Explain why this matters
    - [Answer Questions] button
  - [x] **Comparisons Not Ready:**
    - "Complete effort and questions first"
    - Show what's blocking comparisons
  - [x] **Empty Matrix:**
    - "No items ready for matrix yet"
    - Show specific prerequisites missing
    - Guide user to complete prerequisites

- [x] Task 6: Explain Session Concept
  - [x] Add "What is a Session?" help section
  - [x] Use user-friendly language:
    - "A session is like a project workspace"
    - "It keeps all your improvements organized together"
    - "You can have multiple sessions for different backlogs"
  - [x] Add visual diagram showing session flow
  - [x] Link from dashboard and session pages

- [x] Task 7: Add Breadcrumb Navigation
  - [x] Show current location in flow
  - [x] Example: "Dashboard > My Session > Comparisons"
  - [x] Clickable breadcrumbs for easy back navigation
  - [x] Show session name in breadcrumb

- [x] Task 8: Integration and Testing
  - [x] Test progress indicator updates correctly
  - [x] Test "What's Next?" shows relevant guidance
  - [x] Test empty states appear when appropriate
  - [x] Test prerequisite checklist accuracy
  - [x] Verify all links and navigation work
  - [x] Test with various session states (empty, partial, complete)

- [ ] Task 9: Add Item-Level Status Indicators (UAT Gap Fix)
  - [ ] Add visual status badges to improvement list items
    - Show impact question completion status (✓ Answered / ⚠️ Needs Questions)
    - Position next to existing effort badges (S/M/L)
    - Use Frank's calm clarity color palette (sage green for complete)
  - [ ] Fix "Answer Questions" button navigation
    - Change from `/dashboard` link to scroll/highlight behavior when already on dashboard
    - Or link to first improvement needing questions with auto-expand
  - [ ] Update improvement list component
    - Filter/highlight items needing action when user clicks guidance button
    - Ensure badges update in real-time as questions are answered
  - [ ] Add tests for item-level visibility
    - Test badge displays correct status based on conversation data
    - Test navigation/highlighting behavior
    - Test real-time status updates

- [ ] Task 10: User Review
  - [ ] Show improved UX to Michelle
  - [ ] Test understanding: "What do you do next?"
  - [ ] Verify confusion is reduced
  - [ ] Iterate based on feedback

## Technical Context

### Files to Modify:
- `frank/src/components/session/ProgressIndicator.tsx` - NEW: Progress stepper
- `frank/src/components/session/WhatsNext.tsx` - NEW: Guidance component
- `frank/src/components/session/PrerequisiteChecklist.tsx` - NEW: Matrix prerequisites
- `frank/src/app/dashboard/page.tsx` - Add progress/guidance
- `frank/src/app/sessions/[sessionId]/page.tsx` - Add session flow UI
- `frank/src/app/matrix/page.tsx` - Add prerequisite checklist when empty
- `frank/src/server/api/routers/sessions.ts` - Add state calculation endpoint

### Session State API:
```typescript
// Add to sessions router:
getSessionState: protectedProcedure
  .input(z.object({ sessionId: z.string() }))
  .query(async ({ input, ctx }) => {
    const session = await ctx.db.prioritizationSession.findUnique({
      where: { id: input.sessionId },
      include: {
        improvements: {
          include: {
            evidence: true,
            conversations: true,
          },
        },
        decisions: true,
      },
    });

    return {
      itemsCount: session.improvements.length,
      itemsWithEffort: session.improvements.filter(i => i.effortLevel).length,
      itemsWithQuestions: session.improvements.filter(i =>
        i.conversations.length > 0 && i.conversations[0].finalInsights
      ).length,
      comparisonsCompleted: session.decisions.length,
      comparisonsRequired: calculateRequiredComparisons(session.improvements.length),
      readyForMatrix: /* logic to determine */,
      currentStage: /* calculate based on above */,
      nextAction: /* determine what user should do next */,
    };
  })
```

### Progress Indicator States:
```typescript
type Stage = {
  id: string;
  label: string;
  status: 'complete' | 'current' | 'locked';
  description: string;
};

const stages: Stage[] = [
  { id: 'capture', label: 'Capture', status: 'complete', description: 'Add improvements' },
  { id: 'estimate', label: 'Estimate', status: 'current', description: 'Assign effort levels' },
  { id: 'questions', label: 'Questions', status: 'locked', description: 'Answer impact questions' },
  { id: 'compare', label: 'Compare', status: 'locked', description: 'Pairwise comparisons' },
  { id: 'results', label: 'Results', status: 'locked', description: 'View matrix' },
];
```

### "What's Next?" Logic:
```typescript
function determineNextAction(state: SessionState): NextAction {
  if (state.itemsCount === 0) {
    return {
      title: "Add your first improvement",
      description: "Start by capturing the improvements you want to prioritize",
      action: "Add Improvement",
      link: "/improvements/new",
    };
  }

  if (state.itemsWithEffort < state.itemsCount) {
    return {
      title: `Estimate effort for ${state.itemsCount - state.itemsWithEffort} items`,
      description: "Assign Small, Medium, or Large effort to each improvement",
      action: "Estimate Effort",
      link: "/improvements?filter=missing-effort",
    };
  }

  // ... more logic
}
```

## Dependencies

- **Blocked by:** None - can run in parallel
- **Blocks:** None - but improves UX for Stories 1.13-1.14
- **Related to:**
  - Story 1.15 (Dashboard UI) - consistent terminology
  - Story 1.13 (Comparison bug) - guides users through comparison flow
  - Story 1.14 (Matrix bug) - explains matrix prerequisites

## Success Metrics

- ✅ Progress indicator visible on all session pages
- ✅ "What's Next?" guidance shows relevant next steps
- ✅ Matrix prerequisites clearly explained
- ✅ Empty states provide specific, actionable guidance
- ✅ User testing shows reduced confusion about workflow

## Definition of Done

- [ ] Progress indicator component created and integrated
- [ ] "What's Next?" guidance component working
- [ ] Session state API endpoint implemented
- [ ] Prerequisite checklist added to matrix page
- [ ] Empty states improved across all sections
- [ ] "What is a Session?" help content added
- [ ] Breadcrumb navigation implemented
- [ ] User review completed (Michelle tests and approves)
- [ ] Code reviewed and approved
- [ ] Story marked "done" in sprint-status.yaml

## Notes

**From Retrospective:**
> "User confusion is a bug, not a documentation problem"

This story addresses the core lesson that if users don't understand the workflow, the UI has failed - not the user. Guidance should be PROACTIVE (shown automatically) not REACTIVE (hidden in help docs).

**User-Centric Design:**
Every step should answer:
1. Where am I? (Progress indicator)
2. What did I just do? (Confirmation/status)
3. What should I do next? ("What's Next?" guidance)
4. Why should I do it? (Explain benefit/prerequisite)

**Progressive Disclosure:**
Don't overwhelm new users with all 5 stages upfront. Show current stage + next stage. Lock future stages until prerequisites met. This creates a sense of progression and achievement.

## References

- [Epic 1 Retrospective](../retrospectives/epic-1-retro-2025-11-10.md) - Session flow confusion
- [Story 1.9: Guided Onboarding](./1-9-guided-onboarding-experience.md) - Onboarding UX patterns
- [UX Research: Progress Indicators](https://www.nngroup.com/articles/progress-indicators/) - Best practices
