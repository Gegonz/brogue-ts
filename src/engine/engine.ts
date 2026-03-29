import { COLS, ROWS, DCOLS, DROWS, STAT_BAR_WIDTH, MESSAGE_LINES } from "../shared/constants.ts";
import type { CellDisplayBuffer } from "../shared/types.ts";
import { GameState } from "./state.ts";
import { RNG } from "./rng.ts";
import { generateDungeon } from "./architect.ts";
import { tryMovePlayer } from "./movement.ts";
import { computeFOV } from "./fov.ts";
import { updateLighting } from "./light.ts";

type EventCallback = (...args: unknown[]) => void;

export interface GameStateSnapshot {
  turn: number;
  depth: number;
  phase: "playing" | "dead" | "won";
  player: {
    hp: number; maxHp: number;
    strength: number; maxStrength: number;
    gold: number; nutrition: number;
    depthLevel: number; turnNumber: number;
    seed: number;
    x: number; y: number;
  };
  messages: string[];
  map: string;
  stairsAt: { x: number; y: number } | null;
}

export class GameEngine {
  private state: GameState = new GameState();
  private listeners: Map<string, EventCallback[]> = new Map();

  newGame(seed?: bigint): void {
    this.state = new GameState();
    this.state.rng = new RNG(seed);
    this.state.stats.seed = this.state.rng.seed;
    this.state.initGrids();

    // Generate the first dungeon level
    generateDungeon(this.state);

    // Compute initial FOV
    computeFOV(this.state);
    updateLighting(this.state);

    // Update display buffer
    this.updateDisplay();
    this.emit("displayChanged");
    this.state.messages.push("Welcome to Brogue!");
  }

  handleKeystroke(key: number, _ctrl = false, _shift = false): void {
    if (this.state.gameOver) return;

    const ch = String.fromCharCode(key);

    // Movement keys
    const dirMap: Record<string, [number, number]> = {
      h: [-1, 0], j: [0, 1], k: [0, -1], l: [1, 0],
      y: [-1, -1], u: [1, -1], b: [-1, 1], n: [1, 1],
    };

    if (dirMap[ch]) {
      const [dx, dy] = dirMap[ch]!;
      if (tryMovePlayer(this.state, dx, dy)) {
        this.state.stats.turnNumber++;
        computeFOV(this.state);
        this.updateDisplay();
        this.emit("displayChanged");
      }
      return;
    }

    // Rest
    if (ch === ".") {
      this.state.stats.turnNumber++;
      this.state.messages.push("You rest for a moment.");
      this.updateDisplay();
      this.emit("displayChanged");
      return;
    }

    // Search
    if (ch === "s") {
      this.state.stats.turnNumber++;
      this.state.messages.push("You search the area.");
      this.updateDisplay();
      this.emit("displayChanged");
      return;
    }

    // Descend stairs
    if (ch === ">") {
      const px = this.state.playerPos.x;
      const py = this.state.playerPos.y;
      const tile = this.state.pmap[px]![py]!.layers[0]!;
      if (tile === 12) { // DOWN_STAIRS
        this.state.stats.depthLevel++;
        this.state.stats.turnNumber++;
        this.state.initGrids();
        generateDungeon(this.state);
        computeFOV(this.state);
        updateLighting(this.state);
        this.updateDisplay();
        this.emit("displayChanged");
        this.state.messages.push(`You descend to depth ${this.state.stats.depthLevel}.`);
      } else {
        this.state.messages.push("There are no stairs here.");
        this.updateDisplay();
        this.emit("displayChanged");
      }
      return;
    }
  }

  getDisplayBuffer(): CellDisplayBuffer[][] {
    return this.state.displayBuffer;
  }

  getState(): GameStateSnapshot {
    const s = this.state.stats;
    return {
      turn: s.turnNumber,
      depth: s.depthLevel,
      phase: this.state.gameOver ? (this.state.victory ? "won" : "dead") : "playing",
      player: {
        hp: s.hp, maxHp: s.maxHp,
        strength: s.strength, maxStrength: s.maxStrength,
        gold: s.gold, nutrition: s.nutrition,
        depthLevel: s.depthLevel, turnNumber: s.turnNumber,
        seed: Number(s.seed),
        x: this.state.playerPos.x,
        y: this.state.playerPos.y,
      },
      messages: this.state.messages.slice(-10),
      map: this.getAsciiMap(),
      stairsAt: this.findStairs(),
    };
  }

  private findStairs(): { x: number; y: number } | null {
    for (let x = 0; x < DCOLS; x++) {
      for (let y = 0; y < DROWS; y++) {
        if (this.state.pmap[x]![y]!.layers[0] === 12) { // DOWN_STAIRS
          return { x, y };
        }
      }
    }
    return null;
  }

  getAsciiMap(): string {
    const lines: string[] = [];
    for (let y = 0; y < DROWS; y++) {
      let line = "";
      for (let x = 0; x < DCOLS; x++) {
        const cell = this.state.displayBuffer[x + STAT_BAR_WIDTH + 1]?.[y + MESSAGE_LINES];
        if (cell) {
          line += cell.character || " ";
        } else {
          line += " ";
        }
      }
      // Trim trailing spaces
      lines.push(line.trimEnd());
    }
    // Remove empty trailing lines
    while (lines.length > 0 && lines[lines.length - 1] === "") {
      lines.pop();
    }
    return lines.join("\n");
  }

  private updateDisplay(): void {
    const buf = this.state.displayBuffer;
    const pmap = this.state.pmap;
    const playerPos = this.state.playerPos;

    // Clear display
    for (let x = 0; x < COLS; x++) {
      for (let y = 0; y < ROWS; y++) {
        const cell = buf[x]![y]!;
        cell.character = " ";
        cell.foreColorComponents = [0, 0, 0];
        cell.backColorComponents = [0, 0, 0];
      }
    }

    // Render dungeon cells with lighting
    const tmap = this.state.tmap;
    for (let x = 0; x < DCOLS; x++) {
      for (let y = 0; y < DROWS; y++) {
        const pcell = pmap[x]![y]!;
        const screenX = x + STAT_BAR_WIDTH + 1;
        const screenY = y + MESSAGE_LINES;
        const displayCell = buf[screenX]![screenY]!;

        // Check visibility
        if (!(pcell.flags & 0x1)) continue; // DISCOVERED flag

        const layer = pcell.layers[0]!;
        const appearance = getCellAppearance(layer);
        displayCell.character = appearance.char;

        if (pcell.flags & 0x2) { // VISIBLE — apply lighting from tmap
          const light = tmap[x]![y]!.light;
          // Blend tile color with light: base + light contribution, clamped 0-100
          displayCell.foreColorComponents = [
            Math.max(0, Math.min(100, appearance.fg[0] + Math.floor(light[0] / 3))),
            Math.max(0, Math.min(100, appearance.fg[1] + Math.floor(light[1] / 3))),
            Math.max(0, Math.min(100, appearance.fg[2] + Math.floor(light[2] / 3))),
          ];
          displayCell.backColorComponents = [
            Math.max(0, Math.min(100, appearance.bg[0] + Math.floor(light[0] / 5))),
            Math.max(0, Math.min(100, appearance.bg[1] + Math.floor(light[1] / 5))),
            Math.max(0, Math.min(100, appearance.bg[2] + Math.floor(light[2] / 5))),
          ];
        } else { // DISCOVERED but not visible — blue-tinted memory
          displayCell.foreColorComponents = [
            Math.floor(appearance.fg[0] * 0.25),
            Math.floor(appearance.fg[1] * 0.25),
            Math.floor(appearance.fg[2] * 0.35),
          ];
          displayCell.backColorComponents = [
            Math.floor(appearance.bg[0] * 0.2),
            Math.floor(appearance.bg[1] * 0.2),
            Math.floor(appearance.bg[2] * 0.3),
          ];
        }
      }
    }

    // Render player
    const px = playerPos.x + STAT_BAR_WIDTH + 1;
    const py = playerPos.y + MESSAGE_LINES;
    if (px >= 0 && px < COLS && py >= 0 && py < ROWS) {
      const cell = buf[px]![py]!;
      cell.character = "@";
      cell.foreColorComponents = [100, 100, 100]; // white
    }

    // Render sidebar
    this.renderSidebar();

    // Render messages
    this.renderMessages();
  }

  private renderSidebar(): void {
    const buf = this.state.displayBuffer;
    const stats = this.state.stats;

    const lines = [
      `Depth: ${stats.depthLevel}`,
      `HP: ${stats.hp}/${stats.maxHp}`,
      `Str: ${stats.strength}/${stats.maxStrength}`,
      `Gold: ${stats.gold}`,
      `Turn: ${stats.turnNumber}`,
    ];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]!;
      for (let j = 0; j < line.length && j < STAT_BAR_WIDTH; j++) {
        const cell = buf[j]![i + 1]!;
        cell.character = line[j]!;
        cell.foreColorComponents = [80, 80, 80];
      }
    }
  }

  private renderMessages(): void {
    const buf = this.state.displayBuffer;
    const messages = this.state.messages.slice(-MESSAGE_LINES);

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i]!;
      for (let j = 0; j < msg.length && j < COLS; j++) {
        const cell = buf[j]![i]!;
        cell.character = msg[j]!;
        cell.foreColorComponents = [100, 100, 100];
      }
    }
  }

  on(event: string, cb: EventCallback): void {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event)!.push(cb);
  }

  private emit(event: string, ...args: unknown[]): void {
    const cbs = this.listeners.get(event);
    if (cbs) cbs.forEach(cb => cb(...args));
  }
}

// Tile appearance lookup — data-driven via tileCatalog
import { tileCatalog } from "./catalogs/tiles.ts";

interface TileAppearance {
  char: string;
  fg: [number, number, number];
  bg: [number, number, number];
}

function getCellAppearance(tileType: number): TileAppearance {
  const entry = tileCatalog[tileType] ?? tileCatalog[2]!; // default to FLOOR
  return {
    char: entry.displayChar,
    fg: [...entry.foreColor],
    bg: [...entry.backColor],
  };
}
