"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import { OnboardingStepWrapper } from "@/components/frank/onboarding/onboarding-step";
import {
  ImprovementCaptureDemo,
  AIInterrogationDemo,
  PairwiseComparisonDemo,
  MatrixVisualizationDemo,
  ExportDemo,
} from "@/components/frank/onboarding/feature-demos";
import { CompletionCelebration } from "@/components/frank/onboarding/completion-celebration";
import { useAchievements, AchievementNotifications } from "@/components/frank/onboarding/achievement-toast";
import { ACHIEVEMENTS, type OnboardingStep, getNextStep } from "@/lib/onboarding/types";
import { Loader2 } from "lucide-react";

interface PageProps {
  params: Promise<{ step: OnboardingStep }>;
}

export default function OnboardingStepPage({ params }: PageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState<OnboardingStep | null>(null);
  const [completedSteps, setCompletedSteps] = useState<OnboardingStep[]>([]);

  const { showAchievement, notifications, dismissNotification } = useAchievements();

  // Get onboarding status and session data
  const { data: status, isLoading: statusLoading } = api.onboarding.getStatus.useQuery();
  const { data: sessionData, isLoading: sessionLoading } = api.onboarding.getSession.useQuery();
  const updateProgress = api.onboarding.updateProgress.useMutation();

  useEffect(() => {
    // Unwrap params promise
    params.then((resolvedParams) => {
      setCurrentStep(resolvedParams.step);
    });
  }, [params]);

  useEffect(() => {
    if (status?.progress) {
      setCompletedSteps(status.progress.completedSteps);
    }
  }, [status]);

  const handleStepComplete = async (achievementId?: string) => {
    if (!currentStep) return;

    const newCompletedSteps = [...completedSteps, currentStep];
    const nextStep = getNextStep(currentStep);

    // Show achievement if provided
    if (achievementId) {
      const achievement = Object.values(ACHIEVEMENTS).find((a) => a.id === achievementId);
      if (achievement) {
        showAchievement({
          ...achievement,
          unlockedAt: new Date(),
        });
      }
    }

    // Update progress
    if (nextStep) {
      await updateProgress.mutateAsync({
        currentStep: nextStep,
        completedSteps: newCompletedSteps,
      });

      // Navigate to next step
      const sessionId = searchParams.get("sessionId");
      router.push(`/onboarding/${nextStep}${sessionId ? `?sessionId=${sessionId}` : ""}`);
    } else {
      // Onboarding complete
      await updateProgress.mutateAsync({
        currentStep: "completion",
        completedSteps: newCompletedSteps,
      });
    }
  };

  if (statusLoading || sessionLoading || !currentStep) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect if user already completed onboarding
  if (status?.completed) {
    router.push("/dashboard");
    return null;
  }

  // Show completion page
  if (currentStep === "completion") {
    return <CompletionCelebration />;
  }

  // Render appropriate step content
  const renderStepContent = () => {
    if (!sessionData?.session) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading onboarding session...</p>
        </div>
      );
    }

    switch (currentStep) {
      case "improvement-capture":
        return (
          <ImprovementCaptureDemo
            improvements={(sessionData.session as any).improvements.map((imp: any) => ({
              title: imp.title,
              description: imp.description ?? "",
            }))}
            onComplete={() => handleStepComplete(ACHIEVEMENTS.FIRST_IMPROVEMENT.id)}
          />
        );

      case "ai-interrogation":
        const conversation = (sessionData.session as any).improvements[0]?.conversations[0];
        return (
          <AIInterrogationDemo
            conversation={
              conversation?.messages as Array<{ role: "assistant" | "user"; content: string }> || []
            }
            onComplete={() => handleStepComplete(ACHIEVEMENTS.AI_CONVERSATION.id)}
          />
        );

      case "pairwise-comparison":
        const comparisons = (sessionData.session as any).decisions.map((decision: any) => ({
          itemA: decision.itemA.title,
          itemB: decision.itemB.title,
          winner: (decision.winnerId === decision.itemAId ? "A" : "B") as "A" | "B",
          reasoning: decision.reasoning ?? "",
        }));
        return (
          <PairwiseComparisonDemo
            comparisons={comparisons}
            onComplete={() => handleStepComplete(ACHIEVEMENTS.FIRST_COMPARISON.id)}
          />
        );

      case "matrix-visualization":
        return (
          <MatrixVisualizationDemo
            onComplete={() => handleStepComplete(ACHIEVEMENTS.MATRIX_EXPLORED.id)}
          />
        );

      case "export-demo":
        return (
          <ExportDemo
            onComplete={() => handleStepComplete(ACHIEVEMENTS.FIRST_EXPORT.id)}
          />
        );

      default:
        return (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Unknown step</p>
          </div>
        );
    }
  };

  return (
    <>
      <AchievementNotifications
        notifications={notifications}
        onDismiss={dismissNotification}
      />
      <OnboardingStepWrapper currentStep={currentStep} completedSteps={completedSteps}>
        {renderStepContent()}
      </OnboardingStepWrapper>
    </>
  );
}
