# Story 1.12: Validation Integration and Testing

Status: drafted

## Story

As a development team,
I want comprehensive validation integrated across all Epic 1 features with full test coverage,
So that users experience consistent input validation, error handling, and help throughout the application.

## Acceptance Criteria

1. Validation components (ValidationInput, ValidationTextarea, HelpTooltip) integrated into evidence gathering, effort estimation, pairwise comparison, export, and onboarding workflows
2. Completeness scoring displayed on all forms that capture user input
3. AI-powered description analysis available on all text input fields where applicable
4. Feature-specific error boundaries around complex features (matrix, onboarding, comparisons)
5. End-to-end test suite covering critical user journeys with Playwright
6. Unit tests for all validation code (schemas, scoring, AI analysis, error handling, help system)
7. Performance and accessibility testing confirms validation doesn't degrade UX

## Tasks / Subtasks

- [ ] Task 1: Integrate Validation into Evidence Gathering (AC: #1, #2, #3)
  - [ ] Replace standard inputs with ValidationInput/Textarea in evidence forms
  - [ ] Add HelpTooltip components explaining evidence sources and content
  - [ ] Integrate completeness scoring for evidence quality
  - [ ] Add AI analysis for evidence vagueness detection
  - [ ] Add feature error boundary around evidence gathering workflow

- [ ] Task 2: Integrate Validation into Effort Estimation (AC: #1, #3)
  - [ ] Replace standard inputs with ValidationInput in effort forms
  - [ ] Add HelpTooltip components explaining effort levels and rationale
  - [ ] Add feature error boundary around effort estimation workflow
  - [ ] Validate effort level selection and rationale

- [ ] Task 3: Integrate Validation into Pairwise Comparison (AC: #1, #3)
  - [ ] Add validation for comparison confidence levels
  - [ ] Add HelpTooltip components explaining comparison methodology
  - [ ] Add feature error boundary around comparison workflow
  - [ ] Validate that all required comparisons are completed

- [ ] Task 4: Integrate Validation into Export Workflows (AC: #1, #3)
  - [ ] Add validation for export format selection
  - [ ] Add HelpTooltip components explaining export options
  - [ ] Add feature error boundary around export workflow
  - [ ] Validate export parameters before generation

- [ ] Task 5: Integrate Validation into Onboarding (AC: #1, #2, #3)
  - [ ] Replace standard inputs with ValidationInput/Textarea in onboarding forms
  - [ ] Add HelpTooltip components for onboarding fields
  - [ ] Add completeness scoring for onboarding profile data
  - [ ] Add feature error boundary around onboarding workflow
  - [ ] Validate role selection and sample data preferences

- [ ] Task 6: Add Feature-Specific Error Boundaries (AC: #4)
  - [ ] Wrap FeatureErrorBoundary around matrix visualization
  - [ ] Wrap FeatureErrorBoundary around onboarding flow
  - [ ] Wrap FeatureErrorBoundary around comparison engine
  - [ ] Test error recovery in each feature boundary

- [ ] Task 7: End-to-End Testing Suite with Playwright (AC: #5)
  - [ ] Install and configure Playwright
  - [ ] Create e2e/ directory structure and fixtures
  - [ ] Implement E2E test: New user signup → onboarding → first session
  - [ ] Implement E2E test: Complete prioritization flow (capture → interrogate → compare → export)
  - [ ] Implement E2E test: Session resumption across browser close/reopen
  - [ ] Implement E2E test: Password reset flow with email verification
  - [ ] Implement E2E test: Multi-improvement session with 10+ items
  - [ ] Implement E2E test: Error recovery scenarios (API failures, network issues)
  - [ ] Add visual regression testing for validation states

- [ ] Task 8: Unit Tests for Validation Code (AC: #6)
  - [ ] Write unit tests for completeness scoring algorithm
  - [ ] Write unit tests for custom validators (vagueness detection, substantive content)
  - [ ] Write unit tests for AI description analyzer fallback logic
  - [ ] Write unit tests for error mapper (TRPC, network, validation errors)
  - [ ] Write unit tests for help content search functionality
  - [ ] Write React component tests for ErrorBoundary
  - [ ] Write React component tests for HelpTooltip
  - [ ] Write React component tests for ValidationInput/Textarea
  - [ ] Write React component tests for CompletenessIndicator

- [ ] Task 9: Performance and Accessibility Testing (AC: #7)
  - [ ] Performance test: Validation response time <50ms
  - [ ] Performance test: AI description analysis <3 seconds
  - [ ] Performance test: Error boundary rendering <100ms
  - [ ] Accessibility test: Error states announced to screen readers
  - [ ] Accessibility test: Help tooltips keyboard-navigable
  - [ ] Accessibility test: Error messages have sufficient color contrast
  - [ ] Accessibility test: Focus management in error recovery flows
  - [ ] Add debouncing (300ms) for real-time validation

- [ ] Task 10: Story 1.10 Code Review Follow-ups (Optional Improvements)
  - [ ] Create ErrorToast context provider for global toast management
  - [ ] Implement 300ms debouncing for real-time validation in improvement form
  - [ ] Update Task 6 first subtask checkbox in Story 1.10 to reflect completed integration
  - [ ] Add loading states to AI description analysis UI (can take up to 3s)
  - [ ] Add animation to completeness indicator when score updates
  - [ ] Consider moving help content to CMS for non-developer updates (optional)
  - [ ] Consider integrating error boundary with Sentry/error tracking (optional)
  - [ ] Track which help topics are accessed most for UX improvements (optional)

## Dev Notes

### Context from Story 1.10

This story completes the validation work started in Story 1.10. The infrastructure (validation components, AI analysis, error handling, help system) was built in 1.10, but only integrated into the improvement capture form. This story extends that integration across all Epic 1 features and adds comprehensive test coverage.

**Code Review Recommendations:**
The Story 1.10 code review (Review #2, 2025-11-09) identified optional improvements that have been added to Task 10:
- Missing toast context provider for application-wide error notifications
- Debouncing not implemented for real-time validation (currently validates on blur)
- Loading states for AI analysis (can take up to 3 seconds)
- Animation for completeness score updates
- Analytics tracking for help topic usage
- Optional integrations: CMS for help content, error tracking service (Sentry)

These improvements enhance UX but are not blocking for Epic 1 completion.

**Story 1.10 Deliverables (Foundation):**
- ValidationInput and ValidationTextarea components
- CompletenessIndicator with scoring algorithm
- HelpTooltip component with help content database
- AI-powered description analyzer with Claude integration
- ErrorBoundary and FeatureErrorBoundary components
- Error mapper with user-friendly messages
- Validation router (tRPC) with endpoints

**Story 1.12 Work (Integration & Testing):**
- Extend validation to 5 more workflows (evidence, effort, comparison, export, onboarding)
- Add feature error boundaries to complex workflows
- Complete E2E test suite (deferred from Stories 1.9 and 1.10)
- Add unit tests for all validation code (zero test coverage currently)
- Performance and accessibility validation

### Requirements Context

**From Epic 1 Tech Spec (AC-010):**
- Real-time validation of required fields with helpful error messages (not generic "Required")
- AI detects incomplete or vague improvement descriptions and prompts for clarity
- Graceful error handling with user-friendly messages and recovery suggestions
- Input completeness scoring with recommendations for improvement quality
- Contextual help available throughout the application via "?" icons or tooltips

**From PRD (FR028):**
- FR028: System shall validate input completeness and provide contextual guidance for missing information

**From Architecture:**
- Zod validation schemas for all tRPC procedures
- Error boundaries for React components
- User-friendly error messages without stack traces
- Input sanitization and XSS prevention

### Integration Points

**Evidence Gathering (Story 1.3):**
- Forms: Evidence content, evidence source
- Help topics: "What is Evidence?", "Evidence Sources"
- Completeness: Evidence content substantive, source provided

**Effort Estimation (Story 1.4):**
- Forms: Effort level selection, effort rationale
- Help topics: "Effort Levels Explained", "Why Explain Your Estimate?"
- Validation: Effort level required, rationale optional but encouraged

**Pairwise Comparison (Story 1.5):**
- Forms: Comparison confidence level
- Help topics: "Pairwise Comparison", "Confidence Level"
- Validation: All required comparisons completed

**Export (Story 1.8):**
- Forms: Export format selection, export parameters
- Help topics: Export format explanations
- Validation: Format selected, parameters valid

**Onboarding (Story 1.9):**
- Forms: Role selection, sample data preferences, user profile
- Help topics: Role descriptions, sample data options
- Completeness: Profile data quality scoring

### Testing Strategy

**Unit Tests (Task 8):**
- **Validation Logic**: Test all edge cases for title, description, evidence, effort validation
- **Scoring Algorithm**: Verify completeness calculation with various input combinations
- **AI Analysis**: Mock Claude responses, test parsing and fallback logic
- **Error Handling**: Test error mapper with all error types (TRPC, network, validation)
- **Help System**: Test search functionality, content retrieval
- **React Components**: Test validation states, error display, help tooltip interactions

**Integration Tests:**
- Form validation flow: Input → validation → error display → correction
- AI validation integration: Form submission → Claude analysis → suggestion display
- Error recovery: Trigger error → display message → execute recovery action
- Contextual help: Click help icon → load content → display tooltip

**End-to-End Tests (Task 7):**
- **Journey 1**: New user signup → onboarding → first session (validates auth, onboarding, session creation)
- **Journey 2**: Complete prioritization (capture → interrogate → compare → matrix → export)
- **Journey 3**: Session resumption (start → add data → close browser → reopen → resume)
- **Journey 4**: Error recovery (Claude API failure → fallback → complete workflow)
- **Journey 5**: Multi-improvement session (10+ improvements → comparisons → export)
- **Journey 6**: Validation usage (incomplete form → validation errors → help → correction)

**Performance Tests (Task 9):**
- Validation response time <50ms for form validation
- AI description analysis <3 seconds (Claude API call)
- Error boundary rendering <100ms
- Help tooltip display <50ms
- Debouncing prevents excessive validation calls

**Accessibility Tests (Task 9):**
- Error states announced to screen readers (ARIA live regions)
- Help tooltips keyboard-navigable (Tab, Enter, Escape)
- Error messages have sufficient color contrast (WCAG 2.1 AA)
- Focus management in error recovery flows

### Technical Debt Resolved

This story resolves technical debt from:
- **Story 1.9**: E2E tests were deferred to 1.10
- **Story 1.10**: E2E tests, broader integration (Task 6), unit tests (Task 7) were deferred
- **Epic 1 Quality**: Zero test coverage for validation infrastructure

### Dependencies

- **Story 1.10**: Must be complete (validation infrastructure exists)
- **Story 1.11**: TypeScript cleanup should be done first to ensure clean baseline

### Success Metrics

- ✅ All 5 workflows (evidence, effort, comparison, export, onboarding) have validation integrated
- ✅ 100% of new validation code has unit test coverage
- ✅ E2E tests cover 6 critical user journeys
- ✅ Performance benchmarks met (<50ms validation, <3s AI analysis)
- ✅ Accessibility tests pass (WCAG 2.1 AA compliance)
- ✅ Zero increase in TypeScript errors
- ✅ All 89+ existing tests continue to pass
- ✅ Code review optional improvements implemented (toast provider, debouncing, loading states, animations)

### References

- [Story 1.10: Input Validation and Error Handling](./1-10-input-validation-and-error-handling.md)
- [Epic 1 Tech Spec: Input Validation](../tech-spec-epic-1.md#ac-010-input-validation-and-error-handling)
- [PRD: Functional Requirements](../PRD.md#functional-requirements)
- [Architecture: API Security](../architecture.md#security-architecture)

## Dev Agent Record

### Context Reference

- Context file will be generated when story moves to ready-for-dev

### Agent Model Used

TBD (to be assigned when story begins)

### Debug Log References

TBD (to be populated during implementation)

### Completion Notes List

TBD (to be populated during implementation)

### File List

**Files to Modify:**
- frank/src/app/_components/frank/evidence-form.tsx (if exists)
- frank/src/app/_components/frank/effort-form.tsx (if exists)
- frank/src/components/frank/onboarding/onboarding-welcome.tsx
- Evidence gathering components (TBD - need to locate)
- Pairwise comparison components (TBD - need to locate)
- Export components (TBD - need to locate)
- Matrix visualization component (add FeatureErrorBoundary)

**Files to Create:**
- frank/package.json (add Playwright dependencies)
- frank/e2e/playwright.config.ts
- frank/e2e/fixtures/auth.ts
- frank/e2e/fixtures/test-data.ts
- frank/e2e/tests/onboarding.spec.ts
- frank/e2e/tests/prioritization-flow.spec.ts
- frank/e2e/tests/session-resumption.spec.ts
- frank/e2e/tests/error-recovery.spec.ts
- frank/e2e/tests/multi-improvement.spec.ts
- frank/e2e/tests/validation.spec.ts
- frank/src/lib/validations/__tests__/completeness-scoring.test.ts
- frank/src/lib/validations/__tests__/custom-validators.test.ts
- frank/src/lib/ai/validation/__tests__/description-analyzer.test.ts
- frank/src/lib/error-handling/__tests__/error-mapper.test.ts
- frank/src/lib/help/__tests__/help-content.test.ts
- frank/src/components/error-handling/__tests__/error-boundary.test.tsx
- frank/src/components/help/__tests__/help-tooltip.test.tsx
- frank/src/components/ui/__tests__/validation-input.test.tsx
- frank/src/components/ui/__tests__/validation-textarea.test.tsx
- frank/src/components/ui/__tests__/completeness-indicator.test.tsx
- frank/src/lib/error-handling/error-toast-provider.tsx (Task 10: Toast context provider)
