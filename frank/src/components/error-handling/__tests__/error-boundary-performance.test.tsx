/**
 * Performance Tests for Error Boundary
 * Story 1.12 - Task 9: Error Boundary Rendering Performance
 *
 * Tests that error boundary rendering completes in <100ms
 */

import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary, FeatureErrorBoundary } from '../error-boundary';

// Component that throws an error for testing
function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Normal content</div>;
}

describe('Error Boundary Performance Tests', () => {
  // Suppress console errors in tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  describe('Error boundary rendering <100ms', () => {
    it('should render error fallback UI in less than 100ms', () => {
      const startTime = performance.now();

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(100);
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    });

    it('should render FeatureErrorBoundary fallback in less than 100ms', () => {
      const startTime = performance.now();

      render(
        <FeatureErrorBoundary featureName="Matrix Visualization">
          <ThrowError shouldThrow={true} />
        </FeatureErrorBoundary>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(100);
      expect(screen.getByText(/Matrix Visualization temporarily unavailable/i)).toBeInTheDocument();
    });

    it('should catch error and render without delay', () => {
      const onError = vi.fn();
      const startTime = performance.now();

      render(
        <ErrorBoundary onError={onError}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const catchTime = performance.now() - startTime;

      expect(catchTime).toBeLessThan(50); // Error catching should be instant
      expect(onError).toHaveBeenCalled();
    });

    it('should render normal content without overhead when no error', () => {
      const startTime = performance.now();

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      const renderTime = performance.now() - startTime;

      expect(renderTime).toBeLessThan(50);
      expect(screen.getByText('Normal content')).toBeInTheDocument();
    });
  });

  describe('Error recovery performance', () => {
    it('should reset error state quickly', async () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();

      const startTime = performance.now();

      // Simulate reset by rerendering with non-erroring component
      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      const resetTime = performance.now() - startTime;

      expect(resetTime).toBeLessThan(50);
    });
  });

  describe('Multiple error boundaries performance', () => {
    it('should handle nested error boundaries efficiently', () => {
      const startTime = performance.now();

      render(
        <ErrorBoundary>
          <div>
            <FeatureErrorBoundary featureName="Feature 1">
              <ThrowError shouldThrow={false} />
            </FeatureErrorBoundary>
            <FeatureErrorBoundary featureName="Feature 2">
              <ThrowError shouldThrow={false} />
            </FeatureErrorBoundary>
            <FeatureErrorBoundary featureName="Feature 3">
              <ThrowError shouldThrow={false} />
            </FeatureErrorBoundary>
          </div>
        </ErrorBoundary>
      );

      const renderTime = performance.now() - startTime;

      // Multiple boundaries should still render quickly
      expect(renderTime).toBeLessThan(100);
    });

    it('should isolate errors to specific feature boundaries', () => {
      const startTime = performance.now();

      render(
        <div>
          <FeatureErrorBoundary featureName="Working Feature">
            <ThrowError shouldThrow={false} />
          </FeatureErrorBoundary>
          <FeatureErrorBoundary featureName="Broken Feature">
            <ThrowError shouldThrow={true} />
          </FeatureErrorBoundary>
          <FeatureErrorBoundary featureName="Another Working Feature">
            <ThrowError shouldThrow={false} />
          </FeatureErrorBoundary>
        </div>
      );

      const renderTime = performance.now() - startTime;

      expect(renderTime).toBeLessThan(100);
      expect(screen.getAllByText('Normal content').length).toBe(2); // Working features render
      expect(screen.getByText(/Broken Feature temporarily unavailable/i)).toBeInTheDocument();
    });
  });

  describe('Custom fallback rendering performance', () => {
    it('should render custom fallback efficiently', () => {
      const customFallback = (
        <div className="custom-error">
          <h1>Custom Error UI</h1>
          <p>Something went wrong with this feature</p>
        </div>
      );

      const startTime = performance.now();

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const renderTime = performance.now() - startTime;

      expect(renderTime).toBeLessThan(100);
      expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
    });
  });

  describe('Error boundary with complex children', () => {
    it('should handle deeply nested component trees', () => {
      const ComplexTree = () => (
        <div>
          <div>
            <div>
              <div>
                <div>
                  <ThrowError shouldThrow={false} />
                </div>
              </div>
            </div>
          </div>
        </div>
      );

      const startTime = performance.now();

      render(
        <ErrorBoundary>
          <ComplexTree />
        </ErrorBoundary>
      );

      const renderTime = performance.now() - startTime;

      expect(renderTime).toBeLessThan(100);
      expect(screen.getByText('Normal content')).toBeInTheDocument();
    });

    it('should catch errors in deeply nested components quickly', () => {
      const ComplexTreeWithError = () => (
        <div>
          <div>
            <div>
              <div>
                <div>
                  <ThrowError shouldThrow={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
      );

      const startTime = performance.now();

      render(
        <ErrorBoundary>
          <ComplexTreeWithError />
        </ErrorBoundary>
      );

      const renderTime = performance.now() - startTime;

      expect(renderTime).toBeLessThan(100);
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    });
  });
});
