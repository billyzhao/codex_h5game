# 贪吃蛇 H5 游戏设计

日期：2026-07-04

## 目标

在 `snake/` 下新建一个独立的 Vite + TypeScript H5 贪吃蛇项目。第一阶段只搭项目骨架和最小可测游戏核心，为后续经典玩法、街机增强和微信手机端体验优化打基础。

## 范围

本阶段包含：

- 独立 `snake/` 项目配置：`package.json`、`tsconfig.json`、`vite.config.ts`、`index.html`。
- 基础源码目录：`src/engine/`、`src/ui/`、`src/types.ts`、`src/main.ts`。
- 测试环境：使用 Vitest 验证游戏核心逻辑。
- 最小游戏状态：棋盘尺寸、蛇初始位置、方向、食物、分数、状态。
- 简单页面壳：Canvas 区域、分数显示、开始/重开按钮占位。

本阶段不包含：

- 微信 JS-SDK 接入。
- 分享封面、朋友圈卡片定制。
- 触摸方向键专项优化。
- 完整障碍物、等级加速和本地最高分系统。

## 技术方案

继续采用 Vite + TypeScript + Canvas 2D。贪吃蛇和五子棋分别作为独立项目存在，互不共享构建配置，便于分别部署和发布链接。

## 模块边界

- `src/types.ts`：共享类型定义。
- `src/engine/snake.ts`：纯游戏逻辑，负责创建初始状态、移动、吃食物、碰撞判断。
- `src/ui/renderer.ts`：Canvas 绘制入口。
- `src/ui/controls.ts`：键盘输入入口，后续扩展触摸控制。
- `src/game.ts`：连接引擎、渲染和输入。
- `src/main.ts`：页面启动入口。

## 验证

- `npm test` 运行核心逻辑测试。
- `npm run build` 完成 TypeScript 检查和 Vite 打包。

