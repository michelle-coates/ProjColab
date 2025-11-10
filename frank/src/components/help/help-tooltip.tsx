/**
 * Help Tooltip Component
 * Story 1.10: Contextual help with "?" icon triggers
 */

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface HelpTooltipProps {
  content: string;
  title?: string;
  learnMoreUrl?: string;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function HelpTooltip({
  content,
  title,
  learnMoreUrl,
  position = "top",
  className,
}: HelpTooltipProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const tooltipRef = React.useRef<HTMLDivElement>(null);

  // Close on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  const getPositionClasses = () => {
    switch (position) {
      case "top":
        return "bottom-full left-1/2 -translate-x-1/2 mb-2";
      case "bottom":
        return "top-full left-1/2 -translate-x-1/2 mt-2";
      case "left":
        return "right-full top-1/2 -translate-y-1/2 mr-2";
      case "right":
        return "left-full top-1/2 -translate-y-1/2 ml-2";
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case "top":
        return "top-full left-1/2 -translate-x-1/2 border-t-gray-900 border-l-transparent border-r-transparent border-b-transparent";
      case "bottom":
        return "bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 border-l-transparent border-r-transparent border-t-transparent";
      case "left":
        return "left-full top-1/2 -translate-y-1/2 border-l-gray-900 border-t-transparent border-b-transparent border-r-transparent";
      case "right":
        return "right-full top-1/2 -translate-y-1/2 border-r-gray-900 border-t-transparent border-b-transparent border-l-transparent";
    }
  };

  return (
    <div className={cn("relative inline-block", className)} ref={tooltipRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-gray-600 transition-colors hover:bg-gray-300 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#76A99A] focus:ring-offset-1"
        aria-label="Help"
        aria-expanded={isOpen}
      >
        <svg
          className="h-3 w-3"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 w-64 rounded-lg bg-gray-900 p-3 text-sm text-white shadow-lg",
            getPositionClasses()
          )}
          role="tooltip"
        >
          {/* Arrow */}
          <div
            className={cn(
              "absolute h-0 w-0 border-4",
              getArrowClasses()
            )}
          />

          {title && (
            <div className="mb-2 font-medium">{title}</div>
          )}
          <div className="text-gray-200">{content}</div>

          {learnMoreUrl && (
            <a
              href={learnMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs text-blue-300 hover:text-blue-200"
            >
              Learn more
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Inline help text (always visible, subtle)
 */
export interface InlineHelpProps {
  children: React.ReactNode;
  className?: string;
}

export function InlineHelp({ children, className }: InlineHelpProps) {
  return (
    <p className={cn("text-sm text-gray-600", className)}>
      {children}
    </p>
  );
}
