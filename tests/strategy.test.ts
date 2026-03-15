import { describe, it, expect } from 'vitest';
import { Card } from '../src/core/card';
import { evaluateStrategy } from '../src/core/strategy';

describe('evaluateStrategy', () => {
  const strategy = { r1Target: 7, r2Target: 7, r3Target: 7 };

  it('should stand pat if 4-card badugi meets the target', () => {
    const hand = [
      Card.fromString('Ac'),
      Card.fromString('2d'),
      Card.fromString('3h'),
      Card.fromString('4s')
    ];
    const result = evaluateStrategy(strategy, hand, 1);
    expect(result.length).toBe(4);
    const ranks = result.map(c => c.rank).sort((a,b) => b - a);
    expect(ranks).toEqual([4, 3, 2, 1]);
  });

  it('should ALWAYS stand pat if it is a 4-card badugi, even if it does NOT meet the target', () => {
    const hand = [
      Card.fromString('Ac'),
      Card.fromString('2d'),
      Card.fromString('3h'),
      Card.fromString('Ks') // Ks is > 7
    ];
    const result = evaluateStrategy(strategy, hand, 1);
    // Always stand pat on 4-card badugi
    expect(result.length).toBe(4);
    const resultStrs = result.map(c => c.toString());
    expect(resultStrs).toContain('Ks');
  });

  it('should drop cards strictly above target if not a 4-card badugi', () => {
    // Hand is A, 2, 9, J (J and 9 are same suit) -> 3-card badugi
    const hand = [
      Card.fromString('As'),
      Card.fromString('2d'),
      Card.fromString('9c'),
      Card.fromString('Jc')
    ];
    // In R1, target 7, we keep As, 2d. The 9 is dropped because it is > 7,
    // and special rules no longer apply.
    const result = evaluateStrategy(strategy, hand, 1);
    expect(result.length).toBe(2);
    const resultStrs = result.map(c => c.toString());
    expect(resultStrs).not.toContain('9c');
    expect(resultStrs).not.toContain('Jc');
  });
});
