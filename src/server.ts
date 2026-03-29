import homepage from "./client/index.html";
import { mcpHandler } from "./mcp/server.ts";

Bun.serve({
  port: 8080,
  routes: {
    "/": homepage,
  },
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/mcp") {
      return mcpHandler(req);
    }
    return new Response("Not found", { status: 404 });
  },
  development: {
    hmr: true,
  },
});

console.log("Brogue-TS running on http://localhost:8080");
console.log("MCP endpoint: http://localhost:8080/mcp");
