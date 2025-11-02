"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/trpc/react";
import type { EvidenceSource } from "@/lib/validations/conversation";
import { ConversationHistory } from "./conversation-history";
import { ConfidenceIndicator } from "./confidence-indicator";

interface ConversationInterfaceProps {
  improvementId: string;
  improvementTitle: string;
  onClose?: () => void;
  onComplete?: () => void;
}

const EVIDENCE_SOURCES: { value: EvidenceSource; label: string }[] = [
  { value: "ANALYTICS", label: "Analytics Data" },
  { value: "SUPPORT_TICKETS", label: "Support Tickets" },
  { value: "USER_FEEDBACK", label: "User Feedback" },
  { value: "ASSUMPTIONS", label: "Assumption" },
  { value: "USER_UPLOAD", label: "User Upload" },
];

export function ConversationInterface({
  improvementId,
  improvementTitle,
  onClose,
  onComplete,
}: ConversationInterfaceProps) {
  const [response, setResponse] = useState("");
  const [evidenceType, setEvidenceType] = useState<EvidenceSource | "">("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const utils = api.useUtils();

  // Fetch existing conversation
  const { data: conversationData, isLoading: isLoadingConversation } =
    api.conversations.getConversation.useQuery(
      { improvementId },
      { 
        enabled: !!improvementId,
        retry: false, // Don't retry on "not found" - it's expected for new conversations
      }
    );

  // Generate question mutation
  const generateQuestion = api.conversations.generateQuestion.useMutation({
    onSuccess: (data) => {
      setConversationId(data.conversationId);
      void utils.conversations.getConversation.invalidate({ improvementId });
      scrollToBottom();
    },
  });

  // Submit response mutation
  const submitResponse = api.conversations.submitResponse.useMutation({
    onSuccess: async (data) => {
      setResponse("");
      setEvidenceType("");
      
      await utils.conversations.getConversation.invalidate({ improvementId });
      
      if (data.conversationComplete) {
        onComplete?.();
      } else {
        // Generate next question
        void generateQuestion.mutate({ improvementId });
      }
      
      scrollToBottom();
    },
  });

  // Skip question mutation
  const skipQuestion = api.conversations.skipQuestion.useMutation({
    onSuccess: () => {
      onClose?.();
    },
  });

  // Generate initial question if no conversation exists
  useEffect(() => {
    if (!isLoadingConversation && conversationData) {
      if (conversationData.conversation.turns.length === 0) {
        void generateQuestion.mutate({ improvementId });
      } else {
        setConversationId(conversationData.conversation.id);
      }
    }
  }, [isLoadingConversation, conversationData, improvementId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!conversationId || response.trim().length < 10) {
      return;
    }

    submitResponse.mutate({
      conversationId,
      improvementId,
      response: response.trim(),
      evidenceType: evidenceType || undefined,
    });
  };

  const handleSkip = () => {
    if (confirm("Skip gathering evidence for now? You can return to this later.")) {
      skipQuestion.mutate({ improvementId });
    }
  };

  const isSubmitting = submitResponse.isPending || generateQuestion.isPending;
  const isValid = response.trim().length >= 10 && response.trim().length <= 5000;

  return (
    <div className="mx-auto flex h-[600px] max-w-4xl flex-col rounded-lg border border-gray-200 bg-white shadow-lg">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gray-50 p-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Gather Evidence: {improvementTitle}
        </h2>
        {conversationData && (
          <div className="mt-2">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Evidence Confidence:</span>
              <ConfidenceIndicator value={conversationData.confidence} />
              <span className="text-sm text-gray-500">
                {conversationData.evidenceCount} {conversationData.evidenceCount === 1 ? "piece" : "pieces"} of evidence
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Conversation History */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoadingConversation ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-gray-500">Loading conversation...</div>
          </div>
        ) : conversationData ? (
          <>
            <ConversationHistory turns={conversationData.conversation.turns} />
            <div ref={scrollRef} />
          </>
        ) : null}
        
        {generateQuestion.isPending && (
          <div className="mt-4 flex justify-start">
            <div className="max-w-[70%] rounded-lg bg-[#76A99A] p-4 text-white">
              <p className="italic opacity-80">Frank is thinking...</p>
            </div>
          </div>
        )}
      </div>

      {/* Response Input */}
      <div className="border-t border-gray-200 bg-gray-50 p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Share your evidence and insights..."
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-[#76A99A] focus:outline-none focus:ring-1 focus:ring-[#76A99A]"
              rows={4}
              disabled={isSubmitting}
            />
            <div className="mt-1 flex justify-between text-xs">
              <span className={response.trim().length < 10 ? "text-red-500" : "text-gray-500"}>
                {response.trim().length >= 10
                  ? `${response.trim().length} characters`
                  : `Minimum 10 characters (${10 - response.trim().length} more needed)`}
              </span>
              <span className={response.trim().length > 5000 ? "text-red-500" : "text-gray-500"}>
                {response.trim().length} / 5000
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <select
              value={evidenceType}
              onChange={(e) => setEvidenceType(e.target.value as EvidenceSource | "")}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#76A99A] focus:outline-none focus:ring-1 focus:ring-[#76A99A]"
              disabled={isSubmitting}
            >
              <option value="">Evidence source (optional)</option>
              {EVIDENCE_SOURCES.map((source) => (
                <option key={source.value} value={source.value}>
                  {source.label}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSkip}
                disabled={isSubmitting}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Skip for now
              </button>
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="rounded-lg bg-[#76A99A] px-6 py-2 text-sm font-medium text-white hover:bg-[#6a9589] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Response"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
