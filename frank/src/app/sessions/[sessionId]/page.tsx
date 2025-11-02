"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { api } from "@/trpc/react";
import ImpactEffortMatrix from "@/components/visualization/ImpactEffortMatrix";
import MatrixControls from "@/components/visualization/MatrixControls";
import { SessionStats } from "@/app/_components/frank/session-stats";
import CreateImprovementButton from "@/components/improvements/CreateImprovementButton";
import ImportImprovementsButton from "@/components/improvements/ImportImprovementsButton";

export default function SessionPage() {
  const { sessionId } = useParams();
  const { data: session } = useSession();

  const { data: sessionData, isLoading: isLoadingSession } = api.sessions.getById.useQuery(
    { id: sessionId as string },
    { enabled: !!sessionId }
  );

  const { data: improvements, refetch } = api.matrix.getMatrixData.useQuery(
    { sessionId: sessionId as string },
    { enabled: !!sessionId }
  );

  const updatePosition = api.matrix.updatePosition.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  const handlePositionUpdate = async (improvementId: string, x: number, y: number) => {
    await updatePosition.mutateAsync({ improvementId, x, y });
  };

  if (isLoadingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading session...</p>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p>Session not found</p>
        <Link 
          href="/dashboard"
          className="rounded bg-[#76A99A] px-4 py-2 font-medium text-white transition-colors hover:bg-[#68927f]"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F7F8] px-4 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-[#1D1F21]">{sessionData.name}</h1>
            <p className="mt-2 text-gray-600">
              Started {new Date(sessionData.startedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex gap-2">
              <CreateImprovementButton
                sessionId={sessionId as string}
                onCreated={() => {
                  void refetch();
                }}
              />
              <ImportImprovementsButton
                sessionId={sessionId as string}
                onImported={() => {
                  void refetch();
                }}
              />
            </div>
            <Link
              href="/dashboard"
              className="rounded bg-[#76A99A] px-4 py-2 font-medium text-white transition-colors hover:bg-[#68927f]"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Session Stats */}
        <div className="mb-8">
          <SessionStats sessionId={sessionId as string} />
        </div>

        {/* Matrix Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Matrix Controls */}
          <div className="lg:col-span-1">
            <MatrixControls
              improvements={improvements ?? []}
              onReset={() => {
                void refetch();
              }}
            />
          </div>

          {/* Matrix Visualization */}
          <div className="lg:col-span-3">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <ImpactEffortMatrix
                improvements={improvements ?? []}
                onPositionUpdate={handlePositionUpdate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}