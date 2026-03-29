import { BrogueRenderer } from "./renderer.ts";
import { GameEngine } from "../engine/engine.ts";
import { COLS, ROWS } from "../shared/constants.ts";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const engine = new GameEngine();
const renderer = new BrogueRenderer(canvas, COLS, ROWS);

// Start a new game
engine.newGame();

// Listen for display changes
engine.on("displayChanged", () => {
  const buffer = engine.getDisplayBuffer();
  renderer.render(buffer);
});

// Keyboard input
document.addEventListener("keydown", (e) => {
  e.preventDefault();

  const key = mapKey(e);
  if (key !== null) {
    engine.handleKeystroke(key, e.ctrlKey, e.shiftKey);
  }
});

function mapKey(e: KeyboardEvent): number | null {
  // Vi keys and arrows
  switch (e.key) {
    case "h": case "ArrowLeft":  return "h".charCodeAt(0);
    case "j": case "ArrowDown":  return "j".charCodeAt(0);
    case "k": case "ArrowUp":    return "k".charCodeAt(0);
    case "l": case "ArrowRight": return "l".charCodeAt(0);
    case "y": return "y".charCodeAt(0); // NW
    case "u": return "u".charCodeAt(0); // NE
    case "b": return "b".charCodeAt(0); // SW
    case "n": return "n".charCodeAt(0); // SE
    case ".": return ".".charCodeAt(0); // rest
    case "s": return "s".charCodeAt(0); // search
    case ">": return ">".charCodeAt(0); // descend
    case "<": return "<".charCodeAt(0); // ascend
    case "x": return "x".charCodeAt(0); // explore
    case "i": return "i".charCodeAt(0); // inventory
    case "Escape": return 27;
    case "Enter": return 13;
    default: {
      if (e.key.length === 1) return e.key.charCodeAt(0);
      return null;
    }
  }
}
