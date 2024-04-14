//  9. Low Power Mode
//   - Brightness is lowered
//   - 1 minute
//   - Put a rectangle with low opacify over the code

import { PowerUp, PowerUpType } from "..";

export class LowPowerMode extends PowerUp {
  private time: number;
  private div: HTMLDivElement;

  constructor() {
    super();
    this.time = 1800;
    this.div = document.createElement("div");
    this.div.style.position = "absolute";
    this.div.style.width = "100vw";
    this.div.style.height = "100vh";
    this.div.style.background = "rgba(34,34,34,0.5)";
    this.div.style.zIndex = "9";
    this.div.style.pointerEvents = "none";
  }

  public update(): boolean {
    this.time--;
    return this.time < 0;
  }

  public apply() {
    document.querySelector("main")!.appendChild(this.div);
  }

  public type(): PowerUpType {
    return PowerUpType.LowPowerMode;
  }

  public destroy() {
    this.div.remove;
  }
}
