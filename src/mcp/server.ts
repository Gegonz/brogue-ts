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
