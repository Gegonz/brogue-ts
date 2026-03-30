// Tile catalog — ported from BrogueCE Globals.c tileCatalog
// ~100 entries covering all gameplay-relevant terrain types.

export interface TileEntry {
  displayChar: string;
  foreColor: [number, number, number];
  backColor: [number, number, number];
  flags: number;
  mechFlags: number;
  description: string;
}

// Terrain flag constants
const T_OBSTRUCTS_PASSABILITY = 1 << 0;
const T_OBSTRUCTS_VISION = 1 << 3;
const T_OBSTRUCTS_ITEMS = 1 << 4;
const T_OBSTRUCTS_GAS = 1 << 5;
const T_OBSTRUCTS_SURFACE = 1 << 6;
const T_OBSTRUCTS_DIAGONAL = 1 << 8;
const T_IS_FLAMMABLE = 1 << 10;
const T_IS_FIRE = 1 << 11;
const T_IS_DEEP_WATER = 1 << 13;
const T_LAVA_INSTA_DEATH = 1 << 14;
const T_AUTO_DESCENT = 1 << 16;
const T_OBSTRUCTS_EVERYTHING = T_OBSTRUCTS_PASSABILITY | T_OBSTRUCTS_VISION | T_OBSTRUCTS_ITEMS | T_OBSTRUCTS_GAS | T_OBSTRUCTS_SURFACE | T_OBSTRUCTS_DIAGONAL;

// Build the catalog indexed by TileType enum values
export const tileCatalog: TileEntry[] = [];

// Helper to add entries at specific indices
function t(index: number, char: string, fg: [number,number,number], bg: [number,number,number], flags: number, mf: number, desc: string): void {
  tileCatalog[index] = { displayChar: char, foreColor: fg, backColor: bg, flags, mechFlags: mf, description: desc };
}

// Fill gaps with floor default
for (let i = 0; i < 180; i++) {
  tileCatalog[i] = { displayChar: "\u00B7", foreColor: [30,30,30], backColor: [5,3,0], flags: 0, mechFlags: 0, description: "the ground" };
}

// ===== Dungeon layer (indices 0-60) =====
t(0, " ", [0,0,0], [0,0,0], 0, 0, "a chilly void");                                         // NOTHING
t(1, "#", [40,40,40], [10,8,6], T_OBSTRUCTS_EVERYTHING, 0, "a rough granite wall");           // GRANITE
t(2, "\u00B7", [30,30,30], [5,3,0], 0, 0, "the ground");                                      // FLOOR
t(3, "\u00B7", [30,30,30], [5,3,0], 0, 0, "the ground");                                      // FLOOR_FLOODABLE
t(4, "\u00B7", [55,15,15], [15,5,0], T_IS_FLAMMABLE, 0, "the carpet");                        // CARPET
t(5, "\u00B7", [60,60,60], [10,10,10], 0, 0, "the marble ground");                            // MARBLE_FLOOR
t(6, "#", [40,40,40], [15,12,10], T_OBSTRUCTS_EVERYTHING, 0, "a stone wall");                 // WALL
t(7, "+", [60,30,0], [15,8,0], T_OBSTRUCTS_VISION | T_OBSTRUCTS_GAS, 0, "a wooden door");    // DOOR
t(8, "'", [40,20,0], [5,3,0], 0, 0, "an open door");                                          // OPEN_DOOR
t(9, "#", [40,40,40], [15,12,10], T_OBSTRUCTS_EVERYTHING, 0, "a stone wall");                 // SECRET_DOOR
t(10, "+", [50,50,50], [20,15,10], T_OBSTRUCTS_EVERYTHING, 0, "a locked iron door");          // LOCKED_DOOR
t(11, "'", [100,100,100], [20,15,10], 0, 0, "an open iron door");                             // OPEN_IRON_DOOR
t(12, ">", [80,80,40], [5,3,0], T_OBSTRUCTS_ITEMS, 0, "a downward staircase");                // DOWN_STAIRS
t(13, "<", [80,80,40], [5,3,0], T_OBSTRUCTS_ITEMS, 0, "an upward staircase");                 // UP_STAIRS
t(14, "\u2261", [60,60,100], [5,3,0], T_OBSTRUCTS_ITEMS, 0, "the dungeon exit");              // DUNGEON_EXIT
t(15, "\u2261", [70,70,100], [5,3,0], T_OBSTRUCTS_ITEMS, 0, "a crystal portal");              // DUNGEON_PORTAL
t(16, "#", [75,38,15], [15,12,10], T_OBSTRUCTS_EVERYTHING, 0, "a wall-mounted torch");        // TORCH_WALL
t(17, "#", [70,70,100], [70,70,100], T_OBSTRUCTS_PASSABILITY | T_OBSTRUCTS_DIAGONAL, 0, "a crystal formation"); // CRYSTAL_WALL
t(18, "#", [50,50,50], [5,3,0], T_OBSTRUCTS_PASSABILITY | T_OBSTRUCTS_ITEMS, 0, "a heavy portcullis"); // PORTCULLIS_CLOSED
t(19, "\u00B7", [30,30,30], [5,3,0], 0, 0, "the ground");                                     // PORTCULLIS_DORMANT
t(20, "#", [60,30,0], [5,3,0], T_OBSTRUCTS_PASSABILITY | T_IS_FLAMMABLE, 0, "a wooden barricade"); // WOODEN_BARRICADE
// 21-26: torch/lever variants (use wall appearance)
t(27, "0", [15,12,10], [10,8,5], T_OBSTRUCTS_PASSABILITY | T_OBSTRUCTS_GAS, 0, "a marble statue");  // STATUE_INERT
// 28-35: various machine tiles (floor appearance)
t(36, "^", [100,100,100], [15,10,5], 0, 0, "a pressure plate");                               // MACHINE_PRESSURE_PLATE
// 37-41: more machine tiles

// ===== Liquid layer (indices 42-60) =====
t(42, "~", [20,20,70], [5,5,30], T_IS_DEEP_WATER, 0, "the murky waters");                    // DEEP_WATER
t(43, "~", [30,40,80], [10,15,40], 0, 0, "shallow water");                                    // SHALLOW_WATER
t(44, "~", [40,30,10], [20,15,5], 0, 0, "a bog");                                             // MUD
t(45, " ", [50,50,50], [0,0,0], T_AUTO_DESCENT, 0, "a chasm");                                // CHASM
t(46, "\u00B7", [100,100,100], [20,15,10], 0, 0, "the brink of a chasm");                     // CHASM_EDGE
// 47-48: collapse edges
t(49, "~", [100,25,0], [60,10,0], T_LAVA_INSTA_DEATH, 0, "lava");                            // LAVA
// 50-51: lava variants
t(52, "\u00B7", [80,80,50], [5,3,0], 0, 0, "a patch of sunlight");                            // SUNLIGHT_POOL
t(53, "\u00B7", [20,20,30], [3,2,0], 0, 0, "a patch of shadows");                             // DARKNESS_PATCH
t(54, "\u00B7", [80,50,20], [40,25,5], T_IS_FLAMMABLE, 0, "hissing brimstone");               // ACTIVE_BRIMSTONE
t(55, "\u00B7", [50,50,50], [15,10,10], 0, 0, "the obsidian ground");                         // OBSIDIAN
t(56, "=", [60,40,15], [30,20,5], T_IS_FLAMMABLE, 0, "a rickety rope bridge");                // BRIDGE
// 57-59: bridge variants
t(60, "\u00B7", [40,40,40], [10,8,5], 0, 0, "a stone bridge");                                // STONE_BRIDGE

// ===== Surface layer (indices 61-100) =====
t(61, " ", [50,50,50], [0,0,0], T_AUTO_DESCENT, 0, "a hole");                                 // HOLE
t(62, " ", [50,50,50], [0,0,0], T_AUTO_DESCENT, 0, "a hole");                                 // HOLE_GLOW
t(63, "\u00B7", [100,100,100], [20,15,10], 0, 0, "translucent ground");                       // HOLE_EDGE
// 64-65: flood water
t(66, "\"", [30,80,20], [0,0,0], T_IS_FLAMMABLE, 0, "grass-like fungus");                     // GRASS
t(67, "\"", [50,40,10], [0,0,0], T_IS_FLAMMABLE, 0, "withered fungus");                       // DEAD_GRASS
t(68, "\"", [50,50,50], [0,0,0], T_IS_FLAMMABLE, 0, "withered fungus");                       // GRAY_FUNGUS
t(69, "\"", [20,100,20], [0,0,0], T_IS_FLAMMABLE, 0, "luminescent fungus");                   // LUMINESCENT_FUNGUS
t(70, "\"", [40,20,60], [0,0,0], T_IS_FLAMMABLE, 0, "lichen");                                // LICHEN
t(71, "\"", [30,70,30], [0,0,0], T_IS_FLAMMABLE, 0, "toxic algae");                           // HAY
t(72, "^", [50,50,50], [5,3,0], 0, 0, "a bloodwort stalk");                                   // RED_BLOODWORT_STALK

// ===== Gas layer (indices 100-120) =====
t(100, "\u2592", [30,80,30], [0,0,0], 0, 0, "a cloud of caustic gas");                        // POISON_GAS
t(101, "\u2592", [50,20,50], [0,0,0], 0, 0, "a cloud of confusion gas");                      // CONFUSION_GAS
t(102, "\u2592", [100,50,80], [0,0,0], 0, 0, "a cloud of paralytic gas");                     // PARALYSIS_GAS
t(103, "\u2592", [50,50,5], [0,0,0], T_IS_FLAMMABLE, 0, "a cloud of methane gas");            // METHANE_GAS
t(104, "\u2591", [100,50,0], [0,0,0], T_IS_FIRE, 0, "a cloud of fire");                       // FIRE
t(105, "\u2591", [100,50,0], [0,0,0], T_IS_FIRE, 0, "an explosion");                          // EXPLOSION
t(106, "\u2592", [40,40,40], [0,0,0], 0, 0, "a cloud of scalding steam");                     // STEAM
t(107, "\u2591", [60,80,100], [0,0,0], 0, 0, "a cloud of magical fog");                       // FOG

// ===== Trap types (indices 120-130) =====
t(120, "^", [90,90,10], [5,3,0], 0, 0, "a trap");                                             // TRAP_DART
t(121, "^", [100,20,20], [5,3,0], 0, 0, "a fire trap");                                       // TRAP_FIRE
t(122, "^", [30,80,30], [5,3,0], 0, 0, "a gas trap");                                         // TRAP_GAS
t(123, "^", [60,60,100], [5,3,0], 0, 0, "a net trap");                                        // TRAP_NET
t(124, "^", [100,100,0], [5,3,0], 0, 0, "a confusion trap");                                  // TRAP_CONFUSION
t(125, "^", [100,50,80], [5,3,0], 0, 0, "a paralysis trap");                                  // TRAP_PARALYSIS
t(126, "^", [50,100,50], [5,3,0], T_AUTO_DESCENT, 0, "a pit trap");                           // TRAP_PIT
t(127, "^", [40,40,40], [5,3,0], 0, 0, "a flood trap");                                       // TRAP_FLOOD

// ===== Spiderweb =====
t(130, ":", [100,100,100], [0,0,0], 0, 0, "a spiderweb");                                     // WEB
