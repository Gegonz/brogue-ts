import { COLS, ROWS, DCOLS, DROWS } from "../shared/constants.ts";
import type { CellDisplayBuffer, PCell, TCell, Pos, LevelData } from "../shared/types.ts";
import type { RNG } from "./rng.ts";

export interface PlayerStats {
  depthLevel: number;
  gold: number;
  hp: number;
  maxHp: number;
  strength: number;
  maxStrength: number;
  nutrition: number;
  seed: bigint;
  turnNumber: number;
}

export class GameState {
  // Dungeon grid
  pmap: PCell[][] = [];
  tmap: TCell[][] = [];
  scentMap: number[][] = [];
  terrainRandomValues: number[][][] = [];

  // Display
  displayBuffer: CellDisplayBuffer[][] = [];

  // Pathfinding maps
  safetyMap: number[][] | null = null;
  allySafetyMap: number[][] | null = null;
  chokeMap: number[][] | null = null;

  // Player
  playerPos: Pos = { x: 0, y: 0 };
  stats: PlayerStats = {
    depthLevel: 1,
    gold: 0,
    hp: 30,
    maxHp: 30,
    strength: 12,
    maxStrength: 12,
    nutrition: 1800,
    seed: 0n,
    turnNumber: 0,
  };

  // Messages
  messages: string[] = [];
  messageArchive: string[] = [];

  // Level storage
  levels: LevelData[] = [];

  // RNG
  rng!: RNG;

  // Game lifecycle
  gameOver = false;
  victory = false;

  initGrids(): void {
    this.pmap = this.allocPCellGrid();
    this.tmap = this.allocTCellGrid();
    this.scentMap = this.allocNumberGrid();
    this.displayBuffer = this.allocDisplayBuffer();
    this.terrainRandomValues = Array.from({ length: DCOLS }, () =>
      Array.from({ length: DROWS }, () => new Array(8).fill(0))
    );
  }

  private allocNumberGrid(): number[][] {
    return Array.from({ length: DCOLS }, () => new Array(DROWS).fill(0));
  }

  private allocPCellGrid(): PCell[][] {
    return Array.from({ length: DCOLS }, () =>
      Array.from({ length: DROWS }, (): PCell => ({
        layers: [0, 0, 0, 0],
        flags: 0,
        volume: 0,
        machineNumber: 0,
        rememberedAppearance: { character: " ", foreColorComponents: [0, 0, 0], backColorComponents: [0, 0, 0], opacity: 0 },
        rememberedItemCategory: 0,
        rememberedItemKind: 0,
        rememberedItemQuantity: 0,
        rememberedItemOriginDepth: 0,
        rememberedTerrain: 0,
        rememberedCellFlags: 0,
        rememberedTerrainFlags: 0,
        rememberedTMFlags: 0,
        exposedToFire: 0,
      }))
    );
  }

  private allocTCellGrid(): TCell[][] {
    return Array.from({ length: DCOLS }, () =>
      Array.from({ length: DROWS }, (): TCell => ({
        light: [0, 0, 0],
        oldLight: [0, 0, 0],
      }))
    );
  }

  private allocDisplayBuffer(): CellDisplayBuffer[][] {
    return Array.from({ length: COLS }, () =>
      Array.from({ length: ROWS }, (): CellDisplayBuffer => ({
        character: " ",
        foreColorComponents: [0, 0, 0],
        backColorComponents: [0, 0, 0],
        opacity: 100,
      }))
    );
  }
}
