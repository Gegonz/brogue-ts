// Grid utility functions ported from BrogueCE Grid.c

import { DCOLS, DROWS, nbDirs } from "../shared/constants.ts";

export type Grid = number[][];

export function allocGrid(): Grid {
  return Array.from({ length: DCOLS }, () => new Array(DROWS).fill(0));
}

export function copyGrid(to: Grid, from: Grid): void {
  for (let i = 0; i < DCOLS; i++) {
    for (let j = 0; j < DROWS; j++) {
      to[i]![j] = from[i]![j]!;
    }
  }
}

export function fillGrid(grid: Grid, value: number): void {
  for (let i = 0; i < DCOLS; i++) {
    for (let j = 0; j < DROWS; j++) {
      grid[i]![j] = value;
    }
  }
}

export function findReplaceGrid(grid: Grid, findMin: number, findMax: number, fillValue: number): void {
  for (let i = 0; i < DCOLS; i++) {
    for (let j = 0; j < DROWS; j++) {
      if (grid[i]![j]! >= findMin && grid[i]![j]! <= findMax) {
        grid[i]![j] = fillValue;
      }
    }
  }
}

export function coordinatesAreInMap(x: number, y: number): boolean {
  return x >= 0 && x < DCOLS && y >= 0 && y < DROWS;
}

export function floodFillGrid(
  grid: Grid, x: number, y: number,
  eligibleMin: number, eligibleMax: number, fillValue: number,
): number {
  grid[x]![y] = fillValue;
  let count = 1;
  for (let dir = 0; dir < 4; dir++) {
    const nx = x + nbDirs[dir]![0]!;
    const ny = y + nbDirs[dir]![1]!;
    if (coordinatesAreInMap(nx, ny) && grid[nx]![ny]! >= eligibleMin && grid[nx]![ny]! <= eligibleMax) {
      count += floodFillGrid(grid, nx, ny, eligibleMin, eligibleMax, fillValue);
    }
  }
  return count;
}

export function drawRectangleOnGrid(grid: Grid, x: number, y: number, w: number, h: number, value: number): void {
  for (let i = x; i < x + w; i++) {
    for (let j = y; j < y + h; j++) {
      if (coordinatesAreInMap(i, j)) grid[i]![j] = value;
    }
  }
}

export function drawCircleOnGrid(grid: Grid, cx: number, cy: number, radius: number, value: number): void {
  for (let i = Math.max(0, cx - radius); i < Math.min(DCOLS, cx + radius + 1); i++) {
    for (let j = Math.max(0, cy - radius); j < Math.min(DROWS, cy + radius + 1); j++) {
      if ((i - cx) * (i - cx) + (j - cy) * (j - cy) < radius * radius + radius) {
        grid[i]![j] = value;
      }
    }
  }
}

export function validLocationCount(grid: Grid, value: number): number {
  let count = 0;
  for (let i = 0; i < DCOLS; i++) {
    for (let j = 0; j < DROWS; j++) {
      if (grid[i]![j] === value) count++;
    }
  }
  return count;
}

function fillContiguousRegion(grid: Grid, x: number, y: number, fillValue: number): number {
  grid[x]![y] = fillValue;
  let count = 1;
  for (let dir = 0; dir < 4; dir++) {
    const nx = x + nbDirs[dir]![0]!;
    const ny = y + nbDirs[dir]![1]!;
    if (coordinatesAreInMap(nx, ny) && grid[nx]![ny] === 1) {
      count += fillContiguousRegion(grid, nx, ny, fillValue);
    }
  }
  return count;
}

export interface BlobResult {
  minX: number;
  minY: number;
  width: number;
  height: number;
}

export function createBlobOnGrid(
  grid: Grid,
  roundCount: number,
  minW: number, minH: number,
  maxW: number, maxH: number,
  percentSeeded: number,
  birth: boolean[], survival: boolean[],
  rng: () => number = Math.random,
): BlobResult {
  let topMinX: number, topMinY: number, topMaxX: number, topMaxY: number;
  let blobW: number, blobH: number, topNum: number;

  do {
    fillGrid(grid, 0);

    // Seed
    for (let i = 0; i < maxW; i++) {
      for (let j = 0; j < maxH; j++) {
        grid[i]![j] = rng() * 100 < percentSeeded ? 1 : 0;
      }
    }

    // CA rounds
    for (let k = 0; k < roundCount; k++) {
      const buf = allocGrid();
      copyGrid(buf, grid);
      for (let i = 0; i < DCOLS; i++) {
        for (let j = 0; j < DROWS; j++) {
          let nb = 0;
          for (let d = 0; d < 8; d++) {
            const nx = i + nbDirs[d]![0]!;
            const ny = j + nbDirs[d]![1]!;
            if (coordinatesAreInMap(nx, ny) && buf[nx]![ny]!) nb++;
          }
          if (!buf[i]![j] && birth[nb]) {
            grid[i]![j] = 1;
          } else if (buf[i]![j] && survival[nb]) {
            // survive
          } else {
            grid[i]![j] = 0;
          }
        }
      }
    }

    // Find largest blob
    let topSize = 0;
    topNum = 0;
    topMinX = maxW; topMaxX = 0; topMinY = maxH; topMaxY = 0;
    let blobNum = 2;

    for (let i = 0; i < DCOLS; i++) {
      for (let j = 0; j < DROWS; j++) {
        if (grid[i]![j] === 1) {
          const size = fillContiguousRegion(grid, i, j, blobNum);
          if (size > topSize) { topSize = size; topNum = blobNum; }
          blobNum++;
        }
      }
    }

    // Bounding box
    for (let i = 0; i < DCOLS; i++) {
      for (let j = 0; j < DROWS; j++) {
        if (grid[i]![j] === topNum) {
          if (i < topMinX) topMinX = i;
          if (i > topMaxX) topMaxX = i;
          if (j < topMinY) topMinY = j;
          if (j > topMaxY) topMaxY = j;
        }
      }
    }

    blobW = topMaxX - topMinX + 1;
    blobH = topMaxY - topMinY + 1;
  } while (blobW < minW || blobH < minH || topNum === 0);

  // Clean up: winning blob = 1, rest = 0
  for (let i = 0; i < DCOLS; i++) {
    for (let j = 0; j < DROWS; j++) {
      grid[i]![j] = grid[i]![j] === topNum ? 1 : 0;
    }
  }

  return { minX: topMinX!, minY: topMinY!, width: blobW!, height: blobH! };
}
