"use client";

import { api } from "@/trpc/react";

export function EffortDistribution() {
  const { data: distribution } = api.improvements.getEffortDistribution.useQuery();

  if (!distribution) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 font-semibold text-[#1D1F21]">Effort Distribution</h3>
        <p className="text-sm text-gray-600">Loading...</p>
      </div>
    );
  }

  const total = distribution.small + distribution.medium + distribution.large;
  const smallPct = total > 0 ? (distribution.small / total) * 100 : 0;
  const mediumPct = total > 0 ? (distribution.medium / total) * 100 : 0;
  const largePct = total > 0 ? (distribution.large / total) * 100 : 0;

  // Calculate warnings
  const mostlyLarge = distribution.large > distribution.small + distribution.medium;
  const noSmall = distribution.small === 0 && total > 0;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 font-semibold text-[#1D1F21]">Effort Distribution</h3>

      {total === 0 ? (
        <p className="text-sm text-gray-600">
          No effort estimates yet. Start estimating effort for your improvements!
        </p>
      ) : (
        <>
          {/* Visual bar chart */}
          <div className="mb-3 flex h-8 overflow-hidden rounded-lg">
            {distribution.small > 0 && (
              <div
                className="bg-green-500 transition-all"
                style={{ width: `${smallPct}%` }}
                title={`${distribution.small} Small (${smallPct.toFixed(0)}%)`}
              />
            )}
            {distribution.medium > 0 && (
              <div
                className="bg-yellow-500 transition-all"
                style={{ width: `${mediumPct}%` }}
                title={`${distribution.medium} Medium (${mediumPct.toFixed(0)}%)`}
              />
            )}
            {distribution.large > 0 && (
              <div
                className="bg-red-500 transition-all"
                style={{ width: `${largePct}%` }}
                title={`${distribution.large} Large (${largePct.toFixed(0)}%)`}
              />
            )}
          </div>

          {/* Breakdown details */}
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-green-500" />
                <span className="text-gray-600">Small:</span>
              </span>
              <span className="font-medium">{distribution.small}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-yellow-500" />
                <span className="text-gray-600">Medium:</span>
              </span>
              <span className="font-medium">{distribution.medium}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-red-500" />
                <span className="text-gray-600">Large:</span>
              </span>
              <span className="font-medium">{distribution.large}</span>
            </div>
            {distribution.unestimated > 0 && (
              <div className="flex justify-between border-t border-gray-200 pt-1">
                <span className="text-gray-600">Not estimated:</span>
                <span className="font-medium">{distribution.unestimated}</span>
              </div>
            )}
          </div>

          {/* Warning messages */}
          {mostlyLarge && (
            <div className="mt-3 rounded bg-yellow-50 p-2 text-xs text-yellow-700">
              ⚠️ Mostly large efforts - consider breaking down some improvements into smaller chunks
            </div>
          )}

          {noSmall && (
            <div className="mt-3 rounded bg-blue-50 p-2 text-xs text-blue-700">
              💡 No small efforts found - look for quick wins to build momentum
            </div>
          )}
        </>
      )}
    </div>
  );
}
