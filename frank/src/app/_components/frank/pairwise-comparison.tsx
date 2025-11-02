"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronsDown, Sparkles } from "lucide-react";

interface PairwiseComparisonProps {
  sessionId?: string;
}

const quickRationales = [
  "More users affected",
  "Higher frequency",
  "Easier to implement",
  "Supports strategic goal",
  "Customer feedback priority",
];

const effortColors = {
  SMALL: "bg-green-100 text-green-800 border-green-500",
  MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-500",
  LARGE: "bg-red-100 text-red-800 border-red-500",
};

export function PairwiseComparison({ sessionId }: PairwiseComparisonProps) {
  const router = useRouter();
  const [rationale, setRationale] = useState("");
  const [selectedQuickRationale, setSelectedQuickRationale] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  
  const utils = api.useUtils();
  
  const { data: pairData, isLoading } = api.decisions.getNextPair.useQuery({ 
    sessionId 
  });
  
  const recordDecision = api.decisions.recordDecision.useMutation({
    onSuccess: async () => {
      setRationale("");
      setSelectedQuickRationale(null);
      setSelectedItemId(null);
      // Refetch next pair
      await utils.decisions.getNextPair.invalidate({ sessionId });
      await utils.decisions.getRanking.invalidate({ sessionId });
    },
  });

  const handleChoice = useCallback((winnerId: string) => {
    if (!pairData?.itemA || !pairData?.itemB) return;
    
    setSelectedItemId(winnerId);
    
    recordDecision.mutate({
      sessionId,
      itemAId: pairData.itemA.id,
      itemBId: pairData.itemB.id,
      winnerId,
      rationale: rationale || undefined,
      quickRationale: selectedQuickRationale || undefined,
    });
  }, [pairData, sessionId, rationale, selectedQuickRationale, recordDecision]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!pairData?.itemA || !pairData?.itemB || pairData.complete) return;
      
      // Ignore if typing in textarea
      if (event.target instanceof HTMLTextAreaElement) return;
      
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          handleChoice(pairData.itemA.id);
          break;
        case "ArrowRight":
          event.preventDefault();
          handleChoice(pairData.itemB.id);
          break;
        case "ArrowDown":
          event.preventDefault();
          // Skip functionality - refetch to get next pair
          void utils.decisions.getNextPair.invalidate({ sessionId });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pairData, sessionId, handleChoice, utils]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#76A99A] border-r-transparent"></div>
          <p className="text-gray-700">Loading comparison...</p>
        </div>
      </div>
    );
  }

  if (!pairData) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-800">Error loading comparison data</p>
      </div>
    );
  }

  if (pairData.complete) {
    return (
      <div className="rounded-lg border border-[#76A99A] bg-white p-8 text-center shadow-sm">
        <div className="mb-4 text-6xl">🎉</div>
        <h2 className="mb-2 text-2xl font-bold text-[#76A99A]">
          All comparisons complete!
        </h2>
        <p className="mb-6 text-gray-600">
          You've built a ranking for your improvements. Ready to see the results?
        </p>
        <button
          onClick={() => router.push("/dashboard/ranking")}
          className="rounded-md bg-[#76A99A] px-6 py-3 text-white transition-colors hover:bg-[#5f8a7d]"
        >
          View Ranking
        </button>
      </div>
    );
  }

  const { itemA, itemB, prompt, progress } = pairData;

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Comparison {progress.completed + 1} · {progress.percentage}% complete
        </p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
          <div 
            className="h-full bg-[#76A99A] transition-all duration-300"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>
      
      {/* Decision prompt */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#1D1F21]">
          {prompt}
        </h2>
      </div>
      
      {/* Comparison cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {itemA && itemB && (
          <>
            <ComparisonCard 
              item={itemA} 
              onSelect={() => handleChoice(itemA.id)}
              shortcut="←"
              isLoading={recordDecision.isPending}
              isSelected={selectedItemId === itemA.id}
            />
            <ComparisonCard 
              item={itemB} 
              onSelect={() => handleChoice(itemB.id)}
              shortcut="→"
              isLoading={recordDecision.isPending}
              isSelected={selectedItemId === itemB.id}
            />
          </>
        )}
      </div>
      
      {/* Rationale capture */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Why did you choose this one? (optional but recommended)
        </label>
        
        <div className="mb-3 flex flex-wrap gap-2">
          {quickRationales.map(quick => (
            <button
              key={quick}
              onClick={() => setSelectedQuickRationale(
                selectedQuickRationale === quick ? null : quick
              )}
              className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                selectedQuickRationale === quick
                  ? "border-[#76A99A] bg-[#76A99A] text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:border-[#76A99A]"
              }`}
            >
              {quick}
            </button>
          ))}
        </div>
        
        <textarea
          value={rationale}
          onChange={(e) => setRationale(e.target.value)}
          placeholder="What makes this more valuable? What evidence supports this decision?"
          rows={2}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#76A99A] focus:outline-none focus:ring-1 focus:ring-[#76A99A]"
        />
      </div>
      
      {/* Skip option */}
      <div className="text-center">
        <button
          onClick={() => void utils.decisions.getNextPair.invalidate({ sessionId })}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          <ChevronsDown className="mr-1 inline-block h-4 w-4" />
          Skip this comparison
        </button>
        <p className="mt-1 text-xs text-gray-500">
          Use ← → arrow keys to choose, ↓ to skip
        </p>
      </div>
    </div>
  );
}

interface ComparisonCardProps {
  item: {
    id: string;
    title?: string;
    description?: string | null;
    category?: string;
    effortLevel?: string | null;
    evidence?: Array<{ content: string }>;
    [key: string]: unknown;
  };
  onSelect: () => void;
  shortcut: string;
  isLoading: boolean;
  isSelected: boolean;
}

function ComparisonCard({ item, onSelect, shortcut, isLoading, isSelected }: ComparisonCardProps) {
  const categoryDisplay = (item.category || "OTHER").replace(/_/g, " ");
  const effortLevel = item.effortLevel as keyof typeof effortColors | null;
  
  return (
    <button
      onClick={onSelect}
      disabled={isLoading}
      className={`group relative cursor-pointer rounded-lg border-2 bg-white p-4 text-left transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 ${
        isSelected 
          ? "border-[#76A99A] bg-[#76A99A]/5 shadow-lg" 
          : "border-gray-200 hover:border-[#76A99A]"
      }`}
    >
      <div className="mb-3 flex items-start justify-between">
        <span className="rounded-full border border-gray-300 px-2 py-1 text-xs text-gray-700">
          {categoryDisplay}
        </span>
        {effortLevel && (
          <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${effortColors[effortLevel]}`}>
            {effortLevel[0]} {/* S, M, or L */}
          </span>
        )}
      </div>
      
      <h3 className="mb-2 font-semibold text-[#1D1F21]">
        {item.title || "Untitled"}
      </h3>
      <p className="mb-3 line-clamp-3 text-sm text-gray-600">
        {item.description || "No description"}
      </p>
      
      {item.evidence && item.evidence.length > 0 && (
        <div className="mb-3 rounded-md bg-[#76A99A]/10 p-2">
          <p className="flex items-start text-xs text-gray-700">
            <Sparkles className="mr-1 mt-0.5 h-3 w-3 flex-shrink-0 text-[#76A99A]" />
            <span className="line-clamp-2">
              Evidence: {item.evidence[0]!.content.substring(0, 80)}...
            </span>
          </p>
        </div>
      )}
      
      <div className="mt-4 flex items-center justify-between rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 group-hover:border-[#76A99A] group-hover:bg-[#76A99A] group-hover:text-white">
        <span>Choose this</span>
        <kbd className="rounded bg-white px-2 py-1 text-xs text-gray-700 group-hover:bg-[#5f8a7d] group-hover:text-white">
          {shortcut}
        </kbd>
      </div>
    </button>
  );
}
