import { LEVELS, LevelConfig, getUnlockedLevel, getCompletedLevels, markLevelCompleted, unlockLevel } from './levels';
import { LevelSelectScreen } from './ui/level-select';
import { Game } from './game';

const appEl = document.getElementById('app')!;

function startGame(config: LevelConfig) {
  // Clear app and create game view
  appEl.innerHTML = '';
  
  const title = document.createElement('h1');
  title.textContent = '五子棋';
  appEl.appendChild(title);

  const container = document.createElement('div');
  container.className = 'game-container';

  const canvas = document.createElement('canvas');
  canvas.id = 'board';
  container.appendChild(canvas);

  const panel = document.createElement('div');
  panel.id = 'panel';
  container.appendChild(panel);

  appEl.appendChild(container);

  const game = new Game(canvas, panel, config, () => {
    showLevelSelect();
  });
}

function showLevelSelect() {
  appEl.innerHTML = '';
  const screen = new LevelSelectScreen(appEl, {
    onSelectLevel: (config) => {
      startGame(config);
    },
  });
  screen.show();
}

showLevelSelect();
