<script setup lang="ts">
import { ref } from 'vue';
import type { Strategy } from './core/strategy';
import { simulate } from './core/simulator';
import type { SimulationResult } from './core/simulator';
import { Card } from './core/card';

// ... (Strategy refs abbreviated, replace only the import and result ref lines)


import StrategyBuilder from './components/StrategyBuilder.vue';

// Initial default strategies
const p1Strategy = ref<Strategy>({
  r1Target: 5,
  r2Target: 7,
  r3Target: 10
});

const p2Strategy = ref<Strategy>({
  r1Target: 7,
  r2Target: 7,
  r3Target: 7
});

const p1Start = ref('Ac,2h,3d,4s'); // default start hand
const p2Start = ref('');           // random hands

const isCalculating = ref(false);
const result = ref<(SimulationResult & { duration: number, p1Pct: string, p2Pct: string, tiePct: string }) | null>(null);

function parseCards(str: string): Card[] | null {
  if (!str.trim()) return null;
  try {
    return str.split(',').map(s => s.trim()).filter(Boolean).map(s => Card.fromString(s));
  } catch(e) {
    return null;
  }
}

async function runSimulation() {
  isCalculating.value = true;
  result.value = null;
  
  // Use setTimeout to allow UI to update to "calculating" state
  setTimeout(() => {
    const c1 = parseCards(p1Start.value);
    const c2 = parseCards(p2Start.value);
    
    const start = Date.now();
    const simResult = simulate(p1Strategy.value, p2Strategy.value, c1, c2, 50000);
    const duration = Date.now() - start;
    
    result.value = {
      ...simResult,
      duration,
      p1Pct: ((simResult.p1Wins / simResult.total) * 100).toFixed(2),
      p2Pct: ((simResult.p2Wins / simResult.total) * 100).toFixed(2),
      tiePct: ((simResult.ties / simResult.total) * 100).toFixed(2),
    };
    
    isCalculating.value = false;
  }, 50);
}
</script>

<template>
  <div class="app-container">
    <header class="header">
      <div class="logo">
        <span class="icon">♠️</span> Badugi Equity Calculator
      </div>
      <p class="subtitle">特定の戦術同士の勝率をモンテカルロシミュレーションで計算します</p>
    </header>

    <main class="main-content">
      <div class="split-view">
        <!-- Player 1 -->
        <div class="player-panel">
          <div class="player-header p1">
            <h2>Player 1</h2>
          </div>
          <div class="range-input">
            <label>初期手札 (カンマ区切り、空でランダム):</label>
            <input v-model="p1Start" placeholder="e.g. As,2h,3d,4c" />
          </div>
          <StrategyBuilder v-model="p1Strategy" title="P1 Strategy" />
        </div>

        <!-- VS Divider -->
        <div class="vs-divider">
          <span>VS</span>
        </div>

        <!-- Player 2 -->
        <div class="player-panel">
          <div class="player-header p2">
            <h2>Player 2</h2>
          </div>
          <div class="range-input">
            <label>初期手札 (カンマ区切り、空でランダム):</label>
            <input v-model="p2Start" placeholder="e.g. Kh,Qd,Jc" />
          </div>
          <StrategyBuilder v-model="p2Strategy" title="P2 Strategy" />
        </div>
      </div>

      <div class="action-section">
        <button class="btn-simulate" @click="runSimulation" :disabled="isCalculating">
          {{ isCalculating ? '計算中...' : 'シミュレーション実行 (50,000回)' }}
        </button>
      </div>

      <div class="result-section" v-if="result">
        <h2 class="result-title">Simulation Results</h2>
        <div class="stats-row">
          <div class="stat-card p1">
            <div class="stat-label">Player 1 Win</div>
            <div class="stat-value">{{ result.p1Pct }}%</div>
            <div class="stat-detail">{{ result.p1Wins }} hands</div>
          </div>
          <div class="stat-card tie">
            <div class="stat-label">Tie</div>
            <div class="stat-value">{{ result.tiePct }}%</div>
            <div class="stat-detail">{{ result.ties }} hands</div>
          </div>
          <div class="stat-card p2">
            <div class="stat-label">Player 2 Win</div>
            <div class="stat-value">{{ result.p2Pct }}%</div>
            <div class="stat-detail">{{ result.p2Wins }} hands</div>
          </div>
        </div>
        <div class="time-taken">計算時間: {{ result.duration }} ms</div>

        <div class="distribution-section">
          <div class="dist-panel p1-dist">
            <h3>Player 1 Hand Distribution</h3>
            <ul class="dist-list">
              <li v-for="[cat, stat] in Object.entries(result.p1Dist).sort((a, b) => b[1].count - a[1].count)" :key="cat">
                <span class="dist-name">{{ cat }}</span>
                <span class="dist-bar">
                  <div class="bar-fill win" :style="{ width: (stat.win / stat.count * 100) + '%' }" title="Win"></div>
                  <div class="bar-fill tie" :style="{ width: (stat.tie / stat.count * 100) + '%' }" title="Tie"></div>
                  <div class="bar-fill lose" :style="{ width: (stat.lose / stat.count * 100) + '%' }" title="Lose"></div>
                </span>
                <span class="dist-value">{{ stat.count }}<br/><small>W:{{ stat.win }} L:{{ stat.lose }}</small></span>
              </li>
            </ul>
          </div>
          <div class="dist-panel p2-dist">
            <h3>Player 2 Hand Distribution</h3>
            <ul class="dist-list">
              <li v-for="[cat, stat] in Object.entries(result.p2Dist).sort((a, b) => b[1].count - a[1].count)" :key="cat">
                <span class="dist-name">{{ cat }}</span>
                <span class="dist-bar">
                  <div class="bar-fill win" :style="{ width: (stat.win / stat.count * 100) + '%' }" title="Win"></div>
                  <div class="bar-fill tie" :style="{ width: (stat.tie / stat.count * 100) + '%' }" title="Tie"></div>
                  <div class="bar-fill lose" :style="{ width: (stat.lose / stat.count * 100) + '%' }" title="Lose"></div>
                </span>
                <span class="dist-value">{{ stat.count }}<br/><small>W:{{ stat.win }} L:{{ stat.lose }}</small></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 8px;
  text-shadow: 0 0 20px rgba(100, 255, 218, 0.4);
}

.subtitle {
  color: var(--text-muted);
  font-size: 1.1rem;
}

.split-view {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 40px;
  position: relative;
}

.player-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.vs-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
}

.vs-divider span {
  background: var(--surface);
  color: var(--text-muted);
  font-weight: bold;
  padding: 10px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.1);
  box-shadow: 0 0 15px rgba(0,0,0,0.5);
}

.player-header {
  padding: 12px 20px;
  border-radius: 8px;
  text-align: center;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.player-header.p1 {
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.2), transparent);
  border-left: 4px solid #0ea5e9;
  color: #0ea5e9;
}

.player-header.p2 {
  background: linear-gradient(135deg, rgba(244, 63, 94, 0.2), transparent);
  border-right: 4px solid #f43f5e;
  color: #f43f5e;
}

.range-input {
  background: rgba(255,255,255,0.03);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.05);
}

.range-input label {
  display: block;
  margin-bottom: 8px;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.range-input input {
  width: 100%;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.1);
  color: var(--text);
  padding: 12px;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.range-input input:focus {
  outline: none;
  border-color: var(--primary);
}

.action-section {
  text-align: center;
  margin-bottom: 40px;
}

.btn-simulate {
  background: linear-gradient(135deg, #64ffda, #0ea5e9);
  color: #020617;
  border: none;
  padding: 16px 40px;
  font-size: 1.2rem;
  font-weight: 700;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(100, 255, 218, 0.3);
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-simulate:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(100, 255, 218, 0.5);
}

.btn-simulate:disabled {
  background: #475569;
  color: #94a3b8;
  cursor: not-allowed;
  box-shadow: none;
}

.result-section {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 30px;
  backdrop-filter: blur(10px);
}

.result-title {
  text-align: center;
  margin-bottom: 24px;
  color: var(--text);
}

.stats-row {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  flex: 1;
  max-width: 250px;
  background: rgba(0,0,0,0.2);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.stat-card.p1 { border-bottom: 4px solid #0ea5e9; }
.stat-card.p2 { border-bottom: 4px solid #f43f5e; }
.stat-card.tie { border-bottom: 4px solid #94a3b8; }

.stat-label {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 4px;
}

.stat-card.p1 .stat-value { color: #0ea5e9; }
.stat-card.p2 .stat-value { color: #f43f5e; }

.stat-detail {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.time-taken {
  text-align: center;
  color: var(--text-muted);
  font-size: 0.85rem;
  margin-bottom: 30px;
}

.distribution-section {
  display: flex;
  gap: 20px;
  justify-content: space-between;
}

.dist-panel {
  flex: 1;
  background: rgba(0,0,0,0.2);
  border-radius: 12px;
  padding: 20px;
}

.dist-panel.p1-dist {
  border-top: 3px solid #0ea5e9;
}

.dist-panel.p2-dist {
  border-top: 3px solid #f43f5e;
}

.dist-panel h3 {
  margin-bottom: 16px;
  font-size: 1.1rem;
  text-align: center;
  color: #e2e8f0;
}

.dist-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dist-list li {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.dist-name {
  width: 130px;
  color: #cbd5e1;
  font-family: monospace;
}

.dist-bar {
  flex: 1;
  height: 12px;
  background: rgba(255,255,255,0.1);
  border-radius: 6px;
  margin: 0 12px;
  overflow: hidden;
  display: flex;
}

.bar-fill {
  height: 100%;
}

.bar-fill.win {
  background: #64ffda;
}

.bar-fill.lose {
  background: #f43f5e;
}

.bar-fill.tie {
  background: #94a3b8;
}

.p2-dist .bar-fill.win {
  background: #f43f5e;
}

.p2-dist .bar-fill.lose {
  background: #0ea5e9;
}

.dist-value {
  width: 90px;
  text-align: right;
  color: #f8fafc;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.2;
}

.dist-value small {
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: normal;
}

@media (max-width: 768px) {
  .split-view, .distribution-section {
    flex-direction: column;
  }
  .vs-divider {
    width: 100%;
    margin: 10px 0;
  }
  .stats-row {
    flex-direction: column;
    align-items: center;
  }
}
</style>
