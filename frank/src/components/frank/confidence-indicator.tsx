"use client";

import {
  getConfidenceLevel,
  getConfidenceColor,
} from "@/lib/ai/analytics/evidence-scoring";

interface ConfidenceIndicatorProps {
  value: number;
  showPercentage?: boolean;
  className?: string;
}

export function ConfidenceIndicator({
  value,
  showPercentage = true,
  className = "",
}: ConfidenceIndicatorProps) {
  const percentage = Math.round(value * 100);
  const level = getConfidenceLevel(value);
  const colorClass = getConfidenceColor(value);

  const colorMap: Record<string, string> = {
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
  };

  const textColorMap: Record<string, string> = {
    green: "text-green-700",
    yellow: "text-yellow-700",
    red: "text-red-700",
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full transition-all duration-300 ${colorMap[colorClass]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <span className={`text-sm font-medium ${textColorMap[colorClass]}`}>
          {percentage}%
        </span>
      )}
      <span className="text-xs text-gray-500 capitalize">({level})</span>
    </div>
  );
}
