import type { EvidenceSource } from '../../validations/conversation';

// Confidence weights for different evidence sources
// Higher weight = more reliable evidence
const CONFIDENCE_WEIGHTS: Record<EvidenceSource, number> = {
  ANALYTICS: 1.0,          // Objective data from systems
  USER_UPLOAD: 0.9,        // User-provided documentation (screenshots, files)
  SUPPORT_TICKETS: 0.8,    // Concrete user issues
  USER_FEEDBACK: 0.6,      // Subjective but direct user input
  ASSUMPTIONS: 0.3,        // No concrete evidence, just assumptions
};

export interface EvidenceEntry {
  id: string;
  content: string;
  source: EvidenceSource;
  confidence: number;
  createdAt: Date;
}

/**
 * Calculate overall confidence score from evidence entries
 * Returns a value between 0.0 and 1.0
 * 
 * Formula: Sum of all evidence confidence scores / number of entries
 * This provides a simple weighted average that increases with more diverse evidence
 */
export function calculateConfidence(evidenceEntries: EvidenceEntry[]): number {
  if (evidenceEntries.length === 0) {
    return 0;
  }

  const totalConfidence = evidenceEntries.reduce((sum, entry) => {
    return sum + entry.confidence;
  }, 0);

  // Average confidence across all evidence
  const averageConfidence = totalConfidence / evidenceEntries.length;

  // Cap at 1.0 (100% confidence)
  return Math.min(averageConfidence, 1.0);
}

/**
 * Get the confidence score for a specific evidence source
 */
export function getConfidenceForSource(source: EvidenceSource): number {
  return CONFIDENCE_WEIGHTS[source] ?? 0.3;
}

/**
 * Identify missing evidence types (gaps in evidence coverage)
 * Returns an array of human-readable strings describing missing evidence
 */
export function identifyEvidenceGaps(evidenceEntries: EvidenceEntry[]): string[] {
  const presentSources = new Set(evidenceEntries.map((e) => e.source));
  const gaps: string[] = [];

  // Check for high-value evidence sources that are missing
  if (!presentSources.has('ANALYTICS')) {
    gaps.push('analytics data');
  }
  
  if (!presentSources.has('SUPPORT_TICKETS')) {
    gaps.push('support tickets');
  }
  
  if (!presentSources.has('USER_FEEDBACK')) {
    gaps.push('direct user feedback');
  }

  return gaps;
}

/**
 * Get a confidence level label based on the score
 */
export function getConfidenceLevel(score: number): 'low' | 'medium' | 'high' {
  if (score >= 0.7) return 'high';
  if (score >= 0.4) return 'medium';
  return 'low';
}

/**
 * Get a color code for confidence visualization
 */
export function getConfidenceColor(score: number): string {
  if (score >= 0.7) return 'green';   // High confidence
  if (score >= 0.4) return 'yellow';  // Medium confidence
  return 'red';                        // Low confidence
}

/**
 * Calculate confidence improvement potential
 * Shows what the confidence would be if specific evidence types were added
 */
export function calculatePotentialConfidence(
  currentEvidence: EvidenceEntry[],
  potentialSource: EvidenceSource
): number {
  const hypotheticalEntry: EvidenceEntry = {
    id: 'potential',
    content: '',
    source: potentialSource,
    confidence: CONFIDENCE_WEIGHTS[potentialSource] ?? 0.3,
    createdAt: new Date(),
  };

  const allEvidence = [...currentEvidence, hypotheticalEntry];
  return calculateConfidence(allEvidence);
}

/**
 * Get evidence source label for display
 */
export function getEvidenceSourceLabel(source: EvidenceSource): string {
  const labels: Record<EvidenceSource, string> = {
    ANALYTICS: 'Analytics Data',
    SUPPORT_TICKETS: 'Support Tickets',
    USER_FEEDBACK: 'User Feedback',
    ASSUMPTIONS: 'Assumption',
    USER_UPLOAD: 'User Upload',
  };
  return labels[source] ?? source;
}

/**
 * Get evidence source description
 */
export function getEvidenceSourceDescription(source: EvidenceSource): string {
  const descriptions: Record<EvidenceSource, string> = {
    ANALYTICS: 'Objective data from analytics systems, usage metrics, or performance monitoring',
    SUPPORT_TICKETS: 'Documented issues from support tickets, bug reports, or help desk requests',
    USER_FEEDBACK: 'Direct feedback from users through surveys, interviews, or feedback forms',
    ASSUMPTIONS: 'Assumptions or estimates without concrete supporting evidence',
    USER_UPLOAD: 'Documentation uploaded by users such as screenshots, files, or recordings',
  };
  return descriptions[source] ?? 'No description available';
}
