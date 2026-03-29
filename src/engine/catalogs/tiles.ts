// Tile catalog — ported from BrogueCE Globals.c tileCatalog
// Simplified: only the ~20 most common tiles our dungeon uses.

export interface TileEntry {
  displayChar: string;
  foreColor: [number, number, number];
  backColor: [number, number, number];
  flags: number;
  mechFlags: number;
  description: string;
}

// Terrain flag constants (from enums.ts, subset)
const T_OBSTRUCTS_PASSABILITY = 1 << 0;
const T_OBSTRUCTS_VISION = 1 << 3;
const T_OBSTRUCTS_ITEMS = 1 << 4;
const T_OBSTRUCTS_GAS = 1 << 5;
const T_OBSTRUCTS_SURFACE_EFFECTS = 1 << 6;
const T_OBSTRUCTS_DIAGONAL_MOVEMENT = 1 << 8;
const T_OBSTRUCTS_EVERYTHING = T_OBSTRUCTS_PASSABILITY | T_OBSTRUCTS_VISION | T_OBSTRUCTS_ITEMS | T_OBSTRUCTS_GAS | T_OBSTRUCTS_SURFACE_EFFECTS | T_OBSTRUCTS_DIAGONAL_MOVEMENT;

export const tileCatalog: TileEntry[] = [
  /* 0  NOTHING */          { displayChar: " ",      foreColor: [0, 0, 0],      backColor: [0, 0, 0],      flags: 0, mechFlags: 0, description: "a chilly void" },
  /* 1  GRANITE */          { displayChar: "#",      foreColor: [40, 40, 40],   backColor: [10, 8, 6],     flags: T_OBSTRUCTS_EVERYTHING, mechFlags: 0, description: "a rough granite wall" },
  /* 2  FLOOR */            { displayChar: "\u00B7", foreColor: [30, 30, 30],   backColor: [5, 3, 0],      flags: 0, mechFlags: 0, description: "the ground" },
  /* 3  FLOOR_FLOODABLE */  { displayChar: "\u00B7", foreColor: [30, 30, 30],   backColor: [5, 3, 0],      flags: 0, mechFlags: 0, description: "the ground" },
  /* 4  CARPET */           { displayChar: "\u00B7", foreColor: [55, 15, 15],   backColor: [15, 5, 0],     flags: 0, mechFlags: 0, description: "the carpet" },
  /* 5  MARBLE_FLOOR */     { displayChar: "\u00B7", foreColor: [60, 60, 60],   backColor: [10, 10, 10],   flags: 0, mechFlags: 0, description: "the marble ground" },
  /* 6  WALL */             { displayChar: "#",      foreColor: [40, 40, 40],   backColor: [15, 12, 10],   flags: T_OBSTRUCTS_EVERYTHING, mechFlags: 0, description: "a stone wall" },
  /* 7  DOOR */             { displayChar: "+",      foreColor: [60, 30, 0],    backColor: [15, 8, 0],     flags: T_OBSTRUCTS_VISION | T_OBSTRUCTS_GAS, mechFlags: 0, description: "a wooden door" },
  /* 8  OPEN_DOOR */        { displayChar: "'",      foreColor: [40, 20, 0],    backColor: [5, 3, 0],      flags: 0, mechFlags: 0, description: "an open door" },
  /* 9  SECRET_DOOR */      { displayChar: "#",      foreColor: [40, 40, 40],   backColor: [15, 12, 10],   flags: T_OBSTRUCTS_EVERYTHING, mechFlags: 0, description: "a stone wall" },
  /* 10 LOCKED_DOOR */      { displayChar: "+",      foreColor: [50, 50, 50],   backColor: [20, 15, 10],   flags: T_OBSTRUCTS_EVERYTHING, mechFlags: 0, description: "a locked iron door" },
  /* 11 OPEN_IRON_DOOR */   { displayChar: "'",      foreColor: [100, 100, 100],backColor: [20, 15, 10],   flags: 0, mechFlags: 0, description: "an open iron door" },
  /* 12 DOWN_STAIRS */      { displayChar: ">",      foreColor: [80, 80, 40],   backColor: [5, 3, 0],      flags: T_OBSTRUCTS_ITEMS, mechFlags: 0, description: "a downward staircase" },
  /* 13 UP_STAIRS */        { displayChar: "<",      foreColor: [80, 80, 40],   backColor: [5, 3, 0],      flags: T_OBSTRUCTS_ITEMS, mechFlags: 0, description: "an upward staircase" },
  /* 14 DUNGEON_EXIT */     { displayChar: "\u2261", foreColor: [60, 60, 100],  backColor: [5, 3, 0],      flags: T_OBSTRUCTS_ITEMS, mechFlags: 0, description: "the dungeon exit" },
  /* 15 DUNGEON_PORTAL */   { displayChar: "\u2261", foreColor: [70, 70, 100],  backColor: [5, 3, 0],      flags: T_OBSTRUCTS_ITEMS, mechFlags: 0, description: "a crystal portal" },
  /* 17 TORCH_WALL */       { displayChar: "#",      foreColor: [75, 38, 15],   backColor: [15, 12, 10],   flags: T_OBSTRUCTS_EVERYTHING, mechFlags: 0, description: "a wall-mounted torch" },
  /* 18 CRYSTAL_WALL */     { displayChar: "#",      foreColor: [70, 70, 100],  backColor: [70, 70, 100],  flags: T_OBSTRUCTS_PASSABILITY | T_OBSTRUCTS_DIAGONAL_MOVEMENT, mechFlags: 0, description: "a crystal formation" },
  /* 19 PORTCULLIS */       { displayChar: "#",      foreColor: [50, 50, 50],   backColor: [5, 3, 0],      flags: T_OBSTRUCTS_PASSABILITY | T_OBSTRUCTS_ITEMS, mechFlags: 0, description: "a heavy portcullis" },
];
