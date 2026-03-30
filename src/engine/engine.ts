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
import { populateMonsters, monsterAt, playerAttacksMonster, processMonsterTurns } from "./monsters.ts";
import { processTurnEffects, tryEatFood } from "./time.ts";

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

  if (!hasTargets) {
    // No unexplored areas — navigate to stairs instead
    const onStairs = state.pmap[px]![py]!.layers[0] === 12; // DOWN_STAIRS
    if (onStairs) {
      state.addMessage("You are standing on the stairs. Press > to descend.");
      return null;
    }
    // Find stairs and navigate toward them
    for (let x = 0; x < DCOLS; x++) {
      for (let y = 0; y < DROWS; y++) {
        if (state.pmap[x]![y]!.layers[0] === 12) {
          distMap[x]![y] = 0;
          hasTargets = true;
        }
      }
    }
    if (!hasTargets) {
      state.addMessage("Nothing left to explore and no stairs found.");
      return null;
    }
  }

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

  if (bestDx === 0 && bestDy === 0) {
    // Targets exist but are unreachable — try stairs instead
    return autoNavigateToStairs(state, costMap, distMap);
  }
  return { dx: bestDx, dy: bestDy };
}

function autoNavigateToStairs(state: GameState, costMap: number[][], distMap: number[][]): { dx: number; dy: number } | null {
  const px = state.playerPos.x;
  const py = state.playerPos.y;

  if (state.pmap[px]![py]!.layers[0] === 12) {
    state.addMessage("You are standing on the stairs. Press > to descend.");
    return null;
  }

  // Reset distMap and set stairs as target
  for (let x = 0; x < DCOLS; x++) {
    for (let y = 0; y < DROWS; y++) {
      distMap[x]![y] = state.pmap[x]![y]!.layers[0] === 12 ? 0 : 30000;
    }
  }

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

  if (bestDx === 0 && bestDy === 0) {
    state.addMessage("Cannot find a path to the stairs.");
    return null;
  }
  return { dx: bestDx, dy: bestDy };
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
    monstersKilled: number;
    deepestLevel: number;
    weapon: string | null;
    armor: string | null;
    x: number; y: number;
  };
  messages: string[];
  map: string;
  stairsAt: { x: number; y: number } | null;
  items: { x: number; y: number; name: string; char: string }[];
  monsters: { x: number; y: number; name: string; char: string; hp: number; maxHp: number; dist: number; dir?: string }[];
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
    populateMonsters(this.state);

    // Compute initial FOV
    computeFOV(this.state);
    updateLighting(this.state);

    // Update display buffer
    this.updateDisplay();
    this.emit("displayChanged");
    this.state.addMessage("Welcome to Brogue!");
  }

  /** Common end-of-turn processing */
  private endTurn(): void {
    processTurnEffects(this.state);
    if (this.state.gameOver && !this.state.victory) {
      this.state.addMessage(`--- GAME OVER --- Depth ${this.state.stats.deepestLevel}, ${this.state.stats.turnNumber} turns, ${this.state.stats.monstersKilled} kills, ${this.state.stats.gold} gold. Press any key to restart.`);
    }
    this.updateDisplay();
    this.emit("displayChanged");
  }

  handleKeystroke(key: number, _ctrl = false, _shift = false): void {
    if (this.state.gameOver) {
      // Any keypress after death restarts the game
      this.newGame();
      return;
    }

    const ch = String.fromCharCode(key);

    // Movement keys
    const dirMap: Record<string, [number, number]> = {
      h: [-1, 0], j: [0, 1], k: [0, -1], l: [1, 0],
      y: [-1, -1], u: [1, -1], b: [-1, 1], n: [1, 1],
    };

    if (dirMap[ch]) {
      const [dx, dy] = dirMap[ch]!;
      const targetX = this.state.playerPos.x + dx;
      const targetY = this.state.playerPos.y + dy;
      const monster = monsterAt(this.state, targetX, targetY);

      if (monster) {
        playerAttacksMonster(this.state, monster);
        this.state.stats.turnNumber++;
        processMonsterTurns(this.state);
        this.endTurn();
      } else if (tryMovePlayer(this.state, dx, dy)) {
        this.state.stats.turnNumber++;
        pickUpItem(this.state);
        tryEatFood(this.state);
        processMonsterTurns(this.state);
        computeFOV(this.state);
        updateLighting(this.state);
        this.endTurn();
      }
      return;
    }

    // Rest
    if (ch === ".") {
      this.state.stats.turnNumber++;
      processMonsterTurns(this.state);
      this.state.addMessage("You rest for a moment.");
      this.endTurn();
      return;
    }

    // Search
    if (ch === "s") {
      this.state.stats.turnNumber++;
      processMonsterTurns(this.state);
      this.state.addMessage("You search the area.");
      this.endTurn();
      return;
    }

    // Auto-explore (also auto-fights adjacent monsters)
    if (ch === "x") {
      // Auto-fight: if any adjacent monster, attack the closest one
      const px = this.state.playerPos.x;
      const py = this.state.playerPos.y;
      let adjacentMonster: { monster: ReturnType<typeof monsterAt>; dx: number; dy: number } | null = null;
      let closestDist = Infinity;
      for (const m of this.state.monsters) {
        if (m.dead) continue;
        const mdx = m.x - px;
        const mdy = m.y - py;
        if (Math.abs(mdx) <= 1 && Math.abs(mdy) <= 1 && (Math.abs(mdx) + Math.abs(mdy) > 0)) {
          const d = Math.abs(mdx) + Math.abs(mdy);
          if (d < closestDist) {
            closestDist = d;
            adjacentMonster = { monster: m, dx: mdx, dy: mdy };
          }
        }
      }

      if (adjacentMonster && adjacentMonster.monster) {
        playerAttacksMonster(this.state, adjacentMonster.monster);
        this.state.stats.turnNumber++;
        processMonsterTurns(this.state);
        this.endTurn();
        return;
      }

      const step = autoExploreStep(this.state);
      if (step) {
        if (tryMovePlayer(this.state, step.dx, step.dy)) {
          this.state.stats.turnNumber++;
          pickUpItem(this.state);
          tryEatFood(this.state);
          processMonsterTurns(this.state);
          computeFOV(this.state);
          updateLighting(this.state);
          this.endTurn();
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
        this.state.stats.deepestLevel = Math.max(this.state.stats.deepestLevel, this.state.stats.depthLevel);
        this.state.stats.turnNumber++;
        this.state.initGrids();
        generateDungeon(this.state);
        populateItems(this.state);
        populateMonsters(this.state);
        computeFOV(this.state);
        updateLighting(this.state);
        this.updateDisplay();
        this.emit("displayChanged");
        // Clear old messages from previous level
        this.state.messages = [];
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
        monstersKilled: s.monstersKilled,
        deepestLevel: s.deepestLevel,
        weapon: this.state.weapon?.name ?? null,
        armor: this.state.armor?.name ?? null,
        x: this.state.playerPos.x,
        y: this.state.playerPos.y,
      },
      messages: this.state.messages.slice(-10),
      map: this.getAsciiMap(),
      stairsAt: this.findStairs(),
      items: this.state.floorItems
        .filter(it => !it.collected)
        .map(it => ({ x: it.x, y: it.y, name: it.name, char: it.displayChar })),
      monsters: this.state.monsters
        .filter(m => !m.dead)
        .map(m => {
          const dx = m.x - this.state.playerPos.x;
          const dy = m.y - this.state.playerPos.y;
          const dist = Math.abs(dx) + Math.abs(dy);
          let dir: string | undefined;
          if (dist <= 10) {
            const dirs: string[] = [];
            if (dy < 0) dirs.push("N");
            if (dy > 0) dirs.push("S");
            if (dx > 0) dirs.push("E");
            if (dx < 0) dirs.push("W");
            dir = dirs.join("") || undefined;
          }
          return { x: m.x, y: m.y, name: m.name, char: m.displayChar, hp: m.hp, maxHp: m.maxHp, dist, dir };
        }),
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

    // Render monsters
    for (const monster of this.state.monsters) {
      if (monster.dead) continue;
      const mx = monster.x + STAT_BAR_WIDTH + 1;
      const my = monster.y + MESSAGE_LINES;
      if (mx >= 0 && mx < COLS && my >= 0 && my < ROWS) {
        const pcell = pmap[monster.x]![monster.y]!;
        if (pcell.flags & 0x2) { // VISIBLE
          const cell = buf[mx]![my]!;
          cell.character = monster.displayChar;
          cell.foreColorComponents = [...monster.foreColor];
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
      for (let j = 0; j < text.length && j + 1 < STAT_BAR_WIDTH; j++) {
        const cell = buf[j + 1]![i + MESSAGE_LINES + 1]!;
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
      for (let j = 0; j < msg.length && j + 1 < COLS; j++) {
        const cell = buf[j + 1]![i]!;
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
