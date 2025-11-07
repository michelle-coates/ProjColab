"use client";

import { CheckCircle, Circle } from "lucide-react";
import { ONBOARDING_FLOW, type OnboardingStep } from "@/lib/onboarding/types";
import { Progress } from "@/components/ui/progress";

interface OnboardingStepProps {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  children: React.ReactNode;
}

export function OnboardingStepWrapper({
  currentStep,
  completedSteps,
  children,
}: OnboardingStepProps) {
  const allSteps = Object.values(ONBOARDING_FLOW);
  const currentStepIndex = allSteps.findIndex((s) => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / allSteps.length) * 100;

  const currentStepDef = ONBOARDING_FLOW[currentStep];

  return (
    <div className="min-h-screen bg-background">
      {/* Progress header */}
      <div className="border-b bg-card">
        <div className="container mx-auto max-w-6xl px-4 py-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Step {currentStepIndex + 1} of {allSteps.length}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                {Math.round(progress)}% complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto">
            {allSteps.map((step, index) => {
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = step.id === currentStep;

              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center min-w-0 flex-1"
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      isCompleted
                        ? "bg-primary border-primary text-primary-foreground"
                        : isCurrent
                          ? "border-primary text-primary"
                          : "border-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                  </div>
                  <span
                    className={`text-xs mt-2 text-center ${
                      isCurrent
                        ? "font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{currentStepDef?.title}</h1>
          <p className="text-lg text-muted-foreground">
            {currentStepDef?.description}
          </p>
          {currentStepDef && currentStepDef.estimatedMinutes > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Estimated time: {currentStepDef.estimatedMinutes} minutes
            </p>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}
