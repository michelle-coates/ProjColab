/**
 * Completeness Indicator Component
 * Story 1.10: Display input completeness score with visual feedback
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import type { CompletenessScore } from "@/lib/validations/completeness-scoring";

interface CompletenessIndicatorProps {
  score: CompletenessScore;
  showDetails?: boolean;
  className?: string;
}

export function CompletenessIndicator({
  score,
  showDetails = false,
  className,
}: CompletenessIndicatorProps) {
  const percentage = Math.round(score.score * 100);

  // Determine color scheme based on category
  const getColorClasses = () => {
    switch (score.category) {
      case "excellent":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          bar: "bg-green-500",
          badge: "bg-green-500",
        };
      case "good":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          bar: "bg-blue-500",
          badge: "bg-blue-500",
        };
      case "fair":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          bar: "bg-yellow-500",
          badge: "bg-yellow-500",
        };
      case "poor":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          bar: "bg-red-500",
          badge: "bg-red-500",
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div className={cn("space-y-2", className)}>
      {/* Progress bar and score */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className={cn("h-full transition-all duration-300", colors.bar)}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("text-sm font-medium", colors.text)}>
            {percentage}%
          </span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium text-white",
              colors.badge
            )}
          >
            {score.category}
          </span>
        </div>
      </div>

      {/* Recommendations */}
      {showDetails && score.recommendations.length > 0 && (
        <div className={cn("rounded-md p-3", colors.bg)}>
          <p className={cn("mb-2 text-xs font-medium", colors.text)}>
            Suggestions to improve:
          </p>
          <ul className={cn("space-y-1 text-xs", colors.text)}>
            {score.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Factor breakdown (optional, for debugging or detailed view) */}
      {showDetails && process.env.NODE_ENV === "development" && (
        <details className="text-xs text-gray-600">
          <summary className="cursor-pointer">Score breakdown</summary>
          <ul className="mt-2 space-y-1 pl-4">
            {score.factors.map((factor, idx) => (
              <li key={idx}>
                {factor.name}: {Math.round(factor.score * 100)}% (weight:{" "}
                {factor.weight}) - {factor.reason}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
