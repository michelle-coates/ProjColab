import { format } from "date-fns";
import type { ImprovementExportData, ExportMetadata } from "./csv-generator";

/**
 * Identifies top Quick Win improvements (high impact, low effort)
 * @param improvements - Array of improvements with impact and effort data
 * @returns Top 5 quick win improvements
 */
function identifyQuickWins(
  improvements: ImprovementExportData[]
): ImprovementExportData[] {
  const effortLevelValues: Record<string, number> = {
    SMALL: 1,
    MEDIUM: 2,
    LARGE: 3,
    XLARGE: 4,
  };

  // Calculate quick win score (high impact / low effort = high score)
  const scoredImprovements = improvements.map((item) => ({
    item,
    quickWinScore:
      (item.impactScore ?? 0) /
      (effortLevelValues[item.effortLevel ?? "MEDIUM"] || 2),
  }));

  // Sort by quick win score descending
  scoredImprovements.sort((a, b) => b.quickWinScore - a.quickWinScore);

  // Return top 5
  return scoredImprovements.slice(0, 5).map((s) => s.item);
}

/**
 * Generates a text-based summary report for a prioritization session
 * @param improvements - Array of improvements with related data
 * @param metadata - Export session metadata
 * @param sessionName - Optional session name for report header
 * @returns Formatted summary report string
 */
export function generateSummaryReport(
  improvements: ImprovementExportData[],
  metadata: ExportMetadata,
  sessionName?: string
): string {
  const lines: string[] = [];

  // Header
  lines.push("═".repeat(80));
  lines.push("FRANK - PRIORITIZATION SUMMARY REPORT");
  lines.push("═".repeat(80));
  lines.push("");

  // Session Information
  lines.push("SESSION INFORMATION");
  lines.push("─".repeat(80));
  if (sessionName) {
    lines.push(`Session Name: ${sessionName}`);
  }
  lines.push(`Session ID: ${metadata.sessionId}`);
  lines.push(`Export Date: ${format(metadata.exportDate, "MMMM d, yyyy 'at' h:mm a")}`);
  lines.push(`Exported By: ${metadata.userName}`);
  lines.push(`Total Improvements: ${improvements.length}`);
  lines.push("");

  // Prioritization Methodology
  lines.push("PRIORITIZATION METHODOLOGY");
  lines.push("─".repeat(80));
  lines.push(
    "Frank uses an AI-powered pairwise comparison approach combined with effort"
  );
  lines.push(
    "estimation to prioritize improvements. The methodology consists of:"
  );
  lines.push("");
  lines.push("1. IMPROVEMENT CAPTURE");
  lines.push(
    "   Users enter improvement ideas across categories (Feature, Bug, Tech Debt,"
  );
  lines.push("   User Experience, Performance).");
  lines.push("");
  lines.push("2. CONTEXT GATHERING (AI-Powered)");
  lines.push(
    "   AI assistant asks clarifying questions to understand the full context,"
  );
  lines.push(
    "   impact, and constraints of each improvement. Evidence is collected and"
  );
  lines.push("   tracked with confidence scores.");
  lines.push("");
  lines.push("3. EFFORT ESTIMATION (AI-Guided)");
  lines.push(
    "   AI analyzes the improvement and provides effort level recommendations"
  );
  lines.push(
    "   (Small, Medium, Large, X-Large) with detailed rationale. Users can"
  );
  lines.push("   accept or adjust the estimation.");
  lines.push("");
  lines.push("4. PAIRWISE COMPARISON");
  lines.push(
    "   Users compare improvements head-to-head, making trade-off decisions"
  );
  lines.push(
    "   with AI-generated rationale options. This builds a priority ranking"
  );
  lines.push("   based on relative impact.");
  lines.push("");
  lines.push("5. IMPACT VS EFFORT VISUALIZATION");
  lines.push(
    "   Results are visualized on a 2x2 matrix with four quadrants:"
  );
  lines.push("   - Quick Wins (High Impact, Low Effort)");
  lines.push("   - Major Projects (High Impact, High Effort)");
  lines.push("   - Fill-Ins (Low Impact, Low Effort)");
  lines.push("   - Time Sinks (Low Impact, High Effort)");
  lines.push("");

  // Key Statistics
  const categoryCounts = improvements.reduce(
    (acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const effortCounts = improvements.reduce(
    (acc, item) => {
      const effort = item.effortLevel || "Not estimated";
      acc[effort] = (acc[effort] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  lines.push("KEY STATISTICS");
  lines.push("─".repeat(80));
  lines.push("Category Breakdown:");
  Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, count]) => {
      lines.push(`  - ${category}: ${count} improvement(s)`);
    });
  lines.push("");
  lines.push("Effort Level Distribution:");
  Object.entries(effortCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([effort, count]) => {
      lines.push(`  - ${effort}: ${count} improvement(s)`);
    });
  lines.push("");

  // Top Quick Wins
  const quickWins = identifyQuickWins(improvements);
  lines.push("TOP 5 QUICK WINS (High Impact, Low Effort)");
  lines.push("─".repeat(80));
  lines.push(
    "These improvements offer the best return on investment and should be"
  );
  lines.push("prioritized for immediate implementation:");
  lines.push("");

  quickWins.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.title}`);
    lines.push(
      `   Category: ${item.category} | Effort: ${item.effortLevel || "Not estimated"} | Impact Score: ${item.impactScore?.toFixed(2) ?? "N/A"}`
    );
    if (item.description) {
      const shortDesc =
        item.description.length > 100
          ? item.description.slice(0, 97) + "..."
          : item.description;
      lines.push(`   ${shortDesc}`);
    }
    lines.push("");
  });

  // Top Priority Items (by rank)
  const topRanked = [...improvements]
    .filter((item) => item.rankPosition !== null)
    .sort((a, b) => (a.rankPosition ?? 0) - (b.rankPosition ?? 0))
    .slice(0, 10);

  if (topRanked.length > 0) {
    lines.push("TOP 10 PRIORITY IMPROVEMENTS (By Overall Ranking)");
    lines.push("─".repeat(80));
    topRanked.forEach((item) => {
      lines.push(`#${item.rankPosition} - ${item.title}`);
      lines.push(
        `   Category: ${item.category} | Effort: ${item.effortLevel || "Not estimated"}`
      );
    });
    lines.push("");
  }

  // Actionable Next Steps
  lines.push("ACTIONABLE NEXT STEPS FOR DEVELOPMENT TEAM");
  lines.push("─".repeat(80));
  lines.push(
    "To move forward with implementation, the development team should:"
  );
  lines.push("");
  lines.push("1. REVIEW THE QUICK WINS");
  lines.push(
    "   Start with the top 5 Quick Wins identified above. These offer the best"
  );
  lines.push(
    "   balance of impact and effort, delivering value quickly to users and"
  );
  lines.push("   stakeholders.");
  lines.push("");
  lines.push("2. ASSESS TECHNICAL FEASIBILITY");
  lines.push(
    "   Validate the effort estimates with your engineering team. Consider"
  );
  lines.push(
    "   technical constraints, dependencies, and integration requirements that"
  );
  lines.push("   may affect implementation.");
  lines.push("");
  lines.push("3. CREATE IMPLEMENTATION PLAN");
  lines.push(
    "   Break down selected improvements into user stories or tasks. Define"
  );
  lines.push(
    "   acceptance criteria, technical approach, and success metrics for each."
  );
  lines.push("");
  lines.push("4. SCHEDULE WORK");
  lines.push(
    "   Add prioritized improvements to your sprint backlog or project roadmap."
  );
  lines.push(
    "   Consider team capacity, release cycles, and strategic timing."
  );
  lines.push("");
  lines.push("5. TRACK AND MEASURE");
  lines.push(
    "   After implementation, measure the actual impact of each improvement."
  );
  lines.push(
    "   Use this data to refine future prioritization decisions and validate"
  );
  lines.push("   the effectiveness of the Frank prioritization process.");
  lines.push("");

  // Full CSV Data Reference
  lines.push("DETAILED DATA");
  lines.push("─".repeat(80));
  lines.push(
    "For complete details including decision rationale and evidence summaries,"
  );
  lines.push(
    "refer to the accompanying CSV export. The CSV can be imported into:"
  );
  lines.push("  - Jira, Linear, or other project management tools");
  lines.push("  - Notion or Confluence for documentation");
  lines.push("  - Excel or Google Sheets for further analysis");
  lines.push("");

  // Footer
  lines.push("─".repeat(80));
  lines.push("Generated by Frank - AI-Powered Prioritization Assistant");
  lines.push(`Report Date: ${format(metadata.exportDate, "yyyy-MM-dd HH:mm:ss")}`);
  lines.push("═".repeat(80));

  return lines.join("\n");
}

/**
 * Generates a filename for the summary report
 * @param sessionId - The session ID
 * @param timestamp - Export timestamp
 * @returns Formatted filename
 */
export function generateSummaryFilename(
  sessionId: string,
  timestamp: Date = new Date()
): string {
  const dateStr = format(timestamp, "yyyyMMdd-HHmmss");
  const shortSessionId = sessionId.slice(0, 8);
  return `frank-summary-${shortSessionId}-${dateStr}.txt`;
}
