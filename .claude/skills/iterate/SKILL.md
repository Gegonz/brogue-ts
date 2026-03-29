---
name: iterate
description: Find and port the highest-impact unported BrogueCE C module to TypeScript. Reads C source at ~/work/brogue, translates to TS at ~/work/brogue-ts preserving exact behavior (especially RNG consumption order), validates via MCP tools and typecheck, updates CLAUDE.md status. Autonomous porting cycle.
model: sonnet
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - ToolSearch
  - Agent
  - mcp__brogue__*
  - mcp__plugin_playwright_playwright__*
---

# /iterate — BrogueCE porting iteration cycle

Three phases: DISCOVER → IMPLEMENT → VALIDATE. Do not mix them.

## Path Constants

- **C source**: `/home/gbrunel/work/brogue/src/brogue/` (BrogueCE v1.15.1, the reference implementation)
- **TS target**: `/home/gbrunel/work/brogue-ts/src/` (the port we're building)
- **Status doc**: `/home/gbrunel/work/brogue-ts/CLAUDE.md` (porting status table + architecture)
- **Dev log**: `/tmp/brogue-ts.log` (server output, errors)
- **Iteration log**: `/home/gbrunel/work/game/.claude/state/iterate-log.jsonl`
- **Typecheck**: `cd /home/gbrunel/work/brogue-ts && npx tsc --noEmit`
- **Browser**: `http://localhost:8080` (Canvas game)
- **MCP**: `http://localhost:8080/mcp` (tool endpoint)

## Phase A: DISCOVER (no code changes!)

**Do NOT edit any files during this phase.** Goal: pick ONE focused porting task.

1. **Check server health**:
   ```bash
   tail -5 /tmp/brogue-ts.log
   ```
   If errors, fix those first (becomes the task).

2. **Read status table** in `/home/gbrunel/work/brogue-ts/CLAUDE.md`:
   - Find the highest-priority module marked "Not started" or "Partial"
   - Follow the Phase Priorities order in CLAUDE.md

3. **Read the C source** at `/home/gbrunel/work/brogue/src/brogue/{Module}.c`:
   - Don't read entire 8000-line files. Read 200-300 lines at a time.
   - Identify which functions to port, note dependencies on other modules.
   - Flag every `rand_range()` / `randClumpedRange()` call — RNG consumption order must be preserved exactly.
   - Map C globals to GameState fields.

4. **Run baseline MCP test**:
   - Call `brogue_new` with a fixed seed (e.g., 42)
   - Call `brogue_look` — save the output for Phase C comparison
   - If baseline fails, fixing it becomes the task.

5. **Declare the task**: State what you'll port (e.g., "Port Dijkstra.c pathfinding to engine/dijkstra.ts") and roughly how many functions.

## Phase B: IMPLEMENT (no MCP probes!)

**Do NOT call MCP tools during this phase.** Server may restart from file changes.

1. **Port functions** from C to TypeScript:
   - Preserve exact behavior, especially RNG call order
   - Use `>>> 0` for all uint32 arithmetic
   - Map C globals to `GameState` fields (passed as parameter)
   - C linked lists → TS arrays (preserve iteration order for RNG parity)
   - C `short **` grids → `number[][]`
   - Large modules (>2000 LOC): use Agent tool to delegate subsections in parallel

2. **Typecheck after each file**:
   ```bash
   cd /home/gbrunel/work/brogue-ts && npx tsc --noEmit 2>&1 | head -20
   ```

3. **Wire into engine** if the new module exposes functionality:
   - Import in `engine.ts`, call from game loop or movement
   - Update display buffer rendering if visual changes

4. **Wait 2 seconds** after final save for server auto-reload before Phase C.

## Phase C: VALIDATE (no code changes!)

1. **Typecheck** — must pass with zero errors:
   ```bash
   cd /home/gbrunel/work/brogue-ts && npx tsc --noEmit
   ```

2. **MCP smoke test**:
   - `brogue_new(seed=42)` — must return valid state
   - `brogue_move(direction="S")` then `brogue_move(direction="E")` — turn increments, position changes
   - `brogue_look()` — state consistent
   - Compare map output to Phase A baseline — any regressions?

3. **Visual check** (optional but recommended for rendering changes):
   ```
   Use Playwright: navigate to http://localhost:8080, take screenshot.
   Verify: dungeon renders in cols 21-99, player @ visible, no blank screen.
   ```

4. **Update CLAUDE.md** status table — mark the module as "Done" or "Partial" with notes.

5. **Log result**:
   ```bash
   TS=$(date -Iseconds)
   echo '{"ts":"'"$TS"'","module":"...","functions_ported":N,"impact":"HIGH|MEDIUM|LOW","verified":true}' >> /home/gbrunel/work/game/.claude/state/iterate-log.jsonl
   ```

6. **Assess next step**:
   - HIGH impact port completed → continue to next Phase A
   - All remaining modules are LOW priority → stop, suggest different work direction
   - Error encountered that needs user input → stop and report

## Rules

- **Phase separation is mandatory.** Don't edit files during DISCOVER/VALIDATE. Don't call MCP during IMPLEMENT.
- **RNG fidelity is non-negotiable.** If the C code calls `rand_range()` in a loop, the TS port must call `rng.range()` in the same order. Wrong RNG consumption = different dungeons = broken replay determinism.
- **Batch commits.** Don't commit 5 times for one module. One commit per iteration cycle.
- **Read C incrementally.** Don't try to read an entire 5000-line C file. Read function by function, port as you go.
- **Prefer existing patterns.** Before creating new abstractions, check how existing ported modules handle similar patterns (e.g., grid operations, color handling).
- **Server auto-reloads.** After saving TS files, the Bun watcher restarts in ~300ms. Wait before MCP testing.
