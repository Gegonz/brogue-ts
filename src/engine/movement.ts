import { DCOLS, DROWS } from "../shared/constants.ts";
import type { GameState } from "./state.ts";

function isPassable(tileType: number): boolean {
  // FLOOR=2, FLOOR_FLOODABLE=3, CARPET=4, MARBLE_FLOOR=5, OPEN_DOOR=8
  // Also allow stairs: DOWN_STAIRS~=15, UP_STAIRS~=16
  switch (tileType) {
    case 2: case 3: case 4: case 5: case 8:
    case 15: case 16:
      return true;
    default:
      return false;
  }
}

function isDoor(tileType: number): boolean {
  return tileType === 7; // DOOR
}

export function tryMovePlayer(state: GameState, dx: number, dy: number): boolean {
  const newX = state.playerPos.x + dx;
  const newY = state.playerPos.y + dy;

  // Bounds check
  if (newX < 0 || newX >= DCOLS || newY < 0 || newY >= DROWS) {
    return false;
  }

  const cell = state.pmap[newX]![newY]!;
  const groundTile = cell.layers[0]!;

  // Open doors
  if (isDoor(groundTile)) {
    cell.layers[0] = 8; // OPEN_DOOR
    state.messages.push("You open the door.");
    return true;
  }

  // Move to passable terrain
  if (isPassable(groundTile)) {
    state.playerPos.x = newX;
    state.playerPos.y = newY;
    return true;
  }

  // Bumped into wall
  return false;
}
