// Simple monster system — spawn, display, bump-to-attack.
// Phase 4 stub: no AI movement, no pathfinding, no special abilities.

import { DCOLS, DROWS } from "../shared/constants.ts";
import type { GameState } from "./state.ts";

export interface Monster {
  x: number;
  y: number;
  name: string;
  displayChar: string;
  foreColor: [number, number, number];
  hp: number;
  maxHp: number;
  attack: { min: number; max: number };
  defense: number;
  xpValue: number;
  dead: boolean;
}

interface MonsterTemplate {
  name: string;
  displayChar: string;
  foreColor: [number, number, number];
  maxHp: number;
  attack: { min: number; max: number };
  defense: number;
  xpValue: number;
  minDepth: number;
  maxDepth: number;
  frequency: number;
}

const MONSTER_TEMPLATES: MonsterTemplate[] = [
  { name: "rat",         displayChar: "r", foreColor: [60, 45, 25],  maxHp: 6,  attack: { min: 1, max: 3 },  defense: 0,  xpValue: 2,  minDepth: 1, maxDepth: 5,  frequency: 10 },
  { name: "kobold",      displayChar: "k", foreColor: [60, 60, 25],  maxHp: 7,  attack: { min: 2, max: 4 },  defense: 0,  xpValue: 3,  minDepth: 1, maxDepth: 6,  frequency: 8 },
  { name: "jackal",      displayChar: "j", foreColor: [80, 60, 15],  maxHp: 8,  attack: { min: 2, max: 4 },  defense: 0,  xpValue: 3,  minDepth: 1, maxDepth: 5,  frequency: 6 },
  { name: "eel",         displayChar: "e", foreColor: [20, 65, 100], maxHp: 18, attack: { min: 3, max: 7 },  defense: 0,  xpValue: 6,  minDepth: 2, maxDepth: 12, frequency: 3 },
  { name: "monkey",      displayChar: "m", foreColor: [60, 55, 15],  maxHp: 12, attack: { min: 2, max: 3 },  defense: 0,  xpValue: 3,  minDepth: 2, maxDepth: 7,  frequency: 5 },
  { name: "goblin",      displayChar: "g", foreColor: [40, 85, 15],  maxHp: 15, attack: { min: 3, max: 5 },  defense: 1,  xpValue: 5,  minDepth: 3, maxDepth: 10, frequency: 6 },
  { name: "toad",        displayChar: "t", foreColor: [45, 70, 15],  maxHp: 18, attack: { min: 1, max: 4 },  defense: 0,  xpValue: 4,  minDepth: 3, maxDepth: 8,  frequency: 4 },
  { name: "vampire bat",  displayChar: "v", foreColor: [50, 25, 15],  maxHp: 18, attack: { min: 4, max: 7 },  defense: 0,  xpValue: 7,  minDepth: 4, maxDepth: 12, frequency: 4 },
  { name: "ogre",        displayChar: "O", foreColor: [60, 25, 75],  maxHp: 55, attack: { min: 9, max: 13 }, defense: 2,  xpValue: 15, minDepth: 5, maxDepth: 15, frequency: 3 },
  { name: "troll",       displayChar: "T", foreColor: [40, 60, 15],  maxHp: 65, attack: { min: 10, max: 15 },defense: 3,  xpValue: 20, minDepth: 7, maxDepth: 20, frequency: 2 },
];

function randomFloorCell(state: GameState): { x: number; y: number } | null {
  const rng = state.rng;
  for (let attempt = 0; attempt < 200; attempt++) {
    const x = rng.range(1, DCOLS - 2);
    const y = rng.range(1, DROWS - 2);
    const tile = state.pmap[x]![y]!.layers[0]!;
    if (tile >= 2 && tile <= 5) {
      // Not on player, not on another monster, not on stairs
      if (x === state.playerPos.x && y === state.playerPos.y) continue;
      if (state.monsters.some(m => !m.dead && m.x === x && m.y === y)) continue;
      // Not too close to player (at least 5 cells away)
      const dist = Math.abs(x - state.playerPos.x) + Math.abs(y - state.playerPos.y);
      if (dist < 5) continue;
      return { x, y };
    }
  }
  return null;
}

/**
 * Spawn monsters during dungeon generation.
 */
export function populateMonsters(state: GameState): void {
  const rng = state.rng;
  const depth = state.stats.depthLevel;
  const monsterCount = rng.range(3, 5 + Math.min(depth * 2, 10));

  state.monsters = [];

  // Filter templates eligible for this depth
  const eligible = MONSTER_TEMPLATES.filter(t => depth >= t.minDepth && depth <= t.maxDepth);
  if (eligible.length === 0) return;

  for (let i = 0; i < monsterCount; i++) {
    const loc = randomFloorCell(state);
    if (!loc) continue;

    // Weighted random template selection
    let totalFreq = 0;
    for (const t of eligible) totalFreq += t.frequency;
    let roll = rng.range(0, totalFreq - 1);
    let template = eligible[0]!;
    for (const t of eligible) {
      if (roll < t.frequency) { template = t; break; }
      roll -= t.frequency;
    }

    const monster: Monster = {
      x: loc.x,
      y: loc.y,
      name: template.name,
      displayChar: template.displayChar,
      foreColor: [...template.foreColor],
      hp: template.maxHp,
      maxHp: template.maxHp,
      attack: { ...template.attack },
      defense: template.defense,
      xpValue: template.xpValue,
      dead: false,
    };

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
 * Returns true if the attack happened.
 */
export function playerAttacksMonster(state: GameState, monster: Monster): boolean {
  const rng = state.rng;
  const damage = rng.range(monster.attack.min, monster.attack.max + state.stats.strength - 10);
  const actualDamage = Math.max(1, damage - monster.defense);

  monster.hp -= actualDamage;

  if (monster.hp <= 0) {
    monster.dead = true;
    state.addMessage(`You kill the ${monster.name}! (${actualDamage} damage)`);
  } else {
    state.addMessage(`You hit the ${monster.name} for ${actualDamage} damage. (${monster.hp}/${monster.maxHp} HP)`);
  }

  return true;
}

/**
 * Monster attacks the player (called when adjacent, each turn).
 */
export function monsterAttacksPlayer(state: GameState, monster: Monster): void {
  const rng = state.rng;
  const damage = rng.range(monster.attack.min, monster.attack.max);
  const actualDamage = Math.max(1, damage);

  state.stats.hp -= actualDamage;

  if (state.stats.hp <= 0) {
    state.stats.hp = 0;
    state.gameOver = true;
    state.victory = false;
    state.addMessage(`The ${monster.name} kills you!`);
  } else {
    state.addMessage(`The ${monster.name} hits you for ${actualDamage} damage. (${state.stats.hp}/${state.stats.maxHp} HP)`);
  }
}

/**
 * Check if a monster has line-of-sight to the player.
 * Uses the same VISIBLE flag as the FOV system — if the monster's cell
 * is visible to the player, the monster can also "see" the player.
 */
function monsterCanSeePlayer(state: GameState, monster: Monster): boolean {
  // Symmetric visibility: if the player can see the monster's cell, the monster can see the player
  return (state.pmap[monster.x]![monster.y]!.flags & 0x2) !== 0; // VISIBLE flag
}

function isPassableTile(tile: number): boolean {
  return (tile >= 2 && tile <= 5) || tile === 8 || tile === 12 || tile === 13; // floor/open_door/stairs
}

/**
 * Process monster turns — called each player turn.
 * Adjacent monsters attack. Visible monsters chase. Others wander.
 */
export function processMonsterTurns(state: GameState): void {
  const px = state.playerPos.x;
  const py = state.playerPos.y;
  const rng = state.rng;

  for (const monster of state.monsters) {
    if (monster.dead || state.gameOver) continue;

    const dx = Math.abs(monster.x - px);
    const dy = Math.abs(monster.y - py);

    // Adjacent: attack
    if (dx <= 1 && dy <= 1 && (dx + dy > 0)) {
      monsterAttacksPlayer(state, monster);
      continue;
    }

    // Can see player: chase (move one step toward player)
    if (monsterCanSeePlayer(state, monster)) {
      const stepX = Math.sign(px - monster.x);
      const stepY = Math.sign(py - monster.y);

      // Try direct move, then cardinal fallbacks
      const moves: [number, number][] = [
        [stepX, stepY],
        [stepX, 0],
        [0, stepY],
      ];

      let moved = false;
      for (const [mx, my] of moves) {
        if (mx === 0 && my === 0) continue;
        const nx = monster.x + mx;
        const ny = monster.y + my;
        if (nx < 0 || nx >= DCOLS || ny < 0 || ny >= DROWS) continue;
        const tile = state.pmap[nx]![ny]!.layers[0]!;
        if (!isPassableTile(tile)) continue;
        // Don't move onto player or other monster
        if (nx === px && ny === py) continue;
        if (state.monsters.some(m => !m.dead && m !== monster && m.x === nx && m.y === ny)) continue;
        monster.x = nx;
        monster.y = ny;
        moved = true;
        break;
      }

      // After moving, check if now adjacent — attack immediately
      if (moved) {
        const ndx = Math.abs(monster.x - px);
        const ndy = Math.abs(monster.y - py);
        if (ndx <= 1 && ndy <= 1 && (ndx + ndy > 0)) {
          monsterAttacksPlayer(state, monster);
        }
      }
      continue;
    }

    // Can't see player: random wander (20% chance per turn)
    if (rng.percent(20)) {
      const dir = rng.range(0, 7);
      const wx = monster.x + [0, 0, -1, 1, -1, -1, 1, 1][dir]!;
      const wy = monster.y + [-1, 1, 0, 0, -1, 1, -1, 1][dir]!;
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
