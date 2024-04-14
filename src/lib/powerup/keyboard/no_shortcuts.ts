// 15. No Shortcuts
//   - Shortcuts keys are disabled
//   - 1 minute
//   - Stop recognising ctrl key

import { Game } from "@lib/game";
import { PowerUp, PowerUpType } from "..";
import { get } from "svelte/store";
import { LetterBottle } from "@lib/bottle/letterRequired";

export class No_Shortcuts extends PowerUp {
  public apply(_: Game) {}

  public type(): PowerUpType {
    return PowerUpType.NoShortcuts;
  }

  public destroy(_: Game) {}

  public icon(): string {
    return PowerUpType.NoShortcuts;
  }
}