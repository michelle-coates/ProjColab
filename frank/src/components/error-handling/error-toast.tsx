/**
 * Error Toast Component
 * Story 1.10: User-friendly error notifications with recovery actions
 */

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type ErrorSeverity = "error" | "warning" | "info";

export interface ErrorToastProps {
  title: string;
  message: string;
  severity?: ErrorSeverity;
  recoveryAction?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
  autoHideDuration?: number;
}

export function ErrorToast({
  title,
  message,
  severity = "error",
  recoveryAction,
  onClose,
  autoHideDuration = 5000,
}: ErrorToastProps) {
  React.useEffect(() => {
    if (autoHideDuration > 0 && onClose) {
      const timer = setTimeout(onClose, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [autoHideDuration, onClose]);

  const getColorClasses = () => {
    switch (severity) {
      case "error":
        return {
          bg: "bg-red-50 border-red-200",
          icon: "text-red-600",
          title: "text-red-900",
          message: "text-red-700",
          button: "bg-red-100 hover:bg-red-200 text-red-800",
        };
      case "warning":
        return {
          bg: "bg-yellow-50 border-yellow-200",
          icon: "text-yellow-600",
          title: "text-yellow-900",
          message: "text-yellow-700",
          button: "bg-yellow-100 hover:bg-yellow-200 text-yellow-800",
        };
      case "info":
        return {
          bg: "bg-blue-50 border-blue-200",
          icon: "text-blue-600",
          title: "text-blue-900",
          message: "text-blue-700",
          button: "bg-blue-100 hover:bg-blue-200 text-blue-800",
        };
    }
  };

  const colors = getColorClasses();

  const getIcon = () => {
    switch (severity) {
      case "error":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        );
      case "warning":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        );
      case "info":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  return (
    <div
      className={cn(
        "pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg",
        colors.bg
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className={cn("flex-shrink-0", colors.icon)}>{getIcon()}</div>
          <div className="ml-3 w-0 flex-1">
            <p className={cn("text-sm font-medium", colors.title)}>{title}</p>
            <p className={cn("mt-1 text-sm", colors.message)}>{message}</p>
            {recoveryAction && (
              <div className="mt-3">
                <button
                  onClick={recoveryAction.onClick}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    colors.button
                  )}
                >
                  {recoveryAction.label}
                </button>
              </div>
            )}
          </div>
          {onClose && (
            <div className="ml-4 flex flex-shrink-0">
              <button
                onClick={onClose}
                className="inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Error Toast Container
 * Manages multiple toast notifications
 */
interface ToastContainerProps {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center";
}

export function ErrorToastContainer({ position = "top-right" }: ToastContainerProps) {
  const getPositionClasses = () => {
    switch (position) {
      case "top-right":
        return "top-0 right-0";
      case "top-left":
        return "top-0 left-0";
      case "bottom-right":
        return "bottom-0 right-0";
      case "bottom-left":
        return "bottom-0 left-0";
      case "top-center":
        return "top-0 left-1/2 -translate-x-1/2";
    }
  };

  return (
    <div
      aria-live="assertive"
      className={cn(
        "pointer-events-none fixed z-50 flex flex-col gap-2 p-4",
        getPositionClasses()
      )}
    >
      {/* Toast notifications will be rendered here via portal or context */}
    </div>
  );
}
