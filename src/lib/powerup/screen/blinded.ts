// 12. Blinded
//   - Screen becomes black
//   - 10 seconds
//   - Put a black rectangle over the code

import { PowerUp } from "..";

export class BlackScreen extends PowerUp {
  private time: number;
  private div: HTMLDivElement;

  constructor() {
    super();
    this.time = 300;
    this.div = document.createElement("div");
    this.div.style.position = "absolute";
    this.div.style.width = "100vw";
    this.div.style.height = "100vh";
    this.div.style.background = "black";
    this.div.style.zIndex = "9"
    this.div.style.pointerEvents = "none"
  }

  public update(): boolean {
    this.time--;
    return this.time < 0;
  }

  public init() {
    document.querySelector("main")!.appendChild(this.div);
  }
  public destroy() {
    this.div.remove;
  }
}
