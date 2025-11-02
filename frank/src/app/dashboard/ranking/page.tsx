"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RankingView } from "@/app/_components/frank/ranking-view";
import { ArrowLeft, History } from "lucide-react";

export default function RankingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#76A99A] border-r-transparent"></div>
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/sign-in");
    return null;
  }

  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <Link
              href="/dashboard"
              className="mb-4 inline-flex items-center gap-2 text-sm text-[#76A99A] hover:text-[#5f8a7d]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-semibold text-[#1D1F21]">
              Your Ranking
            </h1>
            <p className="mt-2 text-gray-600">
              Items prioritized based on your decisions
            </p>
          </div>
          <Link
            href="/dashboard/history"
            className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 transition-colors hover:border-[#76A99A] hover:bg-[#76A99A]/5"
          >
            <History className="h-4 w-4" />
            View History
          </Link>
        </div>

        {/* Ranking View */}
        <RankingView />
      </div>
    </div>
  );
}
