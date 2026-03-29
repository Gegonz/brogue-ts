import type { CellDisplayBuffer } from "../shared/types.ts";

const CELL_WIDTH = 10;
const CELL_HEIGHT = 18;

export class BrogueRenderer {
  private ctx: CanvasRenderingContext2D;
  private cols: number;
  private rows: number;

  constructor(canvas: HTMLCanvasElement, cols: number, rows: number) {
    this.cols = cols;
    this.rows = rows;
    canvas.width = cols * CELL_WIDTH;
    canvas.height = rows * CELL_HEIGHT;
    this.ctx = canvas.getContext("2d")!;
    this.ctx.font = `${CELL_HEIGHT - 2}px monospace`;
    this.ctx.textBaseline = "top";
  }

  render(buffer: CellDisplayBuffer[][]): void {
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        const cell = buffer[x]?.[y];
        if (!cell) continue;
        this.plotChar(cell, x, y);
      }
    }
  }

  private plotChar(cell: CellDisplayBuffer, x: number, y: number): void {
    const px = x * CELL_WIDTH;
    const py = y * CELL_HEIGHT;

    // Background
    const [br, bg, bb] = cell.backColorComponents;
    this.ctx.fillStyle = `rgb(${br * 2.55 | 0},${bg * 2.55 | 0},${bb * 2.55 | 0})`;
    this.ctx.fillRect(px, py, CELL_WIDTH, CELL_HEIGHT);

    // Foreground character
    const ch = cell.character;
    if (ch && ch !== " " && ch !== "\0") {
      const [fr, fg, fb] = cell.foreColorComponents;
      this.ctx.fillStyle = `rgb(${fr * 2.55 | 0},${fg * 2.55 | 0},${fb * 2.55 | 0})`;
      this.ctx.fillText(ch, px + 1, py + 1);
    }
  }

  clear(): void {
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.cols * CELL_WIDTH, this.rows * CELL_HEIGHT);
  }
}
