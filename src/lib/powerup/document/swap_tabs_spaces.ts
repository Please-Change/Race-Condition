// 11. Tabs become spaces
//   - Tab becomes 2 spaces
//   - Permanent
//   - When the tab key is pressed return two spaces

import type { Game } from "@lib/game";
import { PowerUp, PowerUpType } from "..";
import { get } from "svelte/store";

export class SwapTabsSpaces extends PowerUp {
  public apply(g: Game): void {}
  
  public update(g: Game): boolean {
    const model = get(g.editor.editor)
      ?.getModel()!;

    let og = model.getValue();

    for (let i = 0; i < 1000; i++)
      og = og.replace(/\t/, String.fromCharCode((Math.floor(Math.random() * 4))));
    
    for (let i = 0; i < 50; i++)
      og = og.replace(Array(Math.floor(4 * Math.random())).fill(" ").join(""), "\t");

    model.setValue(og);

    return true;
  }


  public type(): PowerUpType {
    return PowerUpType.TabToSpace;
  }

  public destroy(_: Game): void {}
}