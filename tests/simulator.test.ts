import { describe, it, expect, vi } from 'vitest';
import { simulate } from '../src/core/simulator';
import { Card } from '../src/core/card';
import type { Strategy } from '../src/core/strategy';
import { Deck } from '../src/core/deck';

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

  it('never draws the same card twice during a single game (draw phases)', () => {
    // A strategy that forces maximum discards
    const discardAllStrategy: Strategy = { r1Target: 0, r2Target: 0, r3Target: 0 };

    let drawnCards = new Set<string>();
    let hasDuplicates = false;

    const shuffleSpy = vi.spyOn(Deck.prototype, 'shuffle').mockImplementation(function(this: Deck) {
      drawnCards.clear();
      // Original logic for shuffle
      for (let i = this.cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
      }
    });

    const drawSpy = vi.spyOn(Deck.prototype, 'draw').mockImplementation(function(this: Deck) {
      const card = this.cards.pop();
      if (!card) throw new Error("Deck is empty");

      const cardStr = card.toString();
      if (drawnCards.has(cardStr)) {
        hasDuplicates = true;
      }
      drawnCards.add(cardStr);
      return card;
    });

    try {
      simulate(discardAllStrategy, discardAllStrategy, null, null, null, 100);
      expect(hasDuplicates).toBe(false);
    } finally {
      shuffleSpy.mockRestore();
      drawSpy.mockRestore();
    }
  });
});
