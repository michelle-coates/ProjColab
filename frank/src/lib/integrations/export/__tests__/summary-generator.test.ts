import { describe, it, expect } from "vitest";
import {
  generateSummaryReport,
  generateSummaryFilename,
} from "../summary-generator";
import type { ImprovementExportData, ExportMetadata } from "../csv-generator";

describe("Summary Report Generator", () => {
  const mockMetadata: ExportMetadata = {
    sessionId: "test-session-123",
    userName: "Test User",
    exportDate: new Date("2025-01-15T10:00:00Z"),
  };

  const mockImprovements: ImprovementExportData[] = [
    {
      id: "1",
      title: "Quick Win: Improve login performance",
      description: "Make login faster for users",
      category: "PERFORMANCE",
      effortLevel: "SMALL",
      impactScore: 8.5,
      rankPosition: 1,
      evidence: [],
      decisionsAsWinner: [],
    },
    {
      id: "2",
      title: "Add dark mode",
      description: "Support dark theme",
      category: "FEATURE",
      effortLevel: "MEDIUM",
      impactScore: 6.2,
      rankPosition: 2,
      evidence: [],
      decisionsAsWinner: [],
    },
    {
      id: "3",
      title: "Fix critical bug",
      description: "Fix data loss issue",
      category: "BUG",
      effortLevel: "SMALL",
      impactScore: 9.0,
      rankPosition: 3,
      evidence: [],
      decisionsAsWinner: [],
    },
  ];

  describe("generateSummaryReport", () => {
    it("should include header and session information", () => {
      const report = generateSummaryReport(mockImprovements, mockMetadata);

      expect(report).toContain("FRANK - PRIORITIZATION SUMMARY REPORT");
      expect(report).toContain("SESSION INFORMATION");
      expect(report).toContain("Session ID: test-session-123");
      expect(report).toContain("Exported By: Test User");
      expect(report).toContain("Total Improvements: 3");
    });

    it("should include session name if provided", () => {
      const report = generateSummaryReport(
        mockImprovements,
        mockMetadata,
        "Q1 2025 Improvements"
      );

      expect(report).toContain("Session Name: Q1 2025 Improvements");
    });

    it("should describe prioritization methodology", () => {
      const report = generateSummaryReport(mockImprovements, mockMetadata);

      expect(report).toContain("PRIORITIZATION METHODOLOGY");
      expect(report).toContain("IMPROVEMENT CAPTURE");
      expect(report).toContain("CONTEXT GATHERING");
      expect(report).toContain("EFFORT ESTIMATION");
      expect(report).toContain("PAIRWISE COMPARISON");
      expect(report).toContain("IMPACT VS EFFORT VISUALIZATION");
    });

    it("should include key statistics", () => {
      const report = generateSummaryReport(mockImprovements, mockMetadata);

      expect(report).toContain("KEY STATISTICS");
      expect(report).toContain("Category Breakdown:");
      expect(report).toContain("Effort Level Distribution:");
      expect(report).toContain("PERFORMANCE");
      expect(report).toContain("FEATURE");
      expect(report).toContain("BUG");
    });

    it("should identify and list top Quick Wins", () => {
      const report = generateSummaryReport(mockImprovements, mockMetadata);

      expect(report).toContain("TOP 5 QUICK WINS");
      expect(report).toContain("High Impact, Low Effort");
      // Fix critical bug should be #1 (9.0 impact / SMALL effort)
      expect(report).toContain("Fix critical bug");
    });

    it("should limit Quick Wins to 5 items", () => {
      const manyImprovements: ImprovementExportData[] = Array.from(
        { length: 10 },
        (_, i) => ({
          id: `${i + 1}`,
          title: `Improvement ${i + 1}`,
          description: `Description ${i + 1}`,
          category: "FEATURE",
          effortLevel: "SMALL",
          impactScore: 7.0 + i * 0.1,
          rankPosition: i + 1,
          evidence: [],
          decisionsAsWinner: [],
        })
      );

      const report = generateSummaryReport(manyImprovements, mockMetadata);

      // Should contain numbered items 1-5
      expect(report).toContain("1. Improvement");
      expect(report).toContain("5. Improvement");
      // But not item 6
      expect(report).not.toMatch(/6\. Improvement/);
    });

    it("should include top 10 priority improvements by rank", () => {
      const report = generateSummaryReport(mockImprovements, mockMetadata);

      expect(report).toContain("TOP 10 PRIORITY IMPROVEMENTS");
      expect(report).toContain("#1 -");
      expect(report).toContain("#2 -");
      expect(report).toContain("#3 -");
    });

    it("should include actionable next steps", () => {
      const report = generateSummaryReport(mockImprovements, mockMetadata);

      expect(report).toContain("ACTIONABLE NEXT STEPS FOR DEVELOPMENT TEAM");
      expect(report).toContain("REVIEW THE QUICK WINS");
      expect(report).toContain("ASSESS TECHNICAL FEASIBILITY");
      expect(report).toContain("CREATE IMPLEMENTATION PLAN");
      expect(report).toContain("SCHEDULE WORK");
      expect(report).toContain("TRACK AND MEASURE");
    });

    it("should mention CSV export for detailed data", () => {
      const report = generateSummaryReport(mockImprovements, mockMetadata);

      expect(report).toContain("DETAILED DATA");
      expect(report).toContain("CSV");
      expect(report).toContain("Jira");
      expect(report).toContain("Notion");
    });

    it("should include footer with generation info", () => {
      const report = generateSummaryReport(mockImprovements, mockMetadata);

      expect(report).toContain("Generated by Frank");
      expect(report).toContain("Report Date:");
    });

    it("should handle empty improvements gracefully", () => {
      const report = generateSummaryReport([], mockMetadata);

      expect(report).toContain("Total Improvements: 0");
      expect(report).toContain("PRIORITIZATION METHODOLOGY");
      // Should still have structure even with no data
      expect(report.length).toBeGreaterThan(500);
    });

    it("should calculate Quick Win scores correctly", () => {
      const improvements: ImprovementExportData[] = [
        {
          id: "1",
          title: "High impact, low effort",
          description: "Test",
          category: "FEATURE",
          effortLevel: "SMALL", // Effort value = 1
          impactScore: 10.0,
          rankPosition: 1,
          evidence: [],
          decisionsAsWinner: [],
        },
        {
          id: "2",
          title: "High impact, high effort",
          description: "Test",
          category: "FEATURE",
          effortLevel: "XLARGE", // Effort value = 4
          impactScore: 10.0,
          rankPosition: 2,
          evidence: [],
          decisionsAsWinner: [],
        },
      ];

      const report = generateSummaryReport(improvements, mockMetadata);

      // First item should be listed first in Quick Wins (better score: 10/1 vs 10/4)
      const quickWinsSection = report.split("TOP 5 QUICK WINS")[1]!.split("TOP 10 PRIORITY")[0]!;
      const firstIndex = quickWinsSection.indexOf("High impact, low effort");
      const secondIndex = quickWinsSection.indexOf("High impact, high effort");

      expect(firstIndex).toBeLessThan(secondIndex);
    });
  });

  describe("generateSummaryFilename", () => {
    it("should generate filename with session ID and timestamp", () => {
      const filename = generateSummaryFilename(
        "test-session-123",
        new Date("2025-01-15T10:30:45Z")
      );

      expect(filename).toContain("frank-summary");
      expect(filename).toContain("test-ses");
      expect(filename).toContain("20250115");
      expect(filename).toContain(".txt");
    });

    it("should use current date if timestamp not provided", () => {
      const filename = generateSummaryFilename("test-session-123");

      expect(filename).toMatch(/frank-summary-test-ses-\d{8}-\d{6}\.txt/);
    });
  });
});
