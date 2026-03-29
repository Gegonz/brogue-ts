import { COLS, ROWS, DCOLS, DROWS, STAT_BAR_WIDTH, MESSAGE_LINES } from "../shared/constants.ts";
import type { CellDisplayBuffer } from "../shared/types.ts";
import { GameState } from "./state.ts";
import { RNG } from "./rng.ts";
import { generateDungeon } from "./architect.ts";
import { tryMovePlayer } from "./movement.ts";
import { computeFOV } from "./fov.ts";
import { updateLighting } from "./light.ts";
import { allocGrid } from "./grid.ts";
import { dijkstraScan } from "./dijkstra.ts";
import { populateItems, pickUpItem } from "./items.ts";

import { nbDirs } from "../shared/constants.ts";

type EventCallback = (...args: unknown[]) => void;

function autoExploreStep(state: GameState): { dx: number; dy: number } | null {
  const px = state.playerPos.x;
  const py = state.playerPos.y;

  const costMap = allocGrid();
  for (let x = 0; x < DCOLS; x++) {
    for (let y = 0; y < DROWS; y++) {
      const tile = state.pmap[x]![y]!.layers[0]!;
      // Walkable: floor(2-5), open_door(8), stairs(12-13), door(7)
      if ((tile >= 2 && tile <= 5) || tile === 7 || tile === 8 || tile === 12 || tile === 13) {
        costMap[x]![y] = 1;
      } else {
        costMap[x]![y] = -2;
      }
    }
  }

  const distMap = allocGrid();
  for (let x = 0; x < DCOLS; x++) {
    for (let y = 0; y < DROWS; y++) {
      distMap[x]![y] = 30000;
    }
  }

  let hasTargets = false;
  for (let x = 1; x < DCOLS - 1; x++) {
    for (let y = 1; y < DROWS - 1; y++) {
      if (state.pmap[x]![y]!.flags & 0x1) continue; // already discovered
      for (let dir = 0; dir < 8; dir++) {
        const nx = x + nbDirs[dir]![0]!;
        const ny = y + nbDirs[dir]![1]!;
        if (nx >= 0 && nx < DCOLS && ny >= 0 && ny < DROWS) {
          const nb = state.pmap[nx]![ny]!;
          const t = nb.layers[0]!;
          if ((nb.flags & 0x1) && ((t >= 2 && t <= 5) || t === 7 || t === 8 || t === 12 || t === 13)) {
            distMap[nx]![ny] = 0;
            hasTargets = true;
            break;
          }
        }
      }
    }
  }

  if (!hasTargets) return null;

  dijkstraScan(distMap, costMap, true);

  let bestDx = 0, bestDy = 0, bestDist = distMap[px]![py]!;
  for (let dir = 0; dir < 8; dir++) {
    const nx = px + nbDirs[dir]![0]!;
    const ny = py + nbDirs[dir]![1]!;
    if (nx >= 0 && nx < DCOLS && ny >= 0 && ny < DROWS) {
      const d = distMap[nx]![ny]!;
      if (d < bestDist) {
        bestDist = d;
        bestDx = nbDirs[dir]![0]!;
        bestDy = nbDirs[dir]![1]!;
      }
    }
  }

  return (bestDx === 0 && bestDy === 0) ? null : { dx: bestDx, dy: bestDy };
}

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
  items: { x: number; y: number; name: string; char: string }[];
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
    populateItems(this.state);

    // Compute initial FOV
    computeFOV(this.state);
    updateLighting(this.state);

    // Update display buffer
    this.updateDisplay();
    this.emit("displayChanged");
    this.state.addMessage("Welcome to Brogue!");
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
        pickUpItem(this.state);
        computeFOV(this.state);
        this.updateDisplay();
        this.emit("displayChanged");
      }
      return;
    }

    // Rest
    if (ch === ".") {
      this.state.stats.turnNumber++;
      this.state.addMessage("You rest for a moment.");
      this.updateDisplay();
      this.emit("displayChanged");
      return;
    }

    // Search
    if (ch === "s") {
      this.state.stats.turnNumber++;
      this.state.addMessage("You search the area.");
      this.updateDisplay();
      this.emit("displayChanged");
      return;
    }

    // Auto-explore
    if (ch === "x") {
      const step = autoExploreStep(this.state);
      if (step) {
        if (tryMovePlayer(this.state, step.dx, step.dy)) {
          this.state.stats.turnNumber++;
          pickUpItem(this.state);
          computeFOV(this.state);
          updateLighting(this.state);
          this.updateDisplay();
          this.emit("displayChanged");
        }
      } else {
        this.state.addMessage("Nothing left to explore.");
        this.updateDisplay();
        this.emit("displayChanged");
      }
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
        this.state.addMessage(`You descend to depth ${this.state.stats.depthLevel}.`);
      } else {
        this.state.addMessage("There are no stairs here.");
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
      items: this.state.floorItems
        .filter(it => !it.collected)
        .map(it => ({ x: it.x, y: it.y, name: it.name, char: it.displayChar })),
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

        if (pcell.flags & 0x2) { // VISIBLE — multiply tile color by light
          const light = tmap[x]![y]!.light;
          // BrogueCE blending: tile color * light / 100, with ambient minimum
          const ambient = 20; // minimum visibility so lit areas aren't pitch black
          const lr = Math.max(ambient, Math.min(150, light[0]));
          const lg = Math.max(ambient, Math.min(150, light[1]));
          const lb = Math.max(ambient, Math.min(150, light[2]));
          displayCell.foreColorComponents = [
            Math.max(0, Math.min(100, Math.floor(appearance.fg[0] * lr / 100))),
            Math.max(0, Math.min(100, Math.floor(appearance.fg[1] * lg / 100))),
            Math.max(0, Math.min(100, Math.floor(appearance.fg[2] * lb / 100))),
          ];
          displayCell.backColorComponents = [
            Math.max(0, Math.min(100, Math.floor(appearance.bg[0] * lr / 100))),
            Math.max(0, Math.min(100, Math.floor(appearance.bg[1] * lg / 100))),
            Math.max(0, Math.min(100, Math.floor(appearance.bg[2] * lb / 100))),
          ];
        } else { // DISCOVERED but not visible — blue-tinted memory
          displayCell.foreColorComponents = [
            Math.floor(appearance.fg[0] * 0.3),
            Math.floor(appearance.fg[1] * 0.3),
            Math.floor(appearance.fg[2] * 0.45),
          ];
          displayCell.backColorComponents = [
            Math.floor(appearance.bg[0] * 0.25),
            Math.floor(appearance.bg[1] * 0.25),
            Math.floor(appearance.bg[2] * 0.35),
          ];
        }
      }
    }

    // Render floor items (before player so player draws on top)
    for (const item of this.state.floorItems) {
      if (item.collected) continue;
      const ix = item.x + STAT_BAR_WIDTH + 1;
      const iy = item.y + MESSAGE_LINES;
      if (ix >= 0 && ix < COLS && iy >= 0 && iy < ROWS) {
        const pcell = pmap[item.x]![item.y]!;
        if (pcell.flags & 0x2) { // VISIBLE
          const cell = buf[ix]![iy]!;
          cell.character = item.displayChar;
          cell.foreColorComponents = [...item.foreColor];
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

    const sidebarLines: Array<{ text: string; color: [number, number, number] }> = [
      { text: `Depth: ${stats.depthLevel}`, color: [100, 100, 100] },
      { text: `HP: ${stats.hp}/${stats.maxHp}`, color: stats.hp > stats.maxHp / 2 ? [0, 100, 0] : stats.hp > stats.maxHp / 4 ? [100, 100, 0] : [100, 0, 0] },
      { text: `Str: ${stats.strength}/${stats.maxStrength}`, color: [80, 60, 30] },
      { text: `Gold: ${stats.gold}`, color: [100, 85, 0] },
      { text: `Nutr: ${stats.nutrition}`, color: [60, 40, 0] },
      { text: `Turn: ${stats.turnNumber}`, color: [50, 50, 50] },
    ];

    for (let i = 0; i < sidebarLines.length; i++) {
      const { text, color } = sidebarLines[i]!;
      for (let j = 0; j < text.length && j < STAT_BAR_WIDTH; j++) {
        const cell = buf[j]![i + 2]!;
        cell.character = text[j]!;
        cell.foreColorComponents = [...color];
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
