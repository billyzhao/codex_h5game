export type Direction = "up" | "down" | "left" | "right";

export type GameStatus = "ready" | "running" | "game-over";

export interface Point {
  readonly x: number;
  readonly y: number;
}

export interface GameConfig {
  readonly columns: number;
  readonly rows: number;
  readonly initialLength: number;
}

export interface GameState {
  readonly config: GameConfig;
  readonly snake: readonly Point[];
  readonly direction: Direction;
  readonly food: Point;
  readonly score: number;
  readonly status: GameStatus;
}
