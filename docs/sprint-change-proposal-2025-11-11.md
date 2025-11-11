# Sprint Change Proposal - Story 1.16 Item-Level Status Gap

**Date:** 2025-11-11
**Epic:** 1.5 - Core Workflow Bug Fixes & UX Polish
**Story:** 1.16 - Session Flow UX Improvements
**Triggered By:** Manual UAT by Michelle (Product Owner)
**Change Scope:** Minor - Direct implementation by development team

---

## 1. Issue Summary

### Problem Statement

Story 1.16 (Session Flow UX Improvements) successfully delivers high-level workflow guidance through "What's Next?" components that tell users how many items need attention (e.g., "5 items need impact questions answered"). However, the implementation lacks **item-level status visibility**, creating a dead-end UX where users know WHAT to do but cannot identify WHICH specific improvements require action.

### Discovery Context

- **When:** 2025-11-11 during manual UAT of Story 1.16
- **Who:** Michelle (Product Owner, Developer)
- **Trigger:** User testing revealed "Answer Questions" button doesn't enable action

### Evidence

1. **User Feedback:** "The Answer Questions button doesn't do anything"
2. **Navigation Bug:** Button links to `/dashboard` when user is already on dashboard (no-op)
3. **Missing Visual Indicators:** Improvement list shows effort badges (S/M/L) but no impact question completion status
4. **Story Scope Gap:** Task 5 mentions "Missing Impact Questions" empty state but doesn't address item-level indicators in the improvement list itself

### Impact

Users are blocked at the "questions" stage of the workflow, unable to complete the core prioritization journey that Epic 1.5 aims to enable. This violates Epic 1.5's success criteria: "Session flow has clear progress guidance."

---

## 2. Impact Analysis

### Epic Impact

**Epic 1.5: Core Workflow Bug Fixes & UX Polish**
- **Status:** Can be completed with Story 1.16 modifications
- **Timeline:** Minimal impact (4-6 hours additional work)
- **Dependencies:** Story 1.18 (UAT Protocol) should include tests for this fix

### Story Impact

**Current Stories:**
- **Story 1.16:** Needs task additions (Tasks 9-10) for item-level status indicators
  - Phase 1 (Tasks 1-8): ✅ Complete
  - Phase 2 (Tasks 9-10): ⏳ In Progress

**Future Stories:**
- **Story 1.18 (UAT Protocol):** Should include item-level visibility test cases

### Artifact Conflicts

**PRD (Product Requirements Document)**
- ❌ No conflicts
- ✅ Fulfills existing requirements more completely
- FR033: "System shall maintain user workflow context and suggest intelligent next actions"
- FR028: "System shall validate input completeness and provide contextual guidance for missing information"

**Architecture Document**
- ❌ No changes needed
- ✅ All required components and APIs already exist
- `ImprovementList` component needs visual indicator addition only
- Data already available via `improvements.list` query

**UX Design Specification**
- ❌ No conflicts
- ✅ Aligns with existing badge pattern specification
- Line 37: "Badge systems for evidence tracking"
- Lines 370-372: "Evidence Source Labels: Badges showing data sources"

### Technical Impact

**Code Changes Required:**
- `frank/src/app/_components/frank/improvement-list.tsx` - Add status badges
- `frank/src/server/api/routers/sessions.ts` - Fix "Answer Questions" button link logic
- Test files - Add item-level visibility tests

**Data Model:**
- ❌ No schema changes needed
- ✅ Existing `improvements.conversations` data tracks question completion

**API Changes:**
- ❌ No new endpoints needed
- ✅ Existing data sufficient for status badges

---

## 3. Recommended Approach

### Selected Path: Direct Adjustment (Option 1)

**Approach:** Extend Story 1.16 with item-level status indicator tasks

**Why This Path:**

**Implementation Effort:**
- Low effort (4-6 hours) vs. high value (unblocks users)
- Leverages existing components and data
- No architectural complexity

**Technical Risk:**
- Minimal - simple UI enhancement
- All infrastructure already in place
- Well-understood badge pattern from UX spec

**Team Morale:**
- Demonstrates responsiveness to UAT findings
- Shows commitment to quality before moving to Epic 2
- Small win that validates the Epic 1.5 approach

**Long-term Sustainability:**
- Completes Story 1.16 properly
- Sets pattern for item-level status visibility across app
- Aligns with UX spec badge system design

**Stakeholder Expectations:**
- Epic 1.5 promised "clear progress guidance" - this delivers it fully
- Maintains quality bar before Epic 2 advanced features
- Validates manual UAT process (caught real issue)

### Alternatives Considered

**Option 2: Potential Rollback**
- ❌ Rejected - Would lose valuable "What's Next?" guidance already working
- High effort, high risk, negative morale impact

**Option 3: PRD MVP Review (Defer Fix)**
- ❌ Rejected - Ships with poor UX, violates Epic 1.5 goals
- Damages user trust and blocks MVP completion

---

## 4. Detailed Change Proposals

### Change #1: Story 1.16 - Add Item-Level Status Tasks

**File:** `docs/stories/1-16-session-flow-ux-improvements.md`
**Section:** Tasks / Subtasks (after Task 8)

**Add:**
```markdown
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
```

**Justification:** UAT revealed that high-level guidance doesn't enable action without item-level visibility.

---

### Change #2: Story 1.16 - Update Status and Document UAT Findings

**File:** `docs/stories/1-16-session-flow-ux-improvements.md`
**Section:** Status and Dev Agent Record

**OLD:** `Status: review`
**NEW:** `Status: in-progress`

**Add to Dev Agent Record:**
```markdown
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
```

**Justification:** Documents UAT discovery and course-correct decision for future reference.

---

### Change #3: Epic 1.5 - Clarify Success Criteria

**File:** `docs/epic-1.5-summary.md`
**Section:** Success Criteria

**OLD:**
```markdown
- ✅ Session flow has clear progress guidance
```

**NEW:**
```markdown
- ✅ Session flow has clear progress guidance with item-level status visibility
```

**Justification:** Ensures Epic 1.5 success criteria accurately reflect complete UX requirement.

---

### Change #4: Sprint Status - Update Story 1.16 Status

**File:** `docs/sprint-status.yaml`
**Section:** Story 1.16

**OLD:**
```yaml
    - id: "1.16"
      title: "Session Flow UX Improvements"
      status: "REVIEW"
      assignee: "Amelia"
      notes: "Progress indicators, What's Next guidance, prerequisite checklist - ready for review"
```

**NEW:**
```yaml
    - id: "1.16"
      title: "Session Flow UX Improvements"
      status: "IN_PROGRESS"
      assignee: "Amelia"
      notes: "Phase 1 complete (progress indicators, guidance). Phase 2: UAT gap fix - adding item-level status indicators"
```

**Justification:** Updates sprint tracking to reflect story is back in development.

---

## 5. Implementation Handoff

### Change Scope Classification

**Scope:** Minor - Direct implementation by development team

### Handoff Recipients and Responsibilities

**Development Agent (Amelia):**
- Implement item-level status badges in improvement list
- Fix "Answer Questions" button navigation logic
- Update component tests for item-level visibility
- Execute UAT validation with Michelle
- Update story documentation after completion

**Product Owner (Michelle):**
- Approve implementation approach
- Conduct manual UAT validation
- Sign off on Story 1.16 completion
- Verify Epic 1.5 success criteria met

### Success Criteria for Implementation

**Functional Success:**
- ✅ Users can visually identify which improvements need impact questions answered
- ✅ Status badges appear next to effort badges (S/M/L) in improvement list
- ✅ "Answer Questions" button provides clear path to action (scroll/highlight or direct link)
- ✅ Badges update in real-time as questions are answered

**Quality Success:**
- ✅ All existing tests continue passing
- ✅ New tests cover item-level status badge behavior
- ✅ TypeScript compilation clean
- ✅ Follows Frank's calm clarity aesthetic (sage green #76A99A)

**User Success:**
- ✅ Michelle confirms improved UX through manual testing
- ✅ Users can complete "questions" stage without confusion
- ✅ Epic 1.5 success criteria satisfied

### Timeline

**Effort Estimate:** 4-6 hours
- 2 hours: Add status badge to improvement list items
- 1 hour: Fix "Answer Questions" button navigation
- 1 hour: Update tests
- 1-2 hours: UAT validation with Michelle

**Target Completion:** Same sprint (Epic 1.5 in progress)

---

## 6. Lessons Learned

### What Worked Well

1. **Manual UAT Caught Real Issue:** Validates Epic 1.5 commitment to UAT before Epic 2
2. **Course-Correct Process:** Systematic analysis prevented rushed fix
3. **Incremental Story Design:** Phase 1 components work; Phase 2 extends cleanly

### Process Improvements

1. **Story Acceptance Criteria:** Should explicitly include "item-level visibility" when adding workflow guidance
2. **UAT Checklist Template:** Should include "Can user identify which items need action?" test
3. **Component Design Reviews:** Review for both workflow-level AND item-level UX patterns

### Impact on Future Work

1. **Story 1.18 (UAT Protocol):** Include item-level visibility as standard test pattern
2. **Future Stories:** Apply "workflow + item-level" pattern for other status indicators
3. **Epic 2 Planning:** Ensure guidance components include both levels of detail

---

## Approval

**Prepared By:** Amelia (Development Agent)
**Reviewed By:** Michelle (Product Owner)
**Date:** 2025-11-11
**Status:** Pending Approval

**Approval Signature:**
- [ ] Michelle (Product Owner) - Approved for implementation

---

**Next Steps After Approval:**
1. Apply all artifact edits (Stories, Epic, Sprint Status)
2. Begin Task 9 implementation (item-level status indicators)
3. Execute Task 10 (UAT validation)
4. Update Story 1.16 to "done" status
5. Continue Epic 1.5 with Story 1.17 or 1.18
