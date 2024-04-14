//  3. swap keys on the keyboard
//   - Two keys on your keyboard swap so that when you press one the other is outputted
//   - 2 minutes

import type { Game } from "@lib/game";
import { PowerUp, PowerUpType } from "..";
import { get } from "svelte/store";
import { Range } from "monaco-editor";
import { randomLetter } from "@lib/bottle/letterRequired";

export class KeyboardSwap extends PowerUp {
  private time: number;
  private myMap: Record<string, string>;
  private stopAllKeys: (e: KeyboardEvent) => void;
  private delayKeys: ((e: KeyboardEvent) => void) | undefined;

  constructor() {
    super();
    this.time = 2 * 60 * 60;
    this.myMap = {};
    const first = randomLetter();
    const second = randomLetter();
    this.myMap[first] = second;
    this.myMap[second] = first;
    console.log(`swapped ${first} with ${second}`);

    this.stopAllKeys = e => {
      if (Object.keys(this.myMap).includes(e.key)) {
        e.preventDefault();
      }
    };
  }

  public update(): boolean {
    this.time--;
    return this.time < 0;
  }

  public apply(game: Game) {
    this.delayKeys = e => {
      if (!Object.keys(this.myMap).includes(e.key)) {
        return;
      }
      e.preventDefault();

      const newKey = this.myMap[e.key];

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
        text: newKey,
        forceMoveMarkers: true,
      };

      get(game.editor.editor)?.executeEdits("pain", [op]);
    };
    window.addEventListener("keyup", this.delayKeys);
    window.addEventListener("keydown", this.stopAllKeys);
  }

  public type(): PowerUpType {
    return PowerUpType.KeyboardSwap;
  }

  public destroy() {
    if (this.delayKeys) window.removeEventListener("keyup", this.delayKeys);
    window.removeEventListener("keydown", this.stopAllKeys);
  }
}
