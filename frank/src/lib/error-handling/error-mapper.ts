/**
 * Error Mapping Utilities
 * Story 1.10: Map technical errors to user-friendly messages
 */

import { TRPCClientError } from "@trpc/client";
import { errorMessages } from "@/lib/validations/error-messages";

export interface UserFriendlyError {
  title: string;
  message: string;
  recoveryActions?: Array<{
    label: string;
    action: string; // Action identifier for the UI to handle
  }>;
  severity: "error" | "warning" | "info";
}

/**
 * Map any error to a user-friendly message
 */
export function mapErrorToUserFriendly(error: unknown): UserFriendlyError {
  // TRPC errors
  if (error instanceof TRPCClientError) {
    return mapTRPCError(error);
  }

  // Network errors
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return {
      title: "Connection Issue",
      message: "We're having trouble reaching the server. Please check your internet connection and try again.",
      recoveryActions: [
        { label: "Retry", action: "retry" },
        { label: "Refresh Page", action: "refresh" },
      ],
      severity: "error",
    };
  }

  // Generic errors
  if (error instanceof Error) {
    return {
      title: "Something Went Wrong",
      message: error.message || "An unexpected error occurred. Please try again.",
      recoveryActions: [{ label: "Try Again", action: "retry" }],
      severity: "error",
    };
  }

  // Unknown error type
  return {
    title: "Unexpected Error",
    message: "Something unexpected happened. Please refresh the page and try again.",
    recoveryActions: [{ label: "Refresh Page", action: "refresh" }],
    severity: "error",
  };
}

/**
 * Map TRPC errors to user-friendly messages
 */
function mapTRPCError(error: TRPCClientError<any>): UserFriendlyError {
  const code = error.data?.code;
  const message = error.message;

  switch (code) {
    case "UNAUTHORIZED":
      return {
        title: "Authentication Required",
        message: "Please sign in to continue.",
        recoveryActions: [
          { label: "Sign In", action: "sign-in" },
        ],
        severity: "warning",
      };

    case "FORBIDDEN":
      return {
        title: "Access Denied",
        message: errorMessages.generic.unauthorized,
        recoveryActions: [
          { label: "Go Back", action: "go-back" },
        ],
        severity: "error",
      };

    case "NOT_FOUND":
      return {
        title: "Not Found",
        message: errorMessages.generic.notFound,
        recoveryActions: [
          { label: "Go Back", action: "go-back" },
        ],
        severity: "warning",
      };

    case "BAD_REQUEST":
      // Check if this is a validation error
      if (message.includes("validation") || message.includes("invalid")) {
        return {
          title: "Invalid Input",
          message: message || "Please check your input and try again.",
          recoveryActions: [
            { label: "Fix Input", action: "focus-first-error" },
          ],
          severity: "warning",
        };
      }
      return {
        title: "Invalid Request",
        message: message || "There was a problem with your request. Please try again.",
        recoveryActions: [{ label: "Try Again", action: "retry" }],
        severity: "error",
      };

    case "TIMEOUT":
      return {
        title: "Request Timed Out",
        message: "This is taking longer than expected. Please try again.",
        recoveryActions: [
          { label: "Retry", action: "retry" },
        ],
        severity: "warning",
      };

    case "CONFLICT":
      return {
        title: "Conflict Detected",
        message: message || "This action conflicts with existing data. Please refresh and try again.",
        recoveryActions: [
          { label: "Refresh", action: "refresh" },
        ],
        severity: "warning",
      };

    case "INTERNAL_SERVER_ERROR":
    default:
      // Check for specific error patterns
      if (message.includes("Claude") || message.includes("AI")) {
        return {
          title: "AI Service Unavailable",
          message: "Our AI service is temporarily unavailable. Don't worry - you can continue with predefined options.",
          recoveryActions: [
            { label: "Use Fallback", action: "use-fallback" },
            { label: "Try Again", action: "retry" },
          ],
          severity: "warning",
        };
      }

      if (message.includes("database") || message.includes("Prisma")) {
        return {
          title: "Data Service Issue",
          message: "We're having trouble accessing your data. This is usually temporary.",
          recoveryActions: [
            { label: "Retry", action: "retry" },
            { label: "Refresh Page", action: "refresh" },
          ],
          severity: "error",
        };
      }

      return {
        title: "Server Error",
        message: errorMessages.generic.serverError,
        recoveryActions: [
          { label: "Try Again", action: "retry" },
        ],
        severity: "error",
      };
  }
}

/**
 * Map validation errors (Zod) to user-friendly messages
 */
export function mapValidationErrors(errors: Record<string, string[]>): string[] {
  const messages: string[] = [];

  for (const [field, fieldErrors] of Object.entries(errors)) {
    for (const error of fieldErrors) {
      messages.push(`${field}: ${error}`);
    }
  }

  return messages;
}

/**
 * Check if error is recoverable (user can retry)
 */
export function isRecoverableError(error: unknown): boolean {
  if (error instanceof TRPCClientError) {
    const code = error.data?.code;
    // These errors are generally recoverable with retry
    return ["TIMEOUT", "INTERNAL_SERVER_ERROR", "BAD_GATEWAY", "SERVICE_UNAVAILABLE"].includes(code);
  }

  // Network errors are usually recoverable
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return true;
  }

  return false;
}

/**
 * Get recovery suggestion based on error type
 */
export function getRecoverySuggestion(error: unknown): string {
  const friendlyError = mapErrorToUserFriendly(error);

  if (friendlyError.recoveryActions && friendlyError.recoveryActions.length > 0) {
    return friendlyError.recoveryActions[0]!.label;
  }

  return "Try again";
}
