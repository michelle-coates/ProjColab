/**
 * Story 1.5: Ranking Algorithm
 * Implements Elo-based ranking system for pairwise comparison decisions
 */

export interface ImprovementItemForRanking {
  id: string;
  [key: string]: unknown;
}

export interface DecisionForRanking {
  winnerId: string;
  itemAId: string;
  itemBId: string;
  decidedAt: Date;
  [key: string]: unknown;
}

export interface RankedItem {
  id: string;
  rankPosition: number;
  confidence: number;
  impactScore: number;
  wins: number;
  comparisons: number;
}

/**
 * Calculate ranking using modified Elo-style algorithm
 * More wins against higher-ranked opponents = higher score
 * 
 * @param items - All improvement items to rank
 * @param decisions - All pairwise comparison decisions
 * @returns Ranked list with positions, confidence scores, and impact scores
 */
export function calculateRanking(
  items: ImprovementItemForRanking[],
  decisions: DecisionForRanking[]
): RankedItem[] {
  // Initialize Elo scores (start at 1500)
  const scores = new Map<string, number>();
  const comparisons = new Map<string, number>();
  
  items.forEach(item => {
    scores.set(item.id, 1500);
    comparisons.set(item.id, 0);
  });
  
  // Process decisions chronologically to build Elo scores
  const sortedDecisions = [...decisions].sort((a, b) => 
    a.decidedAt.getTime() - b.decidedAt.getTime()
  );
  
  sortedDecisions.forEach(decision => {
    const winnerScore = scores.get(decision.winnerId) ?? 1500;
    const loserId = decision.winnerId === decision.itemAId 
      ? decision.itemBId 
      : decision.itemAId;
    const loserScore = scores.get(loserId) ?? 1500;
    
    // K-factor: how much each comparison affects score
    const K = 32;
    
    // Expected score for winner (0-1 probability)
    const expectedWin = 1 / (1 + Math.pow(10, (loserScore - winnerScore) / 400));
    
    // Update scores (winner gets closer to expected, loser loses)
    scores.set(decision.winnerId, winnerScore + K * (1 - expectedWin));
    scores.set(loserId, loserScore + K * (0 - (1 - expectedWin)));
    
    // Track comparison count
    comparisons.set(decision.winnerId, (comparisons.get(decision.winnerId) ?? 0) + 1);
    comparisons.set(loserId, (comparisons.get(loserId) ?? 0) + 1);
  });
  
  // Convert to ranked list
  const ranked = items.map(item => {
    const itemComparisons = comparisons.get(item.id) ?? 0;
    const wins = decisions.filter(d => d.winnerId === item.id).length;
    
    // Confidence based on comparison count and consistency
    let confidence = 0.3; // Minimum confidence
    if (itemComparisons >= 5) confidence = 0.9;
    else if (itemComparisons >= 3) confidence = 0.7;
    else if (itemComparisons >= 2) confidence = 0.5;
    
    return {
      id: item.id,
      rankPosition: 0, // Will be set after sorting
      confidence,
      impactScore: scores.get(item.id) ?? 1500,
      wins,
      comparisons: itemComparisons,
    };
  });
  
  // Sort by impact score descending
  ranked.sort((a, b) => b.impactScore - a.impactScore);
  
  // Assign rank positions
  ranked.forEach((item, index) => {
    item.rankPosition = index + 1;
  });
  
  return ranked;
}
