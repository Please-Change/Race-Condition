import type { PowerUp } from "@lib/powerup";

export class PowerUpBottle {
  public isForMe: boolean;
  public powerUp: PowerUp;
  public position: [number, number];
  public snatched: boolean;

  constructor(isForMe: boolean, powerUp: PowerUp) {
    this.isForMe = isForMe;
    this.powerUp = powerUp;
    this.snatched = false;

    const xpos = Math.floor(Math.random() * (window.innerHeight - 20)) + 20;
    this.position = [xpos, 0];
  }

  public update(): boolean {
    this.position[1]++;
    return this.position[1] >= window.innerHeight || this.snatched;
  }

  public init() {}
  public destroy() {}
  public onClick() {}

  public label(): string {
    return "";
  }

  public icon(): string {
    return this.powerUp.icon();
  }
}
