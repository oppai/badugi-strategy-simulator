import { Deck } from './src/core/deck.js';
import { Card } from './src/core/card.js';
import { evaluateHand, EvaluatedHand } from './src/core/hand-evaluator.js';
import * as fs from 'fs';

const deck = new Deck();
const cards = deck.cards;

let allHands: { cards: Card[], best: EvaluatedHand }[] = [];

for (let i = 0; i < cards.length - 3; i++) {
  for (let j = i + 1; j < cards.length - 2; j++) {
    for (let k = j + 1; k < cards.length - 1; k++) {
      for (let l = k + 1; l < cards.length; l++) {
        const handCards = [cards[i], cards[j], cards[k], cards[l]];
        const best = evaluateHand(handCards);
        allHands.push({ cards: handCards, best });
      }
    }
  }
}

// Sort all hands from best to worst.
// compare: Returns >0 if this beats other, <0 if other beats this, 0 if tie.
allHands.sort((a, b) => b.best.compare(a.best));

// Now allHands is sorted from Best (e.g. 4-card 432A) to Worst (e.g. 1-card K).

function rankToString(r: number) {
  if (r === 1) return 'A';
  if (r === 10) return 'T';
  if (r === 11) return 'J';
  if (r === 12) return 'Q';
  if (r === 13) return 'K';
  return r.toString();
}

function generateCategoryStats(name: string, size: number) {
  const categoryHands = allHands.filter(h => h.best.size === size);
  const total = categoryHands.length;

  const histogram: Record<number, number> = {};
  let sumHighest = 0;

  for (const h of categoryHands) {
    const highest = h.best.ranks[0];
    histogram[highest] = (histogram[highest] || 0) + 1;
    sumHighest += highest;
  }

  const meanHighest = sumHighest / total;

  // Median hand highest card
  const medianHand = categoryHands[Math.floor(total / 2)];
  const medianHighest = medianHand.best.ranks[0];

  let md = `## ${name} (総数: ${total} / 割合: ${(total / allHands.length * 100).toFixed(2)}%)\n\n`;
  md += `- **最も高いカード(Highest Card)の平均値**: ${meanHighest.toFixed(2)}\n`;
  md += `- **最も高いカード(Highest Card)の中央値**: ${rankToString(medianHighest)}\n\n`;

  md += `| Highest Card | 組み合わせ数 | 確率 | 累積確率 (良い方から) |\n`;
  md += `|---|---|---|---|\n`;

  const sortedRanks = Object.keys(histogram).map(Number).sort((a, b) => a - b);
  let cumulative = 0;

  for (const r of sortedRanks) {
    const count = histogram[r];
    const prob = count / total * 100;
    cumulative += count;
    const cumProb = cumulative / total * 100;
    md += `| ${rankToString(r)} | ${count} | ${prob.toFixed(2)}% | ${cumProb.toFixed(2)}% |\n`;
  }

  md += `\n`;
  return md;
}

let report = `# Initial Hand Histogram Report\n\n`;

report += `初手4枚が配られた時のハンドの強さに関する分布レポートです。全組み合わせ数は 270,725 通りです。\n\n`;

// Overall median
const globalMedianHand = allHands[Math.floor(allHands.length / 2)];
report += `## 全体統計\n\n`;
report += `- **全体の中央値ハンド**: ${globalMedianHand.best.toString()} (上位50%の境界)\n`;
report += `- 全体におけるBadugiの割合: ${(allHands.filter(h => h.best.size === 4).length / allHands.length * 100).toFixed(2)}%\n`;
report += `- 全体におけるTriの割合: ${(allHands.filter(h => h.best.size === 3).length / allHands.length * 100).toFixed(2)}%\n`;
report += `- 全体におけるDoubleの割合: ${(allHands.filter(h => h.best.size === 2).length / allHands.length * 100).toFixed(2)}%\n`;
report += `- 全体におけるSingleの割合: ${(allHands.filter(h => h.best.size === 1).length / allHands.length * 100).toFixed(2)}%\n\n`;

report += generateCategoryStats('Badugi (4枚ハンド)', 4);
report += generateCategoryStats('Tri (3枚ハンド)', 3);
report += generateCategoryStats('Double (2枚ハンド)', 2);

fs.writeFileSync('docs/initial_hand_histogram.md', report);
console.log('Report generated at docs/initial_hand_histogram.md');
