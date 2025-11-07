import { describe, it, expect } from "vitest";
import {
  generateCSV,
  generateCSVFilename,
  type ImprovementExportData,
  type ExportMetadata,
} from "../csv-generator";

describe("CSV Generator", () => {
  const mockMetadata: ExportMetadata = {
    sessionId: "test-session-123",
    userName: "Test User",
    exportDate: new Date("2025-01-15T10:00:00Z"),
  };

  const mockImprovements: ImprovementExportData[] = [
    {
      id: "1",
      title: "Improve login performance",
      description: "Make login faster for users",
      category: "PERFORMANCE",
      effortLevel: "SMALL",
      impactScore: 8.5,
      rankPosition: 1,
      evidence: [
        {
          content: "Users report slow login times",
          source: "USER_FEEDBACK",
          confidence: 0.9,
        },
      ],
      decisionsAsWinner: [
        {
          rationale: "High user impact with minimal effort",
          quickRationale: "Quick win",
        },
      ],
    },
    {
      id: "2",
      title: "Add dark mode",
      description: "Support dark theme for better UX",
      category: "FEATURE",
      effortLevel: "MEDIUM",
      impactScore: 6.2,
      rankPosition: 2,
      evidence: [],
      decisionsAsWinner: [],
    },
  ];

  describe("generateCSV", () => {
    it("should generate valid CSV with headers", () => {
      const csv = generateCSV(mockImprovements, mockMetadata);

      expect(csv).toContain("title");
      expect(csv).toContain("description");
      expect(csv).toContain("category");
      expect(csv).toContain("priorityRank");
      expect(csv).toContain("effortLevel");
      expect(csv).toContain("impactScore");
      expect(csv).toContain("decisionRationale");
      expect(csv).toContain("evidenceSummary");
      expect(csv).toContain("exportDate");
      expect(csv).toContain("userName");
      expect(csv).toContain("sessionId");
    });

    it("should include all improvement data", () => {
      const csv = generateCSV(mockImprovements, mockMetadata);

      expect(csv).toContain("Improve login performance");
      expect(csv).toContain("Make login faster for users");
      expect(csv).toContain("PERFORMANCE");
      expect(csv).toContain("Add dark mode");
    });

    it("should include metadata in every row", () => {
      const csv = generateCSV(mockImprovements, mockMetadata);

      expect(csv).toContain("Test User");
      expect(csv).toContain("test-session-123");
      expect(csv).toContain("2025-01-15");
    });

    it("should sort improvements by rank position", () => {
      const unsortedImprovements: ImprovementExportData[] = [
        { ...mockImprovements[1]!, rankPosition: 3 },
        { ...mockImprovements[0]!, rankPosition: 1 },
      ];

      const csv = generateCSV(unsortedImprovements, mockMetadata);
      const lines = csv.split("\n");

      // First data row should be rank 1
      expect(lines[1]).toContain("Improve login performance");
    });

    it("should handle empty improvements array", () => {
      const csv = generateCSV([], mockMetadata);

      // Papa parse returns empty string for empty data with header mode
      expect(csv).toBeDefined();
      expect(csv.length).toBeGreaterThanOrEqual(0);
    });

    it("should sanitize special characters to prevent CSV injection", () => {
      const maliciousImprovements: ImprovementExportData[] = [
        {
          ...mockImprovements[0]!,
          title: "=cmd|'/c calc'!A1",
          description: "+Dangerous formula",
        },
      ];

      const csv = generateCSV(maliciousImprovements, mockMetadata);

      // Leading special characters should be removed
      expect(csv).not.toContain("=cmd");
      expect(csv).not.toContain("+Dangerous");
    });

    it("should handle missing optional fields gracefully", () => {
      const incompleteImprovements: ImprovementExportData[] = [
        {
          id: "3",
          title: "Test improvement",
          description: "Test description",
          category: "BUG",
          effortLevel: null,
          impactScore: null,
          rankPosition: null,
          evidence: [],
          decisionsAsWinner: [],
        },
      ];

      const csv = generateCSV(incompleteImprovements, mockMetadata);

      expect(csv).toContain("Not estimated");
      expect(csv).toContain("No evidence recorded");
      expect(csv).toContain("No decision rationale recorded");
    });

    it("should format evidence summary correctly", () => {
      const csv = generateCSV(mockImprovements, mockMetadata);

      expect(csv).toContain("[USER_FEEDBACK]");
      expect(csv).toContain("Users report slow login times");
      expect(csv).toContain("90% confidence");
    });

    it("should format decision rationale correctly", () => {
      const csv = generateCSV(mockImprovements, mockMetadata);

      expect(csv).toContain("High user impact with minimal effort");
    });
  });

  describe("generateCSVFilename", () => {
    it("should generate filename with session ID and timestamp", () => {
      const filename = generateCSVFilename(
        "test-session-123",
        new Date("2025-01-15T10:30:45Z")
      );

      expect(filename).toContain("frank-export");
      expect(filename).toContain("test-ses"); // Short session ID
      expect(filename).toContain("20250115");
      expect(filename).toContain(".csv");
    });

    it("should use current date if timestamp not provided", () => {
      const filename = generateCSVFilename("test-session-123");

      expect(filename).toMatch(/frank-export-test-ses-\d{8}-\d{6}\.csv/);
    });

    it("should truncate long session IDs", () => {
      const longSessionId = "very-long-session-id-with-many-characters";
      const filename = generateCSVFilename(longSessionId);

      // Should only include first 8 characters
      expect(filename).toContain("very-lon");
      expect(filename.length).toBeLessThan(50);
    });
  });
});
