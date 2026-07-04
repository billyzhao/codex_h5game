## 五子棋 H5 游戏 — 设计文档
日期：2026-07-02

### 概述
一个 H5 五子棋人机对战游戏，AI 使用 Minimax + Alpha-Beta 剪枝，中等棋力（有挑战性但可战胜）。

### 技术选型
Vite + TypeScript（Vanilla），Canvas 2D 渲染棋盘。不引入 UI 框架——项目交互集中在棋盘上，无复杂组件树和路由。

### 项目结构
```
├── index.html
├── src/
│   ├── main.ts              # 启动入口
│   ├── engine/
│   │   ├── board.ts         # 棋盘状态与胜负判断
│   │   └── ai.ts            # AI 引擎 + Web Worker 入口
│   ├── ui/
│   │   ├── board-renderer.ts  # Canvas 绘制
│   │   └── panel.ts         # 信息栏
│   └── game.ts              # 游戏控制器
├── style.css
├── tsconfig.json
├── vite.config.ts
└── package.json
```

### 模块设计

**棋盘引擎 (board.ts)**
- 15×15 二维数组：0=空, 1=黑, 2=白
- 落子方法，包含合法性检查（不能落在已有棋子的位置）
- 胜负判断：四方向扫描（横/竖/两对角），检测五连
- 悔棋支持：维护落子步数历史栈，可回退
- 获取当前可落子空位 + 启发式剪枝候选（仅搜索已有棋子周围2格内的空位）

**AI 引擎 (ai.ts)**
- Minimax + Alpha-Beta 剪枝
- 搜索深度：4 层（玩家/黑子先行视角）
- 局面评估：扫描所有五连窗口，按活四/冲四/活三/活二等模式计分
- 候选落子筛选：仅考虑已有棋子周围 2 格内空位，减少分支因子
- 通过 Web Worker 异步计算，不阻塞主线程 UI

**棋盘渲染 (board-renderer.ts)**
- Canvas 2D，适配 devicePixelRatio 高清屏
- 棋盘格线、星位点（天元和四角星）
- 黑白棋子带径向渐变模拟立体感
- 最后一手标记红点
- 落子缩放动画
- 悬停预览（鼠标位置显示半透明预览子）

**信息面板 (panel.ts)**
- 显示当前回合：黑方（你）/ 白方（AI）
- AI 思考中状态指示
- 胜负/平局结果展示
- 再来一局按钮

**游戏控制器 (game.ts)**
- 玩家先手（黑），AI 后手（白）
- 回合切换逻辑
- AI 思考时禁用点击
- 胜负后结束游戏

### 数据流
用户点击 Canvas → game.ts 获取坐标 → board.ts 落子 + 判断胜负 → 若无胜负，触发 AI → ai.ts(Web Worker) 计算最佳落子 → board.ts 落子 + 判断胜负 → board-renderer.ts 重绘 → panel.ts 更新状态

### 边界情况
- 棋盘满 225 子无胜负 → 平局
- AI 计算时快速连续点击 → 禁用交互
- 首手（棋盘空时 AI 首步）→ 默认落天元附近
- Web Worker 不支持时降级到主线程同步计算
