"use client";

import { api } from "@/trpc/react";
import Link from "next/link";
import { ArrowRight, Target, CheckCircle2 } from "lucide-react";

export function ComparisonReadiness() {
  const { data: improvements } = api.improvements.list.useQuery({});
  const withEffort = (improvements ?? []).filter((item: any) => item.effortLevel !== null);
  const readyToCompare = withEffort.length >= 2;

  const { data: pairData, isLoading: isPairLoading, isError: isPairError } = api.decisions.getNextPair.useQuery(
    {},
    { enabled: readyToCompare }
  );
  
  if (!improvements) return null;

  const totalItems = improvements.length;
  const comparisonsComplete = readyToCompare && (pairData?.complete ?? false);

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <div className="rounded-full bg-[#76A99A]/10 p-2">
          <Target className="h-5 w-5 text-[#76A99A]" />
        </div>
        <div className="flex-1">
          <h3 className="mb-1 text-lg font-semibold text-[#1D1F21]">
            Prioritization Status
          </h3>
          <p className="text-sm text-gray-600">
            {withEffort.length} of {totalItems} items have effort estimates
          </p>
        </div>
      </div>

      {!readyToCompare ? (
        <div className="rounded-md bg-yellow-50 p-3">
          <p className="text-sm font-medium text-yellow-800">
            Add effort estimates first
          </p>
          <p className="mt-1 text-xs text-yellow-700">
            Estimate effort for at least 2 items to start comparing
          </p>
        </div>
      ) : comparisonsComplete ? (
        <div>
          <div className="mb-4 rounded-md bg-green-50 p-3">
            <p className="flex items-center gap-2 text-sm font-medium text-green-800">
              <CheckCircle2 className="h-4 w-4" />
              Comparisons complete!
            </p>
            <p className="mt-1 text-xs text-green-700">
              Your {withEffort.length} items have been ranked
            </p>
          </div>
          
          <div className="flex gap-2">
            <Link
              href="/dashboard/ranking"
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#76A99A] px-4 py-3 text-white transition-colors hover:bg-[#5f8a7d]"
            >
              View Ranking
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard/compare"
              className="flex flex-1 items-center justify-center gap-2 rounded-md border-2 border-[#76A99A] bg-white px-4 py-3 text-[#76A99A] transition-colors hover:bg-[#76A99A]/5"
            >
              Re-compare
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-4 rounded-md bg-blue-50 p-3">
            <p className="text-sm font-medium text-blue-800">
              ✅ Ready to compare!
            </p>
            <p className="mt-1 text-xs text-blue-700">
              {isPairError
                ? "Unable to load comparison progress right now"
                : isPairLoading
                ? "Checking comparison progress..."
                : pairData?.progress
                ? `${pairData.progress.completed} comparisons done, ${pairData.progress.percentage}% complete`
                : "Start your first comparison to build the ranking"}
            </p>
          </div>
          
          <Link
            href="/dashboard/compare"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-[#76A99A] px-4 py-3 text-white transition-colors hover:bg-[#5f8a7d]"
          >
            {pairData?.progress?.completed ? 'Continue Comparing' : 'Start Comparing'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {readyToCompare && !comparisonsComplete && (
        <Link
          href="/dashboard/ranking"
          className="mt-3 block text-center text-sm text-[#76A99A] hover:text-[#5f8a7d]"
        >
          View current ranking →
        </Link>
      )}
    </div>
  );
}
