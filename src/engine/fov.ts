import { DCOLS, DROWS } from "../shared/constants.ts";
import type { GameState } from "./state.ts";

const CELL_DISCOVERED = 0x1;
const CELL_VISIBLE = 0x2;

// Octant multipliers for shadow-casting FOV
const OCTANT_MULTIPLIERS = [
  [1, 0, 0, -1, -1, 0, 0, 1],  // xx
  [0, 1, -1, 0, 0, -1, 1, 0],  // xy
  [0, 1, 1, 0, 0, -1, -1, 0],  // yx
  [1, 0, 0, 1, -1, 0, 0, -1],  // yy
];

function blocksVision(state: GameState, x: number, y: number): boolean {
  if (x < 0 || x >= DCOLS || y < 0 || y >= DROWS) return true;
  const tile = state.pmap[x]![y]!.layers[0]!;
  // GRANITE=1, WALL=6, DOOR=7, SECRET_DOOR=9 block vision
  return tile === 1 || tile === 6 || tile === 7 || tile === 9;
}

function scanOctant(
  state: GameState,
  cx: number, cy: number,
  row: number,
  startSlope: number,
  endSlope: number,
  radius: number,
  octant: number
): void {
  if (startSlope < endSlope) return;

  const xx = OCTANT_MULTIPLIERS[0]![octant]!;
  const xy = OCTANT_MULTIPLIERS[1]![octant]!;
  const yx = OCTANT_MULTIPLIERS[2]![octant]!;
  const yy = OCTANT_MULTIPLIERS[3]![octant]!;

  let nextStartSlope = startSlope;

  for (let i = row; i <= radius; i++) {
    let blocked = false;
    for (let dx = -i, dy = -i; dx <= 0; dx++) {
      const lSlope = (dx - 0.5) / (dy + 0.5);
      const rSlope = (dx + 0.5) / (dy - 0.5);

      if (rSlope > nextStartSlope) continue;
      if (lSlope < endSlope) break;

      const ax = cx + dx * xx + dy * xy;
      const ay = cy + dx * yx + dy * yy;

      if (ax >= 0 && ax < DCOLS && ay >= 0 && ay < DROWS) {
        if (dx * dx + dy * dy < radius * radius) {
          state.pmap[ax]![ay]!.flags |= CELL_VISIBLE | CELL_DISCOVERED;
        }
      }

      if (blocked) {
        if (blocksVision(state, ax, ay)) {
          nextStartSlope = rSlope;
          continue;
        } else {
          blocked = false;
          nextStartSlope = nextStartSlope;
        }
      } else {
        if (blocksVision(state, ax, ay) && i < radius) {
          blocked = true;
          scanOctant(state, cx, cy, i + 1, nextStartSlope, lSlope, radius, octant);
          nextStartSlope = rSlope;
        }
      }
    }
    if (blocked) break;
  }
}

/**
 * Get a FOV mask into a grid (used by lighting).
 * Cells within line-of-sight get set to 1, others stay 0.
 */
export function getFOVMask(
  grid: number[][],
  state: GameState,
  cx: number, cy: number,
  radius: number,
): void {
  // Mark center
  if (cx >= 0 && cx < DCOLS && cy >= 0 && cy < DROWS) {
    grid[cx]![cy] = 1;
  }
  for (let octant = 0; octant < 8; octant++) {
    scanOctantGrid(grid, state, cx, cy, 1, 1.0, 0.0, radius, octant);
  }
}

function scanOctantGrid(
  grid: number[][],
  state: GameState,
  cx: number, cy: number,
  row: number,
  startSlope: number,
  endSlope: number,
  radius: number,
  octant: number,
): void {
  if (startSlope < endSlope) return;

  const xx = OCTANT_MULTIPLIERS[0]![octant]!;
  const xy = OCTANT_MULTIPLIERS[1]![octant]!;
  const yx = OCTANT_MULTIPLIERS[2]![octant]!;
  const yy = OCTANT_MULTIPLIERS[3]![octant]!;

  let nextStartSlope = startSlope;

  for (let i = row; i <= radius; i++) {
    let blocked = false;
    for (let dx = -i, dy = -i; dx <= 0; dx++) {
      const lSlope = (dx - 0.5) / (dy + 0.5);
      const rSlope = (dx + 0.5) / (dy - 0.5);

      if (rSlope > nextStartSlope) continue;
      if (lSlope < endSlope) break;

      const ax = cx + dx * xx + dy * xy;
      const ay = cy + dx * yx + dy * yy;

      if (ax >= 0 && ax < DCOLS && ay >= 0 && ay < DROWS) {
        if (dx * dx + dy * dy < radius * radius) {
          grid[ax]![ay] = 1;
        }
      }

      if (blocked) {
        if (blocksVision(state, ax, ay)) {
          nextStartSlope = rSlope;
          continue;
        } else {
          blocked = false;
        }
      } else {
        if (blocksVision(state, ax, ay) && i < radius) {
          blocked = true;
          scanOctantGrid(grid, state, cx, cy, i + 1, nextStartSlope, lSlope, radius, octant);
          nextStartSlope = rSlope;
        }
      }
    }
    if (blocked) break;
  }
}

export function computeFOV(state: GameState): void {
  const px = state.playerPos.x;
  const py = state.playerPos.y;
  const radius = 15; // visual range

  // Clear visibility (keep DISCOVERED)
  for (let x = 0; x < DCOLS; x++) {
    for (let y = 0; y < DROWS; y++) {
      state.pmap[x]![y]!.flags &= ~CELL_VISIBLE;
    }
  }

  // Mark player's cell
  state.pmap[px]![py]!.flags |= CELL_VISIBLE | CELL_DISCOVERED;

  // Scan all 8 octants
  for (let octant = 0; octant < 8; octant++) {
    scanOctant(state, px, py, 1, 1.0, 0.0, radius, octant);
  }
}
