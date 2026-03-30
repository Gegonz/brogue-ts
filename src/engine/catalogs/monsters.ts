// Monster catalog — ported from BrogueCE Globals.c monsterCatalog
// Contains all ~60 monster types with actual stats from the C source.

export interface MonsterCatalogEntry {
  name: string;
  displayChar: string;
  foreColor: [number, number, number]; // RGB 0-100
  maxHP: number;
  defense: number;
  accuracy: number;
  damage: { min: number; max: number; clump: number };
  regenSpeed: number;   // turns between regen (20=normal, 0=no regen)
  moveSpeed: number;    // 100=normal, 50=fast, 200=slow
  attackSpeed: number;  // 100=normal, 200=slow (heavy weapons)
  isLarge: boolean;
  flags: string[];      // notable behavior/ability flags
}

// Index constants matching BrogueCE MK_* enum order
export const MK_PLAYER = 0;
export const MK_RAT = 1;
export const MK_KOBOLD = 2;
export const MK_JACKAL = 3;
export const MK_EEL = 4;
export const MK_MONKEY = 5;
export const MK_BLOAT = 6;
export const MK_PIT_BLOAT = 7;
export const MK_GOBLIN = 8;
export const MK_GOBLIN_CONJURER = 9;
export const MK_GOBLIN_MYSTIC = 10;
export const MK_GOBLIN_TOTEM = 11;
export const MK_PINK_JELLY = 12;
export const MK_TOAD = 13;
export const MK_VAMPIRE_BAT = 14;
export const MK_ARROW_TURRET = 15;
export const MK_ACID_MOUND = 16;
export const MK_CENTIPEDE = 17;
export const MK_OGRE = 18;
export const MK_BOG_MONSTER = 19;
export const MK_OGRE_TOTEM = 20;
export const MK_SPIDER = 21;
export const MK_SPARK_TURRET = 22;
export const MK_WISP = 23;
export const MK_WRAITH = 24;
export const MK_ZOMBIE = 25;
export const MK_TROLL = 26;
export const MK_OGRE_SHAMAN = 27;
export const MK_NAGA = 28;
export const MK_SALAMANDER = 29;
export const MK_EXPLOSIVE_BLOAT = 30;
export const MK_DAR_BLADEMASTER = 31;
export const MK_DAR_PRIESTESS = 32;
export const MK_DAR_BATTLEMAGE = 33;
export const MK_ACID_JELLY = 34;
export const MK_CENTAUR = 35;
export const MK_UNDERWORM = 36;
export const MK_SENTINEL = 37;
export const MK_DART_TURRET = 38;
export const MK_KRAKEN = 39;
export const MK_LICH = 40;
export const MK_PHYLACTERY = 41;
export const MK_PIXIE = 42;
export const MK_PHANTOM = 43;
export const MK_FLAME_TURRET = 44;
export const MK_IMP = 45;
export const MK_FURY = 46;
export const MK_REVENANT = 47;
export const MK_TENTACLE_HORROR = 48;
export const MK_GOLEM = 49;
export const MK_DRAGON = 50;
// bosses
export const MK_GOBLIN_CHIEFTAN = 51;
export const MK_BLACK_JELLY = 52;
export const MK_VAMPIRE = 53;
export const MK_FLAMEDANCER = 54;

export const monsterCatalog: MonsterCatalogEntry[] = [
  // 0: player (skipped in spawning)
  { name: "player", displayChar: "@", foreColor: [100,100,100], maxHP: 30, defense: 0, accuracy: 100, damage: {min:1,max:2,clump:1}, regenSpeed: 20, moveSpeed: 100, attackSpeed: 100, isLarge: false, flags: [] },
  // 1: rat
  { name: "rat", displayChar: "r", foreColor: [50,50,50], maxHP: 6, defense: 0, accuracy: 80, damage: {min:1,max:3,clump:1}, regenSpeed: 20, moveSpeed: 100, attackSpeed: 100, isLarge: false, flags: [] },
  // 2: kobold
  { name: "kobold", displayChar: "k", foreColor: [60,60,25], maxHP: 7, defense: 0, accuracy: 80, damage: {min:1,max:4,clump:1}, regenSpeed: 20, moveSpeed: 100, attackSpeed: 100, isLarge: false, flags: [] },
  // 3: jackal
  { name: "jackal", displayChar: "j", foreColor: [80,60,15], maxHP: 8, defense: 0, accuracy: 70, damage: {min:2,max:4,clump:1}, regenSpeed: 20, moveSpeed: 50, attackSpeed: 100, isLarge: false, flags: ["fast"] },
  // 4: eel
  { name: "eel", displayChar: "e", foreColor: [20,65,100], maxHP: 18, defense: 27, accuracy: 100, damage: {min:3,max:7,clump:2}, regenSpeed: 5, moveSpeed: 50, attackSpeed: 100, isLarge: false, flags: ["aquatic","submerges"] },
  // 5: monkey
  { name: "monkey", displayChar: "m", foreColor: [60,25,75], maxHP: 12, defense: 17, accuracy: 100, damage: {min:1,max:3,clump:1}, regenSpeed: 20, moveSpeed: 100, attackSpeed: 100, isLarge: false, flags: ["steals"] },
  // 6: bloat
  { name: "bloat", displayChar: "b", foreColor: [30,80,30], maxHP: 4, defense: 0, accuracy: 100, damage: {min:0,max:0,clump:0}, regenSpeed: 5, moveSpeed: 100, attackSpeed: 100, isLarge: false, flags: ["flies","kamikaze"] },
  // 7: pit bloat
  { name: "pit bloat", displayChar: "b", foreColor: [60,60,100], maxHP: 4, defense: 0, accuracy: 100, damage: {min:0,max:0,clump:0}, regenSpeed: 5, moveSpeed: 100, attackSpeed: 100, isLarge: false, flags: ["flies","kamikaze"] },
  // 8: goblin
  { name: "goblin", displayChar: "g", foreColor: [40,85,15], maxHP: 15, defense: 10, accuracy: 70, damage: {min:2,max:5,clump:1}, regenSpeed: 20, moveSpeed: 100, attackSpeed: 100, isLarge: false, flags: ["penetrate"] },
  // 9: goblin conjurer
  { name: "goblin conjurer", displayChar: "g", foreColor: [60,80,60], maxHP: 10, defense: 10, accuracy: 70, damage: {min:2,max:4,clump:1}, regenSpeed: 20, moveSpeed: 100, attackSpeed: 100, isLarge: false, flags: ["summons","ranged"] },
  // 10: goblin mystic
  { name: "goblin mystic", displayChar: "g", foreColor: [40,100,100], maxHP: 10, defense: 10, accuracy: 70, damage: {min:2,max:4,clump:1}, regenSpeed: 20, moveSpeed: 100, attackSpeed: 100, isLarge: false, flags: ["shields","ranged"] },
  // 11: goblin totem
  { name: "goblin totem", displayChar: "T", foreColor: [100,60,0], maxHP: 30, defense: 0, accuracy: 0, damage: {min:0,max:0,clump:0}, regenSpeed: 0, moveSpeed: 100, attackSpeed: 300, isLarge: false, flags: ["immobile","inanimate"] },
  // 12: pink jelly
  { name: "pink jelly", displayChar: "J", foreColor: [100,40,100], maxHP: 50, defense: 0, accuracy: 85, damage: {min:1,max:3,clump:1}, regenSpeed: 0, moveSpeed: 100, attackSpeed: 100, isLarge: true, flags: ["splits"] },
  // 13: toad
  { name: "toad", displayChar: "t", foreColor: [45,70,15], maxHP: 18, defense: 0, accuracy: 90, damage: {min:1,max:4,clump:1}, regenSpeed: 10, moveSpeed: 100, attackSpeed: 100, isLarge: false, flags: ["hallucinate"] },
  // 14: vampire bat
  { name: "vampire bat", displayChar: "v", foreColor: [50,25,15], maxHP: 18, defense: 25, accuracy: 100, damage: {min:2,max:6,clump:1}, regenSpeed: 20, moveSpeed: 50, attackSpeed: 100, isLarge: false, flags: ["flies","lifesteal"] },
  // 15: arrow turret
  { name: "arrow turret", displayChar: "T", foreColor: [10,10,10], maxHP: 30, defense: 0, accuracy: 90, damage: {min:2,max:6,clump:1}, regenSpeed: 0, moveSpeed: 100, attackSpeed: 250, isLarge: false, flags: ["immobile","ranged"] },
  // 16: acid mound
  { name: "acid mound", displayChar: "a", foreColor: [30,100,0], maxHP: 15, defense: 10, accuracy: 70, damage: {min:1,max:3,clump:1}, regenSpeed: 5, moveSpeed: 100, attackSpeed: 100, isLarge: false, flags: ["degrades_armor"] },
  // 17: centipede
  { name: "centipede", displayChar: "c", foreColor: [75,25,85], maxHP: 20, defense: 20, accuracy: 80, damage: {min:4,max:12,clump:1}, regenSpeed: 20, moveSpeed: 100, attackSpeed: 100, isLarge: false, flags: ["weakens"] },
  // 18: ogre
  { name: "ogre", displayChar: "O", foreColor: [60,25,75], maxHP: 55, defense: 60, accuracy: 125, damage: {min:9,max:13,clump:2}, regenSpeed: 20, moveSpeed: 100, attackSpeed: 200, isLarge: true, flags: ["staggers"] },
  // 19: bog monster
  { name: "bog monster", displayChar: "B", foreColor: [20,80,20], maxHP: 55, defense: 60, accuracy: 100, damage: {min:3,max:4,clump:1}, regenSpeed: 3, moveSpeed: 200, attackSpeed: 100, isLarge: true, flags: ["aquatic","seizes"] },
  // 20: ogre totem
  { name: "ogre totem", displayChar: "T", foreColor: [0,100,0], maxHP: 70, defense: 0, accuracy: 0, damage: {min:0,max:0,clump:0}, regenSpeed: 0, moveSpeed: 100, attackSpeed: 400, isLarge: false, flags: ["immobile","inanimate","heals"] },
  // 21: spider
  { name: "spider", displayChar: "s", foreColor: [100,100,100], maxHP: 20, defense: 70, accuracy: 90, damage: {min:3,max:4,clump:2}, regenSpeed: 20, moveSpeed: 100, attackSpeed: 200, isLarge: false, flags: ["poisons","webs"] },
  // 22: spark turret
  { name: "spark turret", displayChar: "T", foreColor: [100,100,20], maxHP: 80, defense: 0, accuracy: 100, damage: {min:0,max:0,clump:0}, regenSpeed: 0, moveSpeed: 100, attackSpeed: 150, isLarge: false, flags: ["immobile","electric"] },
  // 23: wisp
  { name: "wisp", displayChar: "w", foreColor: [100,100,80], maxHP: 10, defense: 90, accuracy: 100, damage: {min:0,max:0,clump:0}, regenSpeed: 5, moveSpeed: 100, attackSpeed: 100, isLarge: false, flags: ["flies","fiery","burns"] },
  // 24: wraith
  { name: "wraith", displayChar: "W", foreColor: [60,60,100], maxHP: 50, defense: 60, accuracy: 120, damage: {min:6,max:13,clump:2}, regenSpeed: 5, moveSpeed: 50, attackSpeed: 100, isLarge: true, flags: ["flees_low_hp"] },
  // 25: zombie
  { name: "zombie", displayChar: "Z", foreColor: [70,80,20], maxHP: 80, defense: 0, accuracy: 120, damage: {min:7,max:12,clump:1}, regenSpeed: 0, moveSpeed: 100, attackSpeed: 100, isLarge: true, flags: ["rot_gas"] },
  // 26: troll
  { name: "troll", displayChar: "T", foreColor: [40,60,15], maxHP: 65, defense: 70, accuracy: 125, damage: {min:10,max:15,clump:3}, regenSpeed: 1, moveSpeed: 100, attackSpeed: 100, isLarge: true, flags: ["fast_regen"] },
  // 27: ogre shaman
  { name: "ogre shaman", displayChar: "O", foreColor: [0,100,0], maxHP: 45, defense: 40, accuracy: 100, damage: {min:5,max:9,clump:1}, regenSpeed: 20, moveSpeed: 100, attackSpeed: 200, isLarge: true, flags: ["ranged","summons","haste"] },
  // 28: naga
  { name: "naga", displayChar: "N", foreColor: [40,60,15], maxHP: 75, defense: 70, accuracy: 150, damage: {min:7,max:11,clump:4}, regenSpeed: 10, moveSpeed: 100, attackSpeed: 100, isLarge: true, flags: ["aquatic","attacks_all_adjacent"] },
  // 29: salamander
  { name: "salamander", displayChar: "S", foreColor: [100,60,0], maxHP: 60, defense: 70, accuracy: 150, damage: {min:5,max:11,clump:3}, regenSpeed: 10, moveSpeed: 100, attackSpeed: 100, isLarge: true, flags: ["fiery","attacks_extend"] },
  // 30: explosive bloat
  { name: "explosive bloat", displayChar: "b", foreColor: [100,60,0], maxHP: 10, defense: 0, accuracy: 100, damage: {min:0,max:0,clump:0}, regenSpeed: 5, moveSpeed: 100, attackSpeed: 100, isLarge: false, flags: ["flies","kamikaze","explodes"] },
  // 31: dar blademaster
  { name: "dar blademaster", displayChar: "d", foreColor: [60,0,100], maxHP: 35, defense: 70, accuracy: 160, damage: {min:5,max:9,clump:2}, regenSpeed: 20, moveSpeed: 100, attackSpeed: 100, isLarge: false, flags: ["blinks"] },
  // 32: dar priestess
  { name: "dar priestess", displayChar: "d", foreColor: [100,30,100], maxHP: 20, defense: 60, accuracy: 100, damage: {min:2,max:5,clump:1}, regenSpeed: 20, moveSpeed: 100, attackSpeed: 100, isLarge: false, flags: ["ranged","heals","negates"] },
  // 33: dar battlemage
  { name: "dar battlemage", displayChar: "d", foreColor: [100,30,30], maxHP: 20, defense: 60, accuracy: 100, damage: {min:1,max:3,clump:1}, regenSpeed: 20, moveSpeed: 100, attackSpeed: 100, isLarge: false, flags: ["ranged","firebolt","slows"] },
  // 34: acidic jelly
  { name: "acidic jelly", displayChar: "J", foreColor: [30,100,0], maxHP: 60, defense: 0, accuracy: 115, damage: {min:2,max:6,clump:1}, regenSpeed: 0, moveSpeed: 100, attackSpeed: 100, isLarge: true, flags: ["splits","degrades_armor"] },
  // 35: centaur
  { name: "centaur", displayChar: "C", foreColor: [60,45,25], maxHP: 35, defense: 50, accuracy: 175, damage: {min:4,max:8,clump:2}, regenSpeed: 20, moveSpeed: 50, attackSpeed: 100, isLarge: true, flags: ["ranged","fast"] },
  // 36: underworm
  { name: "underworm", displayChar: "U", foreColor: [80,50,20], maxHP: 80, defense: 40, accuracy: 160, damage: {min:18,max:22,clump:2}, regenSpeed: 3, moveSpeed: 150, attackSpeed: 200, isLarge: true, flags: ["heavy_damage"] },
  // 37: sentinel
  { name: "sentinel", displayChar: "T", foreColor: [60,60,100], maxHP: 50, defense: 0, accuracy: 0, damage: {min:0,max:0,clump:0}, regenSpeed: 0, moveSpeed: 100, attackSpeed: 175, isLarge: false, flags: ["immobile","heals","electric"] },
  // 38: dart turret
  { name: "dart turret", displayChar: "T", foreColor: [75,25,85], maxHP: 20, defense: 0, accuracy: 140, damage: {min:1,max:2,clump:1}, regenSpeed: 0, moveSpeed: 100, attackSpeed: 250, isLarge: false, flags: ["immobile","poisons"] },
  // 39: kraken
  { name: "kraken", displayChar: "K", foreColor: [20,80,20], maxHP: 120, defense: 0, accuracy: 150, damage: {min:15,max:20,clump:3}, regenSpeed: 1, moveSpeed: 50, attackSpeed: 100, isLarge: true, flags: ["aquatic","seizes"] },
  // 40: lich
  { name: "lich", displayChar: "L", foreColor: [100,100,100], maxHP: 35, defense: 80, accuracy: 175, damage: {min:2,max:6,clump:1}, regenSpeed: 0, moveSpeed: 100, attackSpeed: 100, isLarge: true, flags: ["ranged","firebolt","summons"] },
  // 41: phylactery
  { name: "phylactery", displayChar: "P", foreColor: [80,80,100], maxHP: 30, defense: 0, accuracy: 0, damage: {min:0,max:0,clump:0}, regenSpeed: 0, moveSpeed: 100, attackSpeed: 150, isLarge: false, flags: ["immobile","inanimate","summons"] },
  // 42: pixie
  { name: "pixie", displayChar: "p", foreColor: [100,60,100], maxHP: 10, defense: 90, accuracy: 100, damage: {min:1,max:3,clump:1}, regenSpeed: 20, moveSpeed: 50, attackSpeed: 100, isLarge: false, flags: ["flies","ranged","negates","slows"] },
  // 43: phantom
  { name: "phantom", displayChar: "P", foreColor: [60,80,70], maxHP: 35, defense: 70, accuracy: 160, damage: {min:12,max:18,clump:4}, regenSpeed: 0, moveSpeed: 50, attackSpeed: 200, isLarge: true, flags: ["invisible","flies"] },
  // 44: flame turret
  { name: "flame turret", displayChar: "T", foreColor: [100,25,0], maxHP: 40, defense: 0, accuracy: 150, damage: {min:1,max:2,clump:1}, regenSpeed: 0, moveSpeed: 100, attackSpeed: 250, isLarge: false, flags: ["immobile","firebolt"] },
  // 45: imp
  { name: "imp", displayChar: "i", foreColor: [100,50,80], maxHP: 35, defense: 90, accuracy: 225, damage: {min:4,max:9,clump:2}, regenSpeed: 10, moveSpeed: 100, attackSpeed: 100, isLarge: false, flags: ["steals","blinks"] },
  // 46: fury
  { name: "fury", displayChar: "f", foreColor: [80,0,0], maxHP: 19, defense: 90, accuracy: 200, damage: {min:6,max:11,clump:4}, regenSpeed: 20, moveSpeed: 50, attackSpeed: 100, isLarge: false, flags: ["flies","fast","pack"] },
  // 47: revenant
  { name: "revenant", displayChar: "R", foreColor: [60,80,70], maxHP: 30, defense: 0, accuracy: 200, damage: {min:15,max:20,clump:5}, regenSpeed: 0, moveSpeed: 100, attackSpeed: 100, isLarge: true, flags: ["immune_to_weapons"] },
  // 48: tentacle horror
  { name: "tentacle horror", displayChar: "H", foreColor: [75,25,85], maxHP: 120, defense: 95, accuracy: 225, damage: {min:25,max:35,clump:3}, regenSpeed: 1, moveSpeed: 100, attackSpeed: 100, isLarge: true, flags: ["heavy_damage"] },
  // 49: golem
  { name: "golem", displayChar: "G", foreColor: [50,50,50], maxHP: 400, defense: 70, accuracy: 225, damage: {min:4,max:8,clump:1}, regenSpeed: 0, moveSpeed: 100, attackSpeed: 100, isLarge: true, flags: ["reflects"] },
  // 50: dragon
  { name: "dragon", displayChar: "D", foreColor: [20,80,20], maxHP: 150, defense: 90, accuracy: 250, damage: {min:25,max:50,clump:4}, regenSpeed: 20, moveSpeed: 50, attackSpeed: 200, isLarge: true, flags: ["firebreath","attacks_all_adjacent"] },
  // bosses
  // 51: goblin warlord
  { name: "goblin warlord", displayChar: "g", foreColor: [0,0,100], maxHP: 30, defense: 17, accuracy: 100, damage: {min:3,max:6,clump:1}, regenSpeed: 20, moveSpeed: 100, attackSpeed: 100, isLarge: false, flags: ["summons","penetrate"] },
  // 52: black jelly
  { name: "black jelly", displayChar: "J", foreColor: [10,10,10], maxHP: 120, defense: 0, accuracy: 130, damage: {min:3,max:8,clump:1}, regenSpeed: 0, moveSpeed: 100, attackSpeed: 100, isLarge: true, flags: ["splits"] },
  // 53: vampire
  { name: "vampire", displayChar: "V", foreColor: [100,100,100], maxHP: 75, defense: 60, accuracy: 120, damage: {min:4,max:15,clump:2}, regenSpeed: 6, moveSpeed: 50, attackSpeed: 100, isLarge: true, flags: ["lifesteal","blinks","summons","flees_low_hp"] },
  // 54: flamedancer
  { name: "flamedancer", displayChar: "F", foreColor: [100,100,100], maxHP: 65, defense: 80, accuracy: 120, damage: {min:3,max:8,clump:2}, regenSpeed: 0, moveSpeed: 100, attackSpeed: 100, isLarge: true, flags: ["fiery","ranged","burns"] },
];

// Depth ranges for monster spawning (simplified from hordeCatalog)
export interface MonsterDepthRange {
  monsterIndex: number;
  minDepth: number;
  maxDepth: number;
  frequency: number;
}

export const monsterDepthRanges: MonsterDepthRange[] = [
  { monsterIndex: MK_RAT, minDepth: 1, maxDepth: 5, frequency: 10 },
  { monsterIndex: MK_KOBOLD, minDepth: 1, maxDepth: 6, frequency: 8 },
  { monsterIndex: MK_JACKAL, minDepth: 1, maxDepth: 5, frequency: 6 },
  { monsterIndex: MK_EEL, minDepth: 2, maxDepth: 12, frequency: 2 },
  { monsterIndex: MK_MONKEY, minDepth: 2, maxDepth: 7, frequency: 5 },
  { monsterIndex: MK_BLOAT, minDepth: 2, maxDepth: 8, frequency: 4 },
  { monsterIndex: MK_GOBLIN, minDepth: 3, maxDepth: 10, frequency: 6 },
  { monsterIndex: MK_GOBLIN_CONJURER, minDepth: 4, maxDepth: 12, frequency: 3 },
  { monsterIndex: MK_GOBLIN_MYSTIC, minDepth: 4, maxDepth: 12, frequency: 3 },
  { monsterIndex: MK_PINK_JELLY, minDepth: 4, maxDepth: 14, frequency: 3 },
  { monsterIndex: MK_TOAD, minDepth: 3, maxDepth: 10, frequency: 5 },
  { monsterIndex: MK_VAMPIRE_BAT, minDepth: 4, maxDepth: 12, frequency: 4 },
  { monsterIndex: MK_ACID_MOUND, minDepth: 5, maxDepth: 14, frequency: 3 },
  { monsterIndex: MK_CENTIPEDE, minDepth: 5, maxDepth: 14, frequency: 4 },
  { monsterIndex: MK_OGRE, minDepth: 5, maxDepth: 16, frequency: 4 },
  { monsterIndex: MK_SPIDER, minDepth: 6, maxDepth: 16, frequency: 4 },
  { monsterIndex: MK_WRAITH, minDepth: 7, maxDepth: 18, frequency: 3 },
  { monsterIndex: MK_ZOMBIE, minDepth: 7, maxDepth: 18, frequency: 3 },
  { monsterIndex: MK_TROLL, minDepth: 8, maxDepth: 20, frequency: 3 },
  { monsterIndex: MK_OGRE_SHAMAN, minDepth: 8, maxDepth: 18, frequency: 2 },
  { monsterIndex: MK_NAGA, minDepth: 9, maxDepth: 22, frequency: 3 },
  { monsterIndex: MK_SALAMANDER, minDepth: 9, maxDepth: 22, frequency: 2 },
  { monsterIndex: MK_DAR_BLADEMASTER, minDepth: 10, maxDepth: 22, frequency: 3 },
  { monsterIndex: MK_DAR_PRIESTESS, minDepth: 10, maxDepth: 22, frequency: 2 },
  { monsterIndex: MK_DAR_BATTLEMAGE, minDepth: 10, maxDepth: 22, frequency: 2 },
  { monsterIndex: MK_ACID_JELLY, minDepth: 10, maxDepth: 22, frequency: 2 },
  { monsterIndex: MK_CENTAUR, minDepth: 10, maxDepth: 22, frequency: 3 },
  { monsterIndex: MK_UNDERWORM, minDepth: 12, maxDepth: 24, frequency: 2 },
  { monsterIndex: MK_KRAKEN, minDepth: 12, maxDepth: 26, frequency: 1 },
  { monsterIndex: MK_LICH, minDepth: 14, maxDepth: 26, frequency: 1 },
  { monsterIndex: MK_PIXIE, minDepth: 12, maxDepth: 22, frequency: 2 },
  { monsterIndex: MK_PHANTOM, minDepth: 14, maxDepth: 26, frequency: 2 },
  { monsterIndex: MK_IMP, minDepth: 14, maxDepth: 26, frequency: 2 },
  { monsterIndex: MK_FURY, minDepth: 16, maxDepth: 26, frequency: 2 },
  { monsterIndex: MK_REVENANT, minDepth: 16, maxDepth: 26, frequency: 1 },
  { monsterIndex: MK_TENTACLE_HORROR, minDepth: 18, maxDepth: 26, frequency: 1 },
  { monsterIndex: MK_GOLEM, minDepth: 20, maxDepth: 26, frequency: 1 },
  { monsterIndex: MK_DRAGON, minDepth: 22, maxDepth: 26, frequency: 1 },
];
