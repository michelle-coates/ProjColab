import { describe, it, expect } from "vitest";
import {
  ONBOARDING_FLOW,
  getNextStep,
  getPreviousStep,
  getStepProgress,
  getTotalEstimatedMinutes,
  type OnboardingStep,
} from "../types";

describe("Onboarding Types and Utilities", () => {
  describe("ONBOARDING_FLOW", () => {
    it("should define all required steps", () => {
      const expectedSteps: OnboardingStep[] = [
        "welcome",
        "role-selection",
        "improvement-capture",
        "ai-interrogation",
        "pairwise-comparison",
        "matrix-visualization",
        "export-demo",
        "completion",
      ];

      expectedSteps.forEach((step) => {
        expect(ONBOARDING_FLOW[step]).toBeDefined();
      });
    });

    it("should have valid step definitions", () => {
      Object.values(ONBOARDING_FLOW).forEach((step) => {
        expect(step.id).toBeTruthy();
        expect(step.title).toBeTruthy();
        expect(step.description).toBeTruthy();
        expect(typeof step.estimatedMinutes).toBe("number");
        expect(step.estimatedMinutes).toBeGreaterThanOrEqual(0);
        expect(Array.isArray(step.features)).toBe(true);
      });
    });

    it("should form a valid linked list", () => {
      const steps = Object.values(ONBOARDING_FLOW);
      let currentStep = steps[0];
      const visited = new Set<string>();

      while (currentStep) {
        expect(visited.has(currentStep.id)).toBe(false);
        visited.add(currentStep.id);

        if (currentStep.nextStep) {
          const nextStep = ONBOARDING_FLOW[currentStep.nextStep];
          expect(nextStep).toBeDefined();
          expect(nextStep!.previousStep).toBe(currentStep.id);
          currentStep = nextStep!;
        } else {
          break;
        }
      }

      expect(visited.size).toBe(steps.length);
    });

    it("should have welcome as first step with no previous", () => {
      expect(ONBOARDING_FLOW.welcome.previousStep).toBeNull();
    });

    it("should have completion as last step with no next", () => {
      expect(ONBOARDING_FLOW.completion.nextStep).toBeNull();
    });
  });

  describe("getNextStep", () => {
    it("should return correct next step", () => {
      expect(getNextStep("welcome")).toBe("role-selection");
      expect(getNextStep("role-selection")).toBe("improvement-capture");
      expect(getNextStep("improvement-capture")).toBe("ai-interrogation");
    });

    it("should return null for completion step", () => {
      expect(getNextStep("completion")).toBeNull();
    });
  });

  describe("getPreviousStep", () => {
    it("should return correct previous step", () => {
      expect(getPreviousStep("role-selection")).toBe("welcome");
      expect(getPreviousStep("improvement-capture")).toBe("role-selection");
      expect(getPreviousStep("completion")).toBe("export-demo");
    });

    it("should return null for welcome step", () => {
      expect(getPreviousStep("welcome")).toBeNull();
    });
  });

  describe("getStepProgress", () => {
    it("should return 0 for no completed steps", () => {
      expect(getStepProgress([])).toBe(0);
    });

    it("should return 100 for all steps completed", () => {
      const allSteps: OnboardingStep[] = [
        "welcome",
        "role-selection",
        "improvement-capture",
        "ai-interrogation",
        "pairwise-comparison",
        "matrix-visualization",
        "export-demo",
        "completion",
      ];
      expect(getStepProgress(allSteps)).toBe(100);
    });

    it("should return correct percentage for partial completion", () => {
      const completedSteps: OnboardingStep[] = [
        "welcome",
        "role-selection",
        "improvement-capture",
        "ai-interrogation",
      ];
      const totalSteps = Object.keys(ONBOARDING_FLOW).length;
      const expectedProgress = Math.round((completedSteps.length / totalSteps) * 100);
      expect(getStepProgress(completedSteps)).toBe(expectedProgress);
    });

    it("should handle partial step completion", () => {
      const completedSteps: OnboardingStep[] = ["welcome", "role-selection"];
      const progress = getStepProgress(completedSteps);
      expect(progress).toBeGreaterThan(0);
      expect(progress).toBeLessThan(100);
    });
  });

  describe("getTotalEstimatedMinutes", () => {
    it("should return total estimated time", () => {
      const total = getTotalEstimatedMinutes();
      expect(total).toBeGreaterThan(0);
      expect(total).toBeLessThanOrEqual(20); // Should be under 20 minutes
    });

    it("should match sum of individual step times", () => {
      const steps = Object.values(ONBOARDING_FLOW);
      const expectedTotal = steps.reduce(
        (sum, step) => sum + step.estimatedMinutes,
        0,
      );
      expect(getTotalEstimatedMinutes()).toBe(expectedTotal);
    });
  });
});
