/**
 * Global Error Boundary Component
 * Story 1.10: Graceful Error Handling Framework
 *
 * Catches React errors and displays user-friendly messages with recovery options
 */

"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console (in production, send to error tracking service)
    console.error('Error Boundary caught an error:', error, errorInfo);

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Oops! Something went wrong
                </h2>
                <p className="text-sm text-gray-600">
                  We encountered an unexpected error
                </p>
              </div>
            </div>

            <div className="mb-6 rounded-md bg-gray-50 p-4">
              <p className="text-sm text-gray-700">
                Don't worry - your data is safe. This is a temporary issue that we can usually fix with a quick refresh.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={this.handleReset}
                className="w-full bg-[#76A99A] hover:bg-[#669186]"
              >
                Try Again
              </Button>
              <Button
                onClick={this.handleReload}
                variant="outline"
                className="w-full"
              >
                Refresh Page
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-gray-600">
                  Error details (dev only)
                </summary>
                <pre className="mt-2 overflow-auto rounded bg-gray-900 p-3 text-xs text-gray-100">
                  {this.state.error.toString()}
                  {'\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Feature-specific error boundary for non-critical features
 */
interface FeatureErrorBoundaryProps extends ErrorBoundaryProps {
  featureName: string;
}

export function FeatureErrorBoundary({
  children,
  featureName,
  onError,
}: FeatureErrorBoundaryProps) {
  return (
    <ErrorBoundary
      onError={onError}
      fallback={
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 h-5 w-5 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800">
                {featureName} temporarily unavailable
              </h3>
              <p className="mt-1 text-sm text-yellow-700">
                This feature encountered an error. The rest of the application is working normally.
              </p>
            </div>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
