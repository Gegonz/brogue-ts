// Turn processing — HP regen, nutrition, status effects.
// Ported concept from BrogueCE Time.c (simplified).

import type { GameState } from "./state.ts";
import { ItemCategory } from "./items.ts";

const REGEN_INTERVAL = 10;    // Regen 1 HP every N turns
const HUNGER_THRESHOLD = 300; // "You are hungry" warning
const WEAK_THRESHOLD = 150;   // "You feel weak" warning
const FAINT_THRESHOLD = 50;   // "You feel faint" warning

/**
 * Process end-of-turn effects: HP regen, nutrition drain.
 * Called once per player turn.
 */
export function processTurnEffects(state: GameState): void {
  if (state.gameOver) return;

  // --- HP Regeneration ---
  if (state.stats.hp < state.stats.maxHp && state.stats.turnNumber % REGEN_INTERVAL === 0) {
    state.stats.hp = Math.min(state.stats.hp + 1, state.stats.maxHp);
  }

  // --- Nutrition drain ---
  const prevNutrition = state.stats.nutrition;
  state.stats.nutrition = Math.max(0, state.stats.nutrition - 1);

  // Hunger warnings at thresholds
  if (prevNutrition > HUNGER_THRESHOLD && state.stats.nutrition <= HUNGER_THRESHOLD) {
    state.addMessage("You are feeling hungry.");
  }
  if (prevNutrition > WEAK_THRESHOLD && state.stats.nutrition <= WEAK_THRESHOLD) {
    state.addMessage("You feel weak from lack of food!");
  }
  if (prevNutrition > FAINT_THRESHOLD && state.stats.nutrition <= FAINT_THRESHOLD) {
    state.addMessage("You are about to faint from starvation!");
  }

  // Starvation death
  if (state.stats.nutrition <= 0) {
    state.gameOver = true;
    state.victory = false;
    state.addMessage("You starve to death.");
  }
}

/**
 * Pick up food item at player's location.
 * Returns true if food was consumed.
 */
export function tryEatFood(state: GameState): boolean {
  const px = state.playerPos.x;
  const py = state.playerPos.y;

  for (const item of state.floorItems) {
    if (!item.collected && item.x === px && item.y === py && item.category === ItemCategory.FOOD) {
      item.collected = true;
      const restored = 2000; // Standard ration restores nutrition
      state.stats.nutrition = Math.min(state.stats.nutrition + restored, 3000); // STOMACH_SIZE
      state.addMessage("You eat the food. Delicious!");
      return true;
    }
  }
  return false;
}
