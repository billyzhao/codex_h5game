import { Board } from './board';

export class AIPlayer {
  private board: Board;
  private depth: number;
  private maxCandidates: number;
  private randomness: number;
  private worker: Worker | null = null;

  constructor(board: Board, options: { depth: number; maxCandidates: number; randomness: number }) {
    this.board = board;
    this.depth = options.depth;
    this.maxCandidates = options.maxCandidates;
    this.randomness = options.randomness;
  }

  getBestMove(): Promise<{ row: number; col: number }> {
    return new Promise((resolve, reject) => {
      try {
        this.worker = new Worker(
          new URL('./ai-worker.ts', import.meta.url),
          { type: 'module' }
        );

        this.worker.onmessage = (e) => {
          const { row, col } = e.data;
          this.worker?.terminate();
          this.worker = null;
          resolve({ row, col });
        };

        this.worker.onerror = (err) => {
          this.worker?.terminate();
          this.worker = null;
          reject(err);
        };

        const gridCopy = this.board.grid.map((row) => [...row]);
        this.worker.postMessage({
          type: 'compute',
          grid: gridCopy,
          size: this.board.size,
          aiPlayer: 2 as const,
          humanPlayer: 1 as const,
          depth: this.depth,
          maxCandidates: this.maxCandidates,
          randomness: this.randomness,
        });
      } catch {
        reject(new Error('Web Worker not available'));
      }
    });
  }

  destroy(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}
