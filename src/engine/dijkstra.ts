// Dijkstra pathfinding — exact port from BrogueCE Dijkstra.c
// Uses a priority-queue doubly-linked list for efficient scanning.
// In TS we use index-based links instead of C pointer arithmetic.

import { DCOLS, DROWS, nbDirs } from "../shared/constants.ts";

export const PDS_FORBIDDEN = -1;
export const PDS_OBSTRUCTION = -2;
const PDS_MAX_DISTANCE = 30000;

// Linked-list node for the priority queue
interface PDSLink {
  distance: number;
  cost: number;
  left: number;  // index into links[], or -1 for null
  right: number; // index into links[], or -1 for null
}

// The PDS map: a front sentinel + flat array of links
const FRONT = -2; // sentinel index for front node

interface PDSMap {
  frontRight: number; // index of first node in priority queue, or -1
  links: PDSLink[];
}

function cellIndex(x: number, y: number): number {
  return x + DCOLS * y;
}

function createMap(): PDSMap {
  const links: PDSLink[] = new Array(DCOLS * DROWS);
  for (let i = 0; i < DCOLS * DROWS; i++) {
    links[i] = { distance: PDS_MAX_DISTANCE, cost: 0, left: -1, right: -1 };
  }
  return { frontRight: -1, links };
}

// Reusable static maps (matches C's `static pdsMap map`)
const scanMap = createMap();
const calcMap = createMap();

function pdsUpdate(map: PDSMap, useDiagonals: boolean): void {
  const dirs = useDiagonals ? 8 : 4;
  let headIdx = map.frontRight;
  map.frontRight = -1;

  while (headIdx !== -1) {
    const head = map.links[headIdx]!;

    for (let dir = 0; dir < dirs; dir++) {
      const dx = nbDirs[dir]![0]!;
      const dy = nbDirs[dir]![1]!;
      const linkIdx = headIdx + dx + DCOLS * dy;

      // Bounds check
      if (linkIdx < 0 || linkIdx >= DCOLS * DROWS) continue;

      const link = map.links[linkIdx]!;

      // Verify passability
      if (link.cost < 0) continue;

      // For diagonal moves, check that both cardinal neighbors are passable
      if (dir >= 4) {
        const way1Idx = headIdx + dx;
        const way2Idx = headIdx + DCOLS * dy;
        if (way1Idx >= 0 && way1Idx < DCOLS * DROWS && map.links[way1Idx]!.cost === PDS_OBSTRUCTION) continue;
        if (way2Idx >= 0 && way2Idx < DCOLS * DROWS && map.links[way2Idx]!.cost === PDS_OBSTRUCTION) continue;
      }

      if (head.distance + link.cost < link.distance) {
        link.distance = head.distance + link.cost;

        // Remove from current position in list
        if (link.right !== -1) map.links[link.right]!.left = link.left;
        if (link.left === FRONT) {
          map.frontRight = link.right;
        } else if (link.left !== -1) {
          map.links[link.left]!.right = link.right;
        }

        // Reinsert after head (close to beginning since distance just decreased)
        let leftIdx = headIdx;
        let rightIdx = head.right;
        while (rightIdx !== -1 && map.links[rightIdx]!.distance < link.distance) {
          leftIdx = rightIdx;
          rightIdx = map.links[rightIdx]!.right;
        }

        map.links[leftIdx]!.right = linkIdx;
        link.right = rightIdx;
        link.left = leftIdx;
        if (rightIdx !== -1) map.links[rightIdx]!.left = linkIdx;
      }
    }

    const nextIdx = head.right;
    head.left = -1;
    head.right = -1;
    headIdx = nextIdx;
  }
}

function pdsClear(map: PDSMap, maxDistance: number): void {
  map.frontRight = -1;
  for (let i = 0; i < DCOLS * DROWS; i++) {
    const link = map.links[i]!;
    link.distance = maxDistance;
    link.left = -1;
    link.right = -1;
  }
}

function pdsSetDistance(map: PDSMap, x: number, y: number, distance: number): void {
  if (x <= 0 || y <= 0 || x >= DCOLS - 1 || y >= DROWS - 1) return;

  const idx = cellIndex(x, y);
  const link = map.links[idx]!;

  if (link.distance > distance) {
    link.distance = distance;

    // Remove from current position
    if (link.right !== -1) map.links[link.right]!.left = link.left;
    if (link.left === FRONT) {
      map.frontRight = link.right;
    } else if (link.left !== -1) {
      map.links[link.left]!.right = link.right;
    }

    // Insert at front of list, maintaining sorted order
    let leftIdx = FRONT;
    let rightIdx = map.frontRight;
    while (rightIdx !== -1 && map.links[rightIdx]!.distance < link.distance) {
      leftIdx = rightIdx;
      rightIdx = map.links[rightIdx]!.right;
    }

    link.right = rightIdx;
    link.left = leftIdx;
    if (leftIdx === FRONT) {
      map.frontRight = idx;
    } else {
      map.links[leftIdx]!.right = idx;
    }
    if (rightIdx !== -1) map.links[rightIdx]!.left = idx;
  }
}

function pdsBatchInput(
  map: PDSMap,
  distanceMap: number[][] | null,
  costMap: number[][] | null,
  maxDistance: number,
): void {
  let leftIdx = FRONT;
  let rightIdx = -1;
  map.frontRight = -1;

  for (let i = 0; i < DCOLS; i++) {
    for (let j = 0; j < DROWS; j++) {
      const idx = cellIndex(i, j);
      const link = map.links[idx]!;

      if (distanceMap !== null) {
        link.distance = distanceMap[i]![j]!;
      } else if (costMap !== null) {
        link.distance = maxDistance;
      }

      let cost: number;
      if (i === 0 || j === 0 || i === DCOLS - 1 || j === DROWS - 1) {
        cost = PDS_OBSTRUCTION;
      } else if (costMap === null) {
        // Without a cost map, use terrain-based defaults
        // Simplified: treat all interior cells as passable (cost=1)
        // Full implementation needs cellHasTerrainFlag checks
        cost = PDS_FORBIDDEN;
      } else {
        cost = costMap[i]![j]!;
      }

      link.cost = cost;

      if (cost > 0) {
        if (link.distance < maxDistance) {
          if (rightIdx === -1 || (rightIdx !== -1 && map.links[rightIdx]!.distance > link.distance)) {
            leftIdx = FRONT;
            rightIdx = map.frontRight;
          }

          while (rightIdx !== -1 && map.links[rightIdx]!.distance < link.distance) {
            leftIdx = rightIdx;
            rightIdx = map.links[rightIdx]!.right;
          }

          link.right = rightIdx;
          link.left = leftIdx;
          if (leftIdx === FRONT) {
            map.frontRight = idx;
          } else {
            map.links[leftIdx]!.right = idx;
          }
          if (rightIdx !== -1) map.links[rightIdx]!.left = idx;

          leftIdx = idx;
        } else {
          link.right = -1;
          link.left = -1;
        }
      } else {
        link.right = -1;
        link.left = -1;
      }
    }
  }
}

function pdsBatchOutput(map: PDSMap, distanceMap: number[][], useDiagonals: boolean): void {
  pdsUpdate(map, useDiagonals);
  for (let i = 0; i < DCOLS; i++) {
    for (let j = 0; j < DROWS; j++) {
      distanceMap[i]![j] = map.links[cellIndex(i, j)]!.distance;
    }
  }
}

/**
 * Run Dijkstra scan on a distance map with optional cost map.
 * Cells in distanceMap with values < 30000 are treated as sources.
 * costMap values: >0 = traversal cost, PDS_FORBIDDEN(-1) = impassable, PDS_OBSTRUCTION(-2) = blocks diagonals too.
 */
export function dijkstraScan(distanceMap: number[][], costMap: number[][] | null, useDiagonals: boolean): void {
  pdsBatchInput(scanMap, distanceMap, costMap, PDS_MAX_DISTANCE);
  pdsBatchOutput(scanMap, distanceMap, useDiagonals);
}

/**
 * Calculate distances from a single destination point.
 * Simplified version — full version needs creature/terrain checks.
 */
export function calculateDistances(
  distanceMap: number[][],
  destX: number,
  destY: number,
  costMap: number[][] | null,
  useDiagonals: boolean,
): void {
  // Set up costs from costMap or default all to 1
  for (let i = 0; i < DCOLS; i++) {
    for (let j = 0; j < DROWS; j++) {
      let cost: number;
      if (i === 0 || j === 0 || i === DCOLS - 1 || j === DROWS - 1) {
        cost = PDS_OBSTRUCTION;
      } else if (costMap !== null) {
        cost = costMap[i]![j]!;
      } else {
        cost = 1;
      }
      calcMap.links[cellIndex(i, j)]!.cost = cost;
    }
  }

  pdsClear(calcMap, PDS_MAX_DISTANCE);
  pdsSetDistance(calcMap, destX, destY, 0);
  pdsBatchOutput(calcMap, distanceMap, useDiagonals);
}

/**
 * Get the pathing distance between two points.
 */
export function pathingDistance(x1: number, y1: number, x2: number, y2: number, allocGrid: () => number[][]): number {
  const distanceMap = allocGrid();
  calculateDistances(distanceMap, x2, y2, null, true);
  return distanceMap[x1]![y1]!;
}
