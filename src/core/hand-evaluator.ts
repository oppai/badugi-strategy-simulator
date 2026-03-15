import { Card } from './card';

export class EvaluatedHand {
  cards: Card[];

  constructor(cards: Card[]) {
    this.cards = cards;
    this.cards.sort((a, b) => b.rank - a.rank); // Sort highest to lowest
  }

  get size(): number {
    return this.cards.length;
  }

  get ranks(): number[] {
    return this.cards.map(c => c.rank);
  }

  // Returns >0 if this beats other, <0 if other beats this, 0 if tie
  compare(other: EvaluatedHand): number {
    if (this.size !== other.size) {
      return this.size - other.size;
    }
    
    for (let i = 0; i < this.size; i++) {
        if (this.ranks[i] !== other.ranks[i]) {
            // Lower rank is better in Badugi!
            return other.ranks[i] - this.ranks[i];
        }
    }
    
    return 0; 
  }

  toString(): string {
    return `${this.size}-Card: ` + this.cards.map(c => c.rank === 1 ? 'A' :
                                               c.rank === 10 ? 'T' :
                                               c.rank === 11 ? 'J' :
                                               c.rank === 12 ? 'Q' :
                                               c.rank === 13 ? 'K' :
                                               c.rank.toString()).join('');
  }
}

export function getAllValidHands(cards: Card[]): EvaluatedHand[] {
  const validHands: EvaluatedHand[] = [];
  const n = cards.length;
  
  for (let mask = 1; mask < (1 << n); mask++) {
    const subset: Card[] = [];
    for (let i = 0; i < n; i++) {
      if ((mask & (1 << i))) {
        subset.push(cards[i]);
      }
    }
    
    const suits = new Set(subset.map(c => c.suit));
    const ranks = new Set(subset.map(c => c.rank));
    
    if (suits.size === subset.length && ranks.size === subset.length) {
      validHands.push(new EvaluatedHand(subset));
    }
  }
  
  validHands.sort((a, b) => b.compare(a));
  return validHands;
}

export function evaluateHand(cards: Card[]): EvaluatedHand {
  return getAllValidHands(cards)[0];
}

export function getBestSubsetOfSize(cards: Card[], size: number): EvaluatedHand | null {
  const validHands = getAllValidHands(cards).filter(h => h.size === size);
  return validHands.length > 0 ? validHands[0] : null;
}

export function compareHands(cardsA: Card[], cardsB: Card[]): number {
  return evaluateHand(cardsA).compare(evaluateHand(cardsB));
}

