type Cell = 0 | 1 | 2;

const DIRECTIONS: [number, number][] = [
  [1, 0],
  [0, 1],
  [1, 1],
  [1, -1],
];

interface MoveMessage {
  type: 'compute';
  grid: Cell[][];
  size: number;
  aiPlayer: 1 | 2;
  humanPlayer: 1 | 2;
  depth: number;
  maxCandidates: number;
  randomness: number;
}

interface ResultMessage {
  type: 'result';
  row: number;
  col: number;
}

// 评估单条线上的连续子模式
function evaluateLine(
  grid: Cell[][], size: number,
  row: number, col: number,
  dr: number, dc: number,
  player: Cell
): number {
  let count = 1;
  let openEnds = 0;

  // 正方向：跳过起始位置本身
  {
    let r = row + dr;
    let c = col + dc;
    for (let i = 0; i < 4; i++) {
      if (r < 0 || r >= size || c < 0 || c >= size) break;
      const cell = grid[r][c];
      if (cell === player) { count++; }
      else if (cell === 0) { openEnds++; break; }
      else break;
      r += dr;
      c += dc;
    }
  }

  // 反方向
  {
    let r = row - dr;
    let c = col - dc;
    for (let i = 0; i < 4; i++) {
      if (r < 0 || r >= size || c < 0 || c >= size) break;
      const cell = grid[r][c];
      if (cell === player) { count++; }
      else if (cell === 0) { openEnds++; break; }
      else break;
      r -= dr;
      c -= dc;
    }
  }

  if (count >= 5) return 100000;
  if (count === 4 && openEnds === 2) return 10000;
  if (count === 4 && openEnds === 1) return 1000;
  if (count === 3 && openEnds === 2) return 1000;
  if (count === 3 && openEnds === 1) return 100;
  if (count === 2 && openEnds === 2) return 100;
  if (count === 2 && openEnds === 1) return 10;
  if (count === 1 && openEnds === 2) return 10;
  if (count === 1 && openEnds === 1) return 1;
  return 0;
}

function evaluateBoard(grid: Cell[][], size: number, player: Cell): number {
  let score = 0;
  const opponent: Cell = player === 1 ? 2 : 1;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === 0) continue;
      const p = grid[r][c];
      for (const [dr, dc] of DIRECTIONS) {
        const lineScore = evaluateLine(grid, size, r, c, dr, dc, p);
        if (p === player) {
          score += lineScore;
        } else {
          score -= lineScore * 1.1;
        }
      }
    }
  }
  return score;
}

function getCandidates(grid: Cell[][], size: number): Array<{ row: number; col: number }> {
  const candidateSet = new Set<string>();
  const range = 2;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] !== 0) continue;
      let near = false;
      outer:
      for (let dr = -range; dr <= range; dr++) {
        for (let dc = -range; dc <= range; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue;
          if (grid[nr][nc] !== 0) {
            near = true;
            break outer;
          }
        }
      }
      if (near) candidateSet.add(`${r},${c}`);
    }
  }

  if (candidateSet.size === 0) {
    const center = Math.floor(size / 2);
    return [{ row: center, col: center }];
  }

  return Array.from(candidateSet).map((key) => {
    const [r, c] = key.split(',').map(Number);
    return { row: r, col: c };
  });
}

function checkWin(grid: Cell[][], size: number, row: number, col: number): Cell {
  const player = grid[row][col];
  if (player === 0) return 0;
  for (const [dr, dc] of DIRECTIONS) {
    let count = 1;
    for (let i = 1; i < 5; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r < 0 || r >= size || c < 0 || c >= size) break;
      if (grid[r][c] !== player) break;
      count++;
    }
    for (let i = 1; i < 5; i++) {
      const r = row - dr * i;
      const c = col - dc * i;
      if (r < 0 || r >= size || c < 0 || c >= size) break;
      if (grid[r][c] !== player) break;
      count++;
    }
    if (count >= 5) return player;
  }
  return 0;
}

function minimax(
  grid: Cell[][],
  size: number,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  aiPlayer: Cell,
  humanPlayer: Cell,
  lastRow: number,
  lastCol: number,
  maxCandidates: number
): number {
  const winner = checkWin(grid, size, lastRow, lastCol);
  if (winner === aiPlayer) return 100000 + depth;
  if (winner === humanPlayer) return -100000 - depth;
  if (depth === 0) return evaluateBoard(grid, size, aiPlayer);

  const candidates = getCandidates(grid, size);

  // 启发式排序：优先靠近中心
  const center = Math.floor(size / 2);
  candidates.sort((a, b) => {
    const distA = Math.abs(a.row - center) + Math.abs(a.col - center);
    const distB = Math.abs(b.row - center) + Math.abs(b.col - center);
    return distA - distB;
  });

  const limited = candidates.slice(0, maxCandidates);

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const { row, col } of limited) {
      grid[row][col] = aiPlayer;
      const val = minimax(grid, size, depth - 1, alpha, beta, false, aiPlayer, humanPlayer, row, col, maxCandidates);
      grid[row][col] = 0;
      maxEval = Math.max(maxEval, val);
      alpha = Math.max(alpha, val);
      if (beta <= alpha) break;
    }
    return maxEval === -Infinity ? evaluateBoard(grid, size, aiPlayer) : maxEval;
  } else {
    let minEval = Infinity;
    for (const { row, col } of limited) {
      grid[row][col] = humanPlayer;
      const val = minimax(grid, size, depth - 1, alpha, beta, true, aiPlayer, humanPlayer, row, col, maxCandidates);
      grid[row][col] = 0;
      minEval = Math.min(minEval, val);
      beta = Math.min(beta, val);
      if (beta <= alpha) break;
    }
    return minEval === Infinity ? evaluateBoard(grid, size, aiPlayer) : minEval;
  }
}

function findBestMove(
  grid: Cell[][],
  size: number,
  depth: number,
  aiPlayer: Cell,
  humanPlayer: Cell,
  maxCandidates: number,
  randomness: number
): { row: number; col: number } {
  const candidates = getCandidates(grid, size);

  const center = Math.floor(size / 2);
  candidates.sort((a, b) => {
    const distA = Math.abs(a.row - center) + Math.abs(a.col - center);
    const distB = Math.abs(b.row - center) + Math.abs(b.col - center);
    return distA - distB;
  });

  const limited = candidates.slice(0, maxCandidates);

  let bestScore = -Infinity;
  let bestMove = limited[0];

  for (const { row, col } of limited) {
    grid[row][col] = aiPlayer;
    if (checkWin(grid, size, row, col) === aiPlayer) {
      grid[row][col] = 0;
      return { row, col };
    }
    const score = minimax(grid, size, depth - 1, -Infinity, Infinity, false, aiPlayer, humanPlayer, row, col, maxCandidates);
    grid[row][col] = 0;
    if (score > bestScore) {
      bestScore = score;
      bestMove = { row, col };
    }
  }

  // randomness: 以 randomness 概率从候选手中随机选一步（让低关卡 AI 犯错）
  if (randomness > 0 && Math.random() < randomness && limited.length > 1) {
    const safeCandidates = limited.filter(({ row, col }) => {
      grid[row][col] = humanPlayer;
      const opponentWins = checkWin(grid, size, row, col) === humanPlayer;
      grid[row][col] = 0;
      return !opponentWins;
    });
    if (safeCandidates.length > 1) {
      const randIdx = Math.floor(Math.random() * safeCandidates.length);
      return safeCandidates[randIdx];
    }
  }

  return bestMove;
}

self.onmessage = (e: MessageEvent<MoveMessage>) => {
  const { grid, size, aiPlayer, humanPlayer, depth, maxCandidates, randomness } = e.data;
  const move = findBestMove(grid, size, depth, aiPlayer, humanPlayer, maxCandidates, randomness);
  const result: ResultMessage = { type: 'result', row: move.row, col: move.col };
  self.postMessage(result);
};
