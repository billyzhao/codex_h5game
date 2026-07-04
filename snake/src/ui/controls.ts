import type { Direction } from "../types";

const keyDirection: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right"
};

export function bindKeyboardControls(onDirection: (direction: Direction) => void): () => void {
  const listener = (event: KeyboardEvent) => {
    const direction = keyDirection[event.key];
    if (!direction) {
      return;
    }

    event.preventDefault();
    onDirection(direction);
  };

  window.addEventListener("keydown", listener);
  return () => window.removeEventListener("keydown", listener);
}
