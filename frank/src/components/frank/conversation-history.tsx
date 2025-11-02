"use client";

import type { ConversationTurn } from "@/lib/validations/conversation";
import { EvidenceBadge } from "./evidence-badge";

interface ConversationHistoryProps {
  turns: ConversationTurn[];
  className?: string;
}

export function ConversationHistory({
  turns,
  className = "",
}: ConversationHistoryProps) {
  if (turns.length === 0) {
    return (
      <div className={`text-center text-gray-500 ${className}`}>
        <p>No conversation yet. Start gathering evidence!</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {turns.map((turn, index) => {
        const isAI = turn.speaker === "AI";
        const timestamp = new Date(turn.timestamp);
        const relativeTime = formatRelativeTime(timestamp);

        return (
          <div
            key={index}
            className={`flex ${isAI ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-4 ${
                isAI
                  ? "bg-[#76A99A] text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              {isAI && turn.metadata?.questionReasoning && (
                <p className="mb-2 text-xs italic opacity-80">
                  {turn.metadata.questionReasoning}
                </p>
              )}
              
              <p className="whitespace-pre-wrap">{turn.message}</p>
              
              {!isAI && turn.metadata?.evidenceType && (
                <div className="mt-2">
                  <EvidenceBadge source={turn.metadata.evidenceType} />
                </div>
              )}
              
              <p className={`mt-2 text-xs ${isAI ? "opacity-70" : "text-gray-500"}`}>
                {relativeTime}
                {turn.metadata?.fallback && (
                  <span className="ml-2 italic">(guided question)</span>
                )}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
