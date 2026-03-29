// Lighting system — ported from BrogueCE Light.c
// Handles light painting, miner's light, and display detail updates.

import { DCOLS, DROWS } from "../shared/constants.ts";
import type { Color } from "../shared/types.ts";
import type { GameState } from "./state.ts";
import { getFOVMask } from "./fov.ts";

// Simplified lightSource type
export interface LightSource {
  lightColor: Color;
  lightRadius: { lowerBound: number; upperBound: number; clumpFactor: number };
  radialFadeToPercent: number;
  passThroughCreatures: boolean;
}

const IS_IN_SHADOW = 0x4; // cell flag

/**
 * Paint a single light source onto the tmap light grid.
 * Uses RNG for color randomization — call order must match C.
 */
export function paintLight(
  state: GameState,
  theLight: LightSource,
  x: number, y: number,
  _isMinersLight: boolean,
  maintainShadows: boolean,
): boolean {
  const rng = state.rng;

  // Randomize light radius
  const radiusRaw = rng.clumpedRange(
    theLight.lightRadius.lowerBound,
    theLight.lightRadius.upperBound,
    theLight.lightRadius.clumpFactor,
  );
  const radius = Math.max(1, Math.round(radiusRaw));

  // Randomize color components (3 RNG calls, matching C order)
  const randComponent = rng.range(0, theLight.lightColor.rand);
  const colorComponents: [number, number, number] = [
    randComponent + theLight.lightColor.red + rng.range(0, theLight.lightColor.redRand),
    randComponent + theLight.lightColor.green + rng.range(0, theLight.lightColor.greenRand),
    randComponent + theLight.lightColor.blue + rng.range(0, theLight.lightColor.blueRand),
  ];

  const dispelShadows = !maintainShadows &&
    (colorComponents[0] + colorComponents[1] + colorComponents[2]) > 0;

  const fadeToPercent = theLight.radialFadeToPercent;

  // Build FOV mask for this light
  const grid: number[][] = Array.from({ length: DCOLS }, () => new Array(DROWS).fill(0));
  getFOVMask(grid, state, x, y, radius);

  let overlappedFieldOfView = false;

  for (let i = Math.max(0, x - radius); i < DCOLS && i < x + radius; i++) {
    for (let j = Math.max(0, y - radius); j < DROWS && j < y + radius; j++) {
      if (grid[i]![j]) {
        const distSq = (i - x) * (i - x) + (j - y) * (j - y);
        const distFrac = Math.sqrt(distSq) / radius;
        const lightMultiplier = Math.max(0, Math.round(100 - (100 - fadeToPercent) * distFrac));

        const tCell = state.tmap[i]![j]!;
        tCell.light[0] += Math.round(colorComponents[0] * lightMultiplier / 100);
        tCell.light[1] += Math.round(colorComponents[1] * lightMultiplier / 100);
        tCell.light[2] += Math.round(colorComponents[2] * lightMultiplier / 100);

        if (dispelShadows) {
          state.pmap[i]![j]!.flags &= ~IS_IN_SHADOW;
        }

        // Check if in player's field of view
        if (state.pmap[i]![j]!.flags & 0x2) { // VISIBLE flag
          overlappedFieldOfView = true;
        }
      }
    }
  }

  // Light the source cell itself at full strength
  const srcCell = state.tmap[x]![y]!;
  srcCell.light[0] += colorComponents[0];
  srcCell.light[1] += colorComponents[1];
  srcCell.light[2] += colorComponents[2];

  if (dispelShadows) {
    state.pmap[x]![y]!.flags &= ~IS_IN_SHADOW;
  }

  return overlappedFieldOfView;
}

/**
 * Record current light values as old light values (for smooth transitions).
 */
function recordOldLights(state: GameState): void {
  for (let i = 0; i < DCOLS; i++) {
    for (let j = 0; j < DROWS; j++) {
      const t = state.tmap[i]![j]!;
      t.oldLight[0] = t.light[0];
      t.oldLight[1] = t.light[1];
      t.oldLight[2] = t.light[2];
    }
  }
}

/**
 * Update the lighting for the entire level.
 * Paints the miner's light centered on the player.
 */
export function updateLighting(state: GameState): void {
  // Copy light → oldLight
  recordOldLights(state);

  // Zero out light and mark all cells as in shadow
  for (let i = 0; i < DCOLS; i++) {
    for (let j = 0; j < DROWS; j++) {
      const t = state.tmap[i]![j]!;
      t.light[0] = 0;
      t.light[1] = 0;
      t.light[2] = 0;
      state.pmap[i]![j]!.flags |= IS_IN_SHADOW;
    }
  }

  // TODO: Paint glowing tiles from tileCatalog[tile].glowLight
  // TODO: Paint creature lights (intrinsicLightType, burning, telepathy)

  // Paint miner's light at player position
  const minersLight: LightSource = {
    lightColor: { red: 100, green: 90, blue: 60, redRand: 0, greenRand: 0, blueRand: 0, rand: 0, colorDances: false },
    lightRadius: { lowerBound: 7, upperBound: 7, clumpFactor: 1 },
    radialFadeToPercent: 35,
    passThroughCreatures: true,
  };

  paintLight(state, minersLight, state.playerPos.x, state.playerPos.y, true, true);

  // Update display detail
  updateDisplayDetail(state);
}

// DV_DARK = 1, DV_UNLIT = 2, DV_LIT = 3
function updateDisplayDetail(state: GameState): void {
  if (!state.displayDetail) {
    state.displayDetail = Array.from({ length: DCOLS }, () => new Array(DROWS).fill(0));
  }
  for (let i = 0; i < DCOLS; i++) {
    for (let j = 0; j < DROWS; j++) {
      const t = state.tmap[i]![j]!;
      if (t.light[0] < -10 && t.light[1] < -10 && t.light[2] < -10) {
        state.displayDetail[i]![j] = 1; // DV_DARK
      } else if (state.pmap[i]![j]!.flags & IS_IN_SHADOW) {
        state.displayDetail[i]![j] = 2; // DV_UNLIT
      } else {
        state.displayDetail[i]![j] = 3; // DV_LIT
      }
    }
  }
}

/**
 * Check if the player is in darkness (light < miner's light base color).
 */
export function playerInDarkness(state: GameState): boolean {
  const t = state.tmap[state.playerPos.x]![state.playerPos.y]!;
  return t.light[0] + 10 < 100 && t.light[1] + 10 < 90 && t.light[2] + 10 < 60;
}
