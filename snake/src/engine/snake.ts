import type { Direction, GameConfig, GameState, Point } from "../types";

const directionVector: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};

const oppositeDirection: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left"
};

export function createInitialState(config: GameConfig): GameState {
  const head = {
    x: Math.floor(config.columns / 2),
    y: Math.floor(config.rows / 2)
  };
  const snake = Array.from({ length: config.initialLength }, (_, index) => ({
    x: head.x - index,
    y: head.y
  }));

  return {
    config,
    snake,
    direction: "right",
    food: placeFood(config, snake),
    score: 0,
    status: "ready"
  };
}

export function advance(state: GameState, nextDirection = state.direction): GameState {
  if (state.status === "game-over") {
    return state;
  }

  const direction = normalizeDirection(state.direction, nextDirection);
  const vector = directionVector[direction];
  const head = state.snake[0];
  const nextHead = { x: head.x + vector.x, y: head.y + vector.y };
  const ateFood = samePoint(nextHead, state.food);
  const body = ateFood ? state.snake : state.snake.slice(0, -1);

  if (isOutside(nextHead, state.config) || body.some((part) => samePoint(part, nextHead))) {
    return {
      ...state,
      direction,
      status: "game-over"
    };
  }

  const snake = [nextHead, ...body];

  return {
    ...state,
    snake,
    direction,
    food: ateFood ? placeFood(state.config, snake) : state.food,
    score: ateFood ? state.score + 10 : state.score,
    status: "running"
  };
}

function normalizeDirection(current: Direction, requested: Direction): Direction {
  return requested === oppositeDirection[current] ? current : requested;
}

function placeFood(config: GameConfig, snake: readonly Point[]): Point {
  for (let y = 0; y < config.rows; y += 1) {
    for (let x = 0; x < config.columns; x += 1) {
      const point = { x, y };
      if (!snake.some((part) => samePoint(part, point))) {
        return point;
      }
    }
  }

  return { x: -1, y: -1 };
}

function isOutside(point: Point, config: GameConfig): boolean {
  return point.x < 0 || point.y < 0 || point.x >= config.columns || point.y >= config.rows;
}

function samePoint(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}
