// 15. No Shortcuts
//   - Shortcuts keys are disabled
//   - 1 minute
//   - Stop recognising ctrl key

import type { Game } from "@lib/game";
import { PowerUp, PowerUpType } from "..";
import { get } from "svelte/store";
import { Range } from "monaco-editor";

export class NoShortcuts extends PowerUp {
  private time: number;
  private stopAllKeys: (e: KeyboardEvent) => void;

  constructor() {
    super();
    this.time = 60 * 60;
    this.stopAllKeys = e => {
      if (e.altKey || e.ctrlKey) {
        e.preventDefault();
      }
    };
  }

  public update(): boolean {
    this.time--;
    return this.time < 0;
  }

  public apply() {
    window.addEventListener("keypress", this.stopAllKeys);
  }

  public type(): PowerUpType {
    return PowerUpType.NoShortcuts;
  }

  public destroy() {
    window.removeEventListener("keypress", this.stopAllKeys);
  }
}
