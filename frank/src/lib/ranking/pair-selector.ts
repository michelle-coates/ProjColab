/**
 * Story 1.5: Pair Selection Algorithm
 * Intelligently selects next pair to compare using binary search pattern
 */

export interface ImprovementItemForPairing {
  id: string;
  effortLevel?: string | null;
  [key: string]: unknown;
}

export interface DecisionForPairing {
  itemAId: string;
  itemBId: string;
  [key: string]: unknown;
}

export interface Pair<T> {
  itemA: T;
  itemB: T;
}

/**
 * Intelligently select next pair to compare
 * Strategy: Binary search pattern to minimize comparisons
 * 
 * @param items - All improvement items available for comparison
 * @param decisions - Existing comparison decisions
 * @returns Next pair to compare, or null if all items sufficiently compared
 */
export function selectNextPair<T extends ImprovementItemForPairing>(
  items: T[],
  decisions: DecisionForPairing[]
): Pair<T> | null {
  if (items.length < 2) {
    return null;
  }

  // Build comparison matrix
  const compared = new Set<string>();
  decisions.forEach(d => {
    compared.add(pairKey(d.itemAId, d.itemBId));
  });
  
  // Find items with fewest comparisons
  const comparisonCounts = new Map<string, number>();
  items.forEach(item => {
    const count = decisions.filter(
      d => d.itemAId === item.id || d.itemBId === item.id
    ).length;
    comparisonCounts.set(item.id, count);
  });
  
  // Sort items by comparison count (ascending)
  const sortedItems = [...items].sort((a, b) => {
    const countA = comparisonCounts.get(a.id) ?? 0;
    const countB = comparisonCounts.get(b.id) ?? 0;
    return countA - countB;
  });
  
  // Strategy 1: Find uncompared pair with item needing most comparisons
  for (const itemA of sortedItems) {
    for (const itemB of items) {
      if (itemA.id === itemB.id) continue;
      const key = pairKey(itemA.id, itemB.id);
      if (!compared.has(key)) {
        return { itemA, itemB };
      }
    }
  }
  
  // Strategy 2: For larger sets, compare items with different effort levels
  // This builds the Impact dimension (same effort, choose higher impact)
  // Only apply if we have 4+ items to avoid over-comparing small sets
  if (items.length >= 4) {
    const effortGroups = new Map<string, T[]>();
    items.forEach(item => {
      const effort = item.effortLevel ?? 'UNKNOWN';
      const group = effortGroups.get(effort) ?? [];
      group.push(item);
      effortGroups.set(effort, group);
    });
    
    // Find pair from different effort groups with low comparison count
    for (const itemA of sortedItems) {
      for (const itemB of items) {
        if (itemA.id === itemB.id) continue;
        if (itemA.effortLevel !== itemB.effortLevel) {
          const countA = comparisonCounts.get(itemA.id) ?? 0;
          const countB = comparisonCounts.get(itemB.id) ?? 0;
          if (countA < 5 || countB < 5) {
            return { itemA, itemB };
          }
        }
      }
    }
  }
  
  // All items sufficiently compared
  return null;
}

/**
 * Generate consistent pair key for deduplication
 */
function pairKey(idA: string, idB: string): string {
  return idA < idB ? `${idA}:${idB}` : `${idB}:${idA}`;
}
