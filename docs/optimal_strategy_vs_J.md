# Report: Optimal Strategy vs "Keep Up to J" Strategy in Badugi

## 1. Introduction

This report analyzes the best counter-strategy against an opponent who consistently plays a "Keep Up to J (Jack, 11)" strategy across all draw rounds in random vs random hand Badugi simulations.

The opponent's strategy aims to keep any cards rank J or lower, building toward a Badugi, and discarding anything higher than a J.

## 2. Methodology

We conducted a series of simulations (100,000 iterations per configuration) testing various `r1Target`, `r2Target`, and `r3Target` combinations for Player 1, while Player 2's strategy was fixed at `[11, 11, 11]`.

The base assumption for our test is to try keeping a tighter range early on and potentially widening it in later rounds. The simulation results measure win percentage.

## 3. Results

Here are the results for different P1 strategies vs P2 [11, 11, 11]:

| P1 Strategy (Round 1, 2, 3 Target Rank) | P1 Win Rate | P2 Win Rate | Tie Rate |
| :--- | :--- | :--- | :--- |
| `[11, 11, 11]` (Mirror) | ~49.8% | ~49.8% | ~0.4% |
| `[10, 10, 10]` | 50.36% | 49.45% | 0.19% |
| `[9, 9, 9]` | 50.74% | 49.06% | 0.20% |
| `[8, 8, 8]` | 50.02% | 49.73% | 0.24% |
| `[7, 7, 7]` | 48.49% | 51.28% | 0.23% |
| `[8, 9, 10]` | 50.44% | 49.34% | 0.22% |
| `[7, 8, 9]` | 49.52% | 50.26% | 0.23% |
| `[8, 9, 11]` | 50.38% | 49.41% | 0.21% |
| `[8, 10, 11]` | 50.36% | 49.41% | 0.23% |
| `[8, 8, 10]` | 50.19% | 49.58% | 0.23% |
| `[8, 10, 12]` | 50.26% | 49.53% | 0.21% |
| `[8, 10, 13]` | 50.29% | 49.51% | 0.20% |

## 4. Analysis and Conclusion

From the data, playing a slightly tighter fixed strategy of **`[9, 9, 9]`** yields the highest win rate at **50.74%**.

Why is this the case?

1. **Exploiting Looseness:** By keeping up to J, the opponent is satisfied with weaker 3-card and 4-card hands. By targeting 9 or lower, we ensure that when both players hit their target hands, our hand is significantly likely to out-rank theirs.
2. **Not Too Tight:** When targeting `[8, 8, 8]`, our win rate drops to `50.02%`, and targeting `[7, 7, 7]` is actively losing (`48.49%`). Being too tight means we discard too many playable cards, frequently missing our draws entirely while the opponent manages to piece together a ragged J-high or T-high Badugi that scoops the pot.
3. **Adaptive (Dynamic) Strategies vs Static:** We tested ramping strategies like `[8, 9, 10]`, which performed well (`50.44%`), but still underperformed the static `[9, 9, 9]` approach. The straightforward `[9, 9, 9]` gives a good balance between draw hit rate and hand strength value against a player who is willing to keep up to a Jack.

**Optimal Counter Strategy:**
Target rank 9 across all draw rounds (`[9, 9, 9]`). This allows for an edge of roughly +1.7% in win probability over the opponent's loose J-high strategy.
