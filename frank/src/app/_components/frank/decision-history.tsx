"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Clock, Edit2, Check } from "lucide-react";

interface DecisionHistoryProps {
  sessionId?: string;
}

export function DecisionHistory({ sessionId }: DecisionHistoryProps) {
  const [editingDecisionId, setEditingDecisionId] = useState<string | null>(null);
  const [newWinnerId, setNewWinnerId] = useState<string | null>(null);
  const [editRationale, setEditRationale] = useState("");

  const utils = api.useUtils();
  
  const { data: decisions, isLoading } = api.decisions.getDecisionHistory.useQuery({
    sessionId,
  });

  const updateDecision = api.decisions.updateDecision.useMutation({
    onSuccess: async () => {
      setEditingDecisionId(null);
      setNewWinnerId(null);
      setEditRationale("");
      await utils.decisions.getDecisionHistory.invalidate({ sessionId });
      await utils.decisions.getRanking.invalidate({ sessionId });
    },
  });

  const handleEdit = (decisionId: string, currentWinnerId: string, currentRationale: string) => {
    setEditingDecisionId(decisionId);
    setNewWinnerId(currentWinnerId);
    setEditRationale(currentRationale || "");
  };

  const handleSave = (decisionId: string) => {
    if (!newWinnerId) return;
    
    updateDecision.mutate({
      decisionId,
      winnerId: newWinnerId,
      rationale: editRationale || undefined,
    });
  };

  const handleCancel = () => {
    setEditingDecisionId(null);
    setNewWinnerId(null);
    setEditRationale("");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#76A99A] border-r-transparent"></div>
          <p className="text-gray-700">Loading decision history...</p>
        </div>
      </div>
    );
  }

  if (!decisions || decisions.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
        <p className="text-gray-600">
          No decisions recorded yet. Start comparing your improvements.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold text-[#1D1F21]">
          Decision History
        </h2>
        <p className="text-gray-600">
          Review and modify your {decisions.length} pairwise comparison decisions
        </p>
      </div>

      {/* Decision list */}
      <div className="space-y-4">
        {decisions.map((decision: any) => {
          const isEditing = editingDecisionId === decision.id;
          const itemA = decision.itemA;
          const itemB = decision.itemB;
          const winner = decision.winner;

          return (
            <div
              key={decision.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              {/* Header */}
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>
                    {new Date(decision.decidedAt).toLocaleDateString()} at{" "}
                    {new Date(decision.decidedAt).toLocaleTimeString()}
                  </span>
                  {decision.isModified && (
                    <span className="rounded-full bg-yellow-50 px-2 py-0.5 text-xs text-yellow-700">
                      Modified
                    </span>
                  )}
                </div>
                
                {!isEditing && (
                  <button
                    onClick={() => handleEdit(decision.id, decision.winnerId, decision.rationale)}
                    className="flex items-center gap-1 text-sm text-[#76A99A] hover:text-[#5f8a7d]"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </button>
                )}
              </div>

              {/* Prompt */}
              <div className="mb-3">
                <p className="font-medium text-[#1D1F21]">
                  {decision.prompt}
                </p>
              </div>

              {/* Comparison */}
              {isEditing ? (
                <div className="space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <button
                      onClick={() => setNewWinnerId(itemA.id)}
                      className={`rounded-lg border-2 p-3 text-left transition-colors ${
                        newWinnerId === itemA.id
                          ? "border-[#76A99A] bg-[#76A99A]/10"
                          : "border-gray-200 bg-white hover:border-[#76A99A]"
                      }`}
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm font-medium text-[#1D1F21]">
                          {itemA.title || "Untitled"}
                        </span>
                        {newWinnerId === itemA.id && (
                          <Check className="h-5 w-5 text-[#76A99A]" />
                        )}
                      </div>
                      <p className="line-clamp-2 text-xs text-gray-600">
                        {itemA.description || "No description"}
                      </p>
                    </button>

                    <button
                      onClick={() => setNewWinnerId(itemB.id)}
                      className={`rounded-lg border-2 p-3 text-left transition-colors ${
                        newWinnerId === itemB.id
                          ? "border-[#76A99A] bg-[#76A99A]/10"
                          : "border-gray-200 bg-white hover:border-[#76A99A]"
                      }`}
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm font-medium text-[#1D1F21]">
                          {itemB.title || "Untitled"}
                        </span>
                        {newWinnerId === itemB.id && (
                          <Check className="h-5 w-5 text-[#76A99A]" />
                        )}
                      </div>
                      <p className="line-clamp-2 text-xs text-gray-600">
                        {itemB.description || "No description"}
                      </p>
                    </button>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-[#1D1F21]">
                      Rationale (optional)
                    </label>
                    <textarea
                      value={editRationale}
                      onChange={(e) => setEditRationale(e.target.value)}
                      rows={2}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#76A99A] focus:outline-none focus:ring-1 focus:ring-[#76A99A]"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(decision.id)}
                      disabled={updateDecision.isPending || !newWinnerId}
                      className="rounded-md bg-[#76A99A] px-4 py-2 text-sm text-white transition-colors hover:bg-[#5f8a7d] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {updateDecision.isPending ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={updateDecision.isPending}
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-2 rounded-lg bg-[#76A99A]/10 p-3">
                    <p className="mb-1 text-sm font-medium text-[#1D1F21]">
                      You chose: {winner.title || "Untitled"}
                    </p>
                    <p className="text-xs text-gray-600">
                      Over: {winner.id === itemA.id ? itemB.title : itemA.title}
                    </p>
                  </div>

                  {(decision.rationale || decision.quickRationale) && (
                    <div className="rounded-md bg-gray-50 p-2">
                      <p className="text-xs text-gray-600">
                        <span className="font-medium text-[#1D1F21]">Rationale:</span>{" "}
                        {decision.quickRationale && (
                          <span className="rounded-full bg-[#76A99A]/10 px-2 py-0.5 text-xs text-[#1D1F21]">
                            {decision.quickRationale}
                          </span>
                        )}{" "}
                        {decision.rationale}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
