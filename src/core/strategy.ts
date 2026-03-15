import type { Card } from './card';
import { getAllValidHands, evaluateHand } from './hand-evaluator';

export interface Strategy {
  r1Target: number;
  r2Target: number;
  r3Target: number;
}

export function evaluateStrategy(strategy: Strategy, cards: Card[], drawRound: number): Card[] {
  // If we already have a 4-card Badugi, always stand pat
  const bestHand = evaluateHand(cards);
  if (bestHand.size === 4) {
    return bestHand.cards;
  }

  let targetRank: number;
  switch (drawRound) {
    case 1: targetRank = strategy.r1Target; break;
    case 2: targetRank = strategy.r2Target; break;
    case 3: targetRank = strategy.r3Target; break;
    default: targetRank = 13; // Should not happen, but default to max
  }

  // 指定された「TargetRank以下のカード」だけで構成される部分集合を抽出
  const cardsUnderTarget = cards.filter(c => c.rank <= targetRank);
  
  if (cardsUnderTarget.length > 0) {
    // ターゲット以下のカードだけで構成されるすべての有効なBadugiサブセットを取得
    const validSubsetsForTarget = getAllValidHands(cardsUnderTarget);
    if (validSubsetsForTarget.length > 0) {
      // 一番サイズが大きく、かつ一番数字が小さい(強い)サブセット
      let bestChoice = validSubsetsForTarget[0].cards;

      // 特別ルール: 3rdチェンジで、ターゲットに満たなくても
      // 元の手札の中に"A2Tx (Tを含む3Tri)" のような強い3枚があればそちらを優先する。
      if (drawRound === 3) {
        const allValid = getAllValidHands(cards);
        const bestOverallHand = allValid[0];
        if (bestOverallHand.size === 3 && bestOverallHand.ranks[0] === 10) {
           if (bestOverallHand.size > bestChoice.length) {
             bestChoice = bestOverallHand.cards;
           }
        }
      }

      return bestChoice;
    }
  }

  // 特別ルール: ターゲット以下のカードが全くない場合でも3rdチェンジの特別ルールは適用
  if (drawRound === 3) {
    const allValid = getAllValidHands(cards);
    if (allValid.length > 0) {
      const bestOverallHand = allValid[0];
      if (bestOverallHand.size === 3 && bestOverallHand.ranks[0] === 10) {
        return bestOverallHand.cards;
      }
    }
  }

  // ターゲット以下のカードが1枚もない場合は、全体の最強の1枚(一番数字が小さいカード)をキープするほうがよい？
  // ユーザー要件：「指定したランク以下の色がバラバラの最強ハンドを残します」
  // ターゲットランクより大きいカードしか無い場合、ターゲットを目指す意味では「全とっかえ」が正しい可能性もあるが、
  // 全とっかえ(0枚キープ)にする。
  // ... Wait! "1st Change Targetが7の場合で、As2d8cTcの場合はAs2dを残してください"
  // As2d は A(1) と 2(2) なので Target 7 以下です。上の `cardsUnderTarget` がまさにこれを満たします。
  // TargetRank 以下のカードが存在しない（例えば 8c 9d Tc Jh で Target 7 の場合）は全チェンジでよい。
  
  return [];
}
