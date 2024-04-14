//  6. Swap programming languages
//   - Programming language is changed
//   - Permanent

import type { Game } from "@lib/game";
import { PowerUp, PowerUpType } from "..";
import { StaticAnalysis } from "@lib/analyze";

export class SwapProgrammingLanguage extends PowerUp {
  private applied = false;

  public apply(g: Game): void {}
  
  public update(g: Game): boolean {
    if(this.applied)
      return true;

    g.language.set(StaticAnalysis.SUPPORTED_LANGUAGES[Math.round(StaticAnalysis.SUPPORTED_LANGUAGES.length * Math.random())])
    this.applied = true;
    return false;
  }


  public type(): PowerUpType {
    return PowerUpType.ChangeLanguage;
  }

  public destroy(_: Game): void {}
}