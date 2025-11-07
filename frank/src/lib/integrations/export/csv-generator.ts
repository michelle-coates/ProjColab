import Papa from "papaparse";
import { format } from "date-fns";

/**
 * CSV Export Data Row Interface
 * Defines the structure of each row in the exported CSV
 */
export interface CSVExportRow {
  title: string;
  description: string;
  category: string;
  priorityRank: number;
  effortLevel: string;
  impactScore: number;
  decisionRationale: string;
  evidenceSummary: string;
  exportDate: string;
  userName: string;
  sessionId: string;
}

/**
 * Improvement data with related information for export
 */
export interface ImprovementExportData {
  id: string;
  title: string;
  description: string;
  category: string;
  effortLevel: string | null;
  impactScore: number | null;
  rankPosition: number | null;
  evidence: Array<{
    content: string;
    source: string;
    confidence: number;
  }>;
  decisionsAsWinner: Array<{
    rationale: string | null;
    quickRationale: string | null;
  }>;
}

/**
 * Session metadata for export
 */
export interface ExportMetadata {
  sessionId: string;
  userName: string;
  exportDate: Date;
}

/**
 * Sanitizes CSV field content to prevent CSV injection attacks
 * @param field - The field content to sanitize
 * @returns Sanitized field content
 */
function sanitizeCSVField(field: string): string {
  // Remove leading special characters that could trigger formulas
  const dangerousChars = /^[=+\-@\t\r]/;
  let sanitized = field.replace(dangerousChars, "");

  // Escape any remaining special characters
  sanitized = sanitized.replace(/"/g, '""');

  return sanitized;
}

/**
 * Summarizes evidence entries into a single string
 * @param evidence - Array of evidence entries
 * @returns Formatted evidence summary
 */
function summarizeEvidence(
  evidence: Array<{ content: string; source: string; confidence: number }>
): string {
  if (!evidence || evidence.length === 0) {
    return "No evidence recorded";
  }

  return evidence
    .map((e) => {
      const conf = Math.round(e.confidence * 100);
      return `[${e.source}] ${e.content} (${conf}% confidence)`;
    })
    .join(" | ");
}

/**
 * Extracts decision rationale from decision records
 * @param decisions - Array of decision records where this item won
 * @returns Combined rationale string
 */
function extractDecisionRationale(
  decisions: Array<{ rationale: string | null; quickRationale: string | null }>
): string {
  if (!decisions || decisions.length === 0) {
    return "No decision rationale recorded";
  }

  const rationales = decisions
    .map((d) => d.rationale || d.quickRationale || "")
    .filter((r) => r.length > 0)
    .slice(0, 3); // Limit to top 3 rationales to keep CSV readable

  return rationales.length > 0
    ? rationales.join(" | ")
    : "No decision rationale recorded";
}

/**
 * Generates CSV export data from improvement items
 * @param improvements - Array of improvements with related data
 * @param metadata - Export session metadata
 * @returns CSV string ready for download
 */
export function generateCSV(
  improvements: ImprovementExportData[],
  metadata: ExportMetadata
): string {
  // Sort improvements by rank position (ascending = higher priority)
  const sortedImprovements = [...improvements].sort((a, b) => {
    const rankA = a.rankPosition ?? Number.MAX_SAFE_INTEGER;
    const rankB = b.rankPosition ?? Number.MAX_SAFE_INTEGER;
    return rankA - rankB;
  });

  // Transform improvements into CSV rows
  const rows: CSVExportRow[] = sortedImprovements.map((item, index) => ({
    title: sanitizeCSVField(item.title),
    description: sanitizeCSVField(item.description),
    category: item.category,
    priorityRank: item.rankPosition ?? index + 1,
    effortLevel: item.effortLevel || "Not estimated",
    impactScore: item.impactScore ?? 0,
    decisionRationale: sanitizeCSVField(
      extractDecisionRationale(item.decisionsAsWinner)
    ),
    evidenceSummary: sanitizeCSVField(summarizeEvidence(item.evidence)),
    exportDate: format(metadata.exportDate, "yyyy-MM-dd HH:mm:ss"),
    userName: sanitizeCSVField(metadata.userName),
    sessionId: metadata.sessionId,
  }));

  // Generate CSV using papaparse
  const csv = Papa.unparse(rows, {
    header: true,
    columns: [
      "title",
      "description",
      "category",
      "priorityRank",
      "effortLevel",
      "impactScore",
      "decisionRationale",
      "evidenceSummary",
      "exportDate",
      "userName",
      "sessionId",
    ],
  });

  return csv;
}

/**
 * Generates a filename for the CSV export
 * @param sessionId - The session ID
 * @param timestamp - Export timestamp
 * @returns Formatted filename
 */
export function generateCSVFilename(
  sessionId: string,
  timestamp: Date = new Date()
): string {
  const dateStr = format(timestamp, "yyyyMMdd-HHmmss");
  const shortSessionId = sessionId.slice(0, 8);
  return `frank-export-${shortSessionId}-${dateStr}.csv`;
}
