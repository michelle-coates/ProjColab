/**
 * Test Helper Functions for Creating Mock Data
 *
 * These helpers ensure test mocks match the Prisma schema exactly,
 * preventing type drift between tests and production code.
 */

import { type ImprovementItem, type PrioritizationSession, type Category, type EffortLevel, type SessionStatus } from "@prisma/client";

/**
 * Creates a complete ImprovementItem mock with all required Prisma fields
 *
 * @example
 * ```ts
 * const mockItem = createMockImprovementItem({
 *   id: '1',
 *   title: 'Test Improvement',
 *   category: 'UI_UX',
 * });
 * ```
 */
export function createMockImprovementItem(
  overrides: Partial<ImprovementItem> = {}
): ImprovementItem {
  const baseDate = new Date('2025-01-01');

  return {
    id: 'test-improvement-id',
    userId: 'test-user-id',
    sessionId: 'test-session-id',
    title: 'Test Improvement',
    description: 'Test Description',
    category: 'FEATURE' as Category,
    effortLevel: 'MEDIUM' as EffortLevel,
    impactScore: 0.5,
    matrixPosition: { x: 0.5, y: 0.5 },
    rankPosition: null,
    rankConfidence: null,
    effortRationale: null,
    effortEstimatedAt: null,
    effortRevisedAt: null,
    isOnboardingSample: false, // Story 1.17: Default to false for test data
    createdAt: baseDate,
    updatedAt: baseDate,
    ...overrides,
  };
}

/**
 * Creates a complete PrioritizationSession mock with all required Prisma fields
 *
 * @example
 * ```ts
 * const mockSession = createMockPrioritizationSession({
 *   id: 'session-1',
 *   name: 'Q4 Planning',
 *   status: 'ACTIVE',
 * });
 * ```
 */
export function createMockPrioritizationSession(
  overrides: Partial<PrioritizationSession> = {}
): PrioritizationSession {
  const baseDate = new Date('2025-01-01');

  return {
    id: 'test-session-id',
    userId: 'test-user-id',
    name: 'Test Session',
    description: 'Test Session Description',
    status: 'ACTIVE' as SessionStatus,
    isOnboarding: false,
    startedAt: baseDate,
    completedAt: null,
    createdAt: baseDate,
    updatedAt: baseDate,
    ...overrides,
  };
}

/**
 * Creates multiple ImprovementItem mocks with sequential IDs
 *
 * @example
 * ```ts
 * const mockItems = createMockImprovementItems(3, {
 *   category: 'UI_UX',
 * });
 * // Returns 3 items with ids: 'test-improvement-1', 'test-improvement-2', 'test-improvement-3'
 * ```
 */
export function createMockImprovementItems(
  count: number,
  baseOverrides: Partial<ImprovementItem> = {}
): ImprovementItem[] {
  return Array.from({ length: count }, (_, index) =>
    createMockImprovementItem({
      ...baseOverrides,
      id: `test-improvement-${index + 1}`,
      title: `Test Improvement ${index + 1}`,
    })
  );
}
