# C-to-TypeScript Porting Patterns

## Arithmetic
- All uint32 ops need `>>> 0`: `(a + b) >>> 0`, `(a ^ b) >>> 0`
- C `short` → TS `number` (no narrowing needed)
- C `long long` / `fixpt` → TS `number` (53-bit precision sufficient) or `bigint` for seeds
- C `Fl(N)` macro → `1 << N` (works up to bit 30, use `>>> 0` for bit 31)

## Data Structures
- C `short **allocGrid()` → `number[][]` via `Array.from({length: DCOLS}, () => new Array(DROWS).fill(0))`
- C linked lists (`item->nextItem`) → TS arrays `Item[]` (preserve iteration order for RNG)
- C `creature *` → TS `Creature` object (no pointers, just references)
- C `enum` → TS `const enum` or `export const` for bitfields

## Global State
- All C globals (pmap, tmap, player, rogue, monsters, etc.) → fields on `GameState` class
- Functions take `state: GameState` as first parameter
- Access: C `pmap[x][y]` → TS `state.pmap[x]![y]!` (non-null assertion for noUncheckedIndexedAccess)

## RNG (CRITICAL)
- Every `rand_range(a, b)` → `state.rng.range(a, b)`
- Every `randClumpedRange(a, b, c)` → `state.rng.clumpedRange(a, b, c)`
- Call order MUST match C exactly — determines dungeon layout
- Cosmetic RNG: `state.rng.assureCosmeticRNG()` before, restore after

## Colors
- Components 0-100 (matching C), convert to 0-255 only at render time
- `const color white = {100, 100, 100, 0, 0, 0, 0, false}` → `Color` interface

## Strings
- C char arrays `char name[DCOLS]` → TS `string`
- C `sprintf(buf, ...)` → TS template literals

## Import Conventions
- Use `.ts` extension in imports: `import { X } from './module.ts'`
- Use `import type` for type-only imports
