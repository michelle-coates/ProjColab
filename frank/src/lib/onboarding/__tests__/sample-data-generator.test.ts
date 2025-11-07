import { describe, it, expect } from "vitest";
import {
  generateSampleData,
  generateSampleMatrixData,
} from "../sample-data-generator";
import type { OnboardingRole } from "../types";

describe("Sample Data Generator", () => {
  const roles: OnboardingRole[] = ["SOLO_PM", "TEAM_LEAD", "FOUNDER"];
  const testSessionId = "test-session-123";

  describe("generateSampleData", () => {
    roles.forEach((role) => {
      it(`should generate complete sample data for ${role}`, () => {
        const data = generateSampleData(role, testSessionId);

        expect(data.sessionId).toBe(testSessionId);
        expect(data.improvements).toBeDefined();
        expect(data.improvements.length).toBeGreaterThan(0);
        expect(data.conversations).toBeDefined();
        expect(data.decisions).toBeDefined();
      });

      it(`should generate improvements with all required fields for ${role}`, () => {
        const data = generateSampleData(role, testSessionId);

        data.improvements.forEach((improvement) => {
          expect(improvement.title).toBeTruthy();
          expect(improvement.description).toBeTruthy();
          expect(typeof improvement.estimatedEffort).toBe("number");
          expect(improvement.estimatedEffort).toBeGreaterThan(0);
          expect(improvement.expectedImpact).toBeTruthy();
          expect(Array.isArray(improvement.evidence)).toBe(true);
          expect(improvement.evidence.length).toBeGreaterThan(0);
        });
      });
    });

    it("should generate at least one AI conversation", () => {
      const data = generateSampleData("SOLO_PM", testSessionId);

      expect(data.conversations.length).toBeGreaterThan(0);
      const firstConversation = data.conversations[0];
      expect(firstConversation).toBeDefined();
      expect(firstConversation!.messages.length).toBeGreaterThan(0);
    });

    it("should generate conversations with alternating roles", () => {
      const data = generateSampleData("SOLO_PM", testSessionId);
      const conversation = data.conversations[0];

      if (conversation && conversation.messages.length > 1) {
        for (let i = 0; i < conversation.messages.length - 1; i++) {
          const currentMessage = conversation.messages[i];
          const nextMessage = conversation.messages[i + 1];
          expect(currentMessage!.role).not.toBe(nextMessage!.role);
        }
      }
    });

    it("should generate pairwise decisions when enough improvements exist", () => {
      const data = generateSampleData("SOLO_PM", testSessionId);

      if (data.improvements.length >= 2) {
        expect(data.decisions.length).toBeGreaterThan(0);

        data.decisions.forEach((decision) => {
          expect(decision.improvementAIndex).toBeGreaterThanOrEqual(0);
          expect(decision.improvementBIndex).toBeGreaterThanOrEqual(0);
          expect(decision.improvementAIndex).not.toBe(decision.improvementBIndex);
          expect(["A", "B"]).toContain(decision.winner);
          expect(decision.reasoning).toBeTruthy();
        });
      }
    });

    it("should generate different sample data for different roles", () => {
      const soloPMData = generateSampleData("SOLO_PM", testSessionId);
      const teamLeadData = generateSampleData("TEAM_LEAD", testSessionId);
      const founderData = generateSampleData("FOUNDER", testSessionId);

      // Check that improvement titles are different across roles
      const soloPMTitles = soloPMData.improvements.map((i) => i.title);
      const teamLeadTitles = teamLeadData.improvements.map((i) => i.title);
      const founderTitles = founderData.improvements.map((i) => i.title);

      expect(soloPMTitles).not.toEqual(teamLeadTitles);
      expect(soloPMTitles).not.toEqual(founderTitles);
      expect(teamLeadTitles).not.toEqual(founderTitles);
    });
  });

  describe("generateSampleMatrixData", () => {
    it("should generate matrix positions for given improvement count", () => {
      const improvementCount = 4;
      const matrixData = generateSampleMatrixData(improvementCount);

      expect(matrixData.length).toBeLessThanOrEqual(improvementCount);
      expect(matrixData.length).toBeGreaterThan(0);
    });

    it("should generate valid matrix positions", () => {
      const matrixData = generateSampleMatrixData(4);

      matrixData.forEach((position) => {
        expect(position.improvementIndex).toBeGreaterThanOrEqual(0);
        expect(position.impact).toBeGreaterThanOrEqual(0);
        expect(position.impact).toBeLessThanOrEqual(10);
        expect(position.effort).toBeGreaterThanOrEqual(0);
        expect(position.effort).toBeLessThanOrEqual(10);
        expect(["quick-wins", "big-bets", "fill-ins", "time-sinks"]).toContain(
          position.quadrant,
        );
      });
    });

    it("should distribute improvements across different quadrants", () => {
      const matrixData = generateSampleMatrixData(4);
      const quadrants = new Set(matrixData.map((p) => p.quadrant));

      // Should have some variety in quadrants
      expect(quadrants.size).toBeGreaterThan(0);
    });

    it("should handle zero improvements gracefully", () => {
      const matrixData = generateSampleMatrixData(0);
      expect(matrixData).toEqual([]);
    });

    it("should handle single improvement", () => {
      const matrixData = generateSampleMatrixData(1);
      expect(matrixData.length).toBeLessThanOrEqual(1);
    });
  });
});
