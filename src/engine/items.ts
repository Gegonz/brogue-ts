// Simple floor items — spawn during dungeon gen, display on map.
// Phase 3 stub: no inventory, no identification, no usage yet.

import { DCOLS, DROWS } from "../shared/constants.ts";
import type { GameState } from "./state.ts";

export interface FloorItem {
  x: number;
  y: number;
  category: ItemCategory;
  kind: number;
  displayChar: string;
  foreColor: [number, number, number];
  name: string;
  collected: boolean;
}

export enum ItemCategory {
  FOOD = 0,
  POTION,
  SCROLL,
  WEAPON,
  ARMOR,
  STAFF,
  WAND,
  RING,
  CHARM,
  GOLD,
  KEY,
}

interface ItemTemplate {
  category: ItemCategory;
  displayChar: string;
  foreColor: [number, number, number];
  names: string[];
}

const ITEM_TEMPLATES: ItemTemplate[] = [
  { category: ItemCategory.FOOD,   displayChar: ":", foreColor: [70, 35, 0],   names: ["a ration of food"] },
  { category: ItemCategory.POTION, displayChar: "!", foreColor: [100, 0, 100], names: ["a potion", "a purple potion", "a blue potion", "a green potion", "a red potion", "a yellow potion"] },
  { category: ItemCategory.SCROLL, displayChar: "?", foreColor: [100, 100, 50],names: ["a scroll", "a scroll titled BLAUMEUX", "a scroll titled ZELGO MER", "a scroll titled JUYED AWK YACC"] },
  { category: ItemCategory.WEAPON, displayChar: ")", foreColor: [100, 100, 100], names: ["a dagger", "a sword", "a broadsword", "a mace", "a war hammer", "a spear", "a war axe"] },
  { category: ItemCategory.ARMOR,  displayChar: "[", foreColor: [70, 55, 25],  names: ["leather armor", "scale mail", "chain mail", "banded mail", "plate armor"] },
  { category: ItemCategory.STAFF,  displayChar: "/", foreColor: [100, 80, 20], names: ["a staff", "a birch staff", "a oak staff", "a willow staff"] },
  { category: ItemCategory.RING,   displayChar: "=", foreColor: [100, 85, 0],  names: ["a ring", "a jade ring", "a gold ring", "a silver ring"] },
  { category: ItemCategory.GOLD,   displayChar: "*", foreColor: [100, 85, 0],  names: ["gold pieces"] },
];

function randomFloorCell(state: GameState): { x: number; y: number } | null {
  const rng = state.rng;
  // Try random positions up to 200 times
  for (let attempt = 0; attempt < 200; attempt++) {
    const x = rng.range(1, DCOLS - 2);
    const y = rng.range(1, DROWS - 2);
    const tile = state.pmap[x]![y]!.layers[0]!;
    // Floor tiles: 2-5 (FLOOR variants)
    if (tile >= 2 && tile <= 5) {
      // Check no other item here
      const occupied = state.floorItems.some(it => it.x === x && it.y === y);
      if (!occupied && !(x === state.playerPos.x && y === state.playerPos.y)) {
        return { x, y };
      }
    }
  }
  return null;
}

/**
 * Spawn items on the floor during dungeon generation.
 * Simplified: spawns 3-8 random items per level.
 */
export function populateItems(state: GameState): void {
  const rng = state.rng;
  const depth = state.stats.depthLevel;
  const itemCount = rng.range(3, 5 + Math.min(depth, 5));

  state.floorItems = [];

  for (let i = 0; i < itemCount; i++) {
    const loc = randomFloorCell(state);
    if (!loc) continue;

    // Pick random item category, weighted
    const weights = [3, 6, 3, 2, 1, 1, 1, 4]; // food, potion(+heal), scroll, weapon, armor, staff, ring, gold
    let totalWeight = 0;
    for (const w of weights) totalWeight += w;
    let roll = rng.range(0, totalWeight - 1);
    let templateIdx = 0;
    for (let j = 0; j < weights.length; j++) {
      if (roll < weights[j]!) {
        templateIdx = j;
        break;
      }
      roll -= weights[j]!;
    }

    const template = ITEM_TEMPLATES[templateIdx]!;
    const nameIdx = rng.range(0, template.names.length - 1);

    const item: FloorItem = {
      x: loc.x,
      y: loc.y,
      category: template.category,
      kind: nameIdx,
      displayChar: template.displayChar,
      foreColor: [...template.foreColor],
      name: template.names[nameIdx]!,
      collected: false,
    };

    state.floorItems.push(item);
  }
}

/**
 * Pick up item at player's location (if any).
 * Returns the item picked up, or null.
 */
export function pickUpItem(state: GameState): FloorItem | null {
  const px = state.playerPos.x;
  const py = state.playerPos.y;

  for (const item of state.floorItems) {
    if (!item.collected && item.x === px && item.y === py) {
      item.collected = true;
      if (item.category === ItemCategory.GOLD) {
        const goldAmount = state.rng.range(5, 30) * state.stats.depthLevel;
        state.stats.gold += goldAmount;
        state.addMessage(`You pick up ${goldAmount} gold pieces.`);
      } else if (item.category === ItemCategory.POTION) {
        const healAmount = state.rng.range(8, 15);
        const oldHp = state.stats.hp;
        state.stats.hp = Math.min(state.stats.hp + healAmount, state.stats.maxHp);
        const healed = state.stats.hp - oldHp;
        if (healed > 0) {
          state.addMessage(`You drink ${item.name}. You feel better! (+${healed} HP)`);
        } else {
          state.addMessage(`You drink ${item.name}. It tastes refreshing.`);
        }
      } else if (item.category === ItemCategory.WEAPON) {
        const weaponDamage: Record<string, number> = {
          "a dagger": 2, "a sword": 4, "a broadsword": 6,
          "a mace": 5, "a war hammer": 7, "a spear": 4, "a war axe": 8,
        };
        const bonus = weaponDamage[item.name] ?? 3;
        if (!state.weapon || bonus > state.weapon.bonusDamage) {
          const old = state.weapon;
          state.weapon = { name: item.name, bonusDamage: bonus };
          if (old) {
            state.addMessage(`You swap your ${old.name} for ${item.name}. (+${bonus} damage)`);
          } else {
            state.addMessage(`You equip ${item.name}. (+${bonus} damage)`);
          }
        } else {
          state.addMessage(`You see ${item.name} but your ${state.weapon.name} is better.`);
        }
      } else if (item.category === ItemCategory.ARMOR) {
        const armorDef: Record<string, number> = {
          "leather armor": 2, "scale mail": 3, "chain mail": 4,
          "banded mail": 5, "plate armor": 7,
        };
        const def = armorDef[item.name] ?? 2;
        if (!state.armor || def > state.armor.defense) {
          const old = state.armor;
          state.armor = { name: item.name, defense: def };
          if (old) {
            state.addMessage(`You swap your ${old.name} for ${item.name}. (+${def} defense)`);
          } else {
            state.addMessage(`You don ${item.name}. (+${def} defense)`);
          }
        } else {
          state.addMessage(`You see ${item.name} but your ${state.armor.name} is better.`);
        }
      } else {
        state.addMessage(`You see ${item.name} here.`);
      }
      return item;
    }
  }
  return null;
}
