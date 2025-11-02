"use client";

import { api } from "@/trpc/react";
import { Trophy, Target, Sparkles } from "lucide-react";

interface RankingViewProps {
  sessionId?: string;
}

const effortColors = {
  SMALL: "bg-green-100 text-green-800 border-green-500",
  MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-500",
  LARGE: "bg-red-100 text-red-800 border-red-500",
};

const effortLabels = {
  SMALL: "S",
  MEDIUM: "M",
  LARGE: "L",
} as const;

const confidenceColors = {
  high: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-gray-100 text-gray-800",
};

export function RankingView({ sessionId }: RankingViewProps) {
  const { data: rankedItems, isLoading } = api.decisions.getRanking.useQuery({
    sessionId,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#76A99A] border-r-transparent"></div>
          <p className="text-gray-700">Loading ranking...</p>
        </div>
      </div>
    );
  }

  if (!rankedItems || rankedItems.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
        <p className="text-gray-600">
          No items ranked yet. Start by comparing your improvements.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold text-[#1D1F21]">
          Your Prioritized Improvements
        </h2>
        <p className="text-gray-600">
          Based on {rankedItems.length} items and your pairwise decisions
        </p>
      </div>

      {/* Ranking list */}
      <div className="space-y-3">
        {rankedItems.map((item: any, index: number) => {
          const confidence = getConfidenceLevel(item.rankConfidence);
          const effortLevel = item.effortLevel as keyof typeof effortColors | null;
          const categoryDisplay = (item.category || "OTHER").replace(/_/g, " ");
          const winsCount = item.decisionsAsWinner?.length ?? 0;

          return (
            <div
              key={item.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                {/* Rank badge */}
                <div className="flex-shrink-0">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    index === 0 
                      ? "bg-yellow-100" 
                      : index === 1 
                      ? "bg-gray-200" 
                      : index === 2
                      ? "bg-orange-100"
                      : "bg-[#76A99A]/10"
                  }`}>
                    {index === 0 ? (
                      <Trophy className="h-6 w-6 text-yellow-600" />
                    ) : (
                      <span className="text-lg font-bold text-gray-700">
                        {item.rankPosition ?? index + 1}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-[#1D1F21]">
                      {item.title || "Untitled"}
                    </h3>
                    <span className="rounded-full border border-gray-300 px-2 py-0.5 text-xs text-gray-700">
                      {categoryDisplay}
                    </span>
                    {effortLevel && (
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${effortColors[effortLevel]}`}>
                        {effortLabels[effortLevel]}
                      </span>
                    )}
                  </div>

                  <p className="mb-2 text-sm text-gray-600">
                    {item.description || "No description"}
                  </p>

                  {/* Metrics */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      <span>Impact: {Math.round(item.impactScore ?? 1500)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="h-3 w-3" />
                      <span>{winsCount} wins</span>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 ${confidenceColors[confidence]}`}>
                      {confidence} confidence
                    </span>
                  </div>

                  {/* Evidence preview */}
                  {item.evidence && item.evidence.length > 0 && (
                    <div className="mt-2 rounded-md bg-[#76A99A]/10 p-2">
                      <p className="flex items-start text-xs text-gray-700">
                        <Sparkles className="mr-1 mt-0.5 h-3 w-3 flex-shrink-0 text-[#76A99A]" />
                        <span className="line-clamp-1">
                          {item.evidence[0]!.content}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getConfidenceLevel(confidence: number | null | undefined): "low" | "medium" | "high" {
  if (!confidence) return "low";
  if (confidence >= 0.7) return "high";
  if (confidence >= 0.5) return "medium";
  return "low";
}
