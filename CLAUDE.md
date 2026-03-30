# Brogue-TS

TypeScript rewrite of [Brogue Community Edition](https://github.com/tmewett/BrogueCE) v1.15.1 (C roguelike, ~49K LOC).

**C source (reference)**: `/home/gbrunel/work/brogue/src/brogue/` — read these when porting
**TS target (this project)**: `/home/gbrunel/work/brogue-ts/src/`

## Architecture

```
Bun.serve() on :8080
├── GET /     → Canvas game (browser, HMR)
├── POST /mcp → MCP Streamable HTTP (Claude plays via tools)
└── GameEngine (pure TS, no DOM)
    ├── state.ts      → GameState (replaces C globals)
    ├── rng.ts        → JSF RNG (exact C port, bit-identical)
    ├── architect.ts  → Dungeon generation
    ├── movement.ts   → Player movement + terrain
    ├── fov.ts        → Shadow-casting FOV
    ├── engine.ts     → Public API (newGame, handleKeystroke, getState)
    └── catalogs/     → Tile/monster/item data tables
```

## Dev Workflow

```bash
# In a separate terminal (leave running):
bun run dev:logged

# Server auto-reloads on file changes (~300ms)
# Logs: /tmp/brogue-ts.log
# Browser: http://localhost:8080
# MCP: http://localhost:8080/mcp
```

Claude edits code → server auto-reloads → test via MCP tools or browser. Never restart the server manually.

## MCP Tools

| Tool | Description |
|------|-------------|
| `brogue_new(seed?)` | Start new game, returns ASCII map + stats |
| `brogue_move(direction)` | Move N/S/E/W/NE/NW/SE/SW |
| `brogue_action(action)` | rest/search/descend/ascend/explore |
| `brogue_look()` | Get current state without acting |

## C Source Reference (~/work/brogue)

| C File | LOC | TS Module | Status |
|--------|-----|-----------|--------|
| Rogue.h | 3200 | shared/types,constants,enums | Done (foundation) |
| GlobalsBase.h | 68 | engine/state.ts | Done (basic) |
| Globals.c | 5800 | shared/colors.ts, catalogs/ | Done (colors, tileCatalog 20 entries), Partial (monster/item catalogs) |
| Math.c | 290 | engine/rng.ts | Done (exact JSF port) |
| Grid.c | 547 | engine/grid.ts | Done |
| Dijkstra.c | 259 | engine/dijkstra.ts | Done (dijkstraScan, calculateDistances, pathingDistance) |
| Architect.c | 3837 | engine/architect.ts | Done (7 room types, door sites, hallways, attachRooms, dungeon profiles. Skipped: machines/blueprints, lakes, loops) |
| Light.c | 412 | engine/fov.ts, engine/light.ts | Done (FOV, getFOVMask, paintLight, updateLighting, miner's light. Skipped: flares, creature lights) |
| Movement.c | 1800 | engine/movement.ts | Partial (basic move, door open, stair detection, auto-explore via Dijkstra. No combat, terrain effects) |
| Items.c | 8040 | engine/items.ts | Partial (floor item spawn, display, gold pickup. No inventory, identification, usage) |
| Monsters.c | 4826 | engine/monsters.ts | Partial (spawn, 10 types, chase AI, wander, death. No pathfinding AI, specials) |
| Combat.c | 1784 | engine/combat.ts | Partial (bump-attack, retaliation, auto-fight, kill tracking. In monsters.ts) |
| Time.c | 2640 | engine/time.ts | Partial (HP regen every 15 turns, nutrition drain 1/turn, hunger warnings, starvation death, food consumption) |
| IO.c | 5128 | client/renderer.ts | Simplified (basic plotChar) |
| RogueMain.c | 1400 | engine/game.ts | Simplified (minimal loop) |

## Key Technical Notes

- **RNG fidelity**: JSF algorithm in rng.ts must be bit-identical to C. Uses `>>> 0` for uint32, BigInt for seeds.
- **Globals → GameState**: All C globals from GlobalsBase.h are fields on GameState class.
- **Colors**: 0-100 range internally (matching C), convert to 0-255 only at render time (`* 2.55`).
- **Screen**: COLS=100, ROWS=34, DCOLS=79, DROWS=29, STAT_BAR_WIDTH=20, MESSAGE_LINES=3.
- **Map region**: dungeon at screen cols 21-99, rows 3-30. Sidebar cols 0-19. Messages rows 0-2.
- **Cell flags**: 0x1 = DISCOVERED, 0x2 = VISIBLE (used by FOV).

## Porting Approach

When porting a C module:
1. Read the C source at `~/work/brogue/src/brogue/{Module}.c`
2. Port functions preserving exact behavior (especially RNG consumption order)
3. Test via MCP tools (`brogue_new` + `brogue_move` + `brogue_look`)
4. Validate browser rendering at http://localhost:8080
5. Run `npx tsc --noEmit` to verify types

## Phase Priorities

1. **Dungeon gen** — port full Architect.c (blob rooms, machines, liquid, stairs)
2. **Lighting** — port Light.c (paintLight, updateLighting, proper colors)
3. **Items** — spawn items, pick up, inventory display
4. **Monsters** — spawn, AI, pathfinding
5. **Combat** — attack, damage, death
6. **Turn system** — full turn processing with environment
