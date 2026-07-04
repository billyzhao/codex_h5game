import { Board, Cell } from '../engine/board';

const CELL_SIZE = 36;
const PADDING = 24;
const PIECE_RADIUS = 15;

export class BoardRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private board: Board;
  private hoverRow: number | null = null;
  private hoverCol: number | null = null;
  lastMove: { row: number; col: number } | null = null;

  constructor(canvas: HTMLCanvasElement, board: Board) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context not available');
    this.ctx = ctx;
    this.board = board;
    this.resize();
  }

  get canvasWidth(): number {
    return (this.board.size - 1) * CELL_SIZE + PADDING * 2;
  }

  get canvasHeight(): number {
    return this.canvasWidth;
  }

  resize(): void {
    const dpr = window.devicePixelRatio || 1;
    const w = this.canvasWidth;
    const h = this.canvasHeight;
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  draw(): void {
    const ctx = this.ctx;
    const w = this.canvasWidth;
    const h = this.canvasHeight;

    ctx.clearRect(0, 0, w, h);

    // 棋盘背景
    ctx.fillStyle = '#dcb35c';
    ctx.fillRect(0, 0, w, h);

    // 网格线
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let i = 0; i < this.board.size; i++) {
      const pos = PADDING + i * CELL_SIZE;
      ctx.beginPath();
      ctx.moveTo(PADDING, pos);
      ctx.lineTo(PADDING + (this.board.size - 1) * CELL_SIZE, pos);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pos, PADDING);
      ctx.lineTo(pos, PADDING + (this.board.size - 1) * CELL_SIZE);
      ctx.stroke();
    }

    // 星位点
    const starPoints: [number, number][] = this.board.size === 15
      ? [[3, 3], [3, 7], [3, 11], [7, 3], [7, 7], [7, 11], [11, 3], [11, 7], [11, 11]]
      : [[Math.floor(this.board.size / 2), Math.floor(this.board.size / 2)]];

    ctx.fillStyle = '#333';
    for (const [r, c] of starPoints) {
      const x = PADDING + c * CELL_SIZE;
      const y = PADDING + r * CELL_SIZE;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // 棋子
    for (let r = 0; r < this.board.size; r++) {
      for (let c = 0; c < this.board.size; c++) {
        if (this.board.grid[r][c] === 0) continue;
        this.drawPiece(r, c, this.board.grid[r][c]);
      }
    }

    // 最后一手标记
    if (this.lastMove) {
      const { row, col } = this.lastMove;
      const x = PADDING + col * CELL_SIZE;
      const y = PADDING + row * CELL_SIZE;
      ctx.fillStyle = '#e94560';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // 悬停预览
    if (this.hoverRow !== null && this.hoverCol !== null) {
      const cell = this.board.grid[this.hoverRow][this.hoverCol];
      if (cell === 0) {
        this.drawPiece(this.hoverRow, this.hoverCol, 1, 0.4);
      }
    }
  }

  drawHover(row: number, col: number): void {
    if (this.hoverRow === row && this.hoverCol === col) return;
    this.hoverRow = row;
    this.hoverCol = col;
    this.draw();
  }

  clearHover(): void {
    this.hoverRow = null;
    this.hoverCol = null;
    this.draw();
  }

  private drawPiece(row: number, col: number, player: Cell, alpha = 1): void {
    const ctx = this.ctx;
    const x = PADDING + col * CELL_SIZE;
    const y = PADDING + row * CELL_SIZE;

    ctx.save();
    ctx.globalAlpha = alpha;

    // 阴影
    ctx.beginPath();
    ctx.arc(x + 1, y + 1, PIECE_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fill();

    // 棋子主体（径向渐变）
    const gradient = ctx.createRadialGradient(
      x - 4, y - 4, PIECE_RADIUS * 0.1,
      x, y, PIECE_RADIUS
    );
    if (player === 1) {
      gradient.addColorStop(0, '#555');
      gradient.addColorStop(1, '#111');
    } else {
      gradient.addColorStop(0, '#fff');
      gradient.addColorStop(1, '#bbb');
    }

    ctx.beginPath();
    ctx.arc(x, y, PIECE_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.restore();
  }

  pixelToCell(px: number, py: number): { row: number; col: number } | null {
    const col = Math.round((px - PADDING) / CELL_SIZE);
    const row = Math.round((py - PADDING) / CELL_SIZE);
    if (row < 0 || row >= this.board.size || col < 0 || col >= this.board.size) {
      return null;
    }
    const cx = PADDING + col * CELL_SIZE;
    const cy = PADDING + row * CELL_SIZE;
    const dist = Math.sqrt((px - cx) ** 2 + (py - cy) ** 2);
    if (dist > PIECE_RADIUS + 4) return null;
    return { row, col };
  }

  setLastMove(move: { row: number; col: number } | null): void {
    this.lastMove = move;
  }
}
