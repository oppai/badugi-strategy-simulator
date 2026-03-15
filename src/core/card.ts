export type Suit = 's' | 'h' | 'd' | 'c';
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export class Card {
  rank: Rank;
  suit: Suit;

  constructor(rank: Rank, suit: Suit) {
    this.rank = rank;
    this.suit = suit;
  }

  toString(): string {
    const rankStr = this.rank === 1 ? 'A' :
                    this.rank === 10 ? 'T' :
                    this.rank === 11 ? 'J' :
                    this.rank === 12 ? 'Q' :
                    this.rank === 13 ? 'K' :
                    this.rank.toString();
    return `${rankStr}${this.suit}`;
  }

  static fromString(s: string): Card {
    const rankChar = s[0];
    const suitChar = s[1].toLowerCase() as Suit;
    let rank: Rank;
    switch (rankChar.toUpperCase()) {
      case 'A': rank = 1; break;
      case 'T': rank = 10; break;
      case 'J': rank = 11; break;
      case 'Q': rank = 12; break;
      case 'K': rank = 13; break;
      default: rank = parseInt(rankChar) as Rank; break;
    }
    return new Card(rank, suitChar);
  }
}
