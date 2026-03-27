import { readFileSync } from 'fs';
import { simulate } from '../core/simulator';
import { Card } from '../core/card';
import type { Strategy } from '../core/strategy';

function parseCards(str: string): Card[] {
  if (!str) return [];
  return str.split(',').map(s => s.trim()).filter(s => s).map(s => Card.fromString(s));
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log('Usage: npx tsx src/cli/index.ts <strategy.json> [iterations]');
    console.log('strategy.json format:');
    console.log(`{
  "p1": { "rules": [...] },
  "p2": { "rules": [...] },
  "p1Start": "As,2h,3d,4c", // optional
  "p2Start": "Kh,Qh,Jh",    // optional
  "deadCards": "2s,3c"      // optional
}`);
    process.exit(1);
  }

  const jsonPath = args[0];
  const iterations = args.length > 1 ? parseInt(args[1], 10) : 10000;

  let config: any;
  try {
    const data = readFileSync(jsonPath, 'utf8');
    config = JSON.parse(data);
  } catch (err) {
    console.error('Failed to read or parse strategy JSON file:', err);
    process.exit(1);
  }

  const p1Strategy: Strategy = config.p1;
  const p2Strategy: Strategy = config.p2;

  const p1Start = config.p1Start ? parseCards(config.p1Start) : null;
  const p2Start = config.p2Start ? parseCards(config.p2Start) : null;
  const deadCards = config.deadCards ? parseCards(config.deadCards) : null;

  console.log('Running simulation...');
  console.log(`Iterations: ${iterations}`);
  console.log(`P1 Start: ${p1Start ? p1Start.map(c => c.toString()).join(',') : 'Random'}`);
  console.log(`P2 Start: ${p2Start ? p2Start.map(c => c.toString()).join(',') : 'Random'}`);
  console.log(`Dead Cards: ${deadCards ? deadCards.map(c => c.toString()).join(',') : 'None'}`);
  console.log('------------------------------');

  const start = Date.now();
  const result = simulate(p1Strategy, p2Strategy, p1Start, p2Start, deadCards, iterations);
  const duration = Date.now() - start;

  const p1WinPct = ((result.p1Wins / result.total) * 100).toFixed(2);
  const p2WinPct = ((result.p2Wins / result.total) * 100).toFixed(2);
  const tiePct = ((result.ties / result.total) * 100).toFixed(2);

  console.log(`Time taken: ${duration}ms`);
  console.log(`P1 Wins: ${result.p1Wins} (${p1WinPct}%)`);
  console.log(`P2 Wins: ${result.p2Wins} (${p2WinPct}%)`);
  console.log(`Ties:    ${result.ties} (${tiePct}%)`);
  console.log('\n--- P1 Final Hand Distribution ---');
  Object.entries(result.p1Dist)
    .sort((a, b) => b[1].count - a[1].count)
    .forEach(([cat, stat]) => {
      const pct = ((stat.count / result.total) * 100).toFixed(2);
      console.log(`${cat.padEnd(20)}: ${stat.count.toString().padStart(5)} (${pct}%) | W: ${stat.win.toString().padStart(4)}, L: ${stat.lose.toString().padStart(4)}, T: ${stat.tie}`);
    });

  console.log('\n--- P2 Final Hand Distribution ---');
  Object.entries(result.p2Dist)
    .sort((a, b) => b[1].count - a[1].count)
    .forEach(([cat, stat]) => {
      const pct = ((stat.count / result.total) * 100).toFixed(2);
      console.log(`${cat.padEnd(20)}: ${stat.count.toString().padStart(5)} (${pct}%) | W: ${stat.win.toString().padStart(4)}, L: ${stat.lose.toString().padStart(4)}, T: ${stat.tie}`);
    });
}

main();
