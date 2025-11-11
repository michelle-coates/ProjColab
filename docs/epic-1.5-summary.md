# Epic 1.5: Core Workflow Bug Fixes & UX Polish

**Status:** Drafted
**Priority:** CRITICAL - Must complete before Epic 2
**Estimated Duration:** 5-7 days
**Created:** 2025-11-10
**Reason:** Epic 1 retrospective revealed critical bugs and UX issues blocking user value delivery

---

## Executive Summary

Epic 1 successfully delivered all 12 planned stories with 152 passing tests. However, manual user acceptance testing revealed that **tests passing ≠ app actually working.** Two critical bugs (comparison completion stuck, matrix not loading) and multiple UX issues prevent Frank from delivering its core value proposition.

Epic 1.5 is a focused cleanup sprint to fix these issues before proceeding to Epic 2's advanced features.

---

## Critical Issues to Resolve

### 🔴 BLOCKERS (Must Fix)

**1. Comparison Flow Stuck at 100%**
- **Symptom:** Comparisons show "100% complete" but UI stuck with "Continue Comparing"
- **Impact:** Users cannot finish prioritization session
- **Story:** 1.13 - Fix Comparison Completion Logic

**2. Matrix Not Loading Items**
- **Symptom:** Items with effort + impact questions don't appear in matrix
- **Impact:** No visualization of results - core value broken
- **Story:** 1.14 - Fix Matrix Data Loading

### 🟡 UX ISSUES (Important)

**3. Dashboard UI Cluttered**
- Account info in large boxes wasting space
- Effort Distribution using wrong colors (bold vs subtle)
- Poor terminology ("Sessions" confusing to users)
- **Story:** 1.15 - Dashboard UI Cleanup and Branding

**4. Session Flow Confusing**
- Users don't understand how to get items into matrix
- No progress indicators or "What's Next?" guidance
- Prerequisites unclear
- **Story:** 1.16 - Session Flow UX Improvements

**5. Onboarding Data Clutter**
- Sample data copied to workspace with no cleanup option
- **Story:** 1.17 - Onboarding Cleanup Options

**6. Testing Gap**
- 152 tests passed but critical bugs missed
- Need manual UAT protocol to prevent recurrence
- **Story:** 1.18 - Manual UAT Protocol

---

## Story Breakdown

| Story | Priority | Effort | Description |
|-------|----------|--------|-------------|
| [1.13: Fix Comparison Completion Logic](stories/1-13-fix-comparison-completion-logic.md) | CRITICAL | 1-2 days | Debug and fix comparison stuck at 100% |
| [1.14: Fix Matrix Data Loading](stories/1-14-fix-matrix-data-loading.md) | CRITICAL | 1-2 days | Fix matrix not showing items with prerequisites |
| [1.15: Dashboard UI Cleanup](stories/1-15-dashboard-ui-cleanup-and-branding.md) | HIGH | 1 day | Move account info, fix colors, improve layout |
| [1.16: Session Flow UX](stories/1-16-session-flow-ux-improvements.md) | HIGH | 1-2 days | Add progress indicators and guidance |
| [1.17: Onboarding Cleanup](stories/1-17-onboarding-cleanup-options.md) | MEDIUM | 0.5 day | Add "Start Fresh" option after onboarding |
| [1.18: Manual UAT Protocol](stories/1-18-manual-uat-protocol.md) | HIGH | 0.5 day | Create UAT protocol to prevent future gaps |

**Total Estimated Effort:** 5-7 days

---

## Critical Path

### Must Complete Before Epic 2:
1. ✅ **Story 1.13** (Comparison bug) → BLOCKS all prioritization workflows
2. ✅ **Story 1.14** (Matrix bug) → BLOCKS visualization and value delivery
3. ✅ **Story 1.18** (UAT protocol) → BLOCKS confidence in Epic 1.5 completion

### Can Run in Parallel:
- Stories 1.13 and 1.14 (different bugs, different files)
- Stories 1.15 and 1.16 (different UI areas)

### Sequence Recommendation:
```
Day 1-2: Story 1.13 (Comparison fix)
Day 1-2: Story 1.14 (Matrix fix) - parallel with 1.13
Day 3: Story 1.15 (Dashboard UI)
Day 4-5: Story 1.16 (Session flow UX)
Day 5: Story 1.17 (Onboarding cleanup)
Day 1: Story 1.18 (UAT protocol) - create early, execute at end
Day 6-7: Execute Manual UAT, fix any issues found
```

---

## Success Criteria

**Epic 1.5 is "done" when:**
- ✅ User can complete full prioritization journey without blockers
- ✅ Comparisons complete cleanly (no stuck state)
- ✅ Matrix displays all qualifying items
- ✅ Dashboard uses Frank's subtle branding
- ✅ Session flow has clear progress guidance with item-level status visibility
- ✅ Onboarding offers cleanup choice
- ✅ Manual UAT protocol created and executed
- ✅ All UAT tests pass

**Definition of "Working":**
> A user can: signup → onboard → create session → add improvements → estimate effort → answer questions → complete comparisons → view matrix → export results
>
> **WITHOUT:** confusion, stuck states, empty visualizations, or needing technical support

---

## Key Learnings from Epic 1 (Driving Epic 1.5)

### 1. Tests Passing ≠ App Working
- 152 automated tests passed
- Core workflow completely broken for real users
- **Lesson:** Manual UAT is NOT optional

### 2. Build for Users, Not Developers
- "Sessions" terminology confusing
- Technical jargon throughout UI
- **Lesson:** Use user language, not database models

### 3. UI Polish IS Functional Quality
- Wrong colors → unprofessional feel
- Cluttered layout → poor usability
- **Lesson:** UI affects perceived quality and trust

### 4. Integration Testing Must Cover Journeys
- Unit tests verify code works
- Integration tests missed state transitions
- **Lesson:** Test complete user journeys, not isolated features

### 5. State Management Complexity
- Bugs hide in state transitions
- Session → comparison → matrix flow broke
- **Lesson:** Extra attention to state machines

---

## Why NOT Epic 2 Yet?

**Temptation:** Epic 2 has exciting features (clustering, strategic alignment, enhanced comparison)

**Reality Check:**
1. Epic 2 builds on comparison and matrix features
2. Those features are currently BROKEN
3. Advanced features won't fix broken foundation
4. Will compound debugging complexity
5. Never truly stabilize either epic

**Decision:** Fix Epic 1.5 first (1 week) → Solid foundation → THEN Epic 2 with confidence

---

## Process Improvements

### Added to Definition of Done:
1. ✅ Manual UAT checklist completed and passed
2. ✅ UI/UX review in code review process
3. ✅ User-centric story writing (not developer-centric)
4. ✅ "Done" means user can complete workflow, not just tests pass

### New Practices:
- **Manual UAT:** Required for every epic before "done"
- **UI Review:** Part of code review, not afterthought
- **User Testing:** Stakeholder tests with real data before sign-off
- **Journey Testing:** Test complete flows, not isolated features

---

## References

- [Epic 1 Retrospective](retrospectives/epic-1-retro-2025-11-10.md) - Detailed retrospective findings
- [Sprint Status](sprint-status.yaml) - Epic 1.5 tracking
- [Workflow Status](bmm-workflow-status.md) - Current workflow state

---

## Next Steps

1. **Immediate:** Begin Story 1.13 (Comparison bug fix)
2. **Parallel:** Begin Story 1.14 (Matrix bug fix)
3. **After CRITICAL fixes:** Stories 1.15-1.17 (UX polish)
4. **Before "done":** Execute Manual UAT (Story 1.18)
5. **After Epic 1.5:** Validate with real user testing
6. **Then:** Proceed to Epic 2 with confidence

---

**Created:** 2025-11-10
**Epic Owner:** Michelle (Product Owner, Developer)
**Scrum Master:** Bob
**Priority:** CRITICAL - Foundation must work before building advanced features
