/**
 * Story 1.5: Prompt Generator
 * Generates contextual decision prompts based on item categories and effort levels
 */

export interface ImprovementItemForPrompt {
  category: string;
  effortLevel?: string | null;
}

export interface EvidenceEntry {
  content: string;
  [key: string]: unknown;
}

export interface ImprovementItemWithEvidence extends ImprovementItemForPrompt {
  evidenceEntries?: EvidenceEntry[];
}

/**
 * Generate contextual decision prompt based on item characteristics
 * 
 * @param itemA - First improvement item
 * @param itemB - Second improvement item
 * @returns Contextual prompt string for the comparison
 */
export function generateDecisionPrompt(
  itemA: ImprovementItemWithEvidence,
  itemB: ImprovementItemWithEvidence
): string {
  // Category-specific prompts
  if (itemA.category === itemB.category) {
    switch (itemA.category) {
      case 'UI_UX':
        return "Which would make users smile more?";
      case 'DATA_QUALITY':
        return "Which data problem causes more pain?";
      case 'WORKFLOW':
        return "Which bottleneck slows teams down most?";
      case 'BUG_FIX':
        return "Which bug frustrates users more often?";
      case 'FEATURE':
        return "Which feature would deliver more value?";
      default:
        return "Which would deliver more value?";
    }
  }
  
  // Effort-aware prompts when both same effort level
  if (itemA.effortLevel === itemB.effortLevel) {
    if (itemA.effortLevel === 'SMALL') {
      return "Quick win question: which gives more bang for the buck?";
    } else {
      return "Both similar effort - which would deliver more value?";
    }
  }
  
  // Evidence-based prompts
  const hasEvidenceA = itemA.evidenceEntries && itemA.evidenceEntries.length > 0;
  const hasEvidenceB = itemB.evidenceEntries && itemB.evidenceEntries.length > 0;
  
  if (hasEvidenceA && hasEvidenceB) {
    return "Based on evidence gathered, which has clearer impact?";
  }
  
  // Default
  return "Which would you prioritize?";
}
