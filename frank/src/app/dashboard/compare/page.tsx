"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PairwiseComparison } from "@/app/_components/frank/pairwise-comparison";
import { ArrowLeft } from "lucide-react";

export default function ComparePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-sage-600 border-r-transparent"></div>
          <p className="text-sage-700">Loading...</p>
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
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="mb-4 inline-flex items-center gap-2 text-sm text-[#76A99A] hover:text-[#5f8a7d]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-semibold text-[#1D1F21]">
            Prioritize Your Improvements
          </h1>
          <p className="mt-2 text-gray-600">
            Compare items pairwise to build your prioritized ranking
          </p>
        </div>

        {/* Comparison Interface */}
        <PairwiseComparison />
      </div>
    </div>
  );
}
