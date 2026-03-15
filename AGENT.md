# AI Agent Instructions for Badugi Simulation Project

This is a Vue 3 + TypeScript + Vite project for simulating Badugi strategies and evaluating hands. It also includes a CLI and an MCP server.

## Overview
- **Core logic**: Found in `src/core/`. This contains the deck, hand evaluator, simulator, and strategy logic.
- **Frontend**: The Vue 3 application logic is found in `src/` (e.g., `App.vue`, `components/`).
- **CLI**: Found in `src/cli/index.ts`. Allows running a simulation of Badugi from the terminal using an input strategy JSON file.
- **MCP Server**: Found in `src/mcp/index.ts`. It provides a tool (`run_badugi_simulation`) for AI agents to run Badugi simulations via the Model Context Protocol.
- **Tests**: Found in `tests/`. Uses Vitest.

## Testing
Always ensure tests pass before submitting changes.
- To run tests: `npm run test`
- Make sure to write or update tests in `tests/` when modifying the core logic.

## Badugi Strategy Guidelines
The strategy logic (`src/core/strategy.ts`) has specific domain requirements:
- The strategy strictly requires always standing pat (drawing 0 cards) on a 4-card badugi.
- It prohibits any special rules or exceptions for the 3rd draw (the logic must be consistent across draws).

## Using the CLI
You can run a strategy from the CLI.
1. Create a JSON file (e.g. `strategy.json`) with the following format:
\`\`\`json
{
  "p1": { "rules": [...] },
  "p2": { "rules": [...] }
}
\`\`\`
2. Run the CLI:
\`\`\`bash
npx tsx src/cli/index.ts strategy.json [iterations]
\`\`\`

## Using the MCP Server
If your environment supports the Model Context Protocol, you can configure the MCP server using the following command:
\`\`\`bash
npm run mcp
\`\`\`
This exposes the `run_badugi_simulation` tool. It takes the following arguments:
- \`strategyJson\`: A string representing the strategy configuration in JSON format.
- \`iterations\`: (optional) The number of times to simulate the game.

## Memory Guidelines
When making updates to this repository:
- Follow standard Vue 3 `<script setup>` SFC patterns for frontend changes.
- Prioritize TypeScript type safety.
- Keep the `AGENT.md` updated if architectural or fundamental rule changes happen.
