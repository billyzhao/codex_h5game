import { Board } from './engine/board';
import { AIPlayer } from './engine/ai';
import { BoardRenderer } from './ui/board-renderer';
import { Panel } from './ui/panel';
import { LevelConfig, markLevelCompleted, unlockLevel } from './levels';

export class Game {
  private board: Board;
  private ai: AIPlayer;
  private renderer: BoardRenderer;
  private panel: Panel;
  private levelConfig: LevelConfig;
  private gameOver: boolean = false;
  private onBackToLevels: () => void;

  constructor(canvas: HTMLCanvasElement, panelContainer: HTMLElement, levelConfig: LevelConfig, onBackToLevels: () => void) {
    this.levelConfig = levelConfig;
    this.onBackToLevels = onBackToLevels;
    this.board = new Board(15);
    this.ai = new AIPlayer(this.board, {
      depth: levelConfig.depth,
      maxCandidates: levelConfig.maxCandidates,
      randomness: levelConfig.randomness,
    });
    this.renderer = new BoardRenderer(canvas, this.board);
    this.panel = new Panel(panelContainer, {
      avatar: levelConfig.avatar,
      levelTitle: levelConfig.title,
    });
    this.bindEvents();
    this.renderer.draw();
    this.panel.setStatus('你的回合 (黑子)');
  }

  private bindEvents(): void {
    const canvas = (this.renderer as any).canvas as HTMLCanvasElement;
    canvas.addEventListener('click', (e: MouseEvent) => {
      if (this.gameOver) return;
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const cell = this.renderer.pixelToCell(px, py);
      if (!cell) return;
      this.handleHumanMove(cell.row, cell.col);
    });
    canvas.addEventListener('mousemove', (e: MouseEvent) => {
      if (this.gameOver) return;
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const cell = this.renderer.pixelToCell(px, py);
      if (cell && this.board.grid[cell.row][cell.col] === 0) {
        this.renderer.drawHover(cell.row, cell.col);
      } else {
        this.renderer.clearHover();
      }
    });
    canvas.addEventListener('mouseleave', () => { this.renderer.clearHover(); });
    this.panel.onRestart(() => this.restart());
    this.panel.onBackToLevels(() => {
      this.ai.destroy();
      this.onBackToLevels();
    });
  }

  private handleHumanMove(row: number, col: number): void {
    if (!this.board.place(row, col, 1)) return;
    this.renderer.setLastMove({ row, col });
    this.renderer.draw();
    const winner = this.board.checkWin(row, col);
    if (winner === 1) {
      this.gameOver = true;
      markLevelCompleted(this.levelConfig.level);
      unlockLevel(this.levelConfig.level);
      this.panel.showResult('你赢了！');
      return;
    }
    if (this.board.isFull()) {
      this.gameOver = true;
      this.panel.showResult('平局！');
      return;
    }
    this.doAIMove();
  }

  private async doAIMove(): Promise<void> {
    this.panel.showThinking();
    this.renderer.draw();
    try {
      const move = await this.ai.getBestMove();
      this.board.place(move.row, move.col, 2);
      this.renderer.setLastMove({ row: move.row, col: move.col });
      this.renderer.draw();
      const winner = this.board.checkWin(move.row, move.col);
      if (winner === 2) {
        this.gameOver = true;
        this.panel.showResult('AI 赢了！');
        return;
      }
      if (this.board.isFull()) {
        this.gameOver = true;
        this.panel.showResult('平局！');
        return;
      }
      this.panel.setStatus('你的回合 (黑子)');
    } catch {
      this.panel.setStatus('AI 计算出错，请重试');
    }
  }

  private restart(): void {
    this.ai.destroy();
    this.board.reset();
    this.ai = new AIPlayer(this.board, {
      depth: this.levelConfig.depth,
      maxCandidates: this.levelConfig.maxCandidates,
      randomness: this.levelConfig.randomness,
    });
    this.renderer.setLastMove(null);
    this.renderer.draw();
    this.gameOver = false;
    this.panel.setStatus('你的回合 (黑子)');
  }
}
