import { COLS, ROWS, DCOLS, DROWS, STAT_BAR_WIDTH, MESSAGE_LINES } from "../shared/constants.ts";
import type { CellDisplayBuffer, Pos } from "../shared/types.ts";
import { GameState } from "./state.ts";
import { RNG } from "./rng.ts";
import { generateDungeon } from "./architect.ts";
import { tryMovePlayer } from "./movement.ts";
import { computeFOV } from "./fov.ts";

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

    // Update display buffer
    this.updateDisplay();
    this.emit("displayChanged");
    this.state.messages.push("Welcome to Brogue!");
  }

  handleKeystroke(key: number, ctrl = false, shift = false): void {
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

    // Descend
    if (ch === ">") {
      this.state.messages.push("Stairs are not yet implemented.");
      this.updateDisplay();
      this.emit("displayChanged");
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
    };
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

    // Render dungeon cells
    for (let x = 0; x < DCOLS; x++) {
      for (let y = 0; y < DROWS; y++) {
        const pcell = pmap[x]![y]!;
        const screenX = x + STAT_BAR_WIDTH + 1;
        const screenY = y + MESSAGE_LINES;
        const displayCell = buf[screenX]![screenY]!;

        // Check visibility (simplified — use FOV flags)
        if (!(pcell.flags & 0x1)) continue; // DISCOVERED flag

        const layer = pcell.layers[0]!; // ground layer
        const appearance = getCellAppearance(layer, pcell.flags);
        displayCell.character = appearance.char;
        displayCell.foreColorComponents = [...appearance.fg];
        displayCell.backColorComponents = [...appearance.bg];

        // Dim if not visible (only discovered/remembered)
        if (!(pcell.flags & 0x2)) { // VISIBLE flag
          displayCell.foreColorComponents = displayCell.foreColorComponents.map((c: number) => Math.floor(c * 0.4)) as [number, number, number];
          displayCell.backColorComponents = displayCell.backColorComponents.map((c: number) => Math.floor(c * 0.3)) as [number, number, number];
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

// Tile appearance lookup (simplified for Phase 1)
interface TileAppearance {
  char: string;
  fg: [number, number, number];
  bg: [number, number, number];
}

function getCellAppearance(tileType: number, flags: number): TileAppearance {
  // Simplified tile rendering — will use full tileCatalog later
  switch (tileType) {
    case 0: // NOTHING
      return { char: " ", fg: [0, 0, 0], bg: [0, 0, 0] };
    case 1: // GRANITE
      return { char: "#", fg: [30, 30, 30], bg: [10, 10, 10] };
    case 2: // FLOOR
    case 3: // FLOOR_FLOODABLE
      return { char: "\u00b7", fg: [30, 30, 30], bg: [5, 3, 0] };
    case 4: // CARPET
      return { char: "\u00b7", fg: [55, 15, 15], bg: [15, 5, 0] };
    case 5: // MARBLE_FLOOR
      return { char: "\u00b7", fg: [60, 60, 60], bg: [10, 10, 10] };
    case 6: // WALL
      return { char: "#", fg: [40, 40, 40], bg: [15, 15, 15] };
    case 7: // DOOR
      return { char: "+", fg: [60, 30, 0], bg: [15, 8, 0] };
    case 8: // OPEN_DOOR
      return { char: "'", fg: [40, 20, 0], bg: [5, 3, 0] };
    case 9: // SECRET_DOOR (looks like wall)
      return { char: "#", fg: [40, 40, 40], bg: [15, 15, 15] };
    default:
      // Downstairs, upstairs, liquid, etc.
      if (tileType === 15) return { char: ">", fg: [80, 80, 80], bg: [5, 3, 0] };
      if (tileType === 16) return { char: "<", fg: [80, 80, 80], bg: [5, 3, 0] };
      return { char: "?", fg: [50, 50, 50], bg: [5, 3, 0] };
  }
}
