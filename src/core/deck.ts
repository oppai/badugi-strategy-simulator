import { Card } from './card';
import type { Rank, Suit } from './card';

export class Deck {
  cards: Card[] = [];

  constructor() {
    this.reset();
  }

  reset() {
    this.cards = [];
    const suits: Suit[] = ['s', 'h', 'd', 'c'];
    for (const suit of suits) {
      for (let rank = 1; rank <= 13; rank++) {
        this.cards.push(new Card(rank as Rank, suit));
      }
    }
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  draw(): Card {
    const card = this.cards.pop();
    if (!card) throw new Error("Deck is empty");
    return card;
  }

  removeCards(cardsToRemove: Card[]) {
    this.cards = this.cards.filter(c => 
      !cardsToRemove.some(r => r.rank === c.rank && r.suit === c.suit)
    );
  }
}
