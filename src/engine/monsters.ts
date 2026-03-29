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
 * Process monster turns — called each player turn.
 * Monsters adjacent to the player attack. Others do nothing (no AI yet).
 */
export function processMonsterTurns(state: GameState): void {
  const px = state.playerPos.x;
  const py = state.playerPos.y;

  for (const monster of state.monsters) {
    if (monster.dead || state.gameOver) continue;

    // Check if adjacent to player (8 directions)
    const dx = Math.abs(monster.x - px);
    const dy = Math.abs(monster.y - py);
    if (dx <= 1 && dy <= 1 && (dx + dy > 0)) {
      monsterAttacksPlayer(state, monster);
    }
  }
}
