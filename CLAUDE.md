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
| Items.c | 8040 | engine/items.ts | ~3% (spawn, pickup, auto-equip. No inventory, identification, usage, enchantment) |
| Monsters.c | 4826 | engine/monsters.ts | ~5% (10 of 80+ types, basic chase. No abilities, hordes, mutations, allies) |
| Combat.c | 1784 | engine/combat.ts | ~5% (bump attack only. No accuracy, runic effects, bolts, sweep attacks) |
| Movement.c | 1800 | engine/movement.ts | ~2% (basic move+doors. No terrain effects, auto-travel, diagonal blocking) |
| Time.c | 2640 | engine/time.ts | ~3% (regen+nutrition. No environment updates, status effects, speed system) |
| IO.c | 5128 | client/renderer.ts | ~5% (basic plotChar. No inventory display, targeting, menus) |
| RogueMain.c | 1400 | engine/engine.ts | ~10% (simplified game loop. No recording, turn dispatch) |
| Recordings.c | 1519 | — | Not started |
| MainMenu.c | 1286 | — | Not started |
| PowerTables.c | 345 | — | Not started |
| Wizard.c | 522 | — | Not started |

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

## Phase Priorities (source-faithful porting)

Current coverage: ~17% of C source (6.6K TS / 38K C). Must port properly before AI iteration.

### Priority 1: Items.c (8,040 LOC → ~3% ported)
- Full item generation with enchantment levels
- Identification system (unknown → detected → identified)
- Inventory management (26 slots, pack weight)
- Item usage: apply, throw, equip/unequip, drop
- Potion effects (heal, levitation, fire immunity, detect magic, etc.)
- Scroll effects (enchant, protect, teleport, identify, etc.)
- Staff/wand charges and bolt effects
- Ring passive effects
- Charm system

### Priority 2: Combat.c (1,784 LOC → 0% ported separately)
- Full attack resolution with accuracy/dodge
- Runic weapon effects (speed, confusion, slowing, paralysis, etc.)
- Armor runic effects (reflection, dampening, etc.)
- Bolt/zap system with line-of-sight
- Sweep/lunge/penetrating attacks
- Hit lists for area attacks

### Priority 3: Monsters.c (4,826 LOC → ~5% ported)
- Full monster catalog from Globals.c (80+ types)
- Monster abilities (summon, breathe fire, blink, etc.)
- Horde spawning system
- Ally/captive system
- Mutation system
- Full pathfinding AI (Dijkstra-based, not just chase)
- Creature status effects

### Priority 4: Movement.c (2,487 LOC → ~2% ported)
- Terrain interactions (water, lava, gas, webs, etc.)
- Auto-travel with path display
- Diagonal blocking
- Confusion movement
- Key/door mechanics

### Priority 5: Time.c (2,640 LOC → ~3% ported)
- Full turn processing with tick system
- Environment updates (fire spread, gas dissipation, terrain promotion)
- Status effect processing (poison, confusion, paralysis, etc.)
- Creature speed system (movement/attack speed)

### Priority 6: Architect.c machines (3,837 LOC → ~19% ported)
- Machine/blueprint system (traps, vaults, reward rooms)
- Lake generation (water, lava, chasms)
- Loop detection and corridor widening
- Secret doors, portcullises
- Level connectivity verification

### Priority 7: IO.c (5,128 LOC)
- Full cell appearance with color multiplication
- Inventory display
- Targeting cursor
- Text boxes and menus
- Auto-ID on item use
