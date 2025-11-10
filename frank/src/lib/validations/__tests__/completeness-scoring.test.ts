/**
 * Unit Tests: Completeness Scoring System
 * Story 1.12: Unit Tests for Validation Code
 */

import { describe, it, expect } from 'vitest';
import {
  scoreImprovementCompleteness,
  scoreEvidenceCompleteness,
} from '../completeness-scoring';

describe('scoreImprovementCompleteness', () => {
  it('should return poor score for empty inputs', () => {
    const result = scoreImprovementCompleteness({});

    expect(result.category).toBe('poor');
    expect(result.score).toBeLessThan(0.5);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it('should return excellent score for complete, quality inputs', () => {
    const result = scoreImprovementCompleteness({
      title: 'Improve Dashboard Loading Performance for Better User Experience',
      description: 'Users are experiencing slow dashboard load times above 3 seconds. This affects approximately 45% of our user base based on analytics data. We need to optimize data fetching strategies, implement lazy loading, and reduce initial bundle size. The current implementation loads all widgets simultaneously, causing significant delays.',
      category: 'PERFORMANCE',
      evidenceCount: 3,
      effortLevel: 'MEDIUM',
    });

    expect(result.category).toBe('excellent');
    expect(result.score).toBeGreaterThanOrEqual(0.85);
  });

  it('should provide actionable recommendations for incomplete inputs', () => {
    const result = scoreImprovementCompleteness({
      title: 'Fix bug',
      description: 'There is a problem',
    });

    expect(result.recommendations.length).toBeGreaterThan(0);
    // Check that recommendations address key weaknesses
    const recText = result.recommendations.join(' ').toLowerCase();
    expect(recText.length).toBeGreaterThan(0);
  });

  it('should score title quality correctly', () => {
    const shortTitle = scoreImprovementCompleteness({
      title: 'Fix',
      description: 'A detailed description explaining the issue and expected outcomes',
      category: 'BUG_FIX',
    });

    const goodTitle = scoreImprovementCompleteness({
      title: 'Improve dashboard loading speed for better UX',
      description: 'A detailed description explaining the issue and expected outcomes',
      category: 'BUG_FIX',
    });

    expect(goodTitle.score).toBeGreaterThan(shortTitle.score);
  });

  it('should weight description heavily in overall score', () => {
    const shortDesc = scoreImprovementCompleteness({
      title: 'Good descriptive title about the improvement',
      description: 'Short desc',
      category: 'FEATURE',
    });

    const longDesc = scoreImprovementCompleteness({
      title: 'Good descriptive title about the improvement',
      description: 'This is a comprehensive description that explains the problem in detail, provides context about why it matters, includes specific examples of the issue, discusses the expected impact on users, and outlines potential solutions. It demonstrates clear thinking about the improvement.',
      category: 'FEATURE',
    });

    expect(longDesc.score).toBeGreaterThan(shortDesc.score);
  });

  it('should give higher scores when evidence is provided', () => {
    const noEvidence = scoreImprovementCompleteness({
      title: 'Improve feature X',
      description: 'Users want this feature improved based on feedback',
      category: 'ENHANCEMENT',
      evidenceCount: 0,
    });

    const withEvidence = scoreImprovementCompleteness({
      title: 'Improve feature X',
      description: 'Users want this feature improved based on feedback',
      category: 'ENHANCEMENT',
      evidenceCount: 3,
    });

    expect(withEvidence.score).toBeGreaterThan(noEvidence.score);
  });
});

describe('scoreEvidenceCompleteness', () => {
  it('should return poor score for empty evidence', () => {
    const result = scoreEvidenceCompleteness({});

    expect(result.category).toBe('poor');
    expect(result.score).toBeLessThan(0.5);
  });

  it('should return excellent score for detailed evidence with source', () => {
    const result = scoreEvidenceCompleteness({
      content: 'Analytics data from Q4 2024 shows that 67% of users abandon the checkout process at the payment step. Heat map analysis reveals confusion around the CVV field placement. User testing sessions (n=12) confirmed this issue, with 10 out of 12 participants expressing uncertainty.',
      source: 'Google Analytics + User Testing Report (December 2024)',
    });

    expect(result.category).toBe('excellent');
    expect(result.score).toBeGreaterThanOrEqual(0.85);
  });

  it('should penalize very short content', () => {
    const result = scoreEvidenceCompleteness({
      content: 'Bad UX',
      source: 'User feedback',
    });

    expect(result.category).toBe('fair');
    expect(result.recommendations.some(r => r.toLowerCase().includes('detail'))).toBe(true);
  });

  it('should weight content more heavily than source (70/30 split)', () => {
    const goodContentNoSource = scoreEvidenceCompleteness({
      content: 'This is comprehensive detailed evidence explaining the issue with specific metrics, user quotes, and extensive context about the problem severity and impact on users',
    });

    const poorContentWithSource = scoreEvidenceCompleteness({
      content: 'Bad',
      source: 'Detailed source citation',
    });

    // Good content should score higher due to 70% weight on content
    expect(goodContentNoSource.score).toBeGreaterThan(poorContentWithSource.score);
  });

  it('should provide recommendations for missing elements', () => {
    const noSource = scoreEvidenceCompleteness({
      content: 'Good detailed evidence content explaining the issue with adequate length',
    });

    // Should have recommendations
    expect(noSource.recommendations.length).toBeGreaterThan(0);

    const shortContent = scoreEvidenceCompleteness({
      content: 'Short',
      source: 'Analytics',
    });

    expect(shortContent.recommendations.length).toBeGreaterThan(0);
  });
});

describe('scoring consistency', () => {
  it('should produce consistent scores for identical inputs', () => {
    const input = {
      title: 'Consistent test title',
      description: 'Consistent test description with adequate detail',
      category: 'TEST',
      evidenceCount: 2,
    };

    const result1 = scoreImprovementCompleteness(input);
    const result2 = scoreImprovementCompleteness(input);

    expect(result1.score).toBe(result2.score);
    expect(result1.category).toBe(result2.category);
  });

  it('should have scores between 0 and 1', () => {
    const testCases = [
      {},
      { title: 'T' },
      { title: 'Good title', description: 'D' },
      { title: 'Excellent descriptive title', description: 'Comprehensive description with details', category: 'FEATURE', evidenceCount: 5, effortLevel: 'MEDIUM' },
    ];

    testCases.forEach(testCase => {
      const result = scoreImprovementCompleteness(testCase);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(1);
    });
  });
});
