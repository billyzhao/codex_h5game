import { LEVELS, LevelConfig, getUnlockedLevel, getCompletedLevels } from '../levels';

export interface LevelSelectCallbacks {
  onSelectLevel: (config: LevelConfig) => void;
}

export class LevelSelectScreen {
  private container: HTMLElement;
  private callbacks: LevelSelectCallbacks;
  private wrapper: HTMLElement;

  constructor(container: HTMLElement, callbacks: LevelSelectCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'level-select';
    this.wrapper.style.display = 'none';
    container.appendChild(this.wrapper);
    this.render();
  }

  show(): void {
    this.refresh();
    this.wrapper.style.display = 'flex';
  }

  hide(): void {
    this.wrapper.style.display = 'none';
  }

  refresh(): void {
    this.wrapper.innerHTML = '';
    this.render();
  }

  private render(): void {
    const unlocked = getUnlockedLevel();
    const completed = getCompletedLevels();

    const title = document.createElement('h2');
    title.textContent = '选择关卡';
    title.className = 'level-select-title';
    this.wrapper.appendChild(title);

    const cards = document.createElement('div');
    cards.className = 'level-cards';

    for (const level of LEVELS) {
      const card = document.createElement('div');
      card.className = 'level-card';
      if (level.level > unlocked) {
        card.classList.add('locked');
      }
      if (completed.has(level.level)) {
        card.classList.add('completed');
      }

      const img = document.createElement('img');
      img.src = level.avatar;
      img.alt = level.name;
      img.className = 'level-card-avatar';
      img.onerror = () => { img.style.display = 'none'; };

      const nameEl = document.createElement('div');
      nameEl.className = 'level-card-name';
      nameEl.textContent = level.name;

      const titleEl = document.createElement('div');
      titleEl.className = 'level-card-title';
      titleEl.textContent = level.level + '关';

      card.appendChild(img);
      card.appendChild(nameEl);
      card.appendChild(titleEl);

      if (level.level > unlocked) {
        const lock = document.createElement('span');
        lock.className = 'level-card-lock';
        lock.textContent = '\u{1F512}';
        card.appendChild(lock);
      }

      if (completed.has(level.level)) {
        const check = document.createElement('span');
        check.className = 'level-card-check';
        check.textContent = '\u2713';
        card.appendChild(check);
      }

      if (level.level <= unlocked) {
        card.addEventListener('click', () => {
          this.callbacks.onSelectLevel(level);
        });
      }

      cards.appendChild(card);
    }

    this.wrapper.appendChild(cards);
  }
}
