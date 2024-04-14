// 10. Full Reset
//   - Your Settings are set to default
//   - Permanent

import { Game } from "@lib/game";
import { PowerUp, PowerUpType } from ".";

export class Reset extends PowerUp {
  public apply(game: Game) {
    for (let index = 0; index < game.powerUps.length; index++) {
      game.powerUps[index].destroy(game);
    }
    game.powerUps = [];
  }

  public type(): PowerUpType {
    return PowerUpType.FullReset;
  }

  public destroy(_: Game) {}

  public icon(): string {
    return PowerUpType.FullReset;
  }
}
