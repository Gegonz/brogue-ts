// Inventory system — ported from BrogueCE Items.c
// Pack management: add, remove, list, equip, use items.

import type { GameState } from "./state.ts";
import { ItemCategory, type FloorItem } from "./items.ts";

export interface PackItem {
  category: ItemCategory;
  kind: number;
  name: string;
  displayChar: string;
  foreColor: [number, number, number];
  enchantment: number;
  inventoryLetter: string;  // a-z
  quantity: number;
  identified: boolean;
  equipped: boolean;
  // Weapon stats (if weapon)
  damage?: { min: number; max: number; clump: number };
  // Armor stats (if armor)
  defense?: number;
}

const MAX_PACK_ITEMS = 26; // a-z

/**
 * Find the next available inventory letter.
 */
function nextAvailableLetter(state: GameState): string | null {
  const used = new Set(state.packItems.map(i => i.inventoryLetter));
  for (let c = 97; c <= 122; c++) { // a-z
    const letter = String.fromCharCode(c);
    if (!used.has(letter)) return letter;
  }
  return null;
}

/**
 * Add an item to the player's pack.
 * Returns the pack item, or null if pack is full.
 */
export function addItemToPack(state: GameState, floorItem: FloorItem): PackItem | null {
  // Check if stackable (food, potions, scrolls)
  if (floorItem.category === ItemCategory.FOOD ||
      floorItem.category === ItemCategory.POTION ||
      floorItem.category === ItemCategory.SCROLL) {
    for (const existing of state.packItems) {
      if (existing.category === floorItem.category && existing.kind === floorItem.kind) {
        existing.quantity++;
        return existing;
      }
    }
  }

  // Pack full?
  if (state.packItems.length >= MAX_PACK_ITEMS) {
    state.addMessage("Your pack is full!");
    return null;
  }

  const letter = nextAvailableLetter(state);
  if (!letter) {
    state.addMessage("Your pack is full!");
    return null;
  }

  const packItem: PackItem = {
    category: floorItem.category,
    kind: floorItem.kind,
    name: floorItem.name,
    displayChar: floorItem.displayChar,
    foreColor: [...floorItem.foreColor],
    enchantment: floorItem.enchantment,
    inventoryLetter: letter,
    quantity: 1,
    identified: false,
    equipped: false,
  };

  // Copy weapon damage if applicable
  if (floorItem.category === ItemCategory.WEAPON) {
    const { weaponTable } = require("./catalogs/items.ts") as typeof import("./catalogs/items.ts");
    const entry = weaponTable[floorItem.kind];
    if (entry) {
      packItem.damage = {
        min: entry.range.lowerBound,
        max: entry.range.upperBound,
        clump: entry.range.clumpFactor,
      };
    }
  }

  // Copy armor defense if applicable
  if (floorItem.category === ItemCategory.ARMOR) {
    const { armorTable } = require("./catalogs/items.ts") as typeof import("./catalogs/items.ts");
    const entry = armorTable[floorItem.kind];
    if (entry) {
      packItem.defense = Math.floor(entry.range.lowerBound / 10) + floorItem.enchantment;
    }
  }

  // Insert sorted by category
  let insertIdx = state.packItems.length;
  for (let i = 0; i < state.packItems.length; i++) {
    if (state.packItems[i]!.category > packItem.category) {
      insertIdx = i;
      break;
    }
  }
  state.packItems.splice(insertIdx, 0, packItem);

  return packItem;
}

/**
 * Remove an item from the pack by inventory letter.
 */
export function removeFromPack(state: GameState, letter: string): PackItem | null {
  const idx = state.packItems.findIndex(i => i.inventoryLetter === letter);
  if (idx === -1) return null;
  return state.packItems.splice(idx, 1)[0] ?? null;
}

/**
 * Get a pack item by inventory letter.
 */
export function getPackItem(state: GameState, letter: string): PackItem | null {
  return state.packItems.find(i => i.inventoryLetter === letter) ?? null;
}

/**
 * Count items in the pack.
 */
export function numberOfItemsInPack(state: GameState): number {
  let count = 0;
  for (const item of state.packItems) {
    count += item.quantity;
  }
  return count;
}

/**
 * Get the inventory as a formatted string list.
 */
export function inventoryDescription(state: GameState): string[] {
  if (state.packItems.length === 0) return ["Your pack is empty."];

  const lines: string[] = [];
  let lastCategory = -1;

  const categoryNames: Record<number, string> = {
    [ItemCategory.FOOD]: "Food",
    [ItemCategory.POTION]: "Potions",
    [ItemCategory.SCROLL]: "Scrolls",
    [ItemCategory.WEAPON]: "Weapons",
    [ItemCategory.ARMOR]: "Armor",
    [ItemCategory.STAFF]: "Staves",
    [ItemCategory.WAND]: "Wands",
    [ItemCategory.RING]: "Rings",
    [ItemCategory.GOLD]: "Gold",
  };

  for (const item of state.packItems) {
    if (item.category !== lastCategory) {
      if (lines.length > 0) lines.push("");
      lines.push(`--- ${categoryNames[item.category] ?? "Other"} ---`);
      lastCategory = item.category;
    }

    let desc = `${item.inventoryLetter}) ${item.displayChar} ${item.name}`;
    if (item.quantity > 1) desc += ` (x${item.quantity})`;
    if (item.equipped) desc += " [equipped]";
    lines.push(desc);
  }

  return lines;
}
