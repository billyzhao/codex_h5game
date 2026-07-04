export interface LevelConfig {
  level: number;
  name: string;
  title: string;
  avatar: string;
  depth: number;
  maxCandidates: number;
  randomness: number; // 0~1, probability of picking a random candidate
}

export const LEVELS: LevelConfig[] = [
  {
    level: 1,
    name: "学徒",
    title: "第1关 · 学徒",
    avatar: "/avatars/level1.png",
    depth: 1,
    maxCandidates: 10,
    randomness: 0.4,
  },
  {
    level: 2,
    name: "棋童",
    title: "第2关 · 棋童",
    avatar: "/avatars/level2.png",
    depth: 2,
    maxCandidates: 12,
    randomness: 0.2,
  },
  {
    level: 3,
    name: "棋客",
    title: "第3关 · 棋客",
    avatar: "/avatars/level3.png",
    depth: 3,
    maxCandidates: 15,
    randomness: 0.05,
  },
  {
    level: 4,
    name: "棋师",
    title: "第4关 · 棋师",
    avatar: "/avatars/level4.png",
    depth: 4,
    maxCandidates: 20,
    randomness: 0,
  },
  {
    level: 5,
    name: "棋圣",
    title: "第5关 · 棋圣",
    avatar: "/avatars/level5.png",
    depth: 4,
    maxCandidates: 30,
    randomness: 0,
  },
];

const STORAGE_KEY = "gomoku-progress";

export function getUnlockedLevel(): number {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? Math.max(1, parseInt(stored, 10) || 1) : 1;
}

export function unlockLevel(level: number): void {
  const current = getUnlockedLevel();
  if (level + 1 > current) {
    localStorage.setItem(STORAGE_KEY, String(level + 1));
  }
}

export function getCompletedLevels(): Set<number> {
  const stored = localStorage.getItem("gomoku-completed");
  return stored ? new Set(JSON.parse(stored)) : new Set();
}

export function markLevelCompleted(level: number): void {
  const completed = getCompletedLevels();
  completed.add(level);
  localStorage.setItem("gomoku-completed", JSON.stringify([...completed]));
}
