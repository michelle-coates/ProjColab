"use client";

import type { EvidenceSource } from "@/lib/validations/conversation";

const SOURCE_STYLES: Record<EvidenceSource, string> = {
  ANALYTICS: "bg-blue-100 text-blue-800 border-blue-200",
  SUPPORT_TICKETS: "bg-purple-100 text-purple-800 border-purple-200",
  USER_FEEDBACK: "bg-green-100 text-green-800 border-green-200",
  ASSUMPTIONS: "bg-yellow-100 text-yellow-800 border-yellow-200",
  USER_UPLOAD: "bg-teal-100 text-teal-800 border-teal-200",
};

const SOURCE_LABELS: Record<EvidenceSource, string> = {
  ANALYTICS: "Analytics",
  SUPPORT_TICKETS: "Support Tickets",
  USER_FEEDBACK: "User Feedback",
  ASSUMPTIONS: "Assumption",
  USER_UPLOAD: "Upload",
};

interface EvidenceBadgeProps {
  source: EvidenceSource;
  className?: string;
}

export function EvidenceBadge({ source, className = "" }: EvidenceBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        SOURCE_STYLES[source]
      } ${className}`}
    >
      {SOURCE_LABELS[source]}
    </span>
  );
}
