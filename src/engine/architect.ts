import { DCOLS, DROWS } from "../shared/constants.ts";
import type { GameState } from "./state.ts";

// Tile types (simplified for Phase 1)
const NOTHING = 0;
const GRANITE = 1;
const FLOOR = 2;
const WALL = 6;
const DOOR = 7;
const DOWN_STAIRS = 15;

interface Room {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function generateDungeon(state: GameState): void {
  const rng = state.rng;

  // Fill with granite
  for (let x = 0; x < DCOLS; x++) {
    for (let y = 0; y < DROWS; y++) {
      state.pmap[x]![y]!.layers[0] = GRANITE;
    }
  }

  // Generate rooms
  const rooms: Room[] = [];
  const maxRooms = 15 + rng.range(0, 10);

  for (let attempt = 0; attempt < 200 && rooms.length < maxRooms; attempt++) {
    const width = 4 + rng.range(0, 8);
    const height = 3 + rng.range(0, 5);
    const x = 1 + rng.range(0, DCOLS - width - 2);
    const y = 1 + rng.range(0, DROWS - height - 2);

    const room: Room = { x, y, width, height };

    // Check for overlap with existing rooms (with 1-cell padding)
    let overlaps = false;
    for (const existing of rooms) {
      if (
        room.x - 1 < existing.x + existing.width + 1 &&
        room.x + room.width + 1 > existing.x - 1 &&
        room.y - 1 < existing.y + existing.height + 1 &&
        room.y + room.height + 1 > existing.y - 1
      ) {
        overlaps = true;
        break;
      }
    }

    if (!overlaps) {
      rooms.push(room);
      carveRoom(state, room);
    }
  }

  // Connect rooms with corridors
  for (let i = 1; i < rooms.length; i++) {
    connectRooms(state, rooms[i - 1]!, rooms[i]!, rng);
  }

  // Place walls around floor tiles
  placeWalls(state);

  // Place player in first room
  const firstRoom = rooms[0]!;
  state.playerPos.x = firstRoom.x + Math.floor(firstRoom.width / 2);
  state.playerPos.y = firstRoom.y + Math.floor(firstRoom.height / 2);

  // Place stairs in last room
  if (rooms.length > 1) {
    const lastRoom = rooms[rooms.length - 1]!;
    const stairX = lastRoom.x + Math.floor(lastRoom.width / 2);
    const stairY = lastRoom.y + Math.floor(lastRoom.height / 2);
    state.pmap[stairX]![stairY]!.layers[0] = DOWN_STAIRS;
  }
}

function carveRoom(state: GameState, room: Room): void {
  for (let x = room.x; x < room.x + room.width; x++) {
    for (let y = room.y; y < room.y + room.height; y++) {
      if (x >= 0 && x < DCOLS && y >= 0 && y < DROWS) {
        state.pmap[x]![y]!.layers[0] = FLOOR;
      }
    }
  }
}

function connectRooms(state: GameState, a: Room, b: Room, rng: { range: (lo: number, hi: number) => number }): void {
  // Get center points
  let cx = a.x + Math.floor(a.width / 2);
  let cy = a.y + Math.floor(a.height / 2);
  const tx = b.x + Math.floor(b.width / 2);
  const ty = b.y + Math.floor(b.height / 2);

  // Randomly choose horizontal-first or vertical-first
  const horizontalFirst = rng.range(0, 1) === 0;

  if (horizontalFirst) {
    carveCorridor(state, cx, cy, tx, cy); // horizontal
    carveCorridor(state, tx, cy, tx, ty); // vertical
  } else {
    carveCorridor(state, cx, cy, cx, ty); // vertical
    carveCorridor(state, cx, ty, tx, ty); // horizontal
  }
}

function carveCorridor(state: GameState, x1: number, y1: number, x2: number, y2: number): void {
  let x = x1;
  let y = y1;
  const dx = Math.sign(x2 - x1);
  const dy = Math.sign(y2 - y1);

  while (x !== x2 || y !== y2) {
    if (x >= 0 && x < DCOLS && y >= 0 && y < DROWS) {
      const cell = state.pmap[x]![y]!;
      if (cell.layers[0] === GRANITE) {
        cell.layers[0] = FLOOR;
      }
    }
    if (x !== x2) x += dx;
    else if (y !== y2) y += dy;
  }
  // Carve the final cell
  if (x >= 0 && x < DCOLS && y >= 0 && y < DROWS) {
    const cell = state.pmap[x]![y]!;
    if (cell.layers[0] === GRANITE) {
      cell.layers[0] = FLOOR;
    }
  }
}

function placeWalls(state: GameState): void {
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]];

  for (let x = 0; x < DCOLS; x++) {
    for (let y = 0; y < DROWS; y++) {
      if (state.pmap[x]![y]!.layers[0] !== GRANITE) continue;

      // Check if any neighbor is floor
      for (const [dx, dy] of dirs) {
        const nx = x + dx!;
        const ny = y + dy!;
        if (nx >= 0 && nx < DCOLS && ny >= 0 && ny < DROWS) {
          const neighbor = state.pmap[nx]![ny]!.layers[0];
          if (neighbor === FLOOR || neighbor === DOWN_STAIRS) {
            state.pmap[x]![y]!.layers[0] = WALL;
            break;
          }
        }
      }
    }
  }

  // Place doors at corridor-room transitions
  for (let x = 1; x < DCOLS - 1; x++) {
    for (let y = 1; y < DROWS - 1; y++) {
      if (state.pmap[x]![y]!.layers[0] !== FLOOR) continue;

      // A door candidate: floor cell with walls on two opposite sides
      // and floor on the other two opposite sides
      const isHorizontalDoor =
        isWallLike(state, x - 1, y) && isWallLike(state, x + 1, y) &&
        isFloorLike(state, x, y - 1) && isFloorLike(state, x, y + 1);
      const isVerticalDoor =
        isWallLike(state, x, y - 1) && isWallLike(state, x, y + 1) &&
        isFloorLike(state, x - 1, y) && isFloorLike(state, x + 1, y);

      if (isHorizontalDoor || isVerticalDoor) {
        state.pmap[x]![y]!.layers[0] = DOOR;
      }
    }
  }
}

function isWallLike(state: GameState, x: number, y: number): boolean {
  if (x < 0 || x >= DCOLS || y < 0 || y >= DROWS) return true;
  const t = state.pmap[x]![y]!.layers[0]!;
  return t === WALL || t === GRANITE;
}

function isFloorLike(state: GameState, x: number, y: number): boolean {
  if (x < 0 || x >= DCOLS || y < 0 || y >= DROWS) return false;
  const t = state.pmap[x]![y]!.layers[0]!;
  return t === FLOOR || t === DOWN_STAIRS;
}
