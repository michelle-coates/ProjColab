/**
 * Error Boundary Wrapper for Root Layout
 * Story 1.10: Input Validation and Error Handling
 *
 * Client component wrapper to use ErrorBoundary in server components
 */

"use client";

import { ErrorBoundary } from "./error-boundary";

export function ErrorBoundaryWrapper({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
