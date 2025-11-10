"use client";

import { type NextPage } from "next";
import Head from "next/head";
import { useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import ImpactEffortMatrix from "@/components/visualization/ImpactEffortMatrix";
import MatrixControls from "@/components/visualization/MatrixControls";
import { FeatureErrorBoundary } from "@/components/error-handling/error-boundary";

const MatrixView: NextPage = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

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

  if (!sessionId || !improvements) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Impact vs Effort Matrix - Frank</title>
        <meta name="description" content="Visualize improvements on an Impact vs Effort matrix" />
      </Head>

      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Impact vs Effort Matrix</h1>

        <FeatureErrorBoundary
          featureName="Matrix Visualization"
          fallbackMessage="Unable to load matrix visualization. Please refresh the page."
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Matrix Controls */}
            <div className="lg:col-span-1">
              <MatrixControls
                improvements={improvements}
                onReset={() => {
                  void refetch();
                }}
              />
            </div>

            {/* Matrix Visualization */}
            <div className="lg:col-span-3">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <ImpactEffortMatrix
                  improvements={improvements}
                  onPositionUpdate={handlePositionUpdate}
                />
              </div>
            </div>
          </div>
        </FeatureErrorBoundary>
      </main>
    </>
  );
};

export default MatrixView;