// Item system — spawn from catalog, display, pickup, equipment.
// Uses source-faithful data from catalogs/items.ts

import { DCOLS, DROWS } from "../shared/constants.ts";
import type { GameState } from "./state.ts";
import {
  foodTable, weaponTable, armorTable, potionTable, scrollTable,
  staffTable, ringTable, wandTable, type ItemTableEntry,
} from "./catalogs/items.ts";

export interface FloorItem {
  x: number;
  y: number;
  category: ItemCategory;
  kind: number;         // index into the category's table
  displayChar: string;
  foreColor: [number, number, number];
  name: string;
  enchantment: number;  // +1, +2, etc. for weapons/armor/rings
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

// Display characters and colors for each category
const CATEGORY_DISPLAY: Record<number, { char: string; color: [number, number, number] }> = {
  [ItemCategory.FOOD]:   { char: ":", color: [70, 35, 0] },
  [ItemCategory.POTION]: { char: "!", color: [100, 0, 100] },
  [ItemCategory.SCROLL]: { char: "?", color: [100, 100, 50] },
  [ItemCategory.WEAPON]: { char: ")", color: [100, 100, 100] },
  [ItemCategory.ARMOR]:  { char: "[", color: [70, 55, 25] },
  [ItemCategory.STAFF]:  { char: "/", color: [100, 80, 20] },
  [ItemCategory.WAND]:   { char: "~", color: [60, 60, 100] },
  [ItemCategory.RING]:   { char: "=", color: [100, 85, 0] },
  [ItemCategory.GOLD]:   { char: "*", color: [100, 85, 0] },
};

function getTable(category: ItemCategory): ItemTableEntry[] {
  switch (category) {
    case ItemCategory.FOOD: return foodTable;
    case ItemCategory.WEAPON: return weaponTable;
    case ItemCategory.ARMOR: return armorTable;
    case ItemCategory.POTION: return potionTable;
    case ItemCategory.SCROLL: return scrollTable;
    case ItemCategory.STAFF: return staffTable;
    case ItemCategory.WAND: return wandTable;
    case ItemCategory.RING: return ringTable;
    default: return [];
  }
}

function chooseKind(table: ItemTableEntry[], rng: { range: (a: number, b: number) => number }): number {
  // Weighted selection by frequency (matching BrogueCE chooseKind)
  let totalFreq = 0;
  for (const entry of table) totalFreq += entry.frequency;
  if (totalFreq <= 0) return rng.range(0, table.length - 1);

  let roll = rng.range(0, totalFreq - 1);
  for (let i = 0; i < table.length; i++) {
    if (roll < table[i]!.frequency) return i;
    roll -= table[i]!.frequency;
  }
  return 0;
}

function randomFloorCell(state: GameState): { x: number; y: number } | null {
  const rng = state.rng;
  for (let attempt = 0; attempt < 200; attempt++) {
    const x = rng.range(1, DCOLS - 2);
    const y = rng.range(1, DROWS - 2);
    const tile = state.pmap[x]![y]!.layers[0]!;
    if (tile >= 2 && tile <= 5) {
      const occupied = state.floorItems.some(it => it.x === x && it.y === y);
      if (!occupied && !(x === state.playerPos.x && y === state.playerPos.y)) {
        return { x, y };
      }
    }
  }
  return null;
}

function generateItem(category: ItemCategory, rng: { range: (a: number, b: number) => number }, depth: number): { kind: number; name: string; enchantment: number } {
  const table = getTable(category);
  if (table.length === 0) {
    return { kind: 0, name: category === ItemCategory.GOLD ? "gold pieces" : "unknown item", enchantment: 0 };
  }

  const kind = chooseKind(table, rng);
  const entry = table[kind]!;

  // Enchantment for weapons/armor/rings (depth-based)
  let enchantment = 0;
  if (category === ItemCategory.WEAPON || category === ItemCategory.ARMOR || category === ItemCategory.RING) {
    enchantment = rng.range(0, Math.min(3, Math.floor(depth / 4)));
    if (rng.range(0, 9) === 0) enchantment = -1; // cursed (10% chance)
  }

  let name = entry.name;
  if (enchantment > 0) name = `+${enchantment} ${name}`;
  else if (enchantment < 0) name = `${enchantment} ${name}`;

  return { kind, name, enchantment };
}

/**
 * Spawn items on the floor during dungeon generation.
 * Uses catalog data for item selection.
 */
export function populateItems(state: GameState): void {
  const rng = state.rng;
  const depth = state.stats.depthLevel;
  const itemCount = rng.range(4, 6 + Math.min(depth, 5));

  state.floorItems = [];

  // Guaranteed items per level
  const guaranteed: ItemCategory[] = [];
  guaranteed.push(ItemCategory.FOOD); // always food
  if (depth === 1) {
    guaranteed.push(ItemCategory.WEAPON);
  } else {
    guaranteed.push(rng.percent(60) ? ItemCategory.WEAPON : ItemCategory.ARMOR);
  }
  if (depth >= 2 && rng.percent(50)) {
    guaranteed.push(ItemCategory.ARMOR);
  }
  if (depth >= 3 && rng.percent(60)) {
    guaranteed.push(ItemCategory.FOOD);
  }

  for (const cat of guaranteed) {
    const loc = randomFloorCell(state);
    if (!loc) continue;
    const display = CATEGORY_DISPLAY[cat] ?? { char: "?", color: [100, 100, 100] as [number, number, number] };
    const gen = generateItem(cat, rng, depth);
    state.floorItems.push({
      x: loc.x, y: loc.y,
      category: cat, kind: gen.kind,
      displayChar: display.char, foreColor: [...display.color],
      name: gen.name, enchantment: gen.enchantment, collected: false,
    });
  }

  // Category weights for random items
  const categories: { cat: ItemCategory; weight: number }[] = [
    { cat: ItemCategory.FOOD, weight: 2 },
    { cat: ItemCategory.POTION, weight: 5 },
    { cat: ItemCategory.SCROLL, weight: 3 },
    { cat: ItemCategory.WEAPON, weight: 3 },
    { cat: ItemCategory.ARMOR, weight: 2 },
    { cat: ItemCategory.STAFF, weight: 1 },
    { cat: ItemCategory.WAND, weight: 1 },
    { cat: ItemCategory.RING, weight: 1 },
    { cat: ItemCategory.GOLD, weight: 4 },
  ];

  let totalWeight = 0;
  for (const c of categories) totalWeight += c.weight;

  for (let i = 0; i < itemCount; i++) {
    const loc = randomFloorCell(state);
    if (!loc) continue;

    let roll = rng.range(0, totalWeight - 1);
    let cat = ItemCategory.GOLD;
    for (const c of categories) {
      if (roll < c.weight) { cat = c.cat; break; }
      roll -= c.weight;
    }

    const display = CATEGORY_DISPLAY[cat] ?? { char: "?", color: [100, 100, 100] as [number, number, number] };
    const gen = generateItem(cat, rng, depth);

    state.floorItems.push({
      x: loc.x, y: loc.y,
      category: cat, kind: gen.kind,
      displayChar: display.char, foreColor: [...display.color],
      name: gen.name, enchantment: gen.enchantment, collected: false,
    });
  }
}

/**
 * Pick up item at player's location.
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
        // Use catalog data for effect
        const table = potionTable;
        const entry = table[item.kind];
        if (entry && entry.magicPolarity >= 0) {
          const healAmount = Math.max(5, entry.range.lowerBound > 0 ? Math.floor(entry.range.lowerBound / 3) : state.rng.range(8, 15));
          const oldHp = state.stats.hp;
          state.stats.hp = Math.min(state.stats.hp + healAmount, state.stats.maxHp);
          const healed = state.stats.hp - oldHp;
          if (healed > 0) {
            state.addMessage(`You drink a potion of ${entry.name}. (+${healed} HP)`);
          } else {
            state.addMessage(`You drink a potion of ${entry.name}.`);
          }
        } else {
          state.addMessage(`You drink a potion. It tastes strange.`);
        }

      } else if (item.category === ItemCategory.WEAPON) {
        const table = weaponTable;
        const entry = table[item.kind];
        const dmgRange = entry ? entry.range : { lowerBound: 3, upperBound: 5 };
        const bonusDamage = Math.floor((dmgRange.lowerBound + dmgRange.upperBound) / 4) + item.enchantment;
        if (!state.weapon || bonusDamage > state.weapon.bonusDamage) {
          const old = state.weapon;
          state.weapon = { name: item.name, bonusDamage };
          state.addMessage(old ? `You swap your ${old.name} for ${item.name}. (+${bonusDamage} dmg)` : `You equip ${item.name}. (+${bonusDamage} dmg)`);
        } else {
          state.addMessage(`You see ${item.name} but your ${state.weapon.name} is better.`);
        }

      } else if (item.category === ItemCategory.ARMOR) {
        const table = armorTable;
        const entry = table[item.kind];
        const def = entry ? Math.floor(entry.range.lowerBound / 10) + item.enchantment : 2 + item.enchantment;
        if (!state.armor || def > state.armor.defense) {
          const old = state.armor;
          state.armor = { name: item.name, defense: def };
          state.addMessage(old ? `You swap your ${old.name} for ${item.name}. (+${def} def)` : `You don ${item.name}. (+${def} def)`);
        } else {
          state.addMessage(`You see ${item.name} but your ${state.armor.name} is better.`);
        }

      } else if (item.category === ItemCategory.SCROLL) {
        const entry = scrollTable[item.kind];
        const effectName = entry?.name ?? "unknown";
        // Scrolls have varied effects
        if (effectName === "enchanting" && state.weapon) {
          state.weapon.bonusDamage += 2;
          state.addMessage(`You read a scroll of enchanting. Your ${state.weapon.name} glows! (+2 dmg)`);
        } else if (effectName === "enchanting" && state.armor) {
          state.armor.defense += 1;
          state.addMessage(`You read a scroll of enchanting. Your ${state.armor.name} shimmers! (+1 def)`);
        } else if (effectName === "strength" || effectName === "identify") {
          state.stats.strength++;
          state.stats.maxStrength++;
          state.addMessage(`You read a scroll of ${effectName}. You feel stronger! (+1 Str)`);
        } else if (effectName === "protect armor" && state.armor) {
          state.armor.defense += 1;
          state.addMessage(`You read a scroll of protection. Your ${state.armor.name} hardens! (+1 def)`);
        } else {
          const healAmt = state.rng.range(5, 10);
          state.stats.hp = Math.min(state.stats.hp + healAmt, state.stats.maxHp);
          state.addMessage(`You read a scroll of ${effectName}. (+${healAmt} HP)`);
        }

      } else if (item.category === ItemCategory.RING) {
        const entry = ringTable[item.kind];
        const effectName = entry?.name ?? "unknown";
        if (effectName === "regeneration") {
          state.stats.maxHp += 5;
          state.stats.hp += 5;
          state.addMessage(`You put on a ring of ${effectName}. (+5 max HP)`);
        } else if (effectName === "transference" || effectName === "reaping") {
          state.stats.strength++;
          state.stats.maxStrength++;
          state.addMessage(`You put on a ring of ${effectName}. (+1 Str)`);
        } else {
          state.stats.maxHp += 3;
          state.stats.hp += 3;
          state.addMessage(`You put on a ring of ${effectName}. (+3 max HP)`);
        }

      } else if (item.category === ItemCategory.STAFF || item.category === ItemCategory.WAND) {
        // Zap nearest visible monster
        let nearest: { monster: typeof state.monsters[0]; dist: number } | null = null;
        for (const m of state.monsters) {
          if (m.dead) continue;
          if (!(state.pmap[m.x]![m.y]!.flags & 0x2)) continue;
          const d = Math.abs(m.x - state.playerPos.x) + Math.abs(m.y - state.playerPos.y);
          if (!nearest || d < nearest.dist) nearest = { monster: m, dist: d };
        }
        const table = item.category === ItemCategory.STAFF ? staffTable : wandTable;
        const entry = table[item.kind];
        const zapName = entry?.name ?? "magic";
        if (nearest) {
          const zapDamage = state.rng.range(5, 15);
          nearest.monster.hp -= zapDamage;
          if (nearest.monster.hp <= 0) {
            nearest.monster.dead = true;
            state.stats.monstersKilled++;
            state.addMessage(`You zap a staff of ${zapName}! The ${nearest.monster.name} dies! (${zapDamage})`);
          } else {
            state.addMessage(`You zap a staff of ${zapName} at the ${nearest.monster.name}! (${zapDamage} dmg)`);
          }
        } else {
          state.addMessage(`You wave a staff of ${zapName} but nothing happens.`);
        }

      } else {
        state.addMessage(`You see ${item.name} here.`);
      }
      return item;
    }
  }
  return null;
}
