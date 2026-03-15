import { describe, it, expect } from 'vitest';
import { Card } from '../src/core/card';
import { getAllValidHands, EvaluatedHand } from '../src/core/hand-evaluator';

describe('getAllValidHands', () => {
  it('should return all valid subsets for a given hand', () => {
    const cards = [
      Card.fromString('As'),
      Card.fromString('2d'),
      Card.fromString('3c'),
      Card.fromString('4h')
    ];
    const validHands = getAllValidHands(cards);

    // Total valid hands for a 4-card badugi should be:
    // 1 4-card
    // 4 3-cards
    // 6 2-cards
    // 4 1-cards
    // Total: 15
    expect(validHands.length).toBe(15);
    expect(validHands[0].size).toBe(4);
    expect(validHands[0].ranks).toEqual([4, 3, 2, 1]);
  });

  it('should filter out subsets with duplicate suits', () => {
    const cards = [
      Card.fromString('As'),
      Card.fromString('2d'),
      Card.fromString('3s'),
      Card.fromString('4s')
    ];
    const validHands = getAllValidHands(cards);

    // There can be NO 4-card or 3-card hands containing As+3s, As+4s, or 3s+4s.
    // Valid 2-card hands: As+2d, 3s+2d, 4s+2d
    // Valid 1-card hands: As, 2d, 3s, 4s
    // Total: 7
    expect(validHands.length).toBe(7);

    const maxHand = validHands[0];
    expect(maxHand.size).toBe(2);
    // Best hand is 2-card As+2d
    expect(maxHand.ranks).toEqual([2, 1]);
  });
});

describe('EvaluatedHand', () => {
  it('should compare hands correctly by size', () => {
    const h1 = new EvaluatedHand([Card.fromString('As'), Card.fromString('2d')]);
    const h2 = new EvaluatedHand([Card.fromString('As')]);
    // h1 beats h2
    expect(h1.compare(h2)).toBeGreaterThan(0);
  });

  it('should compare hands correctly by rank (lower is better)', () => {
    const h1 = new EvaluatedHand([Card.fromString('4s'), Card.fromString('3d'), Card.fromString('2c')]);
    const h2 = new EvaluatedHand([Card.fromString('5s'), Card.fromString('3d'), Card.fromString('2c')]);
    // 4 beats 5, so h1 beats h2
    expect(h1.compare(h2)).toBeGreaterThan(0);
  });
});
