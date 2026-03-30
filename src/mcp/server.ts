import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { GameEngine } from "../engine/engine.ts";

let engine: GameEngine | null = null;

function getEngine(): GameEngine {
  if (!engine) throw new Error("No game in progress. Call brogue_new first.");
  return engine;
}

// MCP Server
const mcpServer = new McpServer({
  name: "brogue-ts",
  version: "0.1.0",
});

mcpServer.registerTool("brogue_new", {
  description: "Start a new Brogue game. Returns initial game state with ASCII map.",
  inputSchema: {
    seed: z.number().optional().describe("RNG seed for deterministic dungeon generation"),
  },
}, async ({ seed }) => {
  engine = new GameEngine();
  engine.newGame(seed ? BigInt(seed) : undefined);
  return {
    content: [{ type: "text" as const, text: JSON.stringify(engine.getState(), null, 2) }],
  };
});

mcpServer.registerTool("brogue_move", {
  description: "Move the player in a direction. Returns updated game state.",
  inputSchema: {
    direction: z.enum(["N", "S", "E", "W", "NE", "NW", "SE", "SW"])
      .describe("Cardinal or diagonal direction"),
  },
}, async ({ direction }) => {
  const eng = getEngine();
  const keymap: Record<string, number> = {
    N: "k".charCodeAt(0),
    S: "j".charCodeAt(0),
    E: "l".charCodeAt(0),
    W: "h".charCodeAt(0),
    NW: "y".charCodeAt(0),
    NE: "u".charCodeAt(0),
    SW: "b".charCodeAt(0),
    SE: "n".charCodeAt(0),
  };
  eng.handleKeystroke(keymap[direction]!);
  return {
    content: [{ type: "text" as const, text: JSON.stringify(eng.getState(), null, 2) }],
  };
});

mcpServer.registerTool("brogue_action", {
  description: "Perform a game action: rest, search, descend stairs, ascend stairs, or auto-explore.",
  inputSchema: {
    action: z.enum(["rest", "search", "descend", "ascend", "explore"])
      .describe("The action to perform"),
  },
}, async ({ action }) => {
  const eng = getEngine();
  const actionMap: Record<string, number> = {
    rest: ".".charCodeAt(0),
    search: "s".charCodeAt(0),
    descend: ">".charCodeAt(0),
    ascend: "<".charCodeAt(0),
    explore: "x".charCodeAt(0),
  };
  eng.handleKeystroke(actionMap[action]!);
  return {
    content: [{ type: "text" as const, text: JSON.stringify(eng.getState(), null, 2) }],
  };
});

mcpServer.registerTool("brogue_look", {
  description: "Get the current game state without performing any action. Returns ASCII map, player stats, messages, and visible entities.",
  inputSchema: {},
}, async () => {
  const eng = getEngine();
  return {
    content: [{ type: "text" as const, text: JSON.stringify(eng.getState(), null, 2) }],
  };
});

mcpServer.registerTool("brogue_inventory", {
  description: "View the player's inventory (pack contents). Shows all carried items with inventory letters, categories, and equipped status.",
  inputSchema: {},
}, async () => {
  const eng = getEngine();
  const { inventoryDescription } = await import("../engine/inventory.ts");
  const state = eng["state"];
  const lines = inventoryDescription(state);
  const packSummary = state.packItems.map((i: { inventoryLetter: string; name: string; quantity: number; equipped: boolean }) =>
    ({ letter: i.inventoryLetter, name: i.name, qty: i.quantity, equipped: i.equipped })
  );
  return {
    content: [{ type: "text" as const, text: JSON.stringify({ inventory: lines, items: packSummary, count: state.packItems.length }, null, 2) }],
  };
});

mcpServer.registerTool("brogue_auto", {
  description: "Play one intelligent turn automatically. Analyzes the game state and takes the best action: fight adjacent monsters, explore toward unexplored areas, navigate to stairs when done, or descend when on stairs. Returns the updated game state with a 'reasoning' field explaining the decision. Call this repeatedly for fully autonomous play.",
  inputSchema: {
    turns: z.number().optional().describe("Number of turns to play automatically (default 1, max 50)"),
  },
}, async ({ turns }) => {
  const eng = getEngine();
  const numTurns = Math.min(turns ?? 1, 50);
  const events: string[] = [];

  for (let t = 0; t < numTurns; t++) {
    const state = eng.getState();
    if (state.phase !== "playing") {
      events.push(`Game over: ${state.phase}`);
      break;
    }

    // Decision logic
    const onStairs = state.stairsAt &&
      state.player.x === state.stairsAt.x && state.player.y === state.stairsAt.y;

    if (onStairs) {
      eng.handleKeystroke(">".charCodeAt(0));
      events.push(`Descended to depth ${eng.getState().depth}`);
      continue;
    }

    // Default: explore (handles auto-fight + stairs navigation)
    eng.handleKeystroke("x".charCodeAt(0));

    // Check what happened
    const after = eng.getState();
    if (after.turn > state.turn) {
      // Something happened
      const newMsgs = after.messages.filter(m => !state.messages.includes(m));
      for (const m of newMsgs) {
        if (m.includes("kill") || m.includes("hit") || m.includes("equip") ||
            m.includes("drink") || m.includes("read") || m.includes("zap") ||
            m.includes("LEVEL UP") || m.includes("gold") || m.includes("eat") ||
            m.includes("don ") || m.includes("put on")) {
          events.push(m);
        }
      }
    }
  }

  const finalState = eng.getState();
  const reasoning = events.length > 0 ? events.join("; ") : `Explored (turn ${finalState.turn})`;

  return {
    content: [{ type: "text" as const, text: JSON.stringify({ ...finalState, reasoning }, null, 2) }],
  };
});

mcpServer.registerTool("brogue_benchmark", {
  description: "Run a full benchmark: play 10 seeds to completion and return win rate, average depth, and per-seed results. Takes ~30 seconds.",
  inputSchema: {},
}, async () => {
  const seeds = [1, 10, 42, 77, 100, 200, 555, 777, 999, 1234];
  const results: Array<{
    seed: number; depth: number; level: number; turns: number;
    kills: number; weapon: string | null; armor: string | null;
    result: string;
  }> = [];

  for (const seed of seeds) {
    const eng = new GameEngine();
    eng.newGame(BigInt(seed));

    // Play up to 6000 turns
    for (let t = 0; t < 6000; t++) {
      const state = eng.getState();
      if (state.phase !== "playing") break;
      eng.handleKeystroke("x".charCodeAt(0)); // explore (auto-fight + auto-descend via stairs)
      // Check if on stairs after explore
      const after = eng.getState();
      if (after.phase === "playing" && after.stairsAt &&
          after.player.x === after.stairsAt.x && after.player.y === after.stairsAt.y) {
        eng.handleKeystroke(">".charCodeAt(0));
      }
    }

    const final = eng.getState();
    results.push({
      seed,
      depth: final.player.deepestLevel,
      level: final.player.level,
      turns: final.turn,
      kills: final.player.monstersKilled,
      weapon: final.player.weapon,
      armor: final.player.armor,
      result: final.phase === "won" ? "VICTORY" : "dead",
    });
  }

  const victories = results.filter(r => r.result === "VICTORY").length;
  const avgDepth = results.reduce((s, r) => s + r.depth, 0) / results.length;

  const summary = {
    winRate: `${victories}/${results.length} (${(victories / results.length * 100).toFixed(0)}%)`,
    avgDepth: avgDepth.toFixed(1),
    totalKills: results.reduce((s, r) => s + r.kills, 0),
    results,
  };

  return {
    content: [{ type: "text" as const, text: JSON.stringify(summary, null, 2) }],
  };
});

mcpServer.registerTool("brogue_admin", {
  description: "Admin/debug console for testing. Set depth, stats, equipment, spawn monsters, toggle god mode. Essential for efficient porting iteration — skip to any depth or scenario instantly.",
  inputSchema: {
    command: z.enum([
      "set_depth",      // Jump to a specific depth (generates new level)
      "set_stats",      // Set HP, strength, level, etc.
      "give_weapon",    // Equip a weapon by name
      "give_armor",     // Equip armor by name
      "god_mode",       // Toggle invincibility
      "spawn_monster",  // Spawn a specific monster nearby
      "reveal_map",     // Discover entire map
      "heal",           // Full heal + cure poison
      "info",           // Show detailed game internals
    ]).describe("Admin command to execute"),
    value: z.string().optional().describe("Command parameter (e.g., depth number, weapon name, monster name)"),
  },
}, async ({ command, value }) => {
  const eng = getEngine();
  const state = eng["state"]; // access private state for admin
  let msg = "";

  switch (command) {
    case "set_depth": {
      const depth = parseInt(value ?? "5");
      state.stats.depthLevel = depth;
      state.stats.deepestLevel = Math.max(state.stats.deepestLevel, depth);
      state.stats.turnNumber++;
      state.initGrids();
      const { generateDungeon } = await import("../engine/architect.ts");
      const { populateItems } = await import("../engine/items.ts");
      const { populateMonsters } = await import("../engine/monsters.ts");
      const { computeFOV } = await import("../engine/fov.ts");
      const { updateLighting } = await import("../engine/light.ts");
      generateDungeon(state);
      populateItems(state);
      populateMonsters(state);
      computeFOV(state);
      updateLighting(state);
      // Force display buffer update
      (eng as any).updateDisplay();
      state.messages = [];
      state.addMessage(`[ADMIN] Teleported to depth ${depth}.`);
      msg = `Jumped to depth ${depth}. Player at (${state.playerPos.x},${state.playerPos.y})`;
      break;
    }
    case "set_stats": {
      // value format: "hp=100 str=20 level=10 xp=200 nutrition=3000"
      const parts = (value ?? "").split(/\s+/);
      for (const part of parts) {
        const [k, v] = part.split("=");
        const num = parseInt(v ?? "0");
        if (k === "hp") { state.stats.hp = num; state.stats.maxHp = Math.max(state.stats.maxHp, num); }
        else if (k === "maxhp") { state.stats.maxHp = num; state.stats.hp = Math.min(state.stats.hp, num); }
        else if (k === "str") { state.stats.strength = num; state.stats.maxStrength = Math.max(state.stats.maxStrength, num); }
        else if (k === "level") { state.stats.level = num; }
        else if (k === "xp") { state.stats.xp = num; }
        else if (k === "gold") { state.stats.gold = num; }
        else if (k === "nutrition") { state.stats.nutrition = num; }
      }
      msg = `Stats updated: ${value}`;
      break;
    }
    case "give_weapon": {
      const name = value ?? "war axe";
      const { weaponTable } = await import("../engine/catalogs/items.ts");
      const wEntry = weaponTable.find(w => w.name === name);
      const dmgRange = wEntry ? wEntry.range : { lowerBound: 7, upperBound: 9, clumpFactor: 1 };
      const bonus = Math.floor((dmgRange.lowerBound + dmgRange.upperBound) / 4);
      state.weapon = {
        name,
        bonusDamage: bonus,
        damage: { min: dmgRange.lowerBound, max: dmgRange.upperBound, clump: dmgRange.clumpFactor },
      };
      msg = `Equipped ${name} (${dmgRange.lowerBound}-${dmgRange.upperBound} dmg)`;
      break;
    }
    case "give_armor": {
      const name = value ?? "plate armor";
      const armorDef: Record<string, number> = {
        "leather armor": 3, "scale mail": 4, "chain mail": 5,
        "banded mail": 7, "splint mail": 9, "plate armor": 11,
      };
      state.armor = { name, defense: armorDef[name] ?? 5 };
      msg = `Equipped ${name} (+${state.armor.defense} def)`;
      break;
    }
    case "god_mode": {
      state.stats.hp = 9999;
      state.stats.maxHp = 9999;
      state.stats.strength = 50;
      state.stats.maxStrength = 50;
      state.stats.nutrition = 99999;
      msg = "God mode: 9999 HP, 50 Str, infinite nutrition";
      break;
    }
    case "spawn_monster": {
      const name = (value ?? "rat").toLowerCase();
      const { monsterCatalog } = await import("../engine/catalogs/monsters.ts");
      const idx = monsterCatalog.findIndex(m => m.name.toLowerCase() === name);
      if (idx >= 0) {
        const entry = monsterCatalog[idx]!;
        const mx = state.playerPos.x + 2;
        const my = state.playerPos.y;
        state.monsters.push({
          x: mx, y: my, catalogIndex: idx,
          name: entry.name, displayChar: entry.displayChar,
          foreColor: [...entry.foreColor] as [number,number,number],
          hp: entry.maxHP, maxHp: entry.maxHP,
          defense: entry.defense, accuracy: entry.accuracy,
          damage: { ...entry.damage }, moveSpeed: entry.moveSpeed,
          attackSpeed: entry.attackSpeed,
          xpValue: Math.max(1, Math.floor((entry.maxHP + (entry.damage.min+entry.damage.max)/2*3 + entry.defense/5) / 5)),
          dead: false, flags: [...entry.flags],
        });
        msg = `Spawned ${entry.name} (${entry.maxHP} HP) at (${mx},${my})`;
      } else {
        msg = `Unknown monster: ${name}. Available: ${monsterCatalog.slice(1,20).map(m=>m.name).join(", ")}...`;
      }
      break;
    }
    case "reveal_map": {
      const { DCOLS, DROWS } = await import("../shared/constants.ts");
      for (let x = 0; x < DCOLS; x++) {
        for (let y = 0; y < DROWS; y++) {
          state.pmap[x]![y]!.flags |= 0x1; // DISCOVERED
        }
      }
      msg = "Entire map revealed";
      break;
    }
    case "heal": {
      state.stats.hp = state.stats.maxHp;
      state.poisonAmount = 0;
      if (state.statuses) state.statuses.fill(0);
      msg = `Healed to ${state.stats.hp}/${state.stats.maxHp}, cleared all status effects`;
      break;
    }
    case "info": {
      const monsterSummary = state.monsters.filter((m: {dead: boolean}) => !m.dead)
        .map((m: {name: string; hp: number; maxHp: number; x: number; y: number}) => `${m.name}(${m.hp}/${m.maxHp} @${m.x},${m.y})`)
        .join(", ");
      msg = `Depth=${state.stats.depthLevel} Turn=${state.stats.turnNumber} ` +
        `HP=${state.stats.hp}/${state.stats.maxHp} Str=${state.stats.strength} ` +
        `Lv=${state.stats.level} XP=${state.stats.xp} Nutr=${state.stats.nutrition} ` +
        `Weapon=${state.weapon?.name ?? "none"} Armor=${state.armor?.name ?? "none"} ` +
        `Monsters: ${monsterSummary || "none"} ` +
        `Items: ${state.floorItems.filter((i: {collected: boolean}) => !i.collected).length} uncollected`;
      break;
    }
  }

  state.addMessage(`[ADMIN] ${msg}`);
  return {
    content: [{ type: "text" as const, text: JSON.stringify({ message: msg, state: eng.getState() }, null, 2) }],
  };
});

// Shared transport — same pattern as Augur
// SDK workaround: bypass validation + reset on re-initialize for Claude Code reconnects
interface TransportInternals {
  validateSession: () => undefined;
  validateProtocolVersion: () => undefined;
  _initialized: boolean;
  sessionId: string | undefined;
}

const sharedTransport = new WebStandardStreamableHTTPServerTransport({
  sessionIdGenerator: () => randomUUID(),
});

const internals = sharedTransport as unknown as TransportInternals;
internals.validateSession = () => undefined;
internals.validateProtocolVersion = () => undefined;

await mcpServer.connect(sharedTransport);
console.log("MCP transport connected");

export async function mcpHandler(req: Request): Promise<Response> {
  try {
    if (req.method === "DELETE") {
      return new Response(null, { status: 204 });
    }

    if (req.method === "GET") {
      // SSE stream for server-to-client notifications
      return sharedTransport.handleRequest(req);
    }

    // POST — parse body and check for re-initialization
    const body = await req.json();

    // If this is an initialize request and we're already initialized,
    // reset state so SDK accepts the new initialize (handles Claude Code reconnect)
    const isInit = Array.isArray(body)
      ? body.some((m: Record<string, unknown>) => m.method === "initialize")
      : (body as Record<string, unknown>)?.method === "initialize";

    if (isInit && internals._initialized) {
      console.log("Re-initialization requested, resetting transport state");
      internals._initialized = false;
      internals.sessionId = undefined;
    }

    return sharedTransport.handleRequest(req, { parsedBody: body });
  } catch (err) {
    console.error("MCP error:", err);
    return Response.json(
      { jsonrpc: "2.0", error: { code: -32603, message: "Internal server error" }, id: null },
      { status: 500 },
    );
  }
}
