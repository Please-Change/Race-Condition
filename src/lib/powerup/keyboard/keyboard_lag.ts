//  7. Keyboard Lag
//   - A 0.5-second delay added between typing
//   - 1 minute

import type { Game } from "@lib/game";
import { PowerUp, PowerUpType } from "..";
import { get } from "svelte/store";
import { Range } from "monaco-editor";

export class KeyboardLag extends PowerUp {
  private time: number;
  private stopAllKeys: (e: KeyboardEvent) => void;
  private delayKeys: ((e: KeyboardEvent) => void) | undefined;

  constructor() {
    super();
    this.time = 60 * 60;
    this.stopAllKeys = e => {
      e.preventDefault();
    };
  }

  public update(): boolean {
    this.time--;
    return this.time < 0;
  }

  public apply(game: Game) {
    this.delayKeys = e => {
      e.preventDefault();
      setTimeout(() => {
        const editor = get(game.editor.editor);
        if (!editor) return;

        let line = editor.getPosition();
        let range = new Range(
          line?.lineNumber ?? 0,
          line?.column ?? 0,
          line?.lineNumber ?? 0,
          line?.column ?? 0,
        );
        let id = { major: 1, minor: 1 };
        let op = {
          identifier: id,
          range,
          text: e.key,
          forceMoveMarkers: true,
        };

        get(game.editor.editor)?.executeEdits("pain", [op]);
      }, 500);
    };
    window.addEventListener("keyup", this.delayKeys);
    window.addEventListener("keydown", this.stopAllKeys);
  }

  public type(): PowerUpType {
    return PowerUpType.KeyboardLag;
  }

  public destroy() {
    if (this.delayKeys) window.removeEventListener("keyup", this.delayKeys);
    window.removeEventListener("keydown", this.stopAllKeys);
  }
}
