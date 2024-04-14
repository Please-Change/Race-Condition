//  8. Light Mode
//   - Dark Mode is set to Light Mode and vice versa
//   - 1 minute
//   - Invert theam

import { Game } from "@lib/game";
import { PowerUp, PowerUpType } from "..";

export class LightMode extends PowerUp {
  public apply(game: Game) {
    const Monaco = game.editor.Monaco!;
    Monaco.editor.setTheme("hc-light");
  }

  public type(): PowerUpType {
    return PowerUpType.LightMode;
  }

  public destroy(game: Game) {
    const Monaco = game.editor.Monaco!;
    Monaco.editor.setTheme("vs");
  }

  public icon(): string {
    return PowerUpType.LightMode;
  }
}
