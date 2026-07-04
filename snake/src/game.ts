import { advance, createInitialState } from "./engine/snake";
import type { Direction, GameState } from "./types";
import { bindKeyboardControls } from "./ui/controls";
import { Renderer } from "./ui/renderer";

const defaultConfig = {
  columns: 15,
  rows: 15,
  initialLength: 3
};

export class Game {
  private state: GameState = createInitialState(defaultConfig);
  private pendingDirection: Direction = this.state.direction;
  private timerId = 0;
  private readonly renderer: Renderer;
  private readonly scoreElement: HTMLElement;
  private readonly statusElement: HTMLElement;

  constructor(private readonly root: HTMLElement) {
    this.root.innerHTML = `
      <main class="game-shell">
        <section class="game-header">
          <div>
            <p class="eyebrow">Snake H5</p>
            <h1>贪吃蛇</h1>
          </div>
          <div class="score-box">
            <span>分数</span>
            <strong data-score>0</strong>
          </div>
        </section>
        <canvas class="game-board" aria-label="贪吃蛇游戏区域"></canvas>
        <section class="game-actions">
          <button type="button" data-start>开始 / 重开</button>
          <p data-status>按方向键移动</p>
        </section>
      </main>
    `;

    const canvas = this.required<HTMLCanvasElement>("canvas");
    this.renderer = new Renderer(canvas);
    this.scoreElement = this.required("[data-score]");
    this.statusElement = this.required("[data-status]");

    this.required<HTMLButtonElement>("[data-start]").addEventListener("click", () => this.restart());
    bindKeyboardControls((direction) => {
      this.pendingDirection = direction;
      if (!this.timerId) {
        this.startLoop();
      }
    });

    this.render();
  }

  restart(): void {
    window.clearInterval(this.timerId);
    this.timerId = 0;
    this.state = createInitialState(defaultConfig);
    this.pendingDirection = this.state.direction;
    this.startLoop();
    this.render();
  }

  private startLoop(): void {
    if (this.timerId) {
      return;
    }

    this.timerId = window.setInterval(() => this.tick(), 180);
  }

  private tick(): void {
    this.state = advance(this.state, this.pendingDirection);
    if (this.state.status === "game-over") {
      window.clearInterval(this.timerId);
      this.timerId = 0;
    }
    this.render();
  }

  private render(): void {
    this.renderer.render(this.state);
    this.scoreElement.textContent = String(this.state.score);
    this.statusElement.textContent = this.state.status === "game-over" ? "游戏结束，点击重开" : "按方向键移动";
  }

  private required<T extends Element = HTMLElement>(selector: string): T {
    const element = this.root.querySelector<T>(selector);
    if (!element) {
      throw new Error(`Missing element: ${selector}`);
    }
    return element;
  }
}
