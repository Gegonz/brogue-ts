# Brogue-TS

A complete roguelike game in TypeScript, ported from [Brogue Community Edition](https://github.com/tmewett/BrogueCE). Playable in the browser and controllable via [MCP](https://modelcontextprotocol.io/) for autonomous AI play.

**Built in 31 autonomous iterations by Claude Code.**

## Features

| Category | Details |
|----------|---------|
| **Dungeon** | 7 room types (cross, circular, chunky, cavern...), corridors, doors, stairs, 10+ levels |
| **Monsters** | 10 types (rat to troll), depth-scaled spawning, chase AI, wander behavior |
| **Items** | 8 categories: food, potions (heal), scrolls (enchant/strength), weapons, armor, staves (zap), rings, gold |
| **Combat** | Bump-to-attack, weapon bonus damage, armor defense, auto-fight during explore |
| **Progression** | XP from kills, level-up (+5 HP, +1 Str), equipment upgrades, scaling regen |
| **Survival** | HP regeneration (scales with level), nutrition drain, starvation, food rations |
| **Display** | Canvas renderer, shadow-casting FOV, miner's light, colored sidebar, blue memory |
| **MCP** | 5 tools: new, move, action, look, auto (fully autonomous play) |
| **Win condition** | Reach depth 10 |

## Quick Start

```bash
# Install
git clone https://github.com/Gegonz/brogue-ts.git
cd brogue-ts
bun install

# Run (leave this terminal open)
bun run dev:logged

# Play in browser
open http://localhost:8080

# Controls: hjkl/arrows (move), x (auto-explore), > (descend stairs)
```

## MCP Integration

Connect Claude Code or any MCP client to `http://localhost:8080/mcp`:

```json
{
  "mcpServers": {
    "brogue": {
      "type": "http",
      "url": "http://localhost:8080/mcp"
    }
  }
}
```

### MCP Tools

| Tool | Description |
|------|-------------|
| `brogue_new(seed?)` | Start a new game with optional deterministic seed |
| `brogue_move(direction)` | Move N/S/E/W/NE/NW/SE/SW |
| `brogue_action(action)` | explore / rest / search / descend / ascend |
| `brogue_look()` | Get current game state (map, stats, items, monsters) |
| `brogue_auto(turns?)` | Play 1-50 turns autonomously (explore, fight, descend) |

### Autonomous AI Play

```
brogue_new({seed: 100})
brogue_auto({turns: 50})   // repeat until victory or death
```

## AI Benchmark (10 seeds, 34 iterations)

| Seed | Depth | Level | Turns | Kills | Equipment | Result |
|------|-------|-------|-------|-------|-----------|--------|
| **1** | **10** | **10** | **2449** | **43** | war axe + plate | **VICTORY** |
| **10** | **10** | **10** | **3694** | **36** | broadsword + plate | **VICTORY** |
| **42** | **10** | **16** | **3832** | **53** | war axe + plate | **VICTORY** |
| **77** | **10** | **13** | **3640** | **45** | war hammer + plate | **VICTORY** |
| **100** | **10** | **11** | **3758** | **35** | war axe + plate | **VICTORY** |
| 200 | 7 | 5 | 3000 | 28 | war axe + banded | combat |
| **555** | **10** | **14** | **3633** | **57** | war hammer + banded | **VICTORY** |
| **777** | **10** | **18** | **3099** | **54** | war axe + plate | **VICTORY** |
| **999** | **10** | **15** | **4023** | **47** | war hammer + plate | **VICTORY** |
| **1234** | **10** | **16** | **4279** | **50** | war axe + plate | **VICTORY** |

**Win rate: 90% (9/10) | Avg depth: 9.7 | Best: Lv18, 57 kills (seed 555)**

## Architecture

```
Bun.serve() on :8080
+-- GET /     -> Canvas game (browser, HMR)
+-- POST /mcp -> MCP Streamable HTTP (AI plays via tools)
+-- GameEngine (pure TS, no DOM)
    +-- architect.ts  -> 7 room types, Dijkstra stair placement
    +-- monsters.ts   -> 10 types, chase AI, bump combat
    +-- items.ts      -> 8 categories, equipment, functional effects
    +-- fov.ts        -> Shadow-casting field of view
    +-- light.ts      -> Miner's light with radial fade
    +-- dijkstra.ts   -> Priority-queue pathfinding
    +-- explore.ts    -> Auto-explore + auto-fight + stairs nav
    +-- time.ts       -> HP regen, nutrition, starvation
    +-- rng.ts        -> Exact JSF RNG port from BrogueCE
```

## Tech Stack

- **Runtime**: Bun
- **Language**: TypeScript (strict mode)
- **Renderer**: HTML5 Canvas
- **MCP SDK**: @modelcontextprotocol/sdk v1.28
- **Dev server**: `bun --watch` with HMR

## Development

```bash
bun run dev:logged    # Dev server with watch mode (logs to /tmp/brogue-ts.log)
bun run typecheck     # TypeScript type checking
```

### Autonomous Iteration

This project includes a `/iterate` skill for Claude Code that autonomously ports C modules from BrogueCE to TypeScript, validates via MCP tools and Playwright screenshots, and benchmarks the AI across 10 seeds.

## Ported from BrogueCE

Based on [Brogue Community Edition](https://github.com/tmewett/BrogueCE) v1.15.1 (C, ~49K LOC). Core modules ported:

- Math.c (JSF RNG) | Grid.c | Dijkstra.c | Light.c | Architect.c
- Movement.c | Items.c | Monsters.c | Combat.c | Time.c
- Rogue.h (types/enums/constants) | Globals.c (colors, catalogs)

## License

Based on BrogueCE which is AGPL-3.0.
