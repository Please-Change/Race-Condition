import type { PowerUp } from "@lib/powerup";

export class PowerUpBottle {
  public isForMe: boolean;
  public powerUp: PowerUp;
  public position: [number, number];
  public snatched: boolean;

  constructor(isForMe: boolean, powerUp: PowerUp, xpos: number) {
    this.isForMe = isForMe;
    this.powerUp = powerUp;
    this.position = [xpos, 0];
    this.snatched = false;
  }

  public update(): boolean {
    this.position[1]++;
    return this.position[1] >= window.innerHeight || this.snatched;
  }

  public init() {}
  public destroy() {}

  public icon(): string {
    return this.powerUp.icon();
  }
}
