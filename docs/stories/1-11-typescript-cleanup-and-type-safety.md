# Story 1.11: TypeScript Cleanup and Type Safety

Status: drafted

## Story

As a developer,
I want all TypeScript compilation errors resolved and strict type checking enforced,
So that the codebase maintains type safety and prevents future regressions.

## Acceptance Criteria

1. All 20 TypeScript compilation errors from previous stories are resolved
2. `npm run typecheck` completes with zero errors
3. Test mocks are updated to match current Prisma schema
4. Type imports use correct models (PrioritizationSession vs Session)
5. TanStack Query API updated from v4 to v5 patterns (isLoading → isPending)

## Tasks / Subtasks

- [ ] Task 1: Fix Model Import Errors (Quick Win)
  - [ ] Update new-session-dialog.tsx to use PrioritizationSession
  - [ ] Fix CreateImprovementButton.tsx Session type
  - [ ] Update sessions/[sessionId]/page.tsx type expectations
  - [ ] Fix MatrixControls.tsx Improvement → ImprovementItem

- [ ] Task 2: Update TanStack Query API Usage
  - [ ] Replace `.isLoading` with `.isPending` in new-session-dialog.tsx (2 instances)
  - [ ] Replace `.isLoading` with `.isPending` in CreateImprovementButton.tsx
  - [ ] Verify all mutation hooks use v5 API

- [ ] Task 3: Fix Test Mocks
  - [ ] Update ImpactEffortMatrix.test.tsx mock data with full Prisma fields
  - [ ] Add createdAt, updatedAt, userId, sessionId to all test mocks
  - [ ] Ensure test type safety for all 10+ test cases

- [ ] Task 4: Fix Missing Imports and Exports
  - [ ] Remove or fix @/utils/api import in matrix/page.tsx
  - [ ] Fix FormField export in components/ui/form.tsx
  - [ ] Update router.query usage in matrix/page.tsx (App Router migration)
  - [ ] Fix matrix page onUpdatePosition type signature

- [ ] Task 5: Prevent Future Type Drift
  - [ ] Add `npm run typecheck` to pre-commit hook or CI
  - [ ] Document Prisma model naming conventions (Session vs PrioritizationSession)
  - [ ] Create test mock helper functions for common Prisma types
  - [ ] Add TypeScript strict mode documentation to README

## Dev Notes

### Error Breakdown

**20 Total TypeScript Errors:**
- 3 errors: Model type confusion (Session vs PrioritizationSession)
- 3 errors: TanStack Query v4→v5 API (.isLoading → .isPending)
- 10 errors: Test mocks missing Prisma required fields
- 4 errors: Missing imports/exports and API migration

### Files to Fix

**Priority 1 - Model Types (3 files):**
1. `src/app/_components/frank/new-session-dialog.tsx` (lines 5, 9, 18)
2. `src/components/improvements/CreateImprovementButton.tsx` (line 19)
3. `src/components/visualization/MatrixControls.tsx` (line 2)

**Priority 2 - Query API (2 files):**
1. `src/app/_components/frank/new-session-dialog.tsx` (lines 75, 78)
2. `src/components/improvements/CreateImprovementButton.tsx` (line 19)

**Priority 3 - Test Mocks (1 file, 10 errors):**
1. `src/components/visualization/__tests__/ImpactEffortMatrix.test.tsx` (multiple test cases)

**Priority 4 - Missing Imports (3 files):**
1. `src/app/matrix/page.tsx` (lines 6, 12, 59)
2. `src/app/sessions/[sessionId]/page.tsx` (line 117)
3. `src/components/sessions/NewSessionDialog.tsx` (line 20)

### Prisma Model Reference

```typescript
// ✅ Correct for authentication
import { Session } from "@prisma/client";
// Session has: id, sessionToken, userId, expires

// ✅ Correct for prioritization features
import { PrioritizationSession } from "@prisma/client";
// PrioritizationSession has: id, userId, name, description, status,
// isOnboarding, startedAt, completedAt, createdAt, updatedAt

// ✅ Correct for improvements
import { ImprovementItem } from "@prisma/client";
// NOT "Improvement" - that type doesn't exist
```

### TanStack Query v5 Migration

```typescript
// ❌ Old (v4)
const mutation = api.sessions.create.useMutation();
if (mutation.isLoading) { ... }

// ✅ New (v5)
const mutation = api.sessions.create.useMutation();
if (mutation.isPending) { ... }
```

### Test Mock Template

```typescript
// ✅ Complete mock matching Prisma schema
const mockImprovement: ImprovementItem = {
  id: "test-id",
  userId: "user-id",
  sessionId: "session-id",
  title: "Test Improvement",
  description: "Test Description",
  category: "UI_UX",
  effortLevel: "MEDIUM",
  impactScore: 0.75,
  matrixPosition: { x: 0.5, y: 0.7 },
  effortRationale: null,
  effortEstimatedAt: null,
  effortRevisedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

### Testing Strategy

**Manual Testing:**
1. Run `npm run typecheck` - should show 20 errors initially
2. Fix each category and verify error count decreases
3. Final `npm run typecheck` should show 0 errors
4. Run `npm run test` to ensure test changes work
5. Run `npm run dev` to verify app still runs

**Validation:**
- All existing functionality should work unchanged
- This is purely a type safety cleanup - no behavioral changes
- Tests should pass with updated mocks

### Success Criteria

- ✅ `npm run typecheck` exits with code 0 (no errors)
- ✅ `npm run test` passes all tests
- ✅ `npm run dev` starts without errors
- ✅ All imports use correct Prisma model names
- ✅ TanStack Query uses v5 API throughout

### References

- [TypeScript Error Output](../dev-notes/typescript-errors-2025-11-09.md) (to be created)
- [TanStack Query v5 Migration Guide](https://tanstack.com/query/latest/docs/react/guides/migrating-to-v5)
- [Prisma Client API](https://www.prisma.io/docs/orm/prisma-client)
- [Story 1.10: Notes on Pre-existing Errors](./1-10-input-validation-and-error-handling.md#debug-log-references)

## Dev Agent Record

### Context Reference

Story 1.11 is a technical debt cleanup story to resolve TypeScript compilation errors discovered during Story 1.10 implementation. These errors accumulated across Stories 1.6-1.9 and are isolated from Story 1.10's validation code.

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

### Change Log
