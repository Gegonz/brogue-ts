// Turn processing — HP regen, nutrition, status effects, poison.
// Ported from BrogueCE Time.c (decrementPlayerStatus, playerTurnEnded).

import type { GameState } from "./state.ts";
import { ItemCategory } from "./items.ts";

const REGEN_INTERVAL = 10;
const HUNGER_THRESHOLD = 300;
const WEAK_THRESHOLD = 150;
const FAINT_THRESHOLD = 50;

// Status effect indices (matching BrogueCE enum)
export const STATUS = {
  WEAKENED: 0,
  TELEPATHIC: 1,
  HALLUCINATING: 2,
  LEVITATING: 3,
  SLOWED: 4,
  HASTED: 5,
  CONFUSED: 6,
  BURNING: 7,
  PARALYZED: 8,
  POISONED: 9,
  STUCK: 10,
  NAUSEOUS: 11,
  DISCORDANT: 12,
  IMMUNE_TO_FIRE: 13,
  SHIELDED: 14,
  INVISIBLE: 15,
  NUM_STATUSES: 16,
} as const;

/**
 * Initialize status arrays on the player (call once at game start).
 */
export function initializeStatuses(state: GameState): void {
  if (!state.statuses) {
    state.statuses = new Array(STATUS.NUM_STATUSES).fill(0);
    state.maxStatuses = new Array(STATUS.NUM_STATUSES).fill(0);
    state.poisonAmount = 0;
  }
}

/**
 * Process end-of-turn effects: HP regen, nutrition, status effects, poison.
 */
export function processTurnEffects(state: GameState): void {
  if (state.gameOver) return;
  initializeStatuses(state);

  // --- HP Regeneration (scales with level) ---
  if (state.stats.hp < state.stats.maxHp && state.stats.turnNumber % REGEN_INTERVAL === 0) {
    const regenAmount = Math.max(1, Math.floor(state.stats.level / 2) + 1);
    state.stats.hp = Math.min(state.stats.hp + regenAmount, state.stats.maxHp);
  }

  // --- Poison damage ---
  if (state.poisonAmount > 0) {
    const poisonDmg = Math.min(state.poisonAmount, 1); // 1 damage per turn per dose
    state.stats.hp -= poisonDmg;
    state.poisonAmount = Math.max(0, state.poisonAmount - 1);
    if (state.poisonAmount <= 0) {
      state.statuses[STATUS.POISONED] = 0;
      state.addMessage("The poison wears off.");
    }
    if (state.stats.hp <= 0) {
      state.stats.hp = 0;
      state.gameOver = true;
      state.victory = false;
      state.addMessage("You die of poison.");
    }
  }

  // --- Nutrition drain (every 2 turns) ---
  const prevNutrition = state.stats.nutrition;
  if (state.stats.turnNumber % 2 === 0) {
    state.stats.nutrition = Math.max(0, state.stats.nutrition - 1);
  }

  if (prevNutrition > HUNGER_THRESHOLD && state.stats.nutrition <= HUNGER_THRESHOLD) {
    state.addMessage("You are feeling hungry.");
  }
  if (prevNutrition > WEAK_THRESHOLD && state.stats.nutrition <= WEAK_THRESHOLD) {
    state.addMessage("You feel weak from lack of food!");
  }
  if (prevNutrition > FAINT_THRESHOLD && state.stats.nutrition <= FAINT_THRESHOLD) {
    state.addMessage("You are about to faint from starvation!");
  }
  if (state.stats.nutrition <= 0) {
    state.gameOver = true;
    state.victory = false;
    state.addMessage("You starve to death.");
  }

  // --- Status effect decrement ---
  decrementStatuses(state);

  // --- Environment updates ---
  updateEnvironment(state);

  // --- Shield decay ---
  if (state.statuses[STATUS.SHIELDED]! > 0) {
    const decay = Math.max(1, Math.floor(state.maxStatuses[STATUS.SHIELDED]! / 20));
    state.statuses[STATUS.SHIELDED] = Math.max(0, state.statuses[STATUS.SHIELDED]! - decay);
    if (state.statuses[STATUS.SHIELDED]! <= 0) {
      state.maxStatuses[STATUS.SHIELDED] = 0;
      state.addMessage("Your magical shield dissipates.");
    }
  }
}

function decrementStatuses(state: GameState): void {
  const s = state.statuses;

  if (s[STATUS.TELEPATHIC]! > 0 && --s[STATUS.TELEPATHIC]! <= 0) {
    state.addMessage("Your preternatural mental sensitivity fades.");
  }
  if (s[STATUS.HALLUCINATING]! > 0 && --s[STATUS.HALLUCINATING]! <= 0) {
    state.addMessage("Your hallucinations fade.");
  }
  if (s[STATUS.LEVITATING]! > 0 && --s[STATUS.LEVITATING]! <= 0) {
    state.addMessage("You are no longer levitating.");
  }
  if (s[STATUS.CONFUSED]! > 0 && --s[STATUS.CONFUSED]! <= 0) {
    state.addMessage("You no longer feel confused.");
  }
  if (s[STATUS.PARALYZED]! > 0 && --s[STATUS.PARALYZED]! <= 0) {
    state.addMessage("You can move again.");
  }
  if (s[STATUS.HASTED]! > 0 && --s[STATUS.HASTED]! <= 0) {
    state.addMessage("Your supernatural speed fades.");
  }
  if (s[STATUS.SLOWED]! > 0 && --s[STATUS.SLOWED]! <= 0) {
    state.addMessage("Your normal speed resumes.");
  }
  if (s[STATUS.WEAKENED]! > 0 && --s[STATUS.WEAKENED]! <= 0) {
    state.addMessage("Strength returns to your muscles.");
  }
  if (s[STATUS.IMMUNE_TO_FIRE]! > 0 && --s[STATUS.IMMUNE_TO_FIRE]! <= 0) {
    state.addMessage("You no longer feel immune to fire.");
  }
  if (s[STATUS.INVISIBLE]! > 0 && --s[STATUS.INVISIBLE]! <= 0) {
    state.addMessage("You are no longer invisible.");
  }
  if (s[STATUS.NAUSEOUS]! > 0) s[STATUS.NAUSEOUS]!--;
  if (s[STATUS.DISCORDANT]! > 0) s[STATUS.DISCORDANT]!--;
  if (s[STATUS.BURNING]! > 0) {
    s[STATUS.BURNING]!--;
    if (s[STATUS.BURNING]! > 0) {
      state.stats.hp -= 1;
      if (state.stats.hp <= 0) {
        state.stats.hp = 0;
        state.gameOver = true;
        state.victory = false;
        state.addMessage("You burn to death!");
      }
    }
  }
}

/**
 * Apply poison to the player.
 */
export function applyPoison(state: GameState, amount: number): void {
  initializeStatuses(state);
  state.poisonAmount += amount;
  state.statuses[STATUS.POISONED] = state.poisonAmount;
  state.maxStatuses[STATUS.POISONED] = state.poisonAmount;
  state.addMessage(`You are${state.poisonAmount > amount ? " further" : ""} poisoned! (${state.poisonAmount} doses)`);
}

/**
 * Apply a timed status effect to the player.
 */
export function applyStatus(state: GameState, status: number, duration: number): void {
  initializeStatuses(state);
  state.statuses[status] = Math.max(state.statuses[status]!, duration);
  state.maxStatuses[status] = Math.max(state.maxStatuses[status]!, duration);
}

/**
 * Update environment: terrain promotions (doors closing, etc.)
 * Simplified port of BrogueCE Time.c updateEnvironment().
 */
export function updateEnvironment(state: GameState): void {
  const { DCOLS, DROWS } = require("../shared/constants.ts") as typeof import("../shared/constants.ts");

  // Open doors auto-close after some time (BrogueCE: OPEN_DOOR promotes to CLOSED_DOOR at 10000 promoteChance)
  // Simplified: 1% chance per turn of closing an open door the player isn't standing on
  for (let i = 0; i < DCOLS; i++) {
    for (let j = 0; j < DROWS; j++) {
      const tile = state.pmap[i]![j]!.layers[0]!;
      if (tile === 8) { // OPEN_DOOR
        // Don't close if player is on it
        if (i === state.playerPos.x && j === state.playerPos.y) continue;
        // Don't close if a monster is on it
        if (state.monsters.some((m: { dead: boolean; x: number; y: number }) => !m.dead && m.x === i && m.y === j)) continue;
        // 1% chance per turn
        if (state.rng.percent(1)) {
          state.pmap[i]![j]!.layers[0] = 7; // DOOR (closed)
        }
      }
    }
  }
}

/**
 * Pick up food item at player's location.
 */
export function tryEatFood(state: GameState): boolean {
  const px = state.playerPos.x;
  const py = state.playerPos.y;

  for (const item of state.floorItems) {
    if (!item.collected && item.x === px && item.y === py && item.category === ItemCategory.FOOD) {
      item.collected = true;
      const restored = 2000;
      state.stats.nutrition = Math.min(state.stats.nutrition + restored, 3000);
      state.addMessage("You eat the food. Delicious!");
      return true;
    }
  }
  return false;
}
