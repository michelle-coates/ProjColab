/**
 * Input completeness scoring system
 * Story 1.10: Input Validation and Error Handling
 *
 * Scores input quality on a 0.0-1.0 scale with transparent, explainable criteria
 */

export interface CompletenessScore {
  /** Overall score from 0.0 (incomplete) to 1.0 (excellent) */
  score: number;
  /** Category of completeness: poor, fair, good, excellent */
  category: 'poor' | 'fair' | 'good' | 'excellent';
  /** Breakdown of scoring factors */
  factors: {
    name: string;
    score: number;
    weight: number;
    reason: string;
  }[];
  /** Actionable recommendations to improve the score */
  recommendations: string[];
}

/**
 * Score improvement item completeness
 */
export function scoreImprovementCompleteness(input: {
  title?: string;
  description?: string;
  category?: string;
  evidenceCount?: number;
  effortLevel?: string;
}): CompletenessScore {
  const factors: CompletenessScore['factors'] = [];

  // Factor 1: Title quality (weight: 0.20)
  const titleScore = scoreTitleQuality(input.title || '');
  factors.push({
    name: 'Title Quality',
    score: titleScore.score,
    weight: 0.20,
    reason: titleScore.reason,
  });

  // Factor 2: Description quality (weight: 0.35)
  const descriptionScore = scoreDescriptionQuality(input.description || '');
  factors.push({
    name: 'Description Quality',
    score: descriptionScore.score,
    weight: 0.35,
    reason: descriptionScore.reason,
  });

  // Factor 3: Category selection (weight: 0.10)
  const categoryScore = input.category && input.category !== 'OTHER' ? 1.0 : 0.5;
  factors.push({
    name: 'Category Selection',
    score: categoryScore,
    weight: 0.10,
    reason: categoryScore === 1.0
      ? 'Specific category selected'
      : 'Consider selecting a more specific category than "Other"',
  });

  // Factor 4: Evidence provided (weight: 0.20)
  const evidenceScore = scoreEvidence(input.evidenceCount || 0);
  factors.push({
    name: 'Supporting Evidence',
    score: evidenceScore.score,
    weight: 0.20,
    reason: evidenceScore.reason,
  });

  // Factor 5: Effort estimated (weight: 0.15)
  const effortScore = input.effortLevel ? 1.0 : 0.0;
  factors.push({
    name: 'Effort Estimation',
    score: effortScore,
    weight: 0.15,
    reason: effortScore === 1.0
      ? 'Effort level estimated'
      : 'Add an effort estimate to improve prioritization',
  });

  // Calculate weighted score
  const totalScore = factors.reduce((sum, factor) =>
    sum + (factor.score * factor.weight), 0
  );

  // Determine category
  let category: CompletenessScore['category'];
  if (totalScore >= 0.85) category = 'excellent';
  else if (totalScore >= 0.70) category = 'good';
  else if (totalScore >= 0.50) category = 'fair';
  else category = 'poor';

  // Generate recommendations
  const recommendations = generateRecommendations(factors, input);

  return {
    score: Math.round(totalScore * 100) / 100, // Round to 2 decimal places
    category,
    factors,
    recommendations,
  };
}

/**
 * Score title quality based on length and content
 */
function scoreTitleQuality(title: string): { score: number; reason: string } {
  const trimmed = title.trim();
  const length = trimmed.length;

  if (length === 0) {
    return { score: 0.0, reason: 'Title is missing' };
  }

  if (length < 5) {
    return { score: 0.2, reason: 'Title is too short to be descriptive' };
  }

  if (length >= 5 && length < 15) {
    return { score: 0.5, reason: 'Title is brief but could be more descriptive' };
  }

  if (length >= 15 && length <= 80) {
    // Check for capitalization
    const startsWithCapital = /^[A-Z]/.test(trimmed);
    const hasMultipleWords = trimmed.split(/\s+/).length >= 3;

    if (startsWithCapital && hasMultipleWords) {
      return { score: 1.0, reason: 'Title is clear and descriptive' };
    }

    return { score: 0.8, reason: 'Title is good length but could be more structured' };
  }

  if (length > 80 && length <= 200) {
    return { score: 0.7, reason: 'Title is quite long - consider moving detail to description' };
  }

  return { score: 0.3, reason: 'Title is too long for quick scanning' };
}

/**
 * Score description quality based on length and detail
 */
function scoreDescriptionQuality(description: string): { score: number; reason: string } {
  const trimmed = description.trim();
  const length = trimmed.length;
  const words = trimmed.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  if (length === 0) {
    return { score: 0.0, reason: 'Description is missing' };
  }

  if (length < 10) {
    return { score: 0.1, reason: 'Description is too short to provide context' };
  }

  if (wordCount < 5) {
    return { score: 0.3, reason: 'Description needs more detail for AI analysis' };
  }

  if (wordCount >= 5 && wordCount < 20) {
    return { score: 0.6, reason: 'Description provides basic context but could be more detailed' };
  }

  if (wordCount >= 20 && wordCount < 100) {
    // Check for question words (good sign of problem exploration)
    const hasQuestions = /\b(what|why|how|when|where|who)\b/i.test(trimmed);
    // Check for specific details (numbers, examples)
    const hasDetails = /\d+|e\.g\.|example|specifically|currently/i.test(trimmed);

    if (hasQuestions || hasDetails) {
      return { score: 1.0, reason: 'Description is detailed and provides clear context' };
    }

    return { score: 0.8, reason: 'Description is good but could include specific examples or questions' };
  }

  if (wordCount >= 100 && wordCount <= 300) {
    return { score: 0.9, reason: 'Description is thorough and comprehensive' };
  }

  return { score: 0.7, reason: 'Description is very long - consider breaking into evidence items' };
}

/**
 * Score evidence completeness
 */
function scoreEvidence(count: number): { score: number; reason: string } {
  if (count === 0) {
    return { score: 0.0, reason: 'No supporting evidence provided' };
  }

  if (count === 1) {
    return { score: 0.6, reason: 'One piece of evidence - consider adding more sources' };
  }

  if (count >= 2 && count <= 5) {
    return { score: 1.0, reason: 'Good variety of supporting evidence' };
  }

  return { score: 0.9, reason: 'Lots of evidence - ensure each piece adds unique value' };
}

/**
 * Generate actionable recommendations based on scoring factors
 */
function generateRecommendations(
  factors: CompletenessScore['factors'],
  input: {
    title?: string;
    description?: string;
    category?: string;
    evidenceCount?: number;
    effortLevel?: string;
  }
): string[] {
  const recommendations: string[] = [];

  // Find the lowest scoring factors (under 0.7)
  const weakFactors = factors.filter(f => f.score < 0.7).sort((a, b) => a.score - b.score);

  for (const factor of weakFactors.slice(0, 3)) { // Top 3 recommendations
    switch (factor.name) {
      case 'Title Quality':
        if (!input.title || input.title.trim().length < 15) {
          recommendations.push('Add a more descriptive title that clearly states what needs improvement');
        } else if (input.title.length > 80) {
          recommendations.push('Shorten the title and move extra detail to the description');
        }
        break;

      case 'Description Quality':
        if (!input.description || input.description.trim().split(/\s+/).length < 20) {
          recommendations.push('Add more detail to the description - explain what, why, and the expected impact');
        }
        break;

      case 'Category Selection':
        recommendations.push('Choose a more specific category than "Other" if possible');
        break;

      case 'Supporting Evidence':
        if ((input.evidenceCount || 0) === 0) {
          recommendations.push('Add supporting evidence like user feedback, metrics, or examples');
        } else if ((input.evidenceCount || 0) === 1) {
          recommendations.push('Add another piece of evidence from a different source to strengthen the case');
        }
        break;

      case 'Effort Estimation':
        recommendations.push('Estimate the effort level (Small/Medium/Large) to help with prioritization');
        break;
    }
  }

  // If no weak factors, provide optimization tips
  if (recommendations.length === 0) {
    recommendations.push('This improvement is well-documented! Ready for AI analysis and prioritization');
  }

  return recommendations;
}

/**
 * Score evidence item completeness
 */
export function scoreEvidenceCompleteness(input: {
  content?: string;
  source?: string;
}): CompletenessScore {
  const factors: CompletenessScore['factors'] = [];

  // Factor 1: Content quality (weight: 0.70)
  const contentScore = scoreEvidenceContent(input.content || '');
  factors.push({
    name: 'Evidence Content',
    score: contentScore.score,
    weight: 0.70,
    reason: contentScore.reason,
  });

  // Factor 2: Source provided (weight: 0.30)
  const sourceScore = scoreEvidenceSource(input.source || '');
  factors.push({
    name: 'Evidence Source',
    score: sourceScore.score,
    weight: 0.30,
    reason: sourceScore.reason,
  });

  const totalScore = factors.reduce((sum, factor) =>
    sum + (factor.score * factor.weight), 0
  );

  let category: CompletenessScore['category'];
  if (totalScore >= 0.85) category = 'excellent';
  else if (totalScore >= 0.70) category = 'good';
  else if (totalScore >= 0.50) category = 'fair';
  else category = 'poor';

  const recommendations: string[] = [];
  if (contentScore.score < 0.7) {
    recommendations.push('Add more detail to explain why this evidence matters');
  }
  if (sourceScore.score < 0.7) {
    recommendations.push('Specify where this evidence came from (e.g., user feedback, analytics, support tickets)');
  }

  return {
    score: Math.round(totalScore * 100) / 100,
    category,
    factors,
    recommendations: recommendations.length > 0 ? recommendations : ['Evidence is well-documented'],
  };
}

function scoreEvidenceContent(content: string): { score: number; reason: string } {
  const trimmed = content.trim();
  const length = trimmed.length;
  const wordCount = trimmed.split(/\s+/).filter(w => w.length > 0).length;

  if (length === 0) return { score: 0.0, reason: 'Content is missing' };
  if (length < 5) return { score: 0.2, reason: 'Content is too brief' };
  if (wordCount < 5) return { score: 0.4, reason: 'Add more detail to the evidence' };
  if (wordCount >= 5 && wordCount < 50) return { score: 0.8, reason: 'Good level of detail' };
  if (wordCount >= 50 && wordCount <= 200) return { score: 1.0, reason: 'Comprehensive evidence' };
  return { score: 0.7, reason: 'Very detailed - consider splitting into multiple evidence items' };
}

function scoreEvidenceSource(source: string): { score: number; reason: string } {
  const trimmed = source.trim();
  const length = trimmed.length;

  if (length === 0) return { score: 0.0, reason: 'Source is missing' };
  if (length < 3) return { score: 0.3, reason: 'Source needs more detail' };
  if (length >= 3 && length <= 100) return { score: 1.0, reason: 'Source is clear' };
  return { score: 0.8, reason: 'Source is quite long' };
}
