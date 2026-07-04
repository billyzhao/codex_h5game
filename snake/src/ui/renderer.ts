import type { GameState } from "../types";

const cellGap = 2;

export class Renderer {
  private readonly context: CanvasRenderingContext2D;

  constructor(private readonly canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas 2D is not available.");
    }
    this.context = context;
  }

  render(state: GameState): void {
    const { columns, rows } = state.config;
    const width = this.canvas.clientWidth || 480;
    const cellSize = Math.floor(width / columns);

    this.canvas.width = cellSize * columns;
    this.canvas.height = cellSize * rows;

    this.context.fillStyle = "#101820";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawFood(state, cellSize);
    this.drawSnake(state, cellSize);
  }

  private drawSnake(state: GameState, cellSize: number): void {
    state.snake.forEach((part, index) => {
      this.context.fillStyle = index === 0 ? "#f2c94c" : "#27ae60";
      this.context.fillRect(
        part.x * cellSize + cellGap,
        part.y * cellSize + cellGap,
        cellSize - cellGap * 2,
        cellSize - cellGap * 2
      );
    });
  }

  private drawFood(state: GameState, cellSize: number): void {
    this.context.fillStyle = "#eb5757";
    this.context.fillRect(
      state.food.x * cellSize + cellGap,
      state.food.y * cellSize + cellGap,
      cellSize - cellGap * 2,
      cellSize - cellGap * 2
    );
  }
}
