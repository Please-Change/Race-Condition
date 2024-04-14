// 10. Full Reset
//   - Your Settings are set to default
//   - Permanent

import { Game } from "@lib/game";
import { PowerUp, PowerUpType } from ".";
import { get } from "svelte/store";

export class Reset extends PowerUp {
  public apply(game: Game) {
    for (const p of get(game.powerUps)) {
      p.destroy(game);
    }
    game.powerUps.set([]);
  }

  public type(): PowerUpType {
    return PowerUpType.FullReset; 
  }

  public destroy(_: Game) {}

  public icon(): string {
    return PowerUpType.FullReset;
  }
}
