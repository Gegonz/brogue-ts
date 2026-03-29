---
name: play-brogue
description: Play Brogue via MCP tools to test game functionality and find bugs. Start a game, explore the dungeon, test movement and interactions. Report any issues found.
model: haiku
user-invocable: true
allowed-tools:
  - Read
  - Bash
  - ToolSearch
  - mcp__brogue__*
---

# /play-brogue — Game testing via MCP

Play Brogue through MCP tools to validate gameplay and find bugs.

## Procedure

1. **Start a game**: `brogue_new` (use a random seed or specify one)
2. **Explore**: Move in all 8 directions, open doors, find stairs
3. **Test actions**: rest, search, descend (when implemented)
4. **Monitor state**: Check HP, position, messages after each move
5. **Report bugs**: Note any unexpected behavior (wrong position, missing FOV, rendering issues)

## Reading the Map

```
# = wall     · = floor    + = door    ' = open door
@ = player   > = downstairs   < = upstairs
```

The map uses dungeon coordinates (DCOLS=79 x DROWS=29). Player position is in dungeon coords.

## What to Test

- Movement in all 8 directions works
- Doors open when bumped
- FOV updates correctly (unexplored areas not shown)
- Messages appear for actions
- Turn counter increments on valid moves
- Invalid moves (into walls) don't increment turn

## Bug Reporting

After playing 10-20 turns, summarize:
- What worked correctly
- Any bugs or unexpected behavior
- Suggestions for improvement
