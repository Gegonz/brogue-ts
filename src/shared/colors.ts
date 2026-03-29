// =============================================================================
// colors.ts
// All color constants ported from BrogueCE GlobalsBase.c and Globals.c
// =============================================================================

import type { Color } from './types.ts';

// Helper to construct a Color object
function color(
    red: number, green: number, blue: number,
    redRand: number, greenRand: number, blueRand: number,
    rand: number, colorDances: boolean,
): Color {
    return { red, green, blue, redRand, greenRand, blueRand, rand, colorDances };
}

// =============================================================================
// Base colors (from GlobalsBase.c)
// =============================================================================

export const white:         Color = color(100, 100, 100, 0, 0, 0, 0, false);
export const gray:          Color = color(50,  50,  50,  0, 0, 0, 0, false);
export const darkGray:      Color = color(30,  30,  30,  0, 0, 0, 0, false);
export const veryDarkGray:  Color = color(15,  15,  15,  0, 0, 0, 0, false);
export const black:         Color = color(0,   0,   0,   0, 0, 0, 0, false);
export const yellow:        Color = color(100, 100, 0,   0, 0, 0, 0, false);
export const darkYellow:    Color = color(50,  50,  0,   0, 0, 0, 0, false);
export const teal:          Color = color(30,  100, 100, 0, 0, 0, 0, false);
export const purple:        Color = color(100, 0,   100, 0, 0, 0, 0, false);
export const darkPurple:    Color = color(50,  0,   50,  0, 0, 0, 0, false);
export const brown:         Color = color(60,  40,  0,   0, 0, 0, 0, false);
export const green:         Color = color(0,   100, 0,   0, 0, 0, 0, false);
export const darkGreen:     Color = color(0,   50,  0,   0, 0, 0, 0, false);
export const orange:        Color = color(100, 50,  0,   0, 0, 0, 0, false);
export const darkOrange:    Color = color(50,  25,  0,   0, 0, 0, 0, false);
export const blue:          Color = color(0,   0,   100, 0, 0, 0, 0, false);
export const darkBlue:      Color = color(0,   0,   50,  0, 0, 0, 0, false);
export const darkTurquoise: Color = color(0,   40,  65,  0, 0, 0, 0, false);
export const lightBlue:     Color = color(40,  40,  100, 0, 0, 0, 0, false);
export const pink:          Color = color(100, 60,  66,  0, 0, 0, 0, false);
export const darkPink:      Color = color(50,  30,  33,  0, 0, 0, 0, false);
export const red:           Color = color(100, 0,   0,   0, 0, 0, 0, false);
export const darkRed:       Color = color(50,  0,   0,   0, 0, 0, 0, false);
export const tanColor:      Color = color(80,  67,  15,  0, 0, 0, 0, false);
export const rainbow:       Color = color(-70, -70, -70, 170, 170, 170, 0, true);

// =============================================================================
// Bolt colors (from Globals.c)
// =============================================================================

export const descentBoltColor:      Color = color(-40, -40, -40,  0,  0,  80, 80, true);
export const discordColor:          Color = color(25,  0,   25,   66, 0,  0,  0,  true);
export const poisonColor:           Color = color(0,   0,   0,    10, 50, 10, 0,  true);
export const beckonColor:           Color = color(10,  10,  10,   5,  5,  5,  50, true);
export const invulnerabilityColor:  Color = color(25,  0,   25,   0,  0,  66, 0,  true);
export const fireBoltColor:         Color = color(500, 150, 0,    45, 30, 0,  0,  true);
export const yendorLightColor:      Color = color(50,  -100, 30,  0,  0,  0,  0,  true);
export const flamedancerCoronaColor: Color = color(500, 150, 100, 45, 30, 0,  0,  true);

// =============================================================================
// Tile colors (from Globals.c)
// =============================================================================

export const undiscoveredColor:     Color = color(0,   0,   0,   0,  0,  0,  0,  false);

export const wallForeColor:         Color = color(7,   7,   7,   3,  3,  3,  0,  false);
export const wallBackColorStart:    Color = color(45,  40,  40,  15, 0,  5,  20, false);
export const wallBackColorEnd:      Color = color(40,  30,  35,  0,  20, 30, 20, false);

export const mudWallForeColor:      Color = color(55,  45,  0,   5,  5,  5,  1,  false);
export const mudWallBackColor:      Color = color(20,  12,  3,   8,  4,  3,  0,  false);

export const graniteBackColor:      Color = color(10,  10,  10,  0,  0,  0,  0,  false);

export const floorForeColor:        Color = color(30,  30,  30,  0,  0,  0,  35, false);

export const floorBackColorStart:   Color = color(2,   2,   10,  2,  2,  0,  0,  false);
export const floorBackColorEnd:     Color = color(5,   5,   5,   2,  2,  0,  0,  false);

export const stairsBackColor:       Color = color(15,  15,  5,   0,  0,  0,  0,  false);
export const firstStairsBackColor:  Color = color(10,  10,  25,  0,  0,  0,  0,  false);

export const refuseBackColor:       Color = color(6,   5,   3,   2,  2,  0,  0,  false);
export const rubbleBackColor:       Color = color(7,   7,   8,   2,  2,  1,  0,  false);
export const bloodflowerForeColor:  Color = color(30,  5,   40,  5,  1,  3,  0,  false);
export const bloodflowerPodForeColor: Color = color(50, 5,  25,  5,  1,  3,  0,  false);
export const bloodflowerBackColor:  Color = color(15,  3,   10,  3,  1,  3,  0,  false);
export const bedrollBackColor:      Color = color(10,  8,   5,   1,  1,  0,  0,  false);

export const obsidianBackColor:     Color = color(6,   0,   8,   2,  0,  3,  0,  false);
export const carpetForeColor:       Color = color(23,  30,  38,  0,  0,  0,  0,  false);
export const carpetBackColor:       Color = color(15,  8,   5,   0,  0,  0,  0,  false);
export const marbleForeColor:       Color = color(30,  23,  38,  0,  0,  0,  0,  false);
export const marbleBackColor:       Color = color(6,   5,   13,  1,  0,  1,  0,  false);
export const doorForeColor:         Color = color(70,  35,  15,  0,  0,  0,  0,  false);
export const doorBackColor:         Color = color(30,  10,  5,   0,  0,  0,  0,  false);
export const ironDoorForeColor:     Color = color(500, 500, 500, 0,  0,  0,  0,  false);
export const ironDoorBackColor:     Color = color(15,  15,  30,  0,  0,  0,  0,  false);
export const bridgeFrontColor:      Color = color(33,  12,  12,  12, 7,  2,  0,  false);
export const bridgeBackColor:       Color = color(12,  3,   2,   3,  2,  1,  0,  false);
export const statueBackColor:       Color = color(20,  20,  20,  0,  0,  0,  0,  false);
export const glyphColor:            Color = color(20,  5,   5,   50, 0,  0,  0,  true);
export const glyphLightColor:       Color = color(150, 0,   0,   150, 0, 0,  0,  true);
export const sacredGlyphColor:      Color = color(5,   20,  5,   0,  50, 0,  0,  true);
export const sacredGlyphLightColor: Color = color(45,  150, 60,  25, 80, 25, 0,  true);

export const minersLightStartColor: Color = color(180, 180, 180, 0,  0,  0,  0,  false);
export const minersLightEndColor:   Color = color(90,  90,  120, 0,  0,  0,  0,  false);
export const torchColor:            Color = color(150, 75,  30,  0,  30, 20, 0,  true);

// Water colors
export const deepWaterForeColor:        Color = color(5,  8,  20, 0, 4,  15, 10, true);
export const deepWaterBackColorStart:   Color = color(5,  10, 31, 5, 5,  5,  6,  true);
export const deepWaterBackColorEnd:     Color = color(5,  8,  20, 2, 3,  5,  5,  true);
export const shallowWaterForeColor:     Color = color(28, 28, 60, 0, 0,  10, 10, true);
export const shallowWaterBackColorStart: Color = color(20, 20, 60, 0, 0, 10, 10, true);
export const shallowWaterBackColorEnd:  Color = color(12, 15, 40, 0, 0,  5,  5,  true);

export const mudForeColor:          Color = color(18,  14,  5,   5,  5,  0,  0,  false);
export const mudBackColor:          Color = color(23,  17,  7,   5,  5,  0,  0,  false);
export const chasmForeColor:        Color = color(7,   7,   15,  4,  4,  8,  0,  false);
export const chasmEdgeBackColorStart: Color = color(5,  5,  25,  2,  2,  2,  0,  false);
export const chasmEdgeBackColorEnd: Color = color(8,   8,   20,  2,  2,  2,  0,  false);
export const fireForeColor:         Color = color(70,  20,  0,   15, 10, 0,  0,  true);
export const lavaForeColor:         Color = color(20,  20,  20,  100, 10, 0, 0,  true);
export const brimstoneForeColor:    Color = color(100, 50,  10,  0,  50, 40, 0,  true);
export const brimstoneBackColor:    Color = color(18,  12,  9,   0,  0,  5,  0,  false);

export const lavaBackColor:         Color = color(70,  20,  0,   15, 10, 0,  0,  true);
export const acidBackColor:         Color = color(15,  80,  25,  5,  15, 10, 0,  true);

export const lightningColor:        Color = color(100, 150, 500, 50, 50, 0,  50, true);
export const fungusLightColor:      Color = color(2,   11,  11,  4,  3,  3,  0,  true);
export const lavaLightColor:        Color = color(47,  13,  0,   10, 7,  0,  0,  true);
export const deepWaterLightColor:   Color = color(10,  30,  100, 0,  30, 100, 0, true);

// Vegetation colors
export const grassColor:            Color = color(15,  40,  15,  15, 50, 15, 10, false);
export const deadGrassColor:        Color = color(20,  13,  0,   20, 10, 5,  10, false);
export const fungusColor:           Color = color(15,  50,  50,  0,  25, 0,  30, true);
export const grayFungusColor:       Color = color(30,  30,  30,  5,  5,  5,  10, false);
export const foliageColor:          Color = color(25,  100, 25,  15, 0,  15, 0,  false);
export const deadFoliageColor:      Color = color(20,  13,  0,   30, 15, 0,  20, false);
export const lichenColor:           Color = color(50,  5,   25,  10, 0,  5,  0,  true);
export const hayColor:              Color = color(70,  55,  5,   0,  20, 20, 0,  false);
export const ashForeColor:          Color = color(20,  20,  20,  0,  0,  0,  20, false);
export const bonesForeColor:        Color = color(80,  80,  30,  5,  5,  35, 5,  false);
export const ectoplasmColor:        Color = color(45,  20,  55,  25, 0,  25, 5,  false);
export const forceFieldColor:       Color = color(0,   25,  25,  0,  25, 25, 0,  true);
export const wallCrystalColor:      Color = color(40,  40,  60,  20, 20, 40, 0,  true);
export const altarForeColor:        Color = color(5,   7,   9,   0,  0,  0,  0,  false);
export const altarBackColor:        Color = color(35,  18,  18,  0,  0,  0,  0,  false);
export const greenAltarBackColor:   Color = color(18,  25,  18,  0,  0,  0,  0,  false);
export const goldAltarBackColor:    Color = color(25,  24,  12,  0,  0,  0,  0,  false);
export const pedestalBackColor:     Color = color(10,  5,   20,  0,  0,  0,  0,  false);

// =============================================================================
// Monster colors (from Globals.c)
// =============================================================================

export const goblinColor:           Color = color(44,  33,  22,  0,  0,  0,  0,  false);
export const jackalColor:           Color = color(60,  42,  27,  0,  0,  0,  0,  false);
export const ogreColor:             Color = color(60,  25,  25,  0,  0,  0,  0,  false);
export const eelColor:              Color = color(30,  12,  12,  0,  0,  0,  0,  false);
export const goblinConjurerColor:   Color = color(67,  10,  100, 0,  0,  0,  0,  false);
export const spectralBladeColor:    Color = color(15,  15,  60,  0,  0,  70, 50, true);
export const spectralImageColor:    Color = color(13,  0,   0,   25, 0,  0,  0,  true);
export const toadColor:             Color = color(40,  65,  30,  0,  0,  0,  0,  false);
export const trollColor:            Color = color(40,  60,  15,  0,  0,  0,  0,  false);
export const centipedeColor:        Color = color(75,  25,  85,  0,  0,  0,  0,  false);
export const dragonColor:           Color = color(20,  80,  15,  0,  0,  0,  0,  false);
export const krakenColor:           Color = color(100, 55,  55,  0,  0,  0,  0,  false);
export const salamanderColor:       Color = color(40,  10,  0,   8,  5,  0,  0,  true);
export const pixieColor:            Color = color(60,  60,  60,  40, 40, 40, 0,  true);
export const darPriestessColor:     Color = color(0,   50,  50,  0,  0,  0,  0,  false);
export const darMageColor:          Color = color(50,  50,  0,   0,  0,  0,  0,  false);
export const wraithColor:           Color = color(66,  66,  25,  0,  0,  0,  0,  false);
export const pinkJellyColor:        Color = color(100, 40,  40,  5,  5,  5,  20, true);
export const wormColor:             Color = color(80,  60,  40,  0,  0,  0,  0,  false);
export const sentinelColor:         Color = color(3,   3,   30,  0,  0,  10, 0,  true);
export const goblinMysticColor:     Color = color(10,  67,  100, 0,  0,  0,  0,  false);
export const ifritColor:            Color = color(50,  10,  100, 75, 0,  20, 0,  true);
export const phoenixColor:          Color = color(100, 0,   0,   0,  100, 0, 0,  true);

// =============================================================================
// Light colors (from Globals.c)
// =============================================================================

export const torchLightColor:       Color = color(75,  38,  15,  0,  15, 7,  0,  true);
export const hauntedTorchColor:     Color = color(75,  20,  40,  30, 10, 0,  0,  true);
export const hauntedTorchLightColor: Color = color(67, 10,  10,  20, 4,  0,  0,  true);
export const ifritLightColor:       Color = color(0,   10,  150, 100, 0, 100, 0, true);
export const unicornLightColor:     Color = color(-50, -50, -50, 250, 250, 250, 0, true);
export const wispLightColor:        Color = color(75,  100, 250, 33, 10, 0,  0,  true);
export const summonedImageLightColor: Color = color(200, 0,  75,  0,  0,  0,  0,  true);
export const spectralBladeLightColor: Color = color(40, 0,  230, 0,  0,  0,  0,  true);
export const ectoplasmLightColor:   Color = color(23,  10,  28,  13, 0,  13, 3,  false);
export const explosionColor:        Color = color(10,  8,   2,   0,  2,  2,  0,  true);
export const explosiveAuraColor:    Color = color(2000, 0,  -1000, 200, 200, 0, 0, true);
export const sacrificeTargetColor:  Color = color(100, -100, -300, 0, 100, 100, 0, true);
export const dartFlashColor:        Color = color(500, 500, 500, 0,  2,  2,  0,  true);
export const lichLightColor:        Color = color(-50, 80,  30,  0,  0,  20, 0,  true);
export const forceFieldLightColor:  Color = color(10,  10,  10,  0,  50, 50, 0,  true);
export const crystalWallLightColor: Color = color(10,  10,  10,  0,  0,  50, 0,  true);
export const sunLightColor:         Color = color(100, 100, 75,  0,  0,  0,  0,  false);
export const fungusForestLightColor: Color = color(30, 40,  60,  0,  0,  0,  40, true);
export const fungusTrampledLightColor: Color = color(10, 10, 10, 0,  50, 50, 0,  true);
export const redFlashColor:         Color = color(100, 10,  10,  0,  0,  0,  0,  false);
export const darknessPatchColor:    Color = color(-10, -10, -10, 0,  0,  0,  0,  false);
export const darknessCloudColor:    Color = color(-20, -20, -20, 0,  0,  0,  0,  false);
export const magicMapFlashColor:    Color = color(60,  20,  60,  0,  0,  0,  0,  false);
export const sentinelLightColor:    Color = color(20,  20,  120, 10, 10, 60, 0,  true);
export const telepathyColor:        Color = color(30,  30,  130, 0,  0,  0,  0,  false);
export const confusionLightColor:   Color = color(10,  10,  10,  10, 10, 10, 0,  true);
export const portalActivateLightColor: Color = color(300, 400, 500, 0, 0, 0, 0,  true);
export const descentLightColor:     Color = color(20,  20,  70,  0,  0,  0,  0,  false);
export const algaeBlueLightColor:   Color = color(20,  15,  50,  0,  0,  0,  0,  false);
export const algaeGreenLightColor:  Color = color(15,  50,  20,  0,  0,  0,  0,  false);

// =============================================================================
// Flare colors (from Globals.c)
// =============================================================================

export const scrollProtectionColor: Color = color(375, 750, 0,   0,  0,  0,  0,  true);
export const scrollEnchantmentColor: Color = color(250, 225, 300, 0,  0,  450, 0, true);
export const potionStrengthColor:   Color = color(1000, 0,  400, 600, 0,  0,  0,  true);
export const empowermentFlashColor: Color = color(500, 1000, 600, 0,  500, 0, 0,  true);
export const genericFlashColor:     Color = color(800, 800, 800, 0,  0,  0,  0,  false);
export const summoningFlashColor:   Color = color(0,   0,   0,   600, 0, 1200, 0, true);
export const fireFlashColor:        Color = color(750, 225, 0,   100, 50, 0,  0,  true);
export const explosionFlareColor:   Color = color(10000, 6000, 1000, 0, 0, 0, 0,  false);
export const quietusFlashColor:     Color = color(0,   -1000, -200, 0, 0, 0,  0,  true);
export const slayingFlashColor:     Color = color(-1000, -200, 0,  0,  0,  0,  0,  true);

// =============================================================================
// Color multipliers (from Globals.c)
// =============================================================================

export const colorDim25:            Color = color(25,  25,  25,  25,  25,  25,  25, false);
export const colorMultiplier100:    Color = color(100, 100, 100, 100, 100, 100, 100, false);
export const memoryColor:           Color = color(25,  25,  50,  20,  20,  20,  0,  false);
export const memoryOverlay:         Color = color(25,  25,  50,  0,   0,   0,   0,  false);
export const magicMapColor:         Color = color(60,  20,  60,  60,  20,  60,  0,  false);
export const clairvoyanceColor:     Color = color(50,  90,  50,  50,  90,  50,  66, false);
export const telepathyMultiplier:   Color = color(30,  30,  130, 30,  30,  130, 66, false);
export const omniscienceColor:      Color = color(140, 100, 60,  140, 100, 60,  90, false);
export const basicLightColor:       Color = color(180, 180, 180, 180, 180, 180, 180, false);

// =============================================================================
// Blood colors (from Globals.c)
// =============================================================================

export const humanBloodColor:       Color = color(60,  20,  10,  15, 0,   0,   15, false);
export const insectBloodColor:      Color = color(10,  60,  20,  0,  15,  0,   15, false);
export const vomitColor:            Color = color(60,  50,  5,   0,  15,  15,  0,  false);
export const urineColor:            Color = color(70,  70,  40,  0,  0,   0,   10, false);
export const methaneColor:          Color = color(45,  60,  15,  0,  0,   0,   0,  false);

// =============================================================================
// Gas colors (from Globals.c)
// =============================================================================

export const poisonGasColor:        Color = color(75,  25,  85,  0,  0,   0,   0,  false);
export const confusionGasColor:     Color = color(60,  60,  60,  40, 40,  40,  0,  true);

// =============================================================================
// Interface colors (from Globals.c)
// =============================================================================

export const itemColor:             Color = color(100, 95,  -30, 0,  0,   0,   0,  false);
export const blueBar:               Color = color(15,  10,  50,  0,  0,   0,   0,  false);
export const redBar:                Color = color(45,  10,  15,  0,  0,   0,   0,  false);
export const hiliteColor:           Color = color(100, 100, 0,   0,  0,   0,   0,  false);
export const interfaceBoxColor:     Color = color(7,   6,   15,  0,  0,   0,   0,  false);
export const interfaceButtonColor:  Color = color(18,  15,  38,  0,  0,   0,   0,  false);
export const buttonHoverColor:      Color = color(100, 70,  40,  0,  0,   0,   0,  false);
export const titleButtonColor:      Color = color(23,  15,  30,  0,  0,   0,   0,  false);

// =============================================================================
// Player colors (from Globals.c)
// =============================================================================

export const playerInvisibleColor:  Color = color(30,  30,  40,  0,  0,   80,  0,  true);
export const playerInLightColor:    Color = color(100, 90,  30,  0,  0,   0,   0,  false);
export const playerInShadowColor:   Color = color(60,  60,  100, 0,  0,   0,   0,  false);
export const playerInDarknessColor: Color = color(40,  40,  65,  0,  0,   0,   0,  false);

export const inLightMultiplierColor:    Color = color(150, 150, 75,  150, 150, 75,  100, true);
export const inDarknessMultiplierColor: Color = color(66,  66,  120, 66,  66,  120, 66,  true);

// =============================================================================
// Message colors (from Globals.c)
// =============================================================================

export const goodMessageColor:          Color = color(60,  50,  100, 0, 0, 0, 0, false);
export const badMessageColor:           Color = color(100, 50,  60,  0, 0, 0, 0, false);
export const advancementMessageColor:   Color = color(50,  100, 60,  0, 0, 0, 0, false);
export const itemMessageColor:          Color = color(100, 100, 50,  0, 0, 0, 0, false);
export const flavorTextColor:           Color = color(50,  40,  90,  0, 0, 0, 0, false);
export const backgroundMessageColor:    Color = color(60,  20,  70,  0, 0, 0, 0, false);

export const superVictoryColor:         Color = color(150, 100, 300, 0, 0, 0, 0, false);

// =============================================================================
// Flame colors (from Globals.c)
// =============================================================================

export const flameSourceColor:          Color = color(20, 7, 7, 60, 40, 40, 0, true);
export const flameSourceColorSecondary: Color = color(7,  2, 0, 10, 0,  0,  0, true);
export const flameTitleColor:           Color = color(0,  0, 0, 9,  9,  15, 0, true);

// =============================================================================
// Color utility functions
// =============================================================================

/** Apply a color multiplier to a base color (in-place). Each component is scaled by multiplier/100. */
export function applyColorMultiplier(base: Color, multiplier: Color): void {
    base.red = Math.round(base.red * multiplier.red / 100);
    base.green = Math.round(base.green * multiplier.green / 100);
    base.blue = Math.round(base.blue * multiplier.blue / 100);
    base.redRand = Math.round(base.redRand * multiplier.redRand / 100);
    base.greenRand = Math.round(base.greenRand * multiplier.greenRand / 100);
    base.blueRand = Math.round(base.blueRand * multiplier.blueRand / 100);
    base.rand = Math.round(base.rand * multiplier.rand / 100);
}

/** Blend a new color into a base color with the given weight (0-100). */
export function applyColorAverage(base: Color, newColor: Color, weight: number): void {
    const bWeight = 100 - weight;
    base.red = Math.round((base.red * bWeight + newColor.red * weight) / 100);
    base.green = Math.round((base.green * bWeight + newColor.green * weight) / 100);
    base.blue = Math.round((base.blue * bWeight + newColor.blue * weight) / 100);
    base.redRand = Math.round((base.redRand * bWeight + newColor.redRand * weight) / 100);
    base.greenRand = Math.round((base.greenRand * bWeight + newColor.greenRand * weight) / 100);
    base.blueRand = Math.round((base.blueRand * bWeight + newColor.blueRand * weight) / 100);
    base.rand = Math.round((base.rand * bWeight + newColor.rand * weight) / 100);
}

/** Add augmenting color components scaled by weight/100 to base color. */
export function applyColorAugment(base: Color, augment: Color, weight: number): void {
    base.red += Math.round(augment.red * weight / 100);
    base.green += Math.round(augment.green * weight / 100);
    base.blue += Math.round(augment.blue * weight / 100);
    base.redRand += Math.round(augment.redRand * weight / 100);
    base.greenRand += Math.round(augment.greenRand * weight / 100);
    base.blueRand += Math.round(augment.blueRand * weight / 100);
    base.rand += Math.round(augment.rand * weight / 100);
}

/** Create a deep copy of a color. */
export function cloneColor(c: Color): Color {
    return { ...c };
}

/** Clamp a value between min and max. */
function clamp(value: number, min: number, max: number): number {
    return value < min ? min : value > max ? max : value;
}

/**
 * "Bake" a color by resolving its random components into the base RGB values.
 * After baking, all rand fields are zeroed out.
 * Requires a random number generator function that returns a value in [0, n).
 */
export function bakeColor(c: Color, rng: (n: number) => number = Math.random as never): void {
    const randomFn = typeof rng === 'function'
        ? (n: number) => Math.floor(rng(1) * n)
        : (n: number) => Math.floor(Math.random() * n);

    if (c.rand) {
        const randComponent = randomFn(c.rand);
        c.red += randComponent;
        c.green += randComponent;
        c.blue += randComponent;
    }
    if (c.redRand) {
        c.red += randomFn(c.redRand);
    }
    if (c.greenRand) {
        c.green += randomFn(c.greenRand);
    }
    if (c.blueRand) {
        c.blue += randomFn(c.blueRand);
    }
    c.redRand = 0;
    c.greenRand = 0;
    c.blueRand = 0;
    c.rand = 0;
}

/** Clamp color RGB components to [0, 100]. */
export function clampColor(c: Color): void {
    c.red = clamp(c.red, 0, 100);
    c.green = clamp(c.green, 0, 100);
    c.blue = clamp(c.blue, 0, 100);
}

/**
 * Check if foreground and background colors are different enough to be readable.
 * Returns true if they were separated, false if they were already distinct.
 */
export function separateColors(fore: Color, back: Color): boolean {
    const dominated = (a: number, b: number) => a <= b;
    if (
        dominated(fore.red, back.red) &&
        dominated(fore.green, back.green) &&
        dominated(fore.blue, back.blue)
    ) {
        // Fore is dominated by back; brighten fore
        fore.red = clamp(fore.red + 20, 0, 100);
        fore.green = clamp(fore.green + 20, 0, 100);
        fore.blue = clamp(fore.blue + 20, 0, 100);
        return true;
    }
    return false;
}
