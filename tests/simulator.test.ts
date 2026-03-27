import { describe, it, expect } from 'vitest';
import { simulate } from '../src/core/simulator';
import { Card } from '../src/core/card';
import type { Strategy } from '../src/core/strategy';

const dummyStrategy: Strategy = { r1Target: 7, r2Target: 7, r3Target: 7 };

describe('Simulator Validation', () => {
  it('throws an error if p1Start contains duplicate cards', () => {
    const p1Start = [Card.fromString('Ah'), Card.fromString('Ah')];
    expect(() => simulate(dummyStrategy, dummyStrategy, p1Start, null, null, 1))
      .toThrow('Duplicate cards found in initial hands or dead cards');
  });

  it('throws an error if p2Start contains duplicate cards', () => {
    const p2Start = [Card.fromString('Kh'), Card.fromString('Kh')];
    expect(() => simulate(dummyStrategy, dummyStrategy, null, p2Start, null, 1))
      .toThrow('Duplicate cards found in initial hands or dead cards');
  });

  it('throws an error if p1Start and p2Start share identical cards', () => {
    const p1Start = [Card.fromString('Ah'), Card.fromString('2c')];
    const p2Start = [Card.fromString('Ah'), Card.fromString('3d')];
    expect(() => simulate(dummyStrategy, dummyStrategy, p1Start, p2Start, null, 1))
      .toThrow('Duplicate cards found in initial hands or dead cards');
  });

  it('throws an error if deadCards share identical cards with initial hands', () => {
    const p1Start = [Card.fromString('Ah'), Card.fromString('2c')];
    const deadCards = [Card.fromString('Ah')];
    expect(() => simulate(dummyStrategy, dummyStrategy, p1Start, null, deadCards, 1))
      .toThrow('Duplicate cards found in initial hands or dead cards');
  });

  it('does not throw an error for valid hands and dead cards', () => {
    const p1Start = [Card.fromString('Ah'), Card.fromString('2c')];
    const p2Start = [Card.fromString('Kh'), Card.fromString('Qd')];
    const deadCards = [Card.fromString('3s'), Card.fromString('4d')];
    expect(() => simulate(dummyStrategy, dummyStrategy, p1Start, p2Start, deadCards, 1))
      .not.toThrow();
  });
});
