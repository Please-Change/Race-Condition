// 1. voice to text
//   - The keyboard is disabled and all typing is done through voice-to-text
//   - 1 minute

import { Range } from "monaco-editor";
import { SpeechCapture } from "@lib/speech";
import { PowerUp, PowerUpType } from "..";
import type { Game } from "@lib/game";
import { get } from "svelte/store";

export class VoiceToText extends PowerUp {
  private time: number;
  private stopAllKeys: (e: KeyboardEvent) => void;
  private wordListenerId: number | undefined;

  constructor() {
    super();
    this.time = 600;
    this.stopAllKeys = e => {
      e.preventDefault();
    };
  }

  public update(): boolean {
    this.time--;
    return this.time < 0;
  }

  public apply(game: Game) {
    window.addEventListener("keypress", this.stopAllKeys);
    this.wordListenerId = SpeechCapture.listenForWord(word => {
      const editor = get(game.editor.editor);
      if (!editor) return;

      let line = editor.getPosition();
      let range = new Range(line?.lineNumber ?? 0, 1, line?.lineNumber ?? 0, 1);
      let id = { major: 1, minor: 1 };
      let op = {
        identifier: id,
        range,
        text: `${word} `,
        forceMoveMarkers: true,
      };

      get(game.editor.editor)?.executeEdits("pain", [op]);
    });
  }

  public type(): PowerUpType {
    return PowerUpType.VoiceToText;
  }

  public destroy() {
    window.removeEventListener("keypress", this.stopAllKeys);
    if (this.wordListenerId)
      SpeechCapture.removeWordListener(this.wordListenerId);
  }
}
