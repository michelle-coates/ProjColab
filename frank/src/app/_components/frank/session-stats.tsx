"use client";

import { type FC } from "react";
import { api } from "@/trpc/react";

interface SessionStatsProps {
  sessionId: string;
}

export const SessionStats: FC<SessionStatsProps> = ({ sessionId }) => {
  const { data: stats, isLoading } = api.sessions.getStats.useQuery({ id: sessionId });

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-lg bg-gray-100 p-6 shadow-sm animate-pulse h-32" />
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="mb-2 text-lg font-semibold text-[#1D1F21]">Improvements</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total</span>
            <span className="font-medium">{stats.stats.totalImprovements}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">With Evidence</span>
            <span className="font-medium">{stats.stats.withEvidence}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">With Effort</span>
            <span className="font-medium">{stats.stats.withEffort}</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="mb-2 text-lg font-semibold text-[#1D1F21]">Progress</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Decisions Made</span>
            <span className="font-medium">{stats.stats.totalDecisions}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Completion</span>
            <span className="font-medium">{stats.stats.completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-[#76A99A] h-2.5 rounded-full"
              style={{ width: `${stats.stats.completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="mb-2 text-lg font-semibold text-[#1D1F21]">Top Priorities</h3>
        <div className="space-y-2">
          {stats.stats.topPriorities.map((priority) => (
            <div key={priority.id} className="flex justify-between items-center text-sm">
              <span className="text-gray-600 truncate flex-1 mr-2" title={priority.title}>
                {priority.title}
              </span>
              <span className="font-medium">
                {priority.wins} wins
              </span>
            </div>
          ))}
          {stats.stats.topPriorities.length === 0 && (
            <p className="text-sm text-gray-500">No priorities determined yet</p>
          )}
        </div>
      </div>
    </div>
  );
};