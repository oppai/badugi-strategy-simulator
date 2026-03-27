import { Deck } from './src/core/deck.js';
import { Card } from './src/core/card.js';
import { evaluateHand } from './src/core/hand-evaluator.js';

const deck = new Deck();
const cards = deck.cards;

let total = 0;
const stats: Record<number, Record<number, number>> = {
  4: {}, // Badugi
  3: {}, // Tri
  2: {}, // Double
  1: {}  // Single
};

for (let i = 0; i < cards.length - 3; i++) {
  for (let j = i + 1; j < cards.length - 2; j++) {
    for (let k = j + 1; k < cards.length - 1; k++) {
      for (let l = k + 1; l < cards.length; l++) {
        const handCards = [cards[i], cards[j], cards[k], cards[l]];
        const best = evaluateHand(handCards);
        const size = best.size;
        const highest = best.ranks[0];

        if (!stats[size][highest]) stats[size][highest] = 0;
        stats[size][highest]++;
        total++;
      }
    }
  }
}

console.log("Total combinations:", total);
console.log("Stats:", JSON.stringify(stats, null, 2));
