import type { PowerUp } from "@lib/powerup";
import { PowerUpBottle } from ".";

const ALLOWED_LETTERS =
  "abcdefghijklmnopqrstuvwxyz1234567890!\"£$%^&*()'#~]}{[-_/?;:.>'@".split("");

export class LetterBottle extends PowerUpBottle {
  public letters: string[];

  constructor(isForMe: boolean, powerUp: PowerUp, xpos: number) {
    super(isForMe, powerUp, xpos);

    this.letters = [];
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
