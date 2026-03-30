// =============================================================================
// architect.ts — Dungeon generation, ported from BrogueCE Architect.c
// =============================================================================

import {
  DCOLS, DROWS, nbDirs,
  ROOM_TYPE_COUNT,
  CROSS_ROOM_MIN_WIDTH, CROSS_ROOM_MAX_WIDTH,
  CROSS_ROOM_MIN_HEIGHT, CROSS_ROOM_MAX_HEIGHT,
  HORIZONTAL_CORRIDOR_MIN_LENGTH, HORIZONTAL_CORRIDOR_MAX_LENGTH,
  VERTICAL_CORRIDOR_MIN_LENGTH, VERTICAL_CORRIDOR_MAX_LENGTH,
  CAVE_MIN_WIDTH, CAVE_MIN_HEIGHT,
} from "../shared/constants.ts";
import type { GameState } from "./state.ts";
import type { RNG } from "./rng.ts";
import { fillSequentialList } from "./rng.ts";
import {
  allocGrid, fillGrid, copyGrid, drawRectangleOnGrid, drawCircleOnGrid,
  createBlobOnGrid, coordinatesAreInMap, validLocationCount,
  type Grid,
} from "./grid.ts";
import { calculateDistances } from "./dijkstra.ts";

// ---------------------------------------------------------------------------
// Tile constants (simplified — matching the tile catalog indices)
// ---------------------------------------------------------------------------

// const NOTHING = 0; // unused for now
const GRANITE = 1;
const FLOOR = 2;
const WALL = 6;
const DOOR = 7;
const DOWN_STAIRS = 12;

// Direction enum values matching nbDirs indices
const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;
const NO_DIRECTION = -1;

// ---------------------------------------------------------------------------
// Dungeon profile
// ---------------------------------------------------------------------------

interface DungeonProfile {
  roomFrequencies: number[]; // 8 entries, one per room type
  corridorChance: number;    // 0–100
}

interface Pos {
  x: number;
  y: number;
}

const INVALID_POS: Pos = { x: -1, y: -1 };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function oppositeDirection(dir: number): number {
  switch (dir) {
    case UP: return DOWN;
    case DOWN: return UP;
    case LEFT: return RIGHT;
    case RIGHT: return LEFT;
    default: return NO_DIRECTION;
  }
}

function clampVal(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

/**
 * Pick a random cell in `grid` whose value equals `validValue`.
 * Returns {x, y} or {-1, -1} if none found.
 * Matches BrogueCE randomLocationInGrid exactly — counts first, then picks.
 */
function randomLocationInGrid(grid: Grid, validValue: number, rng: RNG): Pos {
  const count = validLocationCount(grid, validValue);
  if (count <= 0) return { x: -1, y: -1 };

  let idx = rng.range(0, count - 1);
  for (let i = 0; i < DCOLS; i++) {
    for (let j = 0; j < DROWS; j++) {
      if (grid[i]![j] === validValue) {
        if (idx === 0) {
          return { x: i, y: j };
        }
        idx--;
      }
    }
  }
  return { x: -1, y: -1 };
}

// ---------------------------------------------------------------------------
// Room design functions
// ---------------------------------------------------------------------------

function designCrossRoom(grid: Grid, rng: RNG): void {
  fillGrid(grid, 0);

  const roomWidth = rng.range(CROSS_ROOM_MIN_WIDTH, CROSS_ROOM_MAX_WIDTH);
  const roomX = rng.range(Math.max(0, Math.floor(DCOLS / 2) - (roomWidth - 1)), Math.min(DCOLS, Math.floor(DCOLS / 2)));
  const roomWidth2 = rng.range(4, 20);
  const roomX2 = (roomX + Math.floor(roomWidth / 2) + rng.range(0, 2) + rng.range(0, 2) - 3) - Math.floor(roomWidth2 / 2);

  const roomHeight = rng.range(3, 7);
  const roomY = Math.floor(DROWS / 2) - roomHeight;

  const roomHeight2 = rng.range(CROSS_ROOM_MIN_HEIGHT, CROSS_ROOM_MAX_HEIGHT);
  const roomY2 = Math.floor(DROWS / 2) - roomHeight2 - (rng.range(0, 2) + rng.range(0, 1));

  drawRectangleOnGrid(grid, roomX - 5, roomY + 5, roomWidth, roomHeight, 1);
  drawRectangleOnGrid(grid, roomX2 - 5, roomY2 + 5, roomWidth2, roomHeight2, 1);
}

function designSymmetricalCrossRoom(grid: Grid, rng: RNG): void {
  fillGrid(grid, 0);

  const majorWidth = rng.range(4, 8);
  const majorHeight = rng.range(4, 5);

  let minorWidth = rng.range(3, 4);
  if (majorHeight % 2 === 0) {
    minorWidth -= 1;
  }
  let minorHeight = 3;
  if (majorWidth % 2 === 0) {
    minorHeight -= 1;
  }

  drawRectangleOnGrid(grid, Math.floor((DCOLS - majorWidth) / 2), Math.floor((DROWS - minorHeight) / 2), majorWidth, minorHeight, 1);
  drawRectangleOnGrid(grid, Math.floor((DCOLS - minorWidth) / 2), Math.floor((DROWS - majorHeight) / 2), minorWidth, majorHeight, 1);
}

function designSmallRoom(grid: Grid, rng: RNG): void {
  fillGrid(grid, 0);
  const width = rng.range(3, 6);
  const height = rng.range(2, 4);
  drawRectangleOnGrid(grid, Math.floor((DCOLS - width) / 2), Math.floor((DROWS - height) / 2), width, height, 1);
}

function designCircularRoom(grid: Grid, rng: RNG): void {
  let radius: number;
  if (rng.percent(5)) {
    radius = rng.range(4, 10);
  } else {
    radius = rng.range(2, 4);
  }

  fillGrid(grid, 0);
  drawCircleOnGrid(grid, Math.floor(DCOLS / 2), Math.floor(DROWS / 2), radius, 1);

  if (radius > 6 && rng.percent(50)) {
    drawCircleOnGrid(grid, Math.floor(DCOLS / 2), Math.floor(DROWS / 2), rng.range(3, radius - 3), 0);
  }
}

function designChunkyRoom(grid: Grid, rng: RNG): void {
  const chunkCount = rng.range(2, 8);

  fillGrid(grid, 0);
  drawCircleOnGrid(grid, Math.floor(DCOLS / 2), Math.floor(DROWS / 2), 2, 1);
  let minX = Math.floor(DCOLS / 2) - 3;
  let maxX = Math.floor(DCOLS / 2) + 3;
  let minY = Math.floor(DROWS / 2) - 3;
  let maxY = Math.floor(DROWS / 2) + 3;

  for (let i = 0, safety = 0; i < chunkCount && safety < 200; safety++) {
    const x = rng.range(minX, maxX);
    const y = rng.range(minY, maxY);
    if (grid[x]![y]) {
      drawCircleOnGrid(grid, x, y, 2, 1);
      i++;
      minX = Math.max(1, Math.min(x - 3, minX));
      maxX = Math.min(DCOLS - 2, Math.max(x + 3, maxX));
      minY = Math.max(1, Math.min(y - 3, minY));
      maxY = Math.min(DROWS - 2, Math.max(y + 3, maxY));
    }
  }
}

function designCavern(grid: Grid, minWidth: number, maxWidth: number, minHeight: number, maxHeight: number, rng: RNG): void {
  const blobGrid = allocGrid();
  fillGrid(grid, 0);

  // CA rule strings from BrogueCE: birth "ffffffttt" = [f,f,f,f,f,f,t,t,t], survival "ffffttttt" = [f,f,f,f,t,t,t,t,t]
  const birth = [false, false, false, false, false, false, true, true, true];
  const survival = [false, false, false, false, true, true, true, true, true];

  const blob = createBlobOnGrid(
    blobGrid, 5,
    minWidth, minHeight, maxWidth, maxHeight,
    55, birth, survival,
    () => rng.range(0, 99),
  );

  // Position the cave in the middle of the grid
  const destX = Math.floor((DCOLS - blob.width) / 2);
  const destY = Math.floor((DROWS - blob.height) / 2);

  // Find a fill point (first non-zero cell)
  let fillX = 0;
  let fillY = 0;
  let foundFillPoint = false;
  for (fillX = 0; fillX < DCOLS && !foundFillPoint; fillX++) {
    for (fillY = 0; fillY < DROWS && !foundFillPoint; fillY++) {
      if (blobGrid[fillX]![fillY]) {
        foundFillPoint = true;
      }
    }
  }

  // Copy blob to master grid via flood-fill insertion
  insertRoomAt(grid, blobGrid, destX - blob.minX, destY - blob.minY, fillX, fillY);
}

function designEntranceRoom(grid: Grid): void {
  fillGrid(grid, 0);

  const roomWidth = 8;
  const roomHeight = 10;
  const roomWidth2 = 20;
  const roomHeight2 = 5;
  const roomX = Math.floor(DCOLS / 2) - Math.floor(roomWidth / 2) - 1;
  const roomY = DROWS - roomHeight - 2;
  const roomX2 = Math.floor(DCOLS / 2) - Math.floor(roomWidth2 / 2) - 1;
  const roomY2 = DROWS - roomHeight2 - 2;

  drawRectangleOnGrid(grid, roomX, roomY, roomWidth, roomHeight, 1);
  drawRectangleOnGrid(grid, roomX2, roomY2, roomWidth2, roomHeight2, 1);
}

// ---------------------------------------------------------------------------
// Door site detection
// ---------------------------------------------------------------------------

/**
 * If (x,y) is an empty cell on the room grid that borders exactly one
 * interior cell, return the direction a door would face (outward).
 * Otherwise return NO_DIRECTION.
 */
function directionOfDoorSite(grid: Grid, x: number, y: number): number {
  if (grid[x]![y]) {
    return NO_DIRECTION; // already occupied
  }

  let solutionDir = NO_DIRECTION;
  for (let dir = 0; dir < 4; dir++) {
    const newX = x + nbDirs[dir]![0]!;
    const newY = y + nbDirs[dir]![1]!;
    const oppX = x - nbDirs[dir]![0]!;
    const oppY = y - nbDirs[dir]![1]!;
    if (coordinatesAreInMap(oppX, oppY)
      && coordinatesAreInMap(newX, newY)
      && grid[oppX]![oppY] === 1) {
      if (solutionDir !== NO_DIRECTION) {
        return NO_DIRECTION; // claimed by multiple directions
      }
      solutionDir = dir;
    }
  }
  return solutionDir;
}

/**
 * Scan the room grid for valid door sites in each of the 4 cardinal
 * directions. For each direction, pick one at random.
 */
function chooseRandomDoorSites(roomMap: Grid, rng: RNG): Pos[] {
  const grid = allocGrid();
  copyGrid(grid, roomMap);

  for (let i = 0; i < DCOLS; i++) {
    for (let j = 0; j < DROWS; j++) {
      if (!grid[i]![j]) {
        const dir = directionOfDoorSite(roomMap, i, j);
        if (dir !== NO_DIRECTION) {
          // Trace a ray 10 spaces outward to make sure it doesn't re-intersect the room
          let newX = i + nbDirs[dir]![0]!;
          let newY = j + nbDirs[dir]![1]!;
          let doorSiteFailed = false;
          for (let k = 0; k < 10 && coordinatesAreInMap(newX, newY) && !doorSiteFailed; k++) {
            if (grid[newX]![newY]) {
              doorSiteFailed = true;
            }
            newX += nbDirs[dir]![0]!;
            newY += nbDirs[dir]![1]!;
          }
          if (!doorSiteFailed) {
            grid[i]![j] = dir + 2; // +2 so as not to conflict with 0 (exterior) or 1 (interior)
          }
        }
      }
    }
  }

  // Pick one door site per direction
  const doorSites: Pos[] = [];
  for (let dir = 0; dir < 4; dir++) {
    doorSites.push(randomLocationInGrid(grid, dir + 2, rng));
  }

  return doorSites;
}

// ---------------------------------------------------------------------------
// Hallway attachment
// ---------------------------------------------------------------------------

function attachHallwayTo(grid: Grid, doorSites: Pos[], rng: RNG): void {
  // Pick a direction
  const dirs: number[] = [0, 0, 0, 0];
  fillSequentialList(dirs, 4);
  rng.shuffle(dirs);

  let chosenDir = -1;
  for (let i = 0; i < 4; i++) {
    const dir = dirs[i]!;
    if (doorSites[dir]!.x !== -1
      && doorSites[dir]!.y !== -1
      && coordinatesAreInMap(
        doorSites[dir]!.x + nbDirs[dir]![0]! * HORIZONTAL_CORRIDOR_MAX_LENGTH,
        doorSites[dir]!.y + nbDirs[dir]![1]! * VERTICAL_CORRIDOR_MAX_LENGTH,
      )) {
      chosenDir = dir;
      break;
    }
  }
  if (chosenDir === -1) {
    return; // no valid direction
  }

  let length: number;
  if (chosenDir === UP || chosenDir === DOWN) {
    length = rng.range(VERTICAL_CORRIDOR_MIN_LENGTH, VERTICAL_CORRIDOR_MAX_LENGTH);
  } else {
    length = rng.range(HORIZONTAL_CORRIDOR_MIN_LENGTH, HORIZONTAL_CORRIDOR_MAX_LENGTH);
  }

  let x = doorSites[chosenDir]!.x;
  let y = doorSites[chosenDir]!.y;
  for (let i = 0; i < length; i++) {
    if (coordinatesAreInMap(x, y)) {
      grid[x]![y] = 1;
    }
    x += nbDirs[chosenDir]![0]!;
    y += nbDirs[chosenDir]![1]!;
  }

  x = clampVal(x - nbDirs[chosenDir]![0]!, 0, DCOLS - 1);
  y = clampVal(y - nbDirs[chosenDir]![1]!, 0, DROWS - 1);

  const allowObliqueHallwayExit = rng.percent(15);
  for (let dir2 = 0; dir2 < 4; dir2++) {
    const newX = x + nbDirs[dir2]![0]!;
    const newY = y + nbDirs[dir2]![1]!;

    if ((dir2 !== chosenDir && !allowObliqueHallwayExit)
      || !coordinatesAreInMap(newX, newY)
      || grid[newX]![newY]) {
      doorSites[dir2] = { ...INVALID_POS };
    } else {
      doorSites[dir2] = { x: newX, y: newY };
    }
  }
}

// ---------------------------------------------------------------------------
// Room design dispatcher
// ---------------------------------------------------------------------------

function designRandomRoom(
  grid: Grid,
  attachHallway: boolean,
  rng: RNG,
  roomTypeFrequencies: number[],
): Pos[] | null {
  let sum = 0;
  for (let i = 0; i < ROOM_TYPE_COUNT; i++) {
    sum += roomTypeFrequencies[i] ?? 0;
  }
  let randIndex = rng.range(0, sum - 1);
  let roomType = 0;
  for (let i = 0; i < ROOM_TYPE_COUNT; i++) {
    if (randIndex < (roomTypeFrequencies[i] ?? 0)) {
      roomType = i;
      break;
    } else {
      randIndex -= roomTypeFrequencies[i] ?? 0;
    }
  }

  switch (roomType) {
    case 0:
      designCrossRoom(grid, rng);
      break;
    case 1:
      designSymmetricalCrossRoom(grid, rng);
      break;
    case 2:
      designSmallRoom(grid, rng);
      break;
    case 3:
      designCircularRoom(grid, rng);
      break;
    case 4:
      designChunkyRoom(grid, rng);
      break;
    case 5:
      switch (rng.range(0, 2)) {
        case 0:
          designCavern(grid, 3, 12, 4, 8, rng);      // Compact cave room
          break;
        case 1:
          designCavern(grid, 3, 12, 15, DROWS - 2, rng); // Large N-S cave room
          break;
        case 2:
          designCavern(grid, 20, DROWS - 2, 4, 8, rng);  // Large E-W cave room
          break;
      }
      break;
    case 6:
      designCavern(grid, CAVE_MIN_WIDTH, DCOLS - 2, CAVE_MIN_HEIGHT, DROWS - 2, rng);
      break;
    case 7:
      designEntranceRoom(grid);
      break;
  }

  const doorSites = chooseRandomDoorSites(grid, rng);
  if (attachHallway) {
    const dir = rng.range(0, 3);
    let chosen = dir;
    for (let i = 0; doorSites[chosen]!.x === -1 && i < 3; i++) {
      chosen = (chosen + 1) % 4;
    }
    attachHallwayTo(grid, doorSites, rng);
  }

  return doorSites;
}

// ---------------------------------------------------------------------------
// Room fitting and insertion
// ---------------------------------------------------------------------------

function roomFitsAt(dungeonMap: Grid, roomMap: Grid, roomToDungeonX: number, roomToDungeonY: number): boolean {
  for (let xRoom = 0; xRoom < DCOLS; xRoom++) {
    for (let yRoom = 0; yRoom < DROWS; yRoom++) {
      if (roomMap[xRoom]![yRoom]) {
        const xDungeon = xRoom + roomToDungeonX;
        const yDungeon = yRoom + roomToDungeonY;

        for (let i = xDungeon - 1; i <= xDungeon + 1; i++) {
          for (let j = yDungeon - 1; j <= yDungeon + 1; j++) {
            if (!coordinatesAreInMap(i, j) || dungeonMap[i]![j]! > 0) {
              return false;
            }
          }
        }
      }
    }
  }
  return true;
}

/**
 * Recursive flood-fill copy of roomMap into dungeonMap, offset by (roomToDungeonX, roomToDungeonY).
 * Uses an iterative stack to avoid deep recursion.
 */
function insertRoomAt(
  dungeonMap: Grid, roomMap: Grid,
  roomToDungeonX: number, roomToDungeonY: number,
  startXRoom: number, startYRoom: number,
): void {
  // Iterative flood fill to avoid stack overflow on large caves
  const stack: Array<[number, number]> = [[startXRoom, startYRoom]];
  const dX = startXRoom + roomToDungeonX;
  const dY = startYRoom + roomToDungeonY;
  if (!coordinatesAreInMap(dX, dY)) return;

  dungeonMap[dX]![dY] = 1;

  while (stack.length > 0) {
    const [xRoom, yRoom] = stack.pop()!;
    for (let dir = 0; dir < 4; dir++) {
      const newX = xRoom + nbDirs[dir]![0]!;
      const newY = yRoom + nbDirs[dir]![1]!;
      if (coordinatesAreInMap(newX, newY)
        && roomMap[newX]![newY]
        && coordinatesAreInMap(newX + roomToDungeonX, newY + roomToDungeonY)
        && dungeonMap[newX + roomToDungeonX]![newY + roomToDungeonY] === 0) {
        dungeonMap[newX + roomToDungeonX]![newY + roomToDungeonY] = 1;
        stack.push([newX, newY]);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Room attachment loop (main dungeon carving)
// ---------------------------------------------------------------------------

function attachRooms(grid: Grid, theDP: DungeonProfile, attempts: number, maxRoomCount: number, rng: RNG): void {
  const sCoord: number[] = new Array(DCOLS * DROWS).fill(0);
  fillSequentialList(sCoord, DCOLS * DROWS);
  rng.shuffle(sCoord);

  const roomMap = allocGrid();

  let roomsBuilt = 0;
  for (let roomsAttempted = 0; roomsBuilt < maxRoomCount && roomsAttempted < attempts; roomsAttempted++) {
    fillGrid(roomMap, 0);
    const doHallway = roomsAttempted <= attempts - 5 && rng.percent(theDP.corridorChance);
    const doorSites = designRandomRoom(roomMap, doHallway, rng, theDP.roomFrequencies);
    if (!doorSites) continue;

    // Slide hyperspace across real space in random order until the room matches a wall
    for (let i = 0; i < DCOLS * DROWS; i++) {
      const x = Math.floor(sCoord[i]! / DROWS);
      const y = sCoord[i]! % DROWS;

      const dir = directionOfDoorSite(grid, x, y);
      const oppDir = oppositeDirection(dir);
      if (dir !== NO_DIRECTION
        && oppDir !== NO_DIRECTION
        && doorSites[oppDir]!.x !== -1
        && roomFitsAt(grid, roomMap, x - doorSites[oppDir]!.x, y - doorSites[oppDir]!.y)) {
        insertRoomAt(grid, roomMap, x - doorSites[oppDir]!.x, y - doorSites[oppDir]!.y, doorSites[oppDir]!.x, doorSites[oppDir]!.y);
        grid[x]![y] = 2; // Door site
        roomsBuilt++;
        break;
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Dungeon finalization: translate grid values to pmap tile types
// ---------------------------------------------------------------------------

function finishWalls(state: GameState): void {
  for (let i = 0; i < DCOLS; i++) {
    for (let j = 0; j < DROWS; j++) {
      if (state.pmap[i]![j]!.layers[0] === GRANITE) {
        let foundExposure = false;
        for (let dir = 0; dir < 8 && !foundExposure; dir++) {
          const x1 = i + nbDirs[dir]![0]!;
          const y1 = j + nbDirs[dir]![1]!;
          if (coordinatesAreInMap(x1, y1)) {
            const t = state.pmap[x1]![y1]!.layers[0]!;
            if (t === FLOOR || t === DOOR || t === DOWN_STAIRS) {
              state.pmap[i]![j]!.layers[0] = WALL;
              foundExposure = true;
            }
          }
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Lake generation (water/lava pools)
// ---------------------------------------------------------------------------

// Tile indices for liquid terrain (matching expanded tileCatalog)
const DEEP_WATER = 42;
const SHALLOW_WATER = 43;
const LAVA = 49;
const CHASM = 45;
const CHASM_EDGE = 46;

function placeLakes(grid: Grid, depth: number, rng: RNG): void {
  // No lakes on depth 1
  if (depth <= 1) return;

  // Chance of lakes increases with depth
  const lakeChance = Math.min(80, 20 + depth * 5);
  if (!rng.percent(lakeChance)) return;

  // Choose liquid type based on depth
  let liquidTile: number;
  let shallowTile: number;
  if (depth >= 8 && rng.percent(40)) {
    liquidTile = LAVA;
    shallowTile = LAVA; // lava has no shallow variant
  } else if (depth >= 12 && rng.percent(30)) {
    liquidTile = CHASM;
    shallowTile = CHASM_EDGE;
  } else {
    liquidTile = DEEP_WATER;
    shallowTile = SHALLOW_WATER;
  }

  // Generate a blob-shaped lake
  const lakeGrid = allocGrid();
  const birth = [false, false, false, false, false, true, true, true, true];
  const survival = [false, false, false, false, true, true, true, true, true];
  const blob = createBlobOnGrid(
    lakeGrid, 4,
    5, 3, Math.min(20, 8 + depth), Math.min(12, 4 + depth),
    55, birth, survival,
    () => rng.range(0, 99),
  );

  // Position lake randomly on the map, avoiding the first room area
  const offsetX = rng.range(5, DCOLS - blob.width - 5);
  const offsetY = rng.range(3, DROWS - blob.height - 3);

  // Place lake tiles on the grid — only replace floor (value 1) cells
  // Don't overwrite corridors, doors, or walls
  let placed = 0;
  for (let x = 0; x < DCOLS; x++) {
    for (let y = 0; y < DROWS; y++) {
      const lx = x - offsetX + blob.minX;
      const ly = y - offsetY + blob.minY;
      if (lx >= 0 && lx < DCOLS && ly >= 0 && ly < DROWS && lakeGrid[lx]![ly]) {
        if (grid[x]![y] === 1) { // only replace floor
          // Use value 3 to mark lake cells (will be converted to liquid tile in pmap)
          grid[x]![y] = 10 + liquidTile; // encode liquid type: 10+tileIndex
          placed++;
        }
      }
    }
  }

  // Add shallow border around the lake
  if (placed > 0 && shallowTile !== liquidTile) {
    for (let x = 1; x < DCOLS - 1; x++) {
      for (let y = 1; y < DROWS - 1; y++) {
        if (grid[x]![y] === 1) { // floor cell
          // Check if adjacent to a lake cell
          for (let dir = 0; dir < 4; dir++) {
            const nx = x + nbDirs[dir]![0]!;
            const ny = y + nbDirs[dir]![1]!;
            if (coordinatesAreInMap(nx, ny) && grid[nx]![ny]! >= 10) {
              grid[x]![y] = 10 + shallowTile;
              break;
            }
          }
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function generateDungeon(state: GameState): void {
  const rng = state.rng;

  // Fill pmap with granite
  for (let x = 0; x < DCOLS; x++) {
    for (let y = 0; y < DROWS; y++) {
      state.pmap[x]![y]!.layers[0] = GRANITE;
    }
  }

  // -----------------------------------------------------------------------
  // Build the dungeon on a binary grid: 0=granite, 1=floor, 2=door
  // -----------------------------------------------------------------------
  const grid = allocGrid();
  fillGrid(grid, 0);

  // --- Dungeon profiles (from BrogueCE Globals.c) ---
  // Basic first room (depth 1 gets entrance room; deeper levels get caverns)
  const firstRoomDP: DungeonProfile = {
    roomFrequencies: [10, 5, 5, 3, 7, 5, 0, 0], // cave enabled (blob gen fixed), cavern disabled (too large for first room)
    corridorChance: 0,
  };

  // On depth 1, force the entrance room
  if (state.stats.depthLevel === 1) {
    for (let i = 0; i < ROOM_TYPE_COUNT; i++) {
      firstRoomDP.roomFrequencies[i] = 0;
    }
    firstRoomDP.roomFrequencies[7] = 1;
  } else {
    // Deeper levels: more caverns
    const descentPercent = clampVal(Math.floor(100 * (state.stats.depthLevel - 1) / 25), 0, 100);
    firstRoomDP.roomFrequencies[6]! += Math.floor(50 * descentPercent / 100);
  }

  // Place first room (no hallway, no door attachment)
  designRandomRoom(grid, false, rng, firstRoomDP.roomFrequencies);

  // --- Main dungeon profile ---
  const mainDP: DungeonProfile = {
    roomFrequencies: [2, 1, 1, 1, 7, 1, 0, 0], // cave enabled
    corridorChance: 10,
  };

  // Adjust for depth
  const descentPercent = clampVal(Math.floor(100 * (state.stats.depthLevel - 1) / 25), 0, 100);
  mainDP.roomFrequencies[0]! += Math.floor(20 * (100 - descentPercent) / 100);
  mainDP.roomFrequencies[1]! += Math.floor(10 * (100 - descentPercent) / 100);
  mainDP.roomFrequencies[3]! += Math.floor(7 * (100 - descentPercent) / 100);
  mainDP.roomFrequencies[5]! += Math.floor(10 * descentPercent / 100);
  mainDP.corridorChance += Math.floor(80 * (100 - descentPercent) / 100);

  // Attach additional rooms
  attachRooms(grid, mainDP, 35, 35, rng);

  // Place lakes (water/lava) on deeper levels
  placeLakes(grid, state.stats.depthLevel, rng);

  // -----------------------------------------------------------------------
  // Translate grid into pmap
  // -----------------------------------------------------------------------
  // Track first and last floor cells for player/stairs placement
  let firstFloorX = -1, firstFloorY = -1;
  let lastFloorX = -1, lastFloorY = -1;
  for (let x = 0; x < DCOLS; x++) {
    for (let y = 0; y < DROWS; y++) {
      const val = grid[x]![y]!;
      if (val === 1) {
        state.pmap[x]![y]!.layers[0] = FLOOR;
        if (firstFloorX === -1) {
          firstFloorX = x;
          firstFloorY = y;
        }
        lastFloorX = x;
        lastFloorY = y;
      } else if (val === 2) {
        state.pmap[x]![y]!.layers[0] = DOOR;
        lastFloorX = x;
        lastFloorY = y;
      } else if (val >= 10) {
        // Lake/liquid tile (encoded as 10 + tileIndex)
        state.pmap[x]![y]!.layers[0] = val - 10;
      }
    }
  }

  // Place walls around exposed granite
  finishWalls(state);

  // -----------------------------------------------------------------------
  // Place player in the first room (center of the first floor region)
  // -----------------------------------------------------------------------
  if (firstFloorX !== -1) {
    // Find center of the first room by scanning the first contiguous block
    // Use the first floor cell as a safe starting point
    state.playerPos.x = firstFloorX;
    state.playerPos.y = firstFloorY;

    // Try to find a more central position in the first room
    // Scan a region around the first floor cell to find center
    let sumX = 0, sumY = 0, count = 0;
    const visited = allocGrid();
    const floodStack: Array<[number, number]> = [[firstFloorX, firstFloorY]];
    visited[firstFloorX]![firstFloorY] = 1;

    while (floodStack.length > 0) {
      const [fx, fy] = floodStack.pop()!;
      sumX += fx;
      sumY += fy;
      count++;
      for (let dir = 0; dir < 4; dir++) {
        const nx = fx + nbDirs[dir]![0]!;
        const ny = fy + nbDirs[dir]![1]!;
        if (coordinatesAreInMap(nx, ny)
          && !visited[nx]![ny]
          && grid[nx]![ny] === 1) {
          visited[nx]![ny] = 1;
          floodStack.push([nx, ny]);
        }
      }
    }

    if (count > 0) {
      const centerX = Math.floor(sumX / count);
      const centerY = Math.floor(sumY / count);
      // Walk from center to find nearest floor cell
      if (coordinatesAreInMap(centerX, centerY)
        && state.pmap[centerX]![centerY]!.layers[0] === FLOOR) {
        state.playerPos.x = centerX;
        state.playerPos.y = centerY;
      }
    }
  }

  // -----------------------------------------------------------------------
  // Place stairs: use Dijkstra to find the farthest REACHABLE floor cell
  // -----------------------------------------------------------------------
  const distMap = allocGrid();
  // Build cost map: floor/door = 1, everything else = -2 (obstruction)
  const costMap = allocGrid();
  for (let x = 0; x < DCOLS; x++) {
    for (let y = 0; y < DROWS; y++) {
      const t = state.pmap[x]![y]!.layers[0]!;
      if (t === FLOOR || t === DOOR || t === 8) { // OPEN_DOOR=8
        costMap[x]![y] = 1;
      } else {
        costMap[x]![y] = -2; // PDS_OBSTRUCTION
      }
    }
  }
  calculateDistances(distMap, state.playerPos.x, state.playerPos.y, costMap, true);

  let stairX = -1, stairY = -1;
  let maxDist = 0;
  for (let x = 0; x < DCOLS; x++) {
    for (let y = 0; y < DROWS; y++) {
      const d = distMap[x]![y]!;
      if (d > maxDist && d < 30000 && state.pmap[x]![y]!.layers[0] === FLOOR) {
        maxDist = d;
        stairX = x;
        stairY = y;
      }
    }
  }

  if (stairX !== -1) {
    state.pmap[stairX]![stairY]!.layers[0] = DOWN_STAIRS;
  }
}
