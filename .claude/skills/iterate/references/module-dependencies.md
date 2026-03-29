# Module Dependency Graph (porting order)

Port in this order — each module depends only on previously ported ones.

## Level 0: Foundation (DONE)
- `shared/constants.ts` ← Rogue.h defines
- `shared/enums.ts` ← Rogue.h enums
- `shared/types.ts` ← Rogue.h structs
- `shared/colors.ts` ← Globals.c colors

## Level 1: Core Systems (DONE)
- `engine/rng.ts` ← Math.c (JSF RNG, fixed-point)
- `engine/grid.ts` ← Grid.c (allocGrid, floodFill, blob)
- `engine/state.ts` ← GlobalsBase.h (GameState class)

## Level 2: Spatial Systems (PARTIAL)
- `engine/dijkstra.ts` ← Dijkstra.c (depends: grid, constants) **NOT STARTED**
- `engine/fov.ts` ← Light.c FOV only (depends: state, constants) **DONE (simplified)**

## Level 3: Dungeon Generation (PARTIAL)
- `engine/architect.ts` ← Architect.c (depends: grid, rng, state, catalogs) **SIMPLIFIED**
  - Missing: blob rooms, machines/blueprints, liquid placement, proper stairs

## Level 4: Game Mechanics (SIMPLIFIED)
- `engine/movement.ts` ← Movement.c (depends: state, catalogs) **BASIC ONLY**
- `engine/light.ts` ← Light.c lighting (depends: fov, state, colors) **NOT STARTED**

## Level 5: Items (NOT STARTED)
- `engine/items.ts` ← Items.c (depends: state, rng, catalogs, movement)
- `engine/catalogs/items.ts` ← Globals.c item tables

## Level 6: Monsters (NOT STARTED)
- `engine/monsters.ts` ← Monsters.c (depends: state, rng, dijkstra, movement, catalogs)
- `engine/catalogs/monsters.ts` ← Globals.c monster tables

## Level 7: Combat (NOT STARTED)
- `engine/combat.ts` ← Combat.c (depends: monsters, items, state)

## Level 8: Turn System (NOT STARTED)
- `engine/time.ts` ← Time.c (depends: state, monsters, movement, combat, items)

## Level 9: Full Game Loop (SIMPLIFIED)
- `engine/game.ts` ← RogueMain.c (depends: everything)
- `engine/engine.ts` ← Public API (depends: everything)

## Recommended Next Ports (priority order)
1. **Dijkstra.c** (259 LOC) — needed by monster AI, auto-explore
2. **Light.c full** (412 LOC) — proper lighting makes the game look real
3. **Architect.c full** (3837 LOC) — blob rooms, machines, liquid = real Brogue levels
4. **Movement.c full** (1800 LOC) — auto-explore, terrain interactions
5. **Items.c** (8040 LOC) — the big one, enables gameplay depth
