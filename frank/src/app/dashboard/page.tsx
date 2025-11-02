"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ImprovementForm } from "@/app/_components/frank/improvement-form";
import { ImprovementList } from "@/app/_components/frank/improvement-list";
import { EffortDistribution } from "@/app/_components/frank/effort-distribution";
import { ComparisonReadiness } from "@/app/_components/frank/comparison-readiness";
import { SessionList } from "@/app/_components/frank/session-list";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/sign-in");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F6F7F8] px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-[#1D1F21]">Dashboard</h1>
            <p className="mt-2 text-gray-600">Welcome back, {session?.user?.name}!</p>
          </div>
          <Link
            href="/profile"
            className="rounded bg-[#76A99A] px-4 py-2 font-medium text-white transition-colors hover:bg-[#68927f]"
          >
            Edit Profile
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold text-[#1D1F21]">Account Type</h3>
            <p className="text-2xl font-bold text-[#76A99A]">
              {session?.user?.role ?? "FREE"}
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold text-[#1D1F21]">Email</h3>
            <p className="text-sm text-gray-600">{session?.user?.email}</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold text-[#1D1F21]">Sessions</h3>
            <div className="mt-2">
              <SessionList />
            </div>
          </div>
        </div>

        {/* Improvement Management Section */}
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <ImprovementForm />
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-semibold text-[#1D1F21]">
                Enhancements
              </h2>
              <ImprovementList />
            </div>
          </div>

          <div className="space-y-6">
            <ComparisonReadiness />
            <EffortDistribution />
          </div>
        </div>
      </div>
    </div>
  );
}
