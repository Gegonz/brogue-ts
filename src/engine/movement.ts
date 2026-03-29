import { DCOLS, DROWS } from "../shared/constants.ts";
import type { GameState } from "./state.ts";

// Tile type constants (matching TileType enum)
const FLOOR = 2;
const FLOOR_FLOODABLE = 3;
const CARPET = 4;
const MARBLE_FLOOR = 5;
const DOOR = 7;
const OPEN_DOOR = 8;
const DOWN_STAIRS = 12;
const UP_STAIRS = 13;

function isPassable(tileType: number): boolean {
  switch (tileType) {
    case FLOOR: case FLOOR_FLOODABLE: case CARPET: case MARBLE_FLOOR:
    case OPEN_DOOR: case DOWN_STAIRS: case UP_STAIRS:
      return true;
    default:
      return false;
  }
}

export function tryMovePlayer(state: GameState, dx: number, dy: number): boolean {
  const newX = state.playerPos.x + dx;
  const newY = state.playerPos.y + dy;

  if (newX < 0 || newX >= DCOLS || newY < 0 || newY >= DROWS) {
    return false;
  }

  const cell = state.pmap[newX]![newY]!;
  const groundTile = cell.layers[0]!;

  // Open doors
  if (groundTile === DOOR) {
    cell.layers[0] = OPEN_DOOR;
    state.addMessage("You open the door.");
    return true;
  }

  // Move to passable terrain
  if (isPassable(groundTile)) {
    state.playerPos.x = newX;
    state.playerPos.y = newY;

    // Standing on stairs — notify
    if (groundTile === DOWN_STAIRS) {
      state.addMessage("You see a downward staircase here. Press > to descend.");
    }

    return true;
  }

  return false;
}
