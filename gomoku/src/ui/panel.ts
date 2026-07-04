export interface PanelConfig {
  avatar: string;
  levelTitle: string;
}

export class Panel {
  private container: HTMLElement;
  private statusText: HTMLElement;
  private restartBtn: HTMLButtonElement;
  private backBtn: HTMLButtonElement;
  private headerEl: HTMLElement;
  private avatarImg: HTMLImageElement;
  private levelTitleEl: HTMLElement;
  private onBackCallback: (() => void) | null = null;

  constructor(container: HTMLElement, config?: PanelConfig) {
    this.container = container;
    container.innerHTML = "";

    // header: avatar + level title (only when config is provided)
    this.headerEl = document.createElement("div");
    this.headerEl.className = "panel-header";

    this.avatarImg = document.createElement("img");
    this.avatarImg.className = "panel-avatar";
    this.avatarImg.alt = "AI头像";
    if (config?.avatar) {
      this.avatarImg.src = config.avatar;
    }

    this.levelTitleEl = document.createElement("span");
    this.levelTitleEl.className = "panel-level-title";
    this.levelTitleEl.textContent = config?.levelTitle ?? "";

    this.headerEl.appendChild(this.avatarImg);
    this.headerEl.appendChild(this.levelTitleEl);

    if (config) {
      container.appendChild(this.headerEl);
    }

    // status text
    this.statusText = document.createElement("div");
    this.statusText.id = "status-text";

    // restart button
    this.restartBtn = document.createElement("button");
    this.restartBtn.id = "restart-btn";
    this.restartBtn.textContent = "再来一局";

    // back button
    this.backBtn = document.createElement("button");
    this.backBtn.id = "back-btn";
    this.backBtn.textContent = "返回选关";

    container.appendChild(this.statusText);
    container.appendChild(this.restartBtn);
    container.appendChild(this.backBtn);

    this.setStatus("你的回合 (黑子)");

    this.backBtn.addEventListener("click", () => {
      if (this.onBackCallback) {
        this.onBackCallback();
      }
    });
  }

  setStatus(text: string): void {
    this.statusText.textContent = text;
    this.restartBtn.style.display = "none";
    this.backBtn.style.display = "block";
  }

  showThinking(): void {
    this.statusText.textContent = "AI 思考中...";
    this.restartBtn.style.display = "none";
    this.backBtn.style.display = "none";
  }

  showResult(text: string): void {
    this.statusText.textContent = text;
    this.restartBtn.style.display = "block";
    this.backBtn.style.display = "block";
  }

  onRestart(callback: () => void): void {
    this.restartBtn.addEventListener("click", callback);
  }

  onBackToLevels(callback: () => void): void {
    this.onBackCallback = callback;
  }
}
