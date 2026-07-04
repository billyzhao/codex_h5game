# 贪吃蛇项目骨架 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `snake/` 下建立可构建、可测试的 Vite + TypeScript 贪吃蛇 H5 项目骨架。

**Architecture:** 项目使用独立 Vite 配置，纯 TypeScript 游戏核心和 Canvas UI 分离。当前任务只交付最小可测核心与页面壳，微信手机端专项优化后续再做。

**Tech Stack:** Vite 6、TypeScript 5、Vitest、Canvas 2D。

## Global Constraints

- 贪吃蛇项目文件全部放在 `snake/` 下。
- 五子棋项目保持在 `gomoku/` 下，不修改五子棋源码。
- commit message 使用中文。
- 本阶段不做微信 JS-SDK、分享卡片、触摸方向键专项优化。

---

### Task 1: 项目配置与测试骨架

**Files:**
- Create: `snake/package.json`
- Create: `snake/tsconfig.json`
- Create: `snake/vite.config.ts`
- Create: `snake/index.html`
- Create: `snake/src/vite-env.d.ts`

**Interfaces:**
- Produces: `npm test`、`npm run build`、Vite 入口 `src/main.ts`。

- [ ] **Step 1: 添加 Vite、TypeScript、Vitest 配置。**
- [ ] **Step 2: 添加基础 HTML 入口。**

### Task 2: 最小游戏核心

**Files:**
- Create: `snake/src/types.ts`
- Create: `snake/src/engine/snake.test.ts`
- Create: `snake/src/engine/snake.ts`

**Interfaces:**
- Produces: `createInitialState(config: GameConfig): GameState`
- Produces: `advance(state: GameState, nextDirection?: Direction): GameState`

- [ ] **Step 1: 先写失败测试：初始状态位于棋盘中心。**
- [ ] **Step 2: 运行 `npm test`，确认因为模块不存在而失败。**
- [ ] **Step 3: 实现最小核心逻辑。**
- [ ] **Step 4: 运行 `npm test`，确认通过。**

### Task 3: 页面壳与渲染入口

**Files:**
- Create: `snake/src/ui/renderer.ts`
- Create: `snake/src/ui/controls.ts`
- Create: `snake/src/game.ts`
- Create: `snake/src/main.ts`
- Create: `snake/style.css`

**Interfaces:**
- Consumes: `createInitialState`、`advance`
- Produces: 浏览器可打开的基础游戏页面。

- [ ] **Step 1: 添加 Canvas 渲染器。**
- [ ] **Step 2: 添加键盘方向输入。**
- [ ] **Step 3: 添加页面启动和基础样式。**
- [ ] **Step 4: 运行 `npm run build`。**

