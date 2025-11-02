"use client";

import { useState, useRef, useEffect } from "react";
import { api } from "@/trpc/react";

type EffortLevel = "SMALL" | "MEDIUM" | "LARGE";

interface ConversationTurn {
  speaker: "AI" | "USER";
  message: string;
  timestamp: string;
}

interface EffortOption {
  level: EffortLevel;
  label: string;
  description: string;
  examples: string;
  borderColor: string;
  bgColor: string;
}

const effortOptions: EffortOption[] = [
  {
    level: "SMALL",
    label: "Small",
    description: "Hours to a day",
    examples: "Minor tweaks, config changes, simple fixes",
    borderColor: "border-green-500",
    bgColor: "bg-green-50 dark:bg-green-950",
  },
  {
    level: "MEDIUM",
    label: "Medium",
    description: "Days to a week",
    examples: "Feature additions, moderate refactoring, multi-component changes",
    borderColor: "border-yellow-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950",
  },
  {
    level: "LARGE",
    label: "Large",
    description: "Weeks or more",
    examples: "Significant features, architectural changes, cross-system impacts",
    borderColor: "border-red-500",
    bgColor: "bg-red-50 dark:bg-red-950",
  },
];

interface EffortEstimatorProps {
  improvementId: string;
  currentEffort?: {
    level: EffortLevel;
    rationale: string;
  };
  onSuccess?: () => void;
}

export function EffortEstimator({
  improvementId,
  currentEffort,
  onSuccess,
}: EffortEstimatorProps) {
  const [selectedEffort, setSelectedEffort] = useState<EffortLevel | null>(
    currentEffort?.level ?? null,
  );
  const [rationale, setRationale] = useState(currentEffort?.rationale ?? "");
  const [showGuidance, setShowGuidance] = useState(false);
  const [conversationTurns, setConversationTurns] = useState<ConversationTurn[]>([]);
  const [userResponse, setUserResponse] = useState("");
  const [aiRecommendation, setAiRecommendation] = useState<{
    recommendation: string;
    suggestedLevel: EffortLevel;
    reasoning: string;
  } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const utils = api.useUtils();

  const { data: guidance, isLoading: isLoadingGuidance } =
    api.improvements.getEffortGuidance.useQuery(
      { improvementId },
      { enabled: showGuidance && conversationTurns.length === 0 },
    );

  const setEffort = api.improvements.setEffort.useMutation({
    onSuccess: () => {
      // Refresh improvement data and distribution
      void utils.improvements.getById.invalidate({ id: improvementId });
      void utils.improvements.list.invalidate();
      void utils.improvements.getEffortDistribution.invalidate();
      onSuccess?.();
    },
  });

  const analyzeResponses = api.improvements.analyzeEffortResponses.useMutation({
    onSuccess: (data) => {
      setAiRecommendation({
        recommendation: data.recommendation,
        suggestedLevel: data.suggestedLevel,
        reasoning: data.reasoning,
      });
      
      // Add AI recommendation to conversation
      const aiTurn: ConversationTurn = {
        speaker: "AI",
        message: `${data.recommendation}\n\n${data.reasoning}`,
        timestamp: new Date().toISOString(),
      };
      setConversationTurns((prev) => [...prev, aiTurn]);
      scrollToBottom();
    },
  });

  // Add initial AI guidance to conversation when it loads
  useEffect(() => {
    if (guidance && conversationTurns.length === 0) {
      const aiTurn: ConversationTurn = {
        speaker: "AI",
        message: guidance.questions,
        timestamp: new Date().toISOString(),
      };
      setConversationTurns([aiTurn]);
      scrollToBottom();
    }
  }, [guidance]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleGuidanceResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userResponse.trim()) return;

    // Add user response to conversation
    const userTurn: ConversationTurn = {
      speaker: "USER",
      message: userResponse,
      timestamp: new Date().toISOString(),
    };

    setConversationTurns((prev) => [...prev, userTurn]);
    
    // Append to rationale
    const updatedRationale = rationale 
      ? `${rationale}\n\n${userResponse}`
      : userResponse;
    setRationale(updatedRationale);
    
    setUserResponse("");
    
    // Analyze all user responses so far to get AI recommendation
    const allUserResponses = [...conversationTurns.filter(t => t.speaker === "USER").map(t => t.message), userResponse];
    analyzeResponses.mutate({
      improvementId,
      userResponses: allUserResponses,
    });
    
    scrollToBottom();
  };

  const handleSubmit = () => {
    if (!selectedEffort) return;
    
    // Require rationale only if it's not empty (allow empty for quick estimates)
    if (rationale.trim().length > 0 && rationale.trim().length < 10) return;

    setEffort.mutate({
      improvementId,
      effortLevel: selectedEffort,
      rationale: rationale.trim() || `Estimated as ${selectedEffort}`,
    });
  };

  const isRevision = currentEffort !== undefined;
  const rationalePrompt = selectedEffort
    ? `Why ${selectedEffort.toLowerCase()}? Consider scope, dependencies, unknowns, risk.`
    : "Explain your effort estimate...";

  return (
    <div className="space-y-4">
      {isRevision && currentEffort && (
        <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Previous estimate:</strong> {currentEffort.level} -{" "}
            {currentEffort.rationale}
          </p>
        </div>
      )}

      <div className="grid gap-3">
        {effortOptions.map((option) => (
          <div
            key={option.level}
            className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
              selectedEffort === option.level
                ? `${option.borderColor} ${option.bgColor}`
                : "border-gray-200 dark:border-gray-700"
            }`}
            onClick={() => setSelectedEffort(option.level)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-[#76A99A]">
                  {option.label}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {option.description}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  {option.examples}
                </p>
              </div>
              {selectedEffort === option.level && (
                <div className="h-5 w-5 rounded-full bg-[#76A99A]" />
              )}
            </div>
          </div>
        ))}
      </div>

      {!showGuidance && (
        <button
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
          onClick={() => setShowGuidance(true)}
        >
          Need help deciding? Get AI guidance
        </button>
      )}

      {showGuidance && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          {isLoadingGuidance ? (
            <p className="text-sm text-gray-500">
              Generating guidance questions...
            </p>
          ) : (
            <>
              <h4 className="mb-3 font-semibold text-[#76A99A]">
                AI Guidance Conversation
              </h4>
              
              {/* Conversation history */}
              <div className="mb-4 max-h-64 space-y-3 overflow-y-auto">
                {conversationTurns.map((turn, index) => (
                  <div
                    key={index}
                    className={`rounded-lg p-3 ${
                      turn.speaker === "AI"
                        ? "bg-[#76A99A]/10 text-gray-800 dark:text-gray-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                    }`}
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#76A99A]">
                        {turn.speaker === "AI" ? "🤖 Frank" : "👤 You"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(turn.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="whitespace-pre-line text-sm">{turn.message}</p>
                  </div>
                ))}
                {analyzeResponses.isPending && (
                  <div className="rounded-lg bg-[#76A99A]/10 p-3">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#76A99A]">
                        🤖 Frank
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Analyzing your responses...
                    </p>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>

              {/* AI Recommendation Display */}
              {aiRecommendation && (
                <div className="mb-4 rounded-lg border-2 border-[#76A99A] bg-[#76A99A]/5 p-4">
                  <h5 className="mb-2 font-semibold text-[#76A99A]">
                    ✨ Frank's Recommendation: {aiRecommendation.suggestedLevel}
                  </h5>
                  <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
                    {aiRecommendation.recommendation}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedEffort(aiRecommendation.suggestedLevel);
                      const updatedRationale = rationale 
                        ? `${rationale}\n\nFrank's Analysis: ${aiRecommendation.reasoning}`
                        : `Frank's Analysis: ${aiRecommendation.reasoning}`;
                      setRationale(updatedRationale);
                      
                      // Submit the effort estimate immediately
                      setEffort.mutate({
                        improvementId,
                        effortLevel: aiRecommendation.suggestedLevel,
                        rationale: updatedRationale,
                      });
                    }}
                    disabled={setEffort.isPending}
                    className="mt-2 rounded-lg bg-[#76A99A] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#5f8a7d] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {setEffort.isPending ? "Saving..." : "Accept Recommendation & Save"}
                  </button>
                </div>
              )}

              {/* Response form */}
              {conversationTurns.length > 0 && (
                <form onSubmit={handleGuidanceResponse} className="space-y-2">
                  <textarea
                    value={userResponse}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setUserResponse(e.target.value)
                    }
                    placeholder="Share your thoughts on these questions..."
                    className="w-full rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-900 placeholder-gray-500 focus:border-[#76A99A] focus:outline-none focus:ring-1 focus:ring-[#76A99A] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={!userResponse.trim() || analyzeResponses.isPending}
                      className="rounded-lg bg-[#76A99A] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5f8a7d] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {analyzeResponses.isPending ? "Analyzing..." : "Add to Rationale"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowGuidance(false)}
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                      Close Guidance
                    </button>
                  </div>
                </form>
              )}

              {guidance && (
                <p className="mt-3 text-xs text-gray-500">
                  Model: {guidance.metadata.model} | Tokens:{" "}
                  {guidance.metadata.usage.input_tokens} in,{" "}
                  {guidance.metadata.usage.output_tokens} out
                </p>
              )}
            </>
          )}
        </div>
      )}

      {selectedEffort && (
        <div className="space-y-3">
          {/* Warning message if no AI guidance was used */}
          {!showGuidance && conversationTurns.length === 0 && (
            <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-3 dark:border-yellow-700 dark:bg-yellow-950">
              <div className="flex items-start gap-2">
                <span className="text-yellow-600 dark:text-yellow-400">⚠️</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Consider getting AI guidance
                  </p>
                  <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-300">
                    Frank can help you think through complexity, dependencies, and unknowns you might have missed.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {rationalePrompt}
            </label>
            <textarea
              value={rationale}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setRationale(e.target.value)
              }
              placeholder={rationalePrompt}
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-[#76A99A] focus:outline-none focus:ring-1 focus:ring-[#76A99A] dark:border-gray-600 dark:bg-gray-800"
              rows={4}
            />
            <p className="mt-1 text-xs text-gray-500">
              {rationale.length > 0 ? `${rationale.length} characters` : 'Optional - but recommended for better tracking'}
              {conversationTurns.filter(t => t.speaker === "USER").length > 0 && (
                <span className="ml-2 text-[#76A99A]">
                  ✓ {conversationTurns.filter(t => t.speaker === "USER").length} response(s) from AI guidance added
                </span>
              )}
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={setEffort.isPending || (rationale.trim().length > 0 && rationale.trim().length < 10)}
            className="w-full rounded-lg bg-[#76A99A] px-4 py-2 font-medium text-white transition-colors hover:bg-[#5f8a7d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {setEffort.isPending
              ? "Saving..."
              : isRevision
                ? "Update Effort Estimate"
                : "Set Effort Estimate"}
          </button>

          {setEffort.isError && (
            <p className="text-sm text-red-600">
              Error: {setEffort.error.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
