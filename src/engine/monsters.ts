// Monster system — spawn from catalog, display, combat, AI.
// Uses source-faithful data from catalogs/monsters.ts

import { DCOLS, DROWS } from "../shared/constants.ts";
import type { GameState } from "./state.ts";
import { monsterCatalog, monsterDepthRanges, type MonsterCatalogEntry } from "./catalogs/monsters.ts";
import { playerAttackMonster, monsterAttackPlayer } from "./combat.ts";

export interface Monster {
  x: number;
  y: number;
  catalogIndex: number;
  name: string;
  displayChar: string;
  foreColor: [number, number, number];
  hp: number;
  maxHp: number;
  defense: number;
  accuracy: number;
  damage: { min: number; max: number; clump: number };
  moveSpeed: number;
  attackSpeed: number;
  xpValue: number;
  dead: boolean;
  flags: string[];
}

function xpForMonster(entry: MonsterCatalogEntry): number {
  // XP based on monster difficulty (HP + damage + defense)
  const avgDmg = (entry.damage.min + entry.damage.max) / 2;
  return Math.max(1, Math.floor((entry.maxHP + avgDmg * 3 + entry.defense / 5) / 5));
}

function createMonster(catalogIndex: number, x: number, y: number): Monster {
  const entry = monsterCatalog[catalogIndex]!;
  return {
    x, y,
    catalogIndex,
    name: entry.name,
    displayChar: entry.displayChar,
    foreColor: [...entry.foreColor],
    hp: entry.maxHP,
    maxHp: entry.maxHP,
    defense: entry.defense,
    accuracy: entry.accuracy,
    damage: { ...entry.damage },
    moveSpeed: entry.moveSpeed,
    attackSpeed: entry.attackSpeed,
    xpValue: xpForMonster(entry),
    dead: false,
    flags: [...entry.flags],
  };
}

function randomFloorCell(state: GameState): { x: number; y: number } | null {
  const rng = state.rng;
  for (let attempt = 0; attempt < 200; attempt++) {
    const x = rng.range(1, DCOLS - 2);
    const y = rng.range(1, DROWS - 2);
    const tile = state.pmap[x]![y]!.layers[0]!;
    if (tile >= 2 && tile <= 5) {
      if (x === state.playerPos.x && y === state.playerPos.y) continue;
      if (state.monsters.some(m => !m.dead && m.x === x && m.y === y)) continue;
      const dist = Math.abs(x - state.playerPos.x) + Math.abs(y - state.playerPos.y);
      if (dist < 5) continue;
      return { x, y };
    }
  }
  return null;
}

/**
 * Spawn monsters using the catalog depth ranges.
 */
export function populateMonsters(state: GameState): void {
  const rng = state.rng;
  const depth = state.stats.depthLevel;
  const monsterCount = rng.range(2, 3 + Math.min(depth, 8));

  state.monsters = [];

  // Filter eligible monsters for this depth
  const eligible = monsterDepthRanges.filter(r => depth >= r.minDepth && depth <= r.maxDepth);
  if (eligible.length === 0) return;

  for (let i = 0; i < monsterCount; i++) {
    const loc = randomFloorCell(state);
    if (!loc) continue;

    // Weighted random selection
    let totalFreq = 0;
    for (const r of eligible) totalFreq += r.frequency;
    let roll = rng.range(0, totalFreq - 1);
    let chosen = eligible[0]!;
    for (const r of eligible) {
      if (roll < r.frequency) { chosen = r; break; }
      roll -= r.frequency;
    }

    const monster = createMonster(chosen.monsterIndex, loc.x, loc.y);
    state.monsters.push(monster);
  }
}

/**
 * Find a living monster at the given position.
 */
export function monsterAt(state: GameState, x: number, y: number): Monster | null {
  return state.monsters.find(m => !m.dead && m.x === x && m.y === y) ?? null;
}

/**
 * Player attacks a monster (bump combat).
 * Delegates to combat.ts for proper BrogueCE formulas.
 */
export function playerAttacksMonster(state: GameState, monster: Monster): boolean {
  return playerAttackMonster(state, monster);
}

/**
 * Monster attacks the player.
 * Delegates to combat.ts for proper BrogueCE formulas.
 */
export function monsterAttacksPlayer(state: GameState, monster: Monster): void {
  monsterAttackPlayer(state, monster);
}

/**
 * Check if a monster has line-of-sight to the player.
 */
function monsterCanSeePlayer(state: GameState, monster: Monster): boolean {
  return (state.pmap[monster.x]![monster.y]!.flags & 0x2) !== 0;
}

function isPassableTile(tile: number): boolean {
  return (tile >= 2 && tile <= 5) || tile === 8 || tile === 12 || tile === 13;
}

/**
 * Process monster turns — chase, attack, wander.
 */
export function processMonsterTurns(state: GameState): void {
  const px = state.playerPos.x;
  const py = state.playerPos.y;
  const rng = state.rng;

  for (const monster of state.monsters) {
    if (monster.dead || state.gameOver) continue;

    // Skip immobile monsters
    if (monster.flags.includes("immobile") || monster.flags.includes("inanimate")) continue;

    const dx = Math.abs(monster.x - px);
    const dy = Math.abs(monster.y - py);

    // Adjacent: attack
    if (dx <= 1 && dy <= 1 && (dx + dy > 0)) {
      monsterAttacksPlayer(state, monster);
      continue;
    }

    // Flee at low HP (wraiths, vampires, bog monsters)
    if (monster.flags.includes("flees_low_hp") && monster.hp < monster.maxHp / 4 && monsterCanSeePlayer(state, monster)) {
      // Run AWAY from player
      const fleeX = Math.sign(monster.x - px);
      const fleeY = Math.sign(monster.y - py);
      const fleeMoves: [number, number][] = [[fleeX, fleeY], [fleeX, 0], [0, fleeY]];
      for (const [mx, my] of fleeMoves) {
        if (mx === 0 && my === 0) continue;
        const nx = monster.x + mx;
        const ny = monster.y + my;
        if (nx >= 0 && nx < DCOLS && ny >= 0 && ny < DROWS
          && isPassableTile(state.pmap[nx]![ny]!.layers[0]!)
          && !(nx === px && ny === py)
          && !state.monsters.some(m => !m.dead && m !== monster && m.x === nx && m.y === ny)) {
          monster.x = nx;
          monster.y = ny;
          break;
        }
      }
      continue;
    }

    // Ranged attackers: maintain distance (dar priestesses, centaurs)
    if (monster.flags.includes("ranged") && monsterCanSeePlayer(state, monster) && dx + dy <= 8 && dx + dy > 2) {
      // Stay at range — don't chase, just attack from distance
      // (simplified: they just don't move when in range)
      continue;
    }

    // Can see player: chase
    if (monsterCanSeePlayer(state, monster)) {
      const stepX = Math.sign(px - monster.x);
      const stepY = Math.sign(py - monster.y);

      const moves: [number, number][] = [[stepX, stepY], [stepX, 0], [0, stepY]];
      let moved = false;
      for (const [mx, my] of moves) {
        if (mx === 0 && my === 0) continue;
        const nx = monster.x + mx;
        const ny = monster.y + my;
        if (nx < 0 || nx >= DCOLS || ny < 0 || ny >= DROWS) continue;
        const tile = state.pmap[nx]![ny]!.layers[0]!;
        if (!isPassableTile(tile)) continue;
        if (nx === px && ny === py) continue;
        if (state.monsters.some(m => !m.dead && m !== monster && m.x === nx && m.y === ny)) continue;
        monster.x = nx;
        monster.y = ny;
        moved = true;
        break;
      }

      if (moved) {
        const ndx = Math.abs(monster.x - px);
        const ndy = Math.abs(monster.y - py);
        if (ndx <= 1 && ndy <= 1 && (ndx + ndy > 0)) {
          monsterAttacksPlayer(state, monster);
        }
      }
      continue;
    }

    // Wander (20% chance)
    if (rng.percent(20)) {
      const dir = rng.range(0, 7);
      const offsets = [[0,-1],[0,1],[-1,0],[1,0],[-1,-1],[-1,1],[1,-1],[1,1]];
      const wx = monster.x + offsets[dir]![0]!;
      const wy = monster.y + offsets[dir]![1]!;
      if (wx >= 0 && wx < DCOLS && wy >= 0 && wy < DROWS) {
        const tile = state.pmap[wx]![wy]!.layers[0]!;
        if (isPassableTile(tile) && !(wx === px && wy === py)
          && !state.monsters.some(m => !m.dead && m !== monster && m.x === wx && m.y === wy)) {
          monster.x = wx;
          monster.y = wy;
        }
      }
    }
  }
}
