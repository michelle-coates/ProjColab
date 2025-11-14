"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import type { Category } from "@/lib/validations/improvement";
import { ConversationInterface } from "@/components/frank/conversation-interface";
import { EffortEstimator } from "./effort-estimator";
import { Badge } from "@/components/ui/badge";

type EffortLevel = "SMALL" | "MEDIUM" | "LARGE";

interface ImprovementListProps {
  sessionId?: string;
}

const CATEGORY_LABELS: Record<Category, string> = {
  UI_UX: "UI/UX",
  DATA_QUALITY: "Data Quality",
  WORKFLOW: "Workflow",
  BUG_FIX: "Bug Fix",
  FEATURE: "Feature",
  OTHER: "Other",
};

const CATEGORY_COLORS: Record<Category, string> = {
  UI_UX: "bg-[#76A99A]/20 text-[#1D1F21] border border-[#76A99A]/30",
  DATA_QUALITY: "bg-gray-200 text-[#1D1F21] border border-gray-300",
  WORKFLOW: "bg-[#76A99A]/20 text-[#1D1F21] border border-[#76A99A]/30",
  BUG_FIX: "bg-gray-200 text-[#1D1F21] border border-gray-300",
  FEATURE: "bg-[#76A99A]/20 text-[#1D1F21] border border-[#76A99A]/30",
  OTHER: "bg-gray-200 text-[#1D1F21] border border-gray-300",
};

const EFFORT_COLORS: Record<EffortLevel, string> = {
  SMALL: "bg-[#A8C5A0]/30 text-[#1D1F21] border border-[#A8C5A0]/40",
  MEDIUM: "bg-[#D4C4A8]/30 text-[#1D1F21] border border-[#D4C4A8]/40",
  LARGE: "bg-[#C5A598]/30 text-[#1D1F21] border border-[#C5A598]/40",
};

const EFFORT_LABELS: Record<EffortLevel, string> = {
  SMALL: "S",
  MEDIUM: "M",
  LARGE: "L",
};

export function ImprovementList({ sessionId }: ImprovementListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState<Category>("OTHER");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [gatheringEvidenceFor, setGatheringEvidenceFor] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [estimatingEffortFor, setEstimatingEffortFor] = useState<{
    id: string;
    currentEffort?: { level: EffortLevel; rationale: string };
  } | null>(null);

  const { data: improvements, isLoading } = api.improvements.list.useQuery({
    sessionId,
  });

  const utils = api.useUtils();
  const updateImprovement = api.improvements.update.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.improvements.invalidate(),
        utils.decisions.getNextPair.invalidate({ sessionId }),
        utils.decisions.getRanking.invalidate({ sessionId }),
        utils.decisions.getDecisionHistory.invalidate({ sessionId }),
      ]);
      setEditingId(null);
    },
  });

  const deleteImprovement = api.improvements.delete.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.improvements.invalidate(),
        utils.decisions.getNextPair.invalidate({ sessionId }),
        utils.decisions.getRanking.invalidate({ sessionId }),
        utils.decisions.getDecisionHistory.invalidate({ sessionId }),
      ]);
    },
  });

  const handleEdit = (improvement: {
    id: string;
    title: string;
    description: string;
    category: Category;
    createdAt: Date;
    updatedAt: Date;
  }) => {
    setEditingId(improvement.id);
    setEditTitle(improvement.title);
    setEditDescription(improvement.description);
    setEditCategory(improvement.category);
  };

  const handleSaveEdit = (id: string) => {
    updateImprovement.mutate({
      id,
      title: editTitle.trim(),
      description: editDescription.trim(),
      category: editCategory,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
    setEditCategory("OTHER");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this improvement? This action cannot be undone.")) {
      deleteImprovement.mutate({ id });
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const truncateDescription = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <div className="h-4 w-24 rounded bg-gray-200"></div>
                <div className="h-6 w-3/4 rounded bg-gray-200"></div>
                <div className="h-20 w-full rounded bg-gray-200"></div>
                <div className="h-3 w-32 rounded bg-gray-200"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!improvements || improvements.length === 0) {
    return (
      <div className="rounded-lg bg-white p-12 text-center shadow-sm">
        <div className="mx-auto max-w-md">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No improvements yet</h3>
          <p className="mt-2 text-sm text-gray-600">
            Get started by creating your first improvement item.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {improvements.map((improvement: {
        id: string;
        title: string;
        description: string;
        category: Category;
        effortLevel?: EffortLevel | null;
        effortRationale?: string | null;
        isOnboardingSample?: boolean;
        conversations?: Array<{
          id: string;
          finalInsights: unknown;
          completedAt: Date | null;
          status: string | null;
          confidence: number | null;
        }>;
        createdAt: Date;
        updatedAt: Date;
      }) => {
        const isEditing = editingId === improvement.id;
        const isExpanded = expandedIds.has(improvement.id);

        // Determine if impact questions are answered
        // Check if ANY conversation has finalInsights AND meets confidence threshold (70%)
        const CONFIDENCE_THRESHOLD = 0.7;
        const hasAnsweredQuestions = improvement.conversations &&
          improvement.conversations.length > 0 &&
          improvement.conversations.some(c =>
            c.finalInsights !== null &&
            (c.confidence ?? 0) >= CONFIDENCE_THRESHOLD
          );

        return (
          <div
            key={improvement.id}
            className={`rounded-lg border transition-all ${
              isExpanded
                ? 'border-[#76A99A] bg-white shadow-sm'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            {isEditing ? (
              // Edit Mode - Full height
              <div className="space-y-4 p-4">
                <div>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#76A99A] focus:outline-none focus:ring-2 focus:ring-[#76A99A]"
                  />
                  <div className="mt-1 text-right text-xs text-gray-500">{editTitle.length}/200</div>
                </div>
                <div>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={6}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#76A99A] focus:outline-none focus:ring-2 focus:ring-[#76A99A]"
                  />
                  <div className="mt-1 text-right text-xs text-gray-500">{editDescription.length}/2000</div>
                </div>
                <div>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as Category)}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#76A99A] focus:outline-none focus:ring-2 focus:ring-[#76A99A]"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleSaveEdit(improvement.id)}
                    disabled={updateImprovement.isPending}
                    className="rounded-md bg-[#76A99A] px-4 py-2 text-sm font-medium text-white hover:bg-[#669186] focus:outline-none focus:ring-2 focus:ring-[#76A99A] focus:ring-offset-2"
                  >
                    {updateImprovement.isPending ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={updateImprovement.isPending}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#76A99A] focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // Compact View Mode
              <div>
                {/* Collapsed Header - Always Visible */}
                <button
                  onClick={() => toggleExpanded(improvement.id)}
                  className="w-full px-4 py-3 text-left transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      {/* Expand/Collapse Icon */}
                      <svg
                        className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>

                      {/* Title and Badges */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate font-medium text-gray-900">{improvement.title}</h3>
                        </div>
                      </div>
                    </div>

                    {/* Badges - Right Side */}
                    <div className="flex shrink-0 items-center gap-2">
                      {/* Sample Data Badge (Story 1.17) */}
                      {improvement.isOnboardingSample && (
                        <Badge variant="outline" className="text-xs">
                          Sample
                        </Badge>
                      )}
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[improvement.category]}`}>
                        {CATEGORY_LABELS[improvement.category]}
                      </span>
                      {improvement.effortLevel && (
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${EFFORT_COLORS[improvement.effortLevel]}`}>
                          {EFFORT_LABELS[improvement.effortLevel]}
                        </span>
                      )}
                      {!improvement.effortLevel && (
                        <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                          No estimate
                        </span>
                      )}
                      {/* Impact Question Status Badge */}
                      {hasAnsweredQuestions ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#76A99A]/30 px-2.5 py-0.5 text-xs font-medium text-[#1D1F21] border border-[#76A99A]/40">
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Answered</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 border border-amber-200">
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span>Needs Questions</span>
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-4 pb-4 pt-3">
                    {/* Description */}
                    <p className="mb-4 text-sm text-gray-600">{improvement.description}</p>

                    {/* Timestamps */}
                    <p className="mb-4 text-xs text-gray-500">
                      Created {formatDate(improvement.createdAt)}
                      {improvement.updatedAt.getTime() !== improvement.createdAt.getTime() && (
                        <span> • Edited {formatDate(improvement.updatedAt)}</span>
                      )}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setGatheringEvidenceFor({ id: improvement.id, title: improvement.title })}
                        className="rounded-md border border-[#76A99A] bg-white px-3 py-1.5 text-sm font-medium text-[#76A99A] transition-colors hover:bg-[#76A99A] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#76A99A] focus:ring-offset-2"
                      >
                        Gather Evidence
                      </button>
                      <button
                        onClick={() =>
                          setEstimatingEffortFor({
                            id: improvement.id,
                            currentEffort: improvement.effortLevel && improvement.effortRationale
                              ? { level: improvement.effortLevel, rationale: improvement.effortRationale }
                              : undefined,
                          })
                        }
                        className="rounded-md border border-[#76A99A] bg-white px-3 py-1.5 text-sm font-medium text-[#76A99A] transition-colors hover:bg-[#76A99A] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#76A99A] focus:ring-offset-2"
                      >
                        {improvement.effortLevel ? "Revise Effort" : "Estimate Effort"}
                      </button>
                      <button
                        onClick={() => handleEdit(improvement)}
                        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#76A99A] focus:ring-offset-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(improvement.id)}
                        disabled={deleteImprovement.isPending}
                        className="rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        {deleteImprovement.isPending ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
      
      {/* Evidence Gathering Modal */}
      {gatheringEvidenceFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-auto">
            <button
              onClick={() => setGatheringEvidenceFor(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 text-gray-600 hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <ConversationInterface
              improvementId={gatheringEvidenceFor.id}
              improvementTitle={gatheringEvidenceFor.title}
              onClose={() => setGatheringEvidenceFor(null)}
              onComplete={() => {
                setGatheringEvidenceFor(null);
                void utils.improvements.invalidate();
              }}
            />
          </div>
        </div>
      )}

      {/* Effort Estimation Modal */}
      {estimatingEffortFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-auto rounded-lg bg-white p-6">
            <button
              onClick={() => setEstimatingEffortFor(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-600 hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="mb-4 text-xl font-semibold text-[#1D1F21]">
              {estimatingEffortFor.currentEffort ? "Revise" : "Estimate"} Effort
            </h2>
            <EffortEstimator
              improvementId={estimatingEffortFor.id}
              currentEffort={estimatingEffortFor.currentEffort}
              onSuccess={() => {
                setEstimatingEffortFor(null);
                void utils.improvements.invalidate();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
