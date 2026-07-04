export type Cell = 0 | 1 | 2;

const DIRECTIONS: [number, number][] = [
  [1, 0],
  [0, 1],
  [1, 1],
  [1, -1],
];

export class Board {
  readonly size: number;
  grid: Cell[][];
  moveCount: number;
  history: Array<{ row: number; col: number }>;

  constructor(size = 15) {
    this.size = size;
    this.grid = [];
    this.moveCount = 0;
    this.history = [];
    this.reset();
  }

  reset(): void {
    this.grid = Array.from({ length: this.size }, () =>
      new Array<Cell>(this.size).fill(0)
    );
    this.moveCount = 0;
    this.history = [];
  }

  place(row: number, col: number, player: 1 | 2): boolean {
    if (row < 0 || row >= this.size || col < 0 || col >= this.size) return false;
    if (this.grid[row][col] !== 0) return false;
    this.grid[row][col] = player;
    this.moveCount++;
    this.history.push({ row, col });
    return true;
  }

  undo(): { row: number; col: number } | null {
    const last = this.history.pop();
    if (!last) return null;
    this.grid[last.row][last.col] = 0;
    this.moveCount--;
    return last;
  }

  checkWin(row: number, col: number): 0 | 1 | 2 {
    const player = this.grid[row][col];
    if (player === 0) return 0;

    for (const [dr, dc] of DIRECTIONS) {
      let count = 1;
      for (let i = 1; i < 5; i++) {
        const r = row + dr * i;
        const c = col + dc * i;
        if (r < 0 || r >= this.size || c < 0 || c >= this.size) break;
        if (this.grid[r][c] !== player) break;
        count++;
      }
      for (let i = 1; i < 5; i++) {
        const r = row - dr * i;
        const c = col - dc * i;
        if (r < 0 || r >= this.size || c < 0 || c >= this.size) break;
        if (this.grid[r][c] !== player) break;
        count++;
      }
      if (count >= 5) return player;
    }
    return 0;
  }

  isFull(): boolean {
    return this.moveCount >= this.size * this.size;
  }

  getCandidates(): Array<{ row: number; col: number }> {
    const candidateSet = new Set<string>();
    const range = 2;

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.grid[r][c] !== 0) continue;
        let near = false;
        outer:
        for (let dr = -range; dr <= range; dr++) {
          for (let dc = -range; dc <= range; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr;
            const nc = c + dc;
            if (nr < 0 || nr >= this.size || nc < 0 || nc >= this.size) continue;
            if (this.grid[nr][nc] !== 0) {
              near = true;
              break outer;
            }
          }
        }
        if (near) {
          candidateSet.add(`${r},${c}`);
        }
      }
    }

    if (candidateSet.size === 0) {
      const center = Math.floor(this.size / 2);
      return [{ row: center, col: center }];
    }

    return Array.from(candidateSet).map((key) => {
      const [r, c] = key.split(',').map(Number);
      return { row: r, col: c };
    });
  }

  clone(): Board {
    const b = new Board(this.size);
    b.grid = this.grid.map(row => [...row]);
    b.moveCount = this.moveCount;
    b.history = this.history.map(h => ({ ...h }));
    return b;
  }
}
