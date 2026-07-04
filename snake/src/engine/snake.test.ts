import { describe, expect, it } from "vitest";
import { advance, createInitialState } from "./snake";

describe("snake engine", () => {
  it("creates a centered snake with the configured initial length", () => {
    const state = createInitialState({ columns: 15, rows: 15, initialLength: 3 });

    expect(state.snake).toEqual([
      { x: 7, y: 7 },
      { x: 6, y: 7 },
      { x: 5, y: 7 }
    ]);
    expect(state.direction).toBe("right");
    expect(state.score).toBe(0);
    expect(state.status).toBe("ready");
  });

  it("moves the snake one cell in the requested direction", () => {
    const state = createInitialState({ columns: 15, rows: 15, initialLength: 3 });
    const next = advance(state, "down");

    expect(next.snake[0]).toEqual({ x: 7, y: 8 });
    expect(next.snake).toHaveLength(3);
    expect(next.direction).toBe("down");
    expect(next.status).toBe("running");
  });
});
