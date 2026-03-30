// Terrain interactions — ported from BrogueCE Time.c applyInstantTileEffectsToCreature
// Handles what happens when a creature steps on various terrain types.

import type { GameState } from "./state.ts";
import { tileCatalog } from "./catalogs/tiles.ts";

// Terrain flag checks
const T_IS_DEEP_WATER = 1 << 13;
const T_LAVA_INSTA_DEATH = 1 << 14;
const T_AUTO_DESCENT = 1 << 16;
const T_IS_FIRE = 1 << 11;
const T_IS_FLAMMABLE = 1 << 10;

/**
 * Apply instant terrain effects when the player steps on a tile.
 * Called after each player movement.
 */
export function applyTerrainEffectsToPlayer(state: GameState): void {
  if (state.gameOver) return;

  const px = state.playerPos.x;
  const py = state.playerPos.y;

  // Check all terrain layers at player position
  const cell = state.pmap[px]![py]!;
  const groundTile = cell.layers[0]!;
  const entry = tileCatalog[groundTile];
  if (!entry) return;

  const flags = entry.flags;

  // Lava: instant death (unless levitating or fire immune)
  if (flags & T_LAVA_INSTA_DEATH) {
    state.gameOver = true;
    state.victory = false;
    state.addMessage(`You plunge into ${entry.description}! The heat is unbearable.`);
    state.stats.hp = 0;
    return;
  }

  // Chasm / hole: auto-descent
  if (flags & T_AUTO_DESCENT) {
    state.stats.depthLevel++;
    state.stats.deepestLevel = Math.max(state.stats.deepestLevel, state.stats.depthLevel);
    state.addMessage(`You plunge downward into ${entry.description}!`);
    // The engine will need to regenerate the level after this
    return;
  }

  // Deep water: message warning
  if (flags & T_IS_DEEP_WATER) {
    state.addMessage("The water is deep here. You struggle to stay afloat.");
    // In full BrogueCE, this would drain nutrition faster and prevent item pickup
  }

  // Fire: take damage
  if (flags & T_IS_FIRE) {
    const fireDmg = state.rng.range(3, 7);
    state.stats.hp -= fireDmg;
    state.addMessage(`You are burned! (${fireDmg} damage)`);
    if (state.stats.hp <= 0) {
      state.stats.hp = 0;
      state.gameOver = true;
      state.victory = false;
      state.addMessage("You burn to death!");
    }
  }
}

/**
 * Populate a cost map for Dijkstra pathfinding.
 * Ported from BrogueCE Movement.c populateGenericCostMap / populateCreatureCostMap.
 */
export function populateCostMap(state: GameState, costMap: number[][], forPlayer: boolean): void {
  const { DCOLS, DROWS } = require("../shared/constants.ts") as typeof import("../shared/constants.ts");
  const PDS_FORBIDDEN = -1;
  const PDS_OBSTRUCTION = -2;

  for (let i = 0; i < DCOLS; i++) {
    for (let j = 0; j < DROWS; j++) {
      const tile = state.pmap[i]![j]!.layers[0]!;
      const entry = tileCatalog[tile];
      if (!entry) { costMap[i]![j] = PDS_OBSTRUCTION; continue; }

      const flags = entry.flags;

      // Undiscovered cells are obstacles for the player
      if (forPlayer && !(state.pmap[i]![j]!.flags & 0x1)) {
        costMap[i]![j] = PDS_OBSTRUCTION;
        continue;
      }

      // Walls and other passability blockers
      if (flags & (1 << 0)) { // T_OBSTRUCTS_PASSABILITY
        costMap[i]![j] = (flags & (1 << 8)) ? PDS_OBSTRUCTION : PDS_FORBIDDEN; // diagonal vs forbidden
        continue;
      }

      // Lava: forbidden unless fire immune
      if (flags & T_LAVA_INSTA_DEATH) {
        costMap[i]![j] = PDS_FORBIDDEN;
        continue;
      }

      // Deep water: forbidden for non-swimmers
      if (flags & T_IS_DEEP_WATER) {
        costMap[i]![j] = PDS_FORBIDDEN;
        continue;
      }

      // Chasm: forbidden
      if (flags & T_AUTO_DESCENT) {
        costMap[i]![j] = PDS_FORBIDDEN;
        continue;
      }

      costMap[i]![j] = 1; // normal traversal cost
    }
  }
}

/**
 * Get the terrain description at a position.
 */
export function terrainDescription(state: GameState, x: number, y: number): string {
  const tile = state.pmap[x]![y]!.layers[0]!;
  const entry = tileCatalog[tile];
  return entry?.description ?? "the ground";
}

/**
 * Check if a tile is passable for walking.
 * Used by movement to determine valid move targets.
 */
export function tileIsPassable(tileType: number): boolean {
  const entry = tileCatalog[tileType];
  if (!entry) return false;
  // Passable if not obstructing passability
  return !(entry.flags & (1 << 0)); // T_OBSTRUCTS_PASSABILITY
}

/**
 * Check if a tile blocks vision.
 */
export function tileBlocksVision(tileType: number): boolean {
  const entry = tileCatalog[tileType];
  if (!entry) return true;
  return !!(entry.flags & (1 << 3)); // T_OBSTRUCTS_VISION
}

/**
 * Check if a tile is flammable.
 */
export function tileIsFlammable(tileType: number): boolean {
  const entry = tileCatalog[tileType];
  if (!entry) return false;
  return !!(entry.flags & T_IS_FLAMMABLE);
}
