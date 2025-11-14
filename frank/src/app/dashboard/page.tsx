"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { ImprovementForm } from "@/app/_components/frank/improvement-form";
import { ImprovementList } from "@/app/_components/frank/improvement-list";
import { EffortDistribution } from "@/app/_components/frank/effort-distribution";
import { ComparisonReadiness } from "@/app/_components/frank/comparison-readiness";
import { SessionList } from "@/app/_components/frank/session-list";
import { ProgressIndicator } from "@/components/session/ProgressIndicator";
import { WhatsNext } from "@/components/session/WhatsNext";
import { PrerequisiteChecklist } from "@/components/session/PrerequisiteChecklist";
import { SessionExplainer } from "@/components/session/SessionExplainer";
import { Breadcrumbs } from "@/components/session/Breadcrumbs";
import { api } from "@/trpc/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Check if user needs onboarding
  const { data: onboardingStatus } = api.onboarding.getStatus.useQuery(
    undefined,
    {
      enabled: status === "authenticated",
    }
  );

  // Fetch active session - MUST be called before any early returns
  const { data: activeSession } = api.sessions.getOrCreateActiveSession.useQuery(
    undefined,
    {
      enabled: status === "authenticated",
    }
  );

  // Fetch session state for progress tracking (Story 1.16)
  const { data: sessionState } = api.sessions.getSessionState.useQuery(
    { sessionId: activeSession?.id },
    {
      enabled: status === "authenticated" && !!activeSession?.id,
    }
  );

  // Count items with effort and impact for matrix readiness
  const itemsWithEffort = activeSession?.improvements?.filter((i: { effortLevel?: string | null }) => i.effortLevel) || [];
  const itemsWithImpact = activeSession?.improvements?.filter((i: { impactScore?: number | null }) => i.impactScore !== null) || [];
  const matrixReadyCount = activeSession?.improvements?.filter(
    (i: { effortLevel?: string | null; impactScore?: number | null }) => i.effortLevel && i.impactScore !== null
  ).length || 0;

  // Scroll to improvement list when "Answer Questions" is clicked on dashboard
  const handleScrollToImprovements = () => {
    const improvementSection = document.getElementById('improvement-list');
    if (improvementSection) {
      improvementSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    // Redirect to onboarding if user hasn't completed it
    if (onboardingStatus && !onboardingStatus.completed) {
      router.push("/onboarding");
    }
  }, [onboardingStatus, router]);

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

  // Show loading while checking onboarding status
  if (!onboardingStatus) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F7F8] px-4 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumbs (Story 1.16) */}
        <div className="mb-4">
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: "/dashboard" },
              { label: activeSession?.name || "My Prioritization" },
            ]}
          />
        </div>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-[#1D1F21]">Frank</h1>
            <p className="mt-2 text-gray-600">Welcome back, {session?.user?.name}!</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/matrix"
              className="rounded border-2 border-[#76A99A] bg-white px-4 py-2 font-medium text-[#76A99A] transition-all hover:bg-[#76A99A] hover:text-white"
            >
              View Matrix
            </Link>
            <Link
              href="/comparisons"
              className="rounded border-2 border-[#76A99A] bg-white px-4 py-2 font-medium text-[#76A99A] transition-all hover:bg-[#76A99A] hover:text-white"
            >
              Comparisons
            </Link>
            <Link
              href="/profile"
              className="rounded bg-[#76A99A] px-4 py-2 font-medium text-white transition-colors hover:bg-[#68927f]"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Progress Indicator (Story 1.16) */}
        {sessionState && (
          <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
            <ProgressIndicator currentStage={sessionState.currentStage} />
          </div>
        )}

        {/* What's Next Guidance (Story 1.16) */}
        {sessionState && (
          <div className="mb-6">
            <WhatsNext
              nextAction={{
                ...sessionState.nextAction,
                // Add onClick handler when "Answer Questions" links to dashboard (we're already here)
                onClick: sessionState.currentStage === 'questions' && sessionState.nextAction.link === '/dashboard'
                  ? handleScrollToImprovements
                  : undefined,
              }}
              dismissible
            />
          </div>
        )}

        {/* Active Session Card */}
        {activeSession && (
          <div className="mb-6 rounded-lg bg-gradient-to-r from-[#76A99A] to-[#68927f] p-6 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">
                  {activeSession.name}
                </h2>
                <p className="mt-1 text-white/90">
                  Active Session
                </p>
                <div className="mt-3 flex gap-6 text-sm">
                  <div>
                    <span className="font-semibold">{activeSession.improvements?.length || 0}</span>
                    {" "}improvements
                  </div>
                  <div>
                    <span className="font-semibold">{itemsWithEffort.length}</span>
                    {" "}with effort
                  </div>
                  <div>
                    <span className="font-semibold">{itemsWithImpact.length}</span>
                    {" "}with impact
                  </div>
                  <div>
                    <span className="font-semibold">{matrixReadyCount}</span>
                    {" "}ready for matrix
                  </div>
                </div>
              </div>
              <Link
                href={`/matrix?sessionId=${activeSession.id}`}
                className="rounded-lg bg-white px-6 py-3 font-semibold text-[#76A99A] transition-all hover:bg-gray-100 hover:shadow-lg"
              >
                View Matrix
              </Link>
            </div>
          </div>
        )}

        {/* My Prioritizations Section */}
        <div className="mb-8">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-[#1D1F21]">My Prioritizations</h3>
            <SessionList />
          </div>
        </div>

        {/* Improvement Management Section */}
        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-8">
            <div>
              <ImprovementForm />
            </div>

            <div id="improvement-list">
              <h2 className="mb-4 text-2xl font-semibold text-[#1D1F21]">
                Enhancements
              </h2>
              <ImprovementList sessionId={activeSession?.id} />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {/* Session Explainer (Story 1.16) */}
            <SessionExplainer />

            {/* Prerequisite Checklist (Story 1.16) */}
            {sessionState && (
              <PrerequisiteChecklist
                itemsCount={sessionState.itemsCount}
                itemsWithEffort={sessionState.itemsWithEffort}
                itemsWithQuestions={sessionState.itemsWithQuestions}
                comparisonsCompleted={sessionState.comparisonsCompleted}
                comparisonsRequired={sessionState.comparisonsRequired}
                readyForMatrix={sessionState.readyForMatrix}
              />
            )}

            <ComparisonReadiness />
            <EffortDistribution />
          </div>
        </div>
      </div>
    </div>
  );
}
