// 13. Bad Trip
//   - Curser is moved to a random location
//   - once

import { Game } from "@lib/game";
import { PowerUp, PowerUpType } from ".";
import { get } from "svelte/store";
import { Position } from "monaco-editor";

export class Bad_trip extends PowerUp {
  public apply(game: Game) {
    let editor = get(game.editor.editor)!;
    let pos = editor.getModel()!.getFullModelRange();
    let ypos = Math.floor(Math.random() * (pos.endLineNumber - 1)) + 1;
    let xPos =
      Math.floor(
        Math.random() * (editor.getModel()!.getLineMaxColumn(ypos) - 1),
      ) + 1;
    let newPos = new Position(ypos, xPos);
    editor.setPosition(newPos);
  }

  public type(): PowerUpType {
    return PowerUpType.BadTrip;
  }

  public destroy(_: Game) {}

  public icon(): string {
    return PowerUpType.BadTrip;
  }
}
