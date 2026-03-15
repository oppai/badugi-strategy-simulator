import { Deck } from './deck';
import { Card } from './card';
import { compareHands, evaluateHand } from './hand-evaluator';
import type { Strategy } from './strategy';
import { evaluateStrategy } from './strategy';

export type HandDistribution = Record<string, { count: number; win: number; lose: number; tie: number }>;

export interface SimulationResult {
  p1Wins: number;
  p2Wins: number;
  ties: number;
  total: number;
  p1Dist: HandDistribution;
  p2Dist: HandDistribution;
}

function getHandCategory(cards: Card[]): string {
  const best = evaluateHand(cards);
  if (best.size === 4) return `4-Card Badugi (${best.ranks[0] === 1 ? 'A' : best.ranks[0] === 10 ? 'T' : best.ranks[0] === 11 ? 'J' : best.ranks[0] === 12 ? 'Q' : best.ranks[0] === 13 ? 'K' : best.ranks[0]})`;
  if (best.size === 3) return `3-Card Tri (${best.ranks[0] === 1 ? 'A' : best.ranks[0] === 10 ? 'T' : best.ranks[0] === 11 ? 'J' : best.ranks[0] === 12 ? 'Q' : best.ranks[0] === 13 ? 'K' : best.ranks[0]})`;
  if (best.size === 2) return `2-Card (${best.ranks[0] === 1 ? 'A' : best.ranks[0] === 10 ? 'T' : best.ranks[0] === 11 ? 'J' : best.ranks[0] === 12 ? 'Q' : best.ranks[0] === 13 ? 'K' : best.ranks[0]})`;
  return `1-Card / Other`;
}

export function simulate(
  p1Strategy: Strategy,
  p2Strategy: Strategy,
  p1Start: Card[] | null,
  p2Start: Card[] | null,
  iterations: number
): SimulationResult {
  let p1Wins = 0;
  let p2Wins = 0;
  let ties = 0;

  const p1Dist: HandDistribution = {};
  const p2Dist: HandDistribution = {};

  for (let i = 0; i < iterations; i++) {
    const deck = new Deck();
    deck.shuffle();

    let p1Hand: Card[] = [];
    let p2Hand: Card[] = [];

    // Deal initial cards
    if (p1Start) {
      p1Hand = [...p1Start];
      deck.removeCards(p1Hand);
    }
    if (p2Start) {
      p2Hand = [...p2Start];
      deck.removeCards(p2Hand);
    }
    
    // Fill up to 4 cards if needed
    while (p1Hand.length < 4) p1Hand.push(deck.draw());
    while (p2Hand.length < 4) p2Hand.push(deck.draw());

    // 3 Draws
    for (let round = 1; round <= 3; round++) {
      // P1 Draw
      const p1Keep = evaluateStrategy(p1Strategy, p1Hand, round);
      p1Hand = [...p1Keep];
      while (p1Hand.length < 4) p1Hand.push(deck.draw());

      // P2 Draw
      const p2Keep = evaluateStrategy(p2Strategy, p2Hand, round);
      p2Hand = [...p2Keep];
      while (p2Hand.length < 4) p2Hand.push(deck.draw());
    }

    // Compare
    const result = compareHands(p1Hand, p2Hand);
    let p1Res: 'win'|'lose'|'tie' = 'tie';
    let p2Res: 'win'|'lose'|'tie' = 'tie';

    if (result > 0) {
      p1Wins++;
      p1Res = 'win';
      p2Res = 'lose';
    } else if (result < 0) {
      p2Wins++;
      p1Res = 'lose';
      p2Res = 'win';
    } else {
      ties++;
    }

    // Record distributions
    const p1Cat = getHandCategory(p1Hand);
    const p2Cat = getHandCategory(p2Hand);

    if (!p1Dist[p1Cat]) p1Dist[p1Cat] = { count: 0, win: 0, lose: 0, tie: 0 };
    p1Dist[p1Cat].count++;
    p1Dist[p1Cat][p1Res]++;

    if (!p2Dist[p2Cat]) p2Dist[p2Cat] = { count: 0, win: 0, lose: 0, tie: 0 };
    p2Dist[p2Cat].count++;
    p2Dist[p2Cat][p2Res]++;
  }

  return {
    p1Wins,
    p2Wins,
    ties,
    total: iterations,
    p1Dist,
    p2Dist
  };
}
