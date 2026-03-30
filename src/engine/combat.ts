// Combat system — ported from BrogueCE Combat.c
// Core formulas: hit probability, damage calculation, sneak attacks.

import type { GameState } from "./state.ts";
import type { Monster } from "./monsters.ts";
import { applyPoison } from "./time.ts";

const FP_FACTOR = 65536;

/**
 * defenseFraction: 0.987^defense (BrogueCE formula)
 * Returns a fixed-point fraction.
 */
function defenseFraction(defense: number): number {
  // 0.987^defense approximated
  return Math.round(Math.pow(0.987, defense) * FP_FACTOR);
}

/**
 * accuracyFraction: enchantment bonus to accuracy.
 * Each point of net enchantment adds ~6.5% accuracy.
 */
function accuracyFraction(enchant: number): number {
  return Math.round(Math.pow(1.065, enchant) * FP_FACTOR);
}

/**
 * Calculate hit probability: accuracy * defenseFraction(defense)
 * Matching BrogueCE hitProbability()
 */
export function hitProbability(
  attackerAccuracy: number,
  defenderDefense: number,
): number {
  const prob = Math.floor(attackerAccuracy * defenseFraction(defenderDefense) / FP_FACTOR);
  return Math.max(0, Math.min(100, prob));
}

/**
 * Player's effective accuracy considering weapon enchantment and strength.
 */
export function playerAccuracy(state: GameState): number {
  const baseAccuracy = 100;
  const weaponBonus = state.weapon?.bonusDamage ?? 0;
  // Each point of weapon bonus adds accuracy via accuracyFraction
  return Math.floor(baseAccuracy * accuracyFraction(weaponBonus) / FP_FACTOR);
}

/**
 * Player's effective defense from armor.
 * In BrogueCE, armor defense is the armor value from the catalog.
 */
export function playerDefense(state: GameState): number {
  return state.armor?.defense ?? 0;
}

/**
 * Calculate damage from a damage range with clumping.
 * Matches BrogueCE randClump: splits range into clump dice.
 */
export function rollDamage(
  rng: { range: (a: number, b: number) => number; clumpedRange: (a: number, b: number, c: number) => number },
  damage: { min: number; max: number; clump: number },
): number {
  if (damage.clump <= 1) {
    return rng.range(damage.min, damage.max);
  }
  return rng.clumpedRange(damage.min, damage.max, damage.clump);
}

/**
 * Resolve a full attack: attacker hits defender.
 * Returns { hit, damage, killed, message }
 */
export function resolveAttack(
  state: GameState,
  attackerName: string,
  attackerAccuracy: number,
  attackerDamage: { min: number; max: number; clump: number },
  defenderName: string,
  defenderDefense: number,
  defenderHP: number,
  defenderMaxHP: number,
  isSneakAttack: boolean,
): {
  hit: boolean;
  damage: number;
  killed: boolean;
  newHP: number;
  message: string;
} {
  const rng = state.rng;

  // Hit check
  if (!isSneakAttack) {
    const prob = hitProbability(attackerAccuracy, defenderDefense);
    if (rng.range(0, 99) >= prob) {
      return {
        hit: false,
        damage: 0,
        killed: false,
        newHP: defenderHP,
        message: `${attackerName} ${attackerName === "You" ? "miss" : "misses"} ${defenderName}.`,
      };
    }
  }

  // Damage
  let damage = rollDamage(rng, attackerDamage);

  // Sneak attack: triple damage (5x for daggers, but we simplify to 3x)
  if (isSneakAttack) {
    damage *= 3;
  }

  damage = Math.max(1, damage);
  const newHP = Math.max(0, defenderHP - damage);
  const killed = newHP <= 0;

  let message: string;
  if (killed) {
    const verb = isSneakAttack
      ? (attackerName === "You" ? "dispatch" : "dispatches")
      : (attackerName === "You" ? "defeat" : "defeats");
    message = `${attackerName} ${verb} ${defenderName}! (${damage} damage)`;
  } else {
    const verb = attackerName === "You" ? "hit" : "hits";
    let extra = "";
    if (isSneakAttack) extra = " in a sneak attack";
    message = `${attackerName} ${verb} ${defenderName} for ${damage} damage${extra}. (${newHP}/${defenderMaxHP} HP)`;
  }

  return { hit: true, damage, killed, newHP, message };
}

/**
 * Player attacks monster using proper combat formulas.
 */
export function playerAttackMonster(state: GameState, monster: Monster): boolean {
  const pAcc = playerAccuracy(state);
  const weaponDmg = state.weapon
    ? { ...state.weapon.damage }
    : { min: 1, max: 3 + Math.max(0, state.stats.strength - 10), clump: 1 };

  const result = resolveAttack(
    state,
    "You",
    pAcc,
    weaponDmg,
    `the ${monster.name}`,
    monster.defense,
    monster.hp,
    monster.maxHp,
    false,
  );

  monster.hp = result.newHP;
  state.addMessage(result.message);

  if (result.killed) {
    monster.dead = true;
    state.stats.monstersKilled++;
    state.stats.xp += monster.xpValue;
    state.addMessage(`+${monster.xpValue} XP`);

    // Level up
    const xpPerLevel = 20;
    const newLevel = Math.floor(state.stats.xp / xpPerLevel) + 1;
    if (newLevel > state.stats.level) {
      state.stats.level = newLevel;
      state.stats.maxHp += 5;
      state.stats.hp = Math.min(state.stats.hp + 5, state.stats.maxHp);
      state.stats.strength++;
      state.stats.maxStrength++;
      state.addMessage(`*** LEVEL UP! *** Level ${newLevel}! (+5 HP, +1 Str)`);
    }
  }

  return true;
}

/**
 * Monster attacks player using proper combat formulas.
 */
export function monsterAttackPlayer(state: GameState, monster: Monster): void {
  const pDef = playerDefense(state);

  const result = resolveAttack(
    state,
    `The ${monster.name}`,
    monster.accuracy,
    monster.damage,
    "you",
    pDef * 10, // Scale armor defense for the 0.987^defense formula
    state.stats.hp,
    state.stats.maxHp,
    false,
  );

  state.stats.hp = result.newHP;
  state.addMessage(result.message);

  // Monster special effects on hit
  if (result.hit && result.damage > 0 && !result.killed) {
    if (monster.flags.includes("poisons")) {
      applyPoison(state, result.damage);
    }
    if (monster.flags.includes("weakens")) {
      state.stats.strength = Math.max(1, state.stats.strength - 1);
      state.addMessage("You feel weakened!");
    }
  }

  if (result.killed) {
    state.stats.hp = 0;
    state.gameOver = true;
    state.victory = false;
  }
}
