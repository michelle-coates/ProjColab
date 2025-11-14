"use client";

import { type NextPage } from "next";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import ImpactEffortMatrix from "@/components/visualization/ImpactEffortMatrix";
import MatrixControls from "@/components/visualization/MatrixControls";
import { FeatureErrorBoundary } from "@/components/error-handling/error-boundary";
import { PrerequisiteChecklist } from "@/components/session/PrerequisiteChecklist";
import { Breadcrumbs } from "@/components/session/Breadcrumbs";

const MatrixView: NextPage = () => {
  const searchParams = useSearchParams();
  const sessionIdFromUrl = searchParams.get("sessionId");
  const [filteredImprovements, setFilteredImprovements] = useState<any[]>([]);
  const [viewOptions, setViewOptions] = useState({ showLabels: true, showGrid: true, highlightRecommendations: true });

  // Fallback to active session if no sessionId in URL
  const { data: activeSession } = api.sessions.getOrCreateActiveSession.useQuery(
    undefined,
    { enabled: !sessionIdFromUrl }
  );

  // Use sessionId from URL or fallback to active session
  const sessionId = sessionIdFromUrl || activeSession?.id;

  const { data: improvements, refetch } = api.matrix.getMatrixData.useQuery(
    { sessionId: sessionId as string },
    { enabled: !!sessionId }
  );

  // Fetch session state for prerequisites (Story 1.16)
  const { data: sessionState } = api.sessions.getSessionState.useQuery(
    { sessionId: sessionId },
    { enabled: !!sessionId }
  );

  // Initialize filtered improvements when data loads
  useEffect(() => {
    if (improvements) {
      setFilteredImprovements(improvements);
    }
  }, [improvements]);

  const updatePosition = api.matrix.updatePosition.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  const handlePositionUpdate = async (improvementId: string, x: number, y: number) => {
    await updatePosition.mutateAsync({ improvementId, x, y });
  };

  const handleFilterChange = (filters: { category?: string; effortLevel?: 'S' | 'M' | 'L' }) => {
    if (!improvements) return;

    let filtered = [...improvements];

    if (filters.category) {
      filtered = filtered.filter(imp => imp.category === filters.category);
    }

    if (filters.effortLevel) {
      const effortMap = { S: 'SMALL', M: 'MEDIUM', L: 'LARGE' };
      filtered = filtered.filter(imp => imp.effortLevel === effortMap[filters.effortLevel!]);
    }

    setFilteredImprovements(filtered);
  };

  if (!sessionId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading session...</p>
      </div>
    );
  }

  if (!improvements) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading improvements...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Impact vs Effort Matrix - Frank</title>
        <meta name="description" content="Visualize improvements on an Impact vs Effort matrix" />
      </Head>

      <main className="container mx-auto py-8 px-4">
        {/* Breadcrumbs (Story 1.16) */}
        <div className="mb-4">
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Matrix" },
            ]}
          />
        </div>

        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#1D1F21]">Impact vs Effort Matrix</h1>
          <Link
            href="/dashboard"
            className="rounded bg-[#76A99A] px-4 py-2 font-medium text-white transition-colors hover:bg-[#68927f]"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Empty State with Prerequisites (Story 1.16) */}
        {sessionState && !sessionState.readyForMatrix && (
          <div className="mb-8">
            <div className="rounded-lg border-2 border-yellow-200 bg-yellow-50 p-6 mb-6">
              <h2 className="text-lg font-semibold text-yellow-900 mb-2">
                Matrix Not Ready Yet
              </h2>
              <p className="text-sm text-yellow-800">
                Complete the prerequisites below to unlock your prioritization matrix.
              </p>
            </div>
            <PrerequisiteChecklist
              itemsCount={sessionState.itemsCount}
              itemsWithEffort={sessionState.itemsWithEffort}
              itemsWithQuestions={sessionState.itemsWithQuestions}
              comparisonsCompleted={sessionState.comparisonsCompleted}
              comparisonsRequired={sessionState.comparisonsRequired}
              readyForMatrix={sessionState.readyForMatrix}
            />
          </div>
        )}

        {/* Show matrix only when ready */}
        {sessionState?.readyForMatrix && (
          <FeatureErrorBoundary
            featureName="Matrix Visualization"
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Matrix Controls */}
              <div className="lg:col-span-1">
                <MatrixControls
                  improvements={improvements as any}
                  onFilterChange={handleFilterChange}
                  onViewOptionsChange={setViewOptions}
                  onReset={() => {
                    setFilteredImprovements(improvements);
                    setViewOptions({ showLabels: true, showGrid: true, highlightRecommendations: true });
                    void refetch();
                  }}
                />
              </div>

              {/* Matrix Visualization */}
              <div className="lg:col-span-3">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <ImpactEffortMatrix
                    improvements={filteredImprovements}
                    onPositionUpdate={handlePositionUpdate}
                    showLabels={viewOptions.showLabels}
                    showGrid={viewOptions.showGrid}
                  />
                </div>
              </div>
            </div>
          </FeatureErrorBoundary>
        )}
      </main>
    </>
  );
};

export default MatrixView;