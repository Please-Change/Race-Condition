//  2. Random character swap
//   - One character in your code will be swapped to a similar character eg b -> d, p -> q
//   - once

import type { Game } from "@lib/game";
import { PowerUp, PowerUpType } from "..";
import { StaticAnalysis } from "@lib/analyze";
import { get } from "svelte/store";

export class CharacterSwap extends PowerUp {
  public apply(g: Game): void {}
  
  public update(g: Game): boolean {
    const model = get(g.editor.editor)
      ?.getModel()!;

    const og = model.getValue();
    const chars = og.split("");
    let i1 = Math.round(chars.length * Math.random());
    let i2 = Math.round(chars.length * Math.random());
    let tmp = chars[i2];
    chars[i2] = chars[i1];
    chars[i1] = tmp;

    model.setValue(chars.join(""));
    return true;
  }


  public type(): PowerUpType {
    return PowerUpType.ChangeLanguage;
  }

  public destroy(_: Game): void {}
}