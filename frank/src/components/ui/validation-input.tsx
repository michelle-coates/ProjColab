/**
 * Validation Input Component
 * Story 1.10: Enhanced input with validation states and completeness feedback
 */

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ValidationInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Validation error message */
  error?: string;
  /** Warning message (non-blocking) */
  warning?: string;
  /** Success message */
  success?: string;
  /** Current character count */
  currentLength?: number;
  /** Maximum allowed length */
  maxLength?: number;
  /** Show character count */
  showCount?: boolean;
  /** Validation state */
  validationState?: "error" | "warning" | "success" | "default";
}

const ValidationInput = React.forwardRef<HTMLInputElement, ValidationInputProps>(
  (
    {
      className,
      type,
      error,
      warning,
      success,
      currentLength,
      maxLength,
      showCount = false,
      validationState = "default",
      ...props
    },
    ref
  ) => {
    // Determine border color based on state
    const getBorderColor = () => {
      if (error || validationState === "error") return "border-red-300 focus:border-red-500 focus:ring-red-500";
      if (warning || validationState === "warning") return "border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500";
      if (success || validationState === "success") return "border-green-300 focus:border-green-500 focus:ring-green-500";
      return "border-gray-300 focus:border-[#76A99A] focus:ring-[#76A99A]";
    };

    const message = error || warning || success;
    const messageColor = error
      ? "text-red-600"
      : warning
      ? "text-yellow-600"
      : success
      ? "text-green-600"
      : "text-gray-500";

    const countColor =
      currentLength && maxLength && currentLength > maxLength
        ? "text-red-600"
        : currentLength && maxLength && currentLength > maxLength * 0.9
        ? "text-yellow-600"
        : "text-gray-500";

    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            getBorderColor(),
            className
          )}
          ref={ref}
          {...props}
        />
        {(message || showCount) && (
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className={messageColor}>
              {message || " "}
            </span>
            {showCount && currentLength !== undefined && maxLength !== undefined && (
              <span className={countColor}>
                {currentLength}/{maxLength}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);
ValidationInput.displayName = "ValidationInput";

export { ValidationInput };
